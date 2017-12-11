// require statements
var express = require("express");
var http = require("http");
var path = require("path");
var logger = require("morgan");
var helmet = require("helmet");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var csrf = require("csurf");
var mongoose = require("mongoose");
var Fruit = require("./models/fruit");


// database
var mongoDB = "mongodb://admin:amelie@ds137206.mlab.com:37206/fms";
mongoose.connect(mongoDB, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function() {
    console.log("Application connected to mLab MongoDB instance");
});

// setup csrf protection
var csrfProtection = csrf({cookie: true});


// initialize the express application
var app = express();

// use statements
app.use(logger("short"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(helmet.xssFilter());
app.use(csrfProtection);
app.use(function(request, response, next) {
    var token = request.csrfToken();
    response.cookie('XSRF-TOKEN', token);
    response.locals.csrfToken = token;
    next();
});

// set statements
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");


// route requests
app.get("/", function (request, response) {
    response.render("index", {
        title: "Home page"
    });
});

app.get("/new", function (request, response) {
    response.render("new", {
        title: "New Fruit"
    });
});

app.post("/process", function(request, response) {
   // console.log(request.body.txtName);
   if (!request.body.txtName) {
       response.status(400).send("Entries must have a name");
       return;
   }

   // get the request's form data
   var fruitName = request.body.txtName;
   console.log(fruitName);

   // create a fruit model
   var fruit = new Fruit({
       name: fruitName
   });

   // save
   fruit.save(function (error) {
       if (error) throw error;

       console.log(fruitName + " saved successfully!");
   });

   response.redirect("/list");
});

app.get("/list", function(request, response) {
    Fruit.find({}, function(error, fruits) {
       if (error) throw error;

       response.render("list", {
           title: "Fruit List",
           fruits: fruits
       });
    });
});


http.createServer(app).listen(8080, function() {
    console.log("Application started on port 8080!");
});