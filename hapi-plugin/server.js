var Hapi = require('hapi')

// create new server instance
var server = new Hapi.Server()

var Bcrypt = require('bcrypt')  
var BasicAuth = require('hapi-auth-basic');
var Joi=require('joi');




var users = {  
  future: {
    id: '1',
    email: 'guri',
    password: '$2a$04$YPy8WdAtWswed8b9MfKixebJkVUhEZxQCrExQaxzhcdR2xMmpSJiG'  // 'studio'
  }
}



// add server’s connection information
server.connection({  
  host: 'localhost',
  port: 3000
});



server.register([  
  
  // register plugin without options #1
  {
    register: require('vision')
  },
  // register plugin without options #2
   {
   register:require('inert')
  }
]);







    //HANDLING POST REQUEST FROM FORM
server.route(
{
   method: 'POST',
   path:'/server.js',

   //without hapi-auth-basic
  /* handler: function(request,reply){
   	var email=request.payload.email;
   	console.log(email);
   	reply.view('facebook',{mail:email});
   }*/

   

 
      handler: function (request, reply) {
      	var email=request.payload.email;
      	var password=request.payload.password;
      	if(email != users.future.email)
      	{
      		reply("username not exists !!!"); //
      	}
      	else
      	{
      	Bcrypt.compare(password, users.future.password, function (err, isValid) {

      		if(!err && isValid) {
          reply("password is incorrect.."); 
        }
        else
        {
        	reply("welcome u h r successful");

        }
     // console.log(password);
      //console.log(users.future.password);
      //reply("passsowrd does not match");
       
   });
      }
      }

     /* config:{
      	validate:{
      		payload:{
      			email:Joi.string().min(3).max(10)
      		}
      	}
      }*/
    
   });






server.route(
{
   method: 'GET',
   path:'/',
   handler: function(request,reply){
   	reply.view('facebook');
   }
   });



//HANDLING GET REQUEST FROM FORM
/*server.route(
{
   method: 'GET',
   path:'/server.js',
   handler: function(request,reply){
   	var email=request.query.email;
   	reply.view('facebook',{mail:email});
   }
   });*/






server.views(
   {
       engines:{
       	html: require('handlebars')
       },

       relativeTo:__dirname,
       path: 'templates'

   });



server.route({  
  method: 'GET',
  path: '/facebook.CSS',
  handler:  function (request, reply) {

  	//console.log(request.payload);
    // reply.file() expects the file path as parameter
    reply.file('/home/adminint1/hapi-plugin/templates/facebook.CSS')
  }
});


server.route({  
  method: 'GET',
  path: '/panga.png',
  handler:  function (request, reply) {
    // reply.file() expects the file path as parameter
    reply.file('/home/adminint1/hapi-plugin/templates/panga.png')
  }
});





server.start(function (err) {  
  console.log('info', 'Server running at: ' + server.info.uri)
})