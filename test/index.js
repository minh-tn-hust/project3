const axios = require('axios');

const javascriptExampleCode = require('./javascriptExampleCode');
const javaExampleCode = require('./javaExampleCode');
class API_TESTER {
    constructor(code, type) {
        this.code = code; this.type = type;
    }

    start() {
        let exampleCode = this.code;
        let type = this.type;
        axios.post('http://localhost:6500/code', {
            language: type,
            text: exampleCode
        }).then(response => {
            console.log(JSON.stringify(response.data));
        }).catch(error => {
            console.log(error);
        });
    }
}

let listExampleCode = [
    {type : 'java', code : javaExampleCode.syntaxError},
    {type : 'java', code : javaExampleCode.runtimeError},
    {type : 'java', code : javaExampleCode.logicError},
    {type : 'java', code : javaExampleCode.nullPointer},
    {type : 'java', code : javaExampleCode.typeErro},
    {type : 'java', code : javaExampleCode.dijktraExample},
    {type : 'java', code : javaExampleCode.tleExample},
    {type : 'javascript', code : javascriptExampleCode.syntaxError},
    {type : 'javascript', code : javascriptExampleCode.dijktraExample},
    {type : 'javascript', code : javascriptExampleCode.nullPointer},
    {type : 'javascript', code : javascriptExampleCode.dividedBy0},
    {type : 'javascript', code : javascriptExampleCode.tleExample}
]
let listRequest = []


for (let i = 0; i < 400; i++) {
    let randomIndex = Math.round(Math.random() * 100000) % listExampleCode.length;
    listRequest.push(new API_TESTER(listExampleCode[randomIndex].code, listExampleCode[randomIndex].type));
}

for (let i = 0; i < listRequest.length; i++) {
    setTimeout(function () {
        listRequest[i].start();

    }, Math.random() * 15000);
}
