var http = require("http");


var server= http.createServer(function (req, res) {


	//console.log(req.method);
	//console.log(req.url);
   console.log(res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
  //console.log("gourav");
});


server.listen('3000',function(err,result)
{
	  if(err)
	   console.log(err);
		console.log("server is running");
});