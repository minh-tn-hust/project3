let config = require("../codeServices/config.js");
class ProcessManagerPrivate {
  constructor() {
    this.listProcess = [];
    this.currentRunning = 0;
  }

  findNextProcessToRun() {
    if (this.currentRunning < config.MAX_PARALLEL_THREAD && this.listProcess.length != 0) {
      let listProcess = this.listProcess;
      for (let i = 0; i < listProcess.length; i++) {
        if (listProcess[i].isRunning == false) {
          return i;
        }
      }
    }    
    return -1;
  }

  runNextProcess() {
    let nextRunningIndex = this.findNextProcessToRun();
    if (nextRunningIndex == -1) {
      return;
    }
    this.currentRunning++;
    let nextRunningProcess = this.listProcess[nextRunningIndex];
    nextRunningProcess.isRunning = true;
    console.log("Running next process with id = " + nextRunningProcess.pid);
    nextRunningProcess.run();
  }

  addProcess(processWorker) {
    this.listProcess.push(processWorker);
  }

  finishRunning(pid) {
    this.currentRunning--;
    this.listProcess = this.listProcess.filter((element) => element.pid != pid);
    this.runNextProcess();
  }
}

class ProcessManager {
  constructor() {
    throw new Error('Use ProcessManager.getInstance()')
  }
  static getInstance() {
    if (!ProcessManager.instance) {
      ProcessManager.instance = new ProcessManagerPrivate();
    }
    return ProcessManager.instance;
  }
}


module.exports = ProcessManager;
