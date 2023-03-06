const axios = require('axios');

let exampleCode = ' let count = 10000000; while(count--);';

class API_TESTER {
  constructor() {

  }

  start() {
  axios.post('http://localhost:6500/code', {
    language : "javascript",
    text : exampleCode
  }).then(response => {
    console.log("CALL SUCCESSFUL");

    })
    .catch(error => {
      console.log(error);
    });
  }

}
let listRequest = [
]
for (let i = 0; i < 1000; i++) {
  listRequest.push(new API_TESTER());
}

for (let i = 0; i < listRequest.length; i++) {
  setTimeout(function(){
    listRequest[i].start();
  }, Math.random() * 10000)
}
