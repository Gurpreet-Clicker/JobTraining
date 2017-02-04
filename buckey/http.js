var http=require('http');
var fs=require('fs');
var connect=require('connect');
var app=connect();




       //response.writeHead(200,{});


       fs.readFile('./facebook.css','utf8',function(err,data)
       	{
       		var css;
             css=data;
             //response.end(file);
             
       	});

        /*var mystream=fs.createReadStream(__dirname +'/facebook.html' ,'utf8');

        mystream.on('data' ,function(chunk)
        {
           console.log(chunk);
        });*/


       var file;
       fs.readFile('./facebook.html',function(err,data)
       	{
             file=data;

             console.log(file);
       	});


       
      // console.log(res);
          


function onRequest(request,response)
{
     
	switch(request.url){

	  case "/":
	  response.writeHead(200, {"Content-Type": "text/html"});
	//response.write(css);
	response.end(file);
	break;
	//break;
	 default:
	response.writeHead(200, {"Content-Type": "text/css"});
	//response.write(file);
	response.end(css);
	break;
    }

}

var server=http.createServer(onRequest);


//use of connect to handle requests

/*function showCss(req,res,next)
{
      res.writeHead(200, {"Content-Type": "text/css"});
      //res.end(css);	
      next();
}

function showHtml(req,res,next)
{
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(file);
    next();
}




app.use(showCss);
app.use(showHtml);


var server=http.createServer(app);*/

server.listen(8000);


console.log("server is running...");

//console.log(request.url);

