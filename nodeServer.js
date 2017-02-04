var http = require("http");

http.createServer(function (request, response) {

   
   response.writeHead(200, {'Content-Type: text/html; charset=utf-8'});
   
   
   response.end(/home/adminint1/Desktop/sublime/calculator.html);
}).listen(3000);



console.log('Server running at http://127.0.0.1:3000/');