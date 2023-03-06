var express = require("express");
var formidable = require("express-formidable");
var cors = require("cors");
var app = express();
var port = process.env.PORT || 6500;
var frontend = process.env.FRONTEND || "https://runcode.paulonteri.com";

const ProcessManager = require("./processManagement/processManagement");
const java = require("./codeServices/java");
const javascript = require("./codeServices/javascript");


app.use(formidable());

const corsOptions = () => {
  if (process.env.NODE_ENV === "production") {
    return {
      origin: frontend,
      optionsSuccessStatus: 200,
      methods: "GET,POST",
    };
  } else {
    return {
      optionsSuccessStatus: 200,
    };
  }
};

app.use(cors(corsOptions()));

// ROUTES
app.get("/", (req, res) =>
  res.send(
    "Hi! This is executing code server"
  )
);

app.post("/code", (req, res) => {
  console.log("Receive post code event");
  var text = req.fields.text;
  var language = req.fields.language;

  if (!text || !(text.length > 1)) {
    res.status(422).send("Write some code!");
  }
  // console.log(language, text)

  switch (language) {
    case "javascript":
      var randomId = Math.round(Math.random() * 10000);
      ProcessManager.getInstance().addProcess(
        {
          isRunning : false,
          pid : randomId,
          run : function() {
            javascript.run(text, function (data) {
              ProcessManager.getInstance().finishRunning(randomId);
              res.status(200).json(data);
            });
          }.bind(res)
        }
      );
      ProcessManager.getInstance().runNextProcess();
      break;
    case "java":
      java.run(text, function (data) {
        res.status(200).json(data);
      });
      break;
    default:
      res.status(422).send("Invalid programming language!");
  }
});

app.listen(port, () =>
  console.log(`Backend listening at http://localhost:${port}`)
);
