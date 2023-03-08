const fs = require("fs");
const Path = require("path");
const spawn = require("child_process").spawn;
const {v1: uuidv1} = require("uuid");
const config = require("./config");
const env = process.env.NODE_ENV;
const configPath = config.codePath;
const timeOut = config.timeOut;


const validate = (str) => {
    // prevent handling files
    words = ["java.io.File"];
    if (words.every((el) => str.toLowerCase().includes(el.toLowerCase()))) {
        return false;
    }
    return true;
};

const runCodeAfterComplie = function (fileName, folderName, sendResponseCallback) {
    let timeOut = config.timeOut;
    var childProcessConfig = {
        timeout: timeOut,
        killSignal: 'SIGKILL',
        cwd: "/home/minhtran/Documents/" + folderName
    }

    let javaFilePath = "Main";
    var child = spawn("java", [javaFilePath], childProcessConfig);
    child.stdout.setEncoding('utf-8');
    var stdoutData = "";
    var stderrData = "";
    child.stdout.on('data', (data) => {
        stdoutData += data.toString();
    })

    child.stderr.setEncoding('utf-8');
    child.stderr.on('data', (data) => {
        stderrData += data.toString();
    })

    child.on('close', (code, signal) => {
        if (code != 0) {
            if (stderrData.length != 0) {
                sendResponseCallback({ERROR: stderrData});
            } else {
                sendResponseCallback({ERROR: "Time limit executed"});
            }
        } else {
            sendResponseCallback({stdout: stdoutData});
        }
    })

    setTimeout(function () {
        child.kill();
    }, timeOut);
}

const compilingCodeAfterWrite = function (writeFileError, fileName, folderName, sendResponseCallback) {
    if (writeFileError) {
        console.log("Error creating file: " + writeFileError);
        sendResponseCallback({ERROR : "System has some error, please try again later"});
        return;
    }

    var childProcessConfig = {
        timeout: timeOut,
        killSignal: 'SIGKILL',
        cwd: process.cwd()
    }
    var javaFilePath = "../../" + folderName + "/" + fileName;
    var child = spawn("javac", [javaFilePath], childProcessConfig);
    child.stdout.setEncoding('utf-8');
    var stdoutData = "";
    var stderrData = "";
    child.stdout.on('data', (data) => {
        stdoutData += data.toString();
    })

    child.stderr.setEncoding('utf-8');
    child.stderr.on('data', (data) => {
        stderrData += data.toString();
    })

    child.on('close', (code, signal) => {
        console.log("stdoutData = " + JSON.stringify(stdoutData));
        console.log("stderrData = " + JSON.stringify(stderrData));
        console.log("exit code  = " + code);
        console.log("exit signal = " + signal);
        if (code === 0) {
            runCodeAfterComplie(fileName, folderName, sendResponseCallback);
        } else {
            if (stderrData.indexOf("file not found") !== -1) {
                stderrData = "Somethings wrong with server, please try again later!";
            }
            sendResponseCallback({ERROR: stderrData});
        }
    })
}

const runCode = (code, func) => {
    if (validate(code)) {
        if (!code.match(RegExp(/\bclass\W+(?:\w+\W+){0}?Main\b/g))) {
            return func({ERROR: 'Include a correct "Main" class!'});
        } else if (!code.match(RegExp(/\bpublic\W+(?:\w+\W+){2}?main\b/g))) {
            return func({ERROR: 'Include a correct "main()" method!'});
        }

        var folderName = uuidv1();
        var fileName = "Main.java";
        var folder = configPath + folderName;
        var path = folder + "/";

        fs.mkdir(folder, 0777, function (err) {
            if (err) {
                func({ERROR: "Server error, can't create java folder"});
            } else {
                fs.writeFile(path + fileName, code, function (err) {
                    compilingCodeAfterWrite(err, fileName, folderName, func);
                });
            }
        });
    } else {
        console.log(code);
        func({ERROR: "Not allowed!"});
    }
};

const run = (code, func) => {
    runCode(code, function (data, dir = null) {
        if (dir) {
            if (fs.existsSync(dir)) {
                fs.readdirSync(dir).forEach((file, index) => {
                    const curPath = Path.join(dir, file);
                    fs.unlinkSync(curPath);
                });
                fs.rmdirSync(dir);
            }
        }
        // add more logic
        func(data);
    });
};

module.exports = {run: run};
