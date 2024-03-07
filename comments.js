//Create web server
var http = require('http');
//Create file system object
var fs = require('fs');
//Create file object
var file = 'comments.json';
//Create server
var server = http.createServer(function(req, res) {
  //If the request is a POST
  if (req.method == 'POST') {
    //Create variable to hold data
    var body = '';
    //When the request receives data, append it to the body
    req.on('data', function(data) {
      body += data;
    });
    //When the request ends
    req.on('end', function() {
      //Parse the data
      var data = JSON.parse(body);
      //Read the file
      fs.readFile(file, function(err, comments) {
        //If there are no comments, create an empty array
        if (comments == '') {
          comments = '[]';
        }
        //Parse the comments
        comments = JSON.parse(comments);
        //Add the new comment to the comments array
        comments.push(data);
        //Write the comments array to the file
        fs.writeFile(file, JSON.stringify(comments), function(err) {
          //If there is an error, send a 500 status code
          if (err) {
            res.writeHead(500);
            res.end();
          }
          //If there is no error, send a 200 status code
          else {
            res.writeHead(200);
            res.end();
          }
        });
      });
    });
  }
  //If the request is a GET
  else if (req.method == 'GET') {
    //Read the file
    fs.readFile(file, function(err, comments) {
      //If there is an error, send a 500 status code
      if (err) {
        res.writeHead(500);
        res.end();
      }
      //If there is no error, send a 200 status code and the comments
      else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(comments);
      }
    });
  }
  //If the request is anything else, send a 404 status code
  else {
    res.writeHead(404);
    res.end();
  }
});
//Listen on port 3000
server.listen(3000);
//Print message to the console
console.log('Server is running on port 3000');