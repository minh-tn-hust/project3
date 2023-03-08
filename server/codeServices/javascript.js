const child_process = require("child_process");
const fs = require("fs");
const exec = require("child_process").exec;
const spawn = require("child_process").spawn;
const { v1: uuidv1 } = require("uuid");
const config = require("./config");
const env = process.env.NODE_ENV;
const configPath = config.codePath;
const timeOut = config.timeOut;

const validate = (str) => {
  words = ["require(", "exports.", "module.exports"];
  // prevent imports
  var valid = !words.some((el) => {
    return str.includes(el);
  });

  return valid;
};

const executingCodeAfterWriteFile = function(writeFileError, actualFile, fileName, sendResponseCallback) {
  if (writeFileError) {
    console.log("Error creating file: " + writeFileError);
    return;
  }

  var command = "node " + ("/home/minhtran/Documents/" + fileName);
  var processConfig = {
    timeout : timeOut,
    killSignal : 'SIGKILL',
    cwd : process.cwd()
  }
  var child = spawn("node", ["/home/minhtran/Documents/" + fileName], processConfig)

  let response = {};
  let hasAnswer = false;
  let hasError = false;
  let outputData = "";
  let outputError = "";


  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (data) => {
    hasAnswer = true;
    outputData += data.toString();
  })

  child.stderr.on('data', (data) => {
    hasError = true;
    outputError += data.toString();
  })

  child.on('close', (code, signal) => {
    if (signal == 'SIGTERM') {
      sendResponseCallback({ERROR : "Time limit executed"}, actualFile);
    } else {
      if (hasError) {
        sendResponseCallback({ERROR : outputError}, actualFile);
      } else {
        sendResponseCallback({stdout : outputData}, actualFile);
      }
    }
  })
  setTimeout(function() {
    child.kill();
  }, timeOut)
}

const runCode = (code, func) => {
  if (validate(code)) {
    var fileName = uuidv1();
    var actualFile = configPath + fileName + ".js";

    fs.writeFile(actualFile, code, function (err) {
      executingCodeAfterWriteFile(err, actualFile, fileName, func)
    });
  } else {
    console.log(code);
    func({ ERROR: "Not allowed!" });
  }
};

const run = (code, func) => {
  runCode(code, function (data, file = null) {
    if (file) {
      fs.unlink(file, (err) => {
        if (err) {
          console.error(err);
        }
        //file removed
      });
    }
    // add more logic
    func(data);
  });
};

module.exports = { run: run };
