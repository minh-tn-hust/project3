const axios = require('axios');

const exampleCode = require('./errorExampleCode');

class API_TESTER {
  constructor(code) {
    this.code = code;

  }

  start() {
  let exampleCode = this.code;
  axios.post('http://localhost:6500/code', {
    language : "javascript",
    text : exampleCode
  }).then(response => {
    console.log(JSON.stringify(response.data));
  }).catch(error => {
    console.log(error);
  });
  }
}

let listExampleCode = [
  exampleCode.syntaxError,
  exampleCode.dijktraExample,
  exampleCode.nullPointer,
  exampleCode.dividedBy0,
  exampleCode.tleExample,
  exampleCode.tleExample,
  exampleCode.tleExample,
  exampleCode.tleExample,
  exampleCode.tleExample,
  exampleCode.tleExample,
  exampleCode.tleExample,
  exampleCode.tleExample,
  exampleCode.tleExample
]
let listRequest = [
]
for (let i = 0; i < 500; i++) {
  listRequest.push(new API_TESTER(listExampleCode[Math.round(Math.random() * 100) % listExampleCode.length]));
}

for (let i = 0; i < listRequest.length; i++) {
  setTimeout(function(){
    listRequest[i].start();

  }, Math.random() * 10000);
}
