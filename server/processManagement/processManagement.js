class ProcessManagerPrivate {
  constructor() {
    this.listProcess = [];
    this.currentRunning = 0;
  }

  runNextProcess() {
    if (this.listProcess.length != 0 && this.currentRunning != 4) {
      this.currentRunning++;
      let nextRunningProcess = this.listProcess[0];
      nextRunningProcess.run();
    }
  }

  addProcess(processWorker) {
    console.log(JSON.stringify(this.listProcess));
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
