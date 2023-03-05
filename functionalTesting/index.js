
class ProcessManagerPrivate {
  constructor() {
    this.listProcess = [];
    this.currentRunning = 0;
  }

  runNextProcess() {
    console.log("Calling running next process");
    console.log("List process = " + JSON.stringify(this.listProcess));
    console.log("Current runninig = " + this.currentRunning);
    if (this.listProcess.length != 0 && this.currentRunning != 4) {
      console.log("Runing into this branch");
      this.currentRunning++;
      let nextRunningProcess = this.listProcess[0];
      nextRunningProcess.run();
    }
  }

  addProcess(processWorker) {
    console.log("RUNNING ADD PROCESS");
    console.log("ADDING PROCESS :" + JSON.stringify(processWorker));
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

const testing1Function = function() {
  let process = {
    id : Math.round(Math.random() * 100000),
    run : function() {
      console.log("Hello1, this is running randomly " + Math.round(Math.random() * 10000));
      ProcessManager.getInstance().finishRunning();
    }
  }

  ProcessManager.getInstance().addProcess(process);
  ProcessManager.getInstance().runNextProcess();
}

const testing2Function = function() {
  let process = {
    id : Math.round(Math.random() * 100000),
    run : function() {
      console.log("Hello2, this is running randomly " + Math.round(Math.random() * 10000));
      ProcessManager.getInstance().finishRunning();
    }
  }

  ProcessManager.getInstance().addProcess(process);
  ProcessManager.getInstance().runNextProcess();
}

testing1Function();
testing2Function();
