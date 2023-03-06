const child_process = require("child_process");
const fs = require("fs");
const exec = require("child_process").exec;
const spawn = require("child_process").spawn;
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

  var command = "node " + ("/home/minhtran/Documents/" + fileName);
  var processConfig = {
    timeout : timeOut,
    killSignal : 'SIGKILL',
    cwd : process.cwd()
  }
  console.log(JSON.stringify(processConfig));
  var child = spawn("node", ["/home/minhtran/Documents/" + fileName], processConfig)

  child.stdout.on('data', (data) => {
    console.log(`stdout : ${data}`);
  })

  child.stderr.on('data', (data) => {
    console.log(`stderr : ${data}`);
  })

  child.on('close', (code, signal) => {
    console.log('exit with code : ' + code);
    console.log('exit with signal : ' + signal);
  })

  child.on('error', (err) => {
    console.log(err);
  })

  setTimeout(function() {
    child.kill();
  }, 5000)
    // let child = exec(command, { timeout: timeOut, killSignal: 'SIGINT' }, function (error, stdout, stderr) {
    //   if (error) {
    //     if (env != "production") {
    //       console.log("Error: " + error);
    //       console.log("Stderr: " + stderr);
    //     }
    //
    //     if (
    //       error.toString().includes("ERR_CHILD_PROCESS_STDIO_MAXBUFFER")
    //     ) {
    //       errorMessage =
    //         "Process terminated. 'maxBuffer' exceeded. This normally happens during an infinite loop.";
    //     } else if (error.signal === "SIGTERM") {
    //       errorMessage =
    //         "Process terminated. Please check your code and try again.";
    //     } else if (stderr) {
    //       errorMessage = stderr;
    //     } else {
    //       errorMessage = "Something went wrong. Please try again";
    //     }
    //     func({ ERROR: errorMessage }, actualFile);
    //   } else {
    //     if (env != "production") {
    //       console.log("Successfully executed !");
    //     }
    //     func({ stdout: stdout }, actualFile);
    //   }
    // });
    // console.log("RUNNING WITH PID = " + child.pid);
    // 
    // setTimeout(function(){
    //   child.kill('SIGINT');
    // }, 10000)

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
