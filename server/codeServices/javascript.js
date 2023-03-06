
const fs = require("fs");
const exec = require("child_process").exec;
const { v1: uuidv1 } = require("uuid");
const config = require("./config");
const env = process.env.NODE_ENV;
const configPath = config.codePath;
const timeOut = config.timeOut;

// This should never happen
const validate = (str) => {
  words = ["require(", "exports.", "module.exports"];
  // prevent imports
  var valid = !words.some((el) => {
    return str.includes(el);
  });

  return valid;
};

const executingCodeAfterWriteFile = function(writeFileError, actualFile, fileName, func) {
  if (writeFileError) {
    console.log("Error creating file: " + writeFileError);
    return;
  }
    var command = "node " + configPath + fileName;
    exec(command, { timeout: timeOut, killSignal: 'SIGKILL' }, function (error, stdout, stderr) {
      if (error) {
        if (env != "production") {
          console.log("Error: " + error);
          console.log("Stderr: " + stderr);
        }

        if (
          error.toString().includes("ERR_CHILD_PROCESS_STDIO_MAXBUFFER")
        ) {
          errorMessage =
            "Process terminated. 'maxBuffer' exceeded. This normally happens during an infinite loop.";
        } else if (error.signal === "SIGTERM") {
          errorMessage =
            "Process terminated. Please check your code and try again.";
        } else if (stderr) {
          errorMessage = stderr;
        } else {
          errorMessage = "Something went wrong. Please try again";
        }
        func({ ERROR: errorMessage }, actualFile);
      } else {
        if (env != "production") {
          console.log("Successfully executed !");
        }
        func({ stdout: stdout }, actualFile);
      }
    });

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
