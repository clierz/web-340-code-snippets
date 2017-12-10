var express = require("express");
var http = require("http");

var app = express();

app.get("/customer/:id", function (request, response) {
    var id = parseInt(request.params.id, 10);

    response.json({
        firstName: "Leo",
        lastName: "Tolstoy",
        employeeId: id
    });
});

http.createServer(app).listen(8080, function() {
    console.log("Application started on port 8080");
});