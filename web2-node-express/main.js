var express = require("express");
var app = express();
var fs = require("fs");
var helmet = require("helmet");
var bodyParser = require("body-parser");
var compression = require("compression");
var session = require("express-session");
var FileStore = require("session-file-store")(session);


app.use(helmet());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(compression());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.get("*", function (request, response, next) {
  fs.readdir("./data", function (error, filelist) {
    request.list = filelist;
    next();
  });
});


var indexRouter = require("./routes/index.js");
var topicRouter = require("./routes/topic.js");
var authRouter = require("./routes/auth.js");

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/auth", authRouter);


app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// app.listen(3000, () => console.log('Example app listening on port 3000!'))
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});