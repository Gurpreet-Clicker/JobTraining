var Hapi = require('hapi');

var server = new Hapi.Server();
var jwt=require('jwt-simple');

var secret = 'xxx';

var bcrypt = require('bcrypt') ; 
var myhash;

var saltRounds = 10;
var path=require('path');
var CookieAuth = require('hapi-auth-cookie')

//var BasicAuth = require('hapi-auth-basic');
//var Joi=require('joi');




var mysql=require('mysql');
//var res=[];
var connection=mysql.createConnection(


	{

	host:        'localhost',
	user:        'root',
	password:    'root',
	database:    'UserDb'  

});



connection.connect();



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
  },
  {
    register: CookieAuth
  }
],function(err)
{
  if(err)
    throw err;
  else
    console.log("Plugins Registered");





var validation = function (request, session, callback) {
    var username = session.user;
    console.log(username);
    // // var user = Users[ username ]

     if (!username) {
       return callback(null, false)
     }

     server.log('info', 'user authenticated')
     callback(err, true)
  }

  server.auth.strategy('session', 'cookie',false, {
   password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC',
    cookie: 'future-studio-hapi-tutorials-cookie-auth-example',
    redirectTo: '/',
    isSecure: false,
    validateFunc: validation
  });


server.route(
{
   method: 'GET',
   path:'/',

   config: {
      auth: {
        mode: 'try',
        strategy: 'session'
      },
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      },

   
  handler: function(request,reply){
    console.log(request.auth.isAuthenticated);
   	
   	if (request.auth.isAuthenticated) {
          console.log("in / vale if authenticated");
          return reply.view('users');
        }
        
    	reply.view('admin');
   }
 }
   });


server.route({

             method: 'GET',
    path: '/logout',
    config: {
      auth: 'session',
      handler: function (request, reply) {
        request.cookieAuth.clear();
        reply.view('admin')
      }
    }
   

});





 
server.route(
{
   method: 'GET',
   path:'/css/style.css',

   
  handler: function(request,reply){
    
    
    reply.file('/home/adminint1/user_management/templates/css/style.css');
   }
   });




server.route(
{
   method: 'GET',
   path:'/login.html',

   
  handler: function(request,reply){
   	
   	
   	reply.view('login');
   }
   });





server.route(
{
   method: 'POST',
   path:'/admin.js',
    config: {
    // auth: 'session',
      auth: {
        mode: 'try',
        strategy:'session'
      },
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      },
     handler: function(request,reply){
  	//var payload=request.payload;
   	var username=request.payload.username;
   	var password=request.payload.password;

    if (request.auth.isAuthenticated) {
          console.log("in /login vale isauthenticated");
          return reply.view('users');
        }
   //	var params = request.query.params;
   //	var token = jwt.encode(payload, secret);
   	//console.log(token);
   	  connection.query('select * from admin',function(err,rows,fields)
       {
         var jasus=0;
             if(err)
            	throw err;
            for( res in rows)
              {
              	//console.log(rows[res]);
              	if(rows[res].username==username && rows[res].password==password)
              	{
                  var obj={
                    user:rows[res].username,
                    pwd:rows[res].password
                  }
                  request.cookieAuth.set(obj);
              		return reply.view('users');
              	}
              	else
              	{
              	return	reply.view('error');
              	}
              }
        
            
       });
      
   }
 }
   });




server.route(
{
   method: 'POST',
   path:'/login.js',

   
  handler: function(request,reply){
   	var username=request.payload.username;
   	var password=request.payload.password;
    //var role= request.payload.role;

    //console.log(role);
   	   
   	  connection.query('select * from users',function(err,rows,fields)
       {

        
             if(err)
            	throw err;

            var jasus=0;
               //console.log(rows.username);
              for( res in rows)
                 { 
                  //console.log(rows[res].username);
                 //console.log(jasus);
                    // console.log(rows[res].role);
              	//console.log(rows[res]);
              	if(rows[res].username==username && rows[res].password==password )
              	{
                  //console.log(request.payload.role);
                   
                    jasus=1;
                    var dbrole=rows[res].role;
                    if(dbrole=="Manager")
                      return reply.view('manager');
                    else if(dbrole=="User")
                       return reply.view('user');
                      else if(dbrole=="Employee")
                        return reply.view('employee');
                    console.log(dbrole);
                 //return reply.view('manager');
                 break;
                 //   var dbrole=rows[res].role;
                //   if(role=="Employee")
                //   {
                //     jasus=1;
              		// reply.view('employee');
                //   break;
                // }
                }
              
                 
              	
              	
              


             //if(rows[res].username==username && rows[res].password==password && role=="Employee")
              //   {
              //     console.log("before");
                  
              //     jasus=1;
              //    return reply.view('employee');
              //    break;


              //   //  console.log(rows[res].username + rows[res].password);
                
              //   //  var dbrole=rows[res].role;
              //   //   if(role=="Manager")
              //   //   {
              //   //     jasus=1;
              //   //   reply.view('manager');
              //   //   break;
              //   // }
              //     //reply.view('info',{user:user ,age:age ,name:name ,email:email ,phone:phone});
                    
             
              // }
              
              

              // if((rows[res].username==username) && (rows[res].password==password) && role=="User")
              //   {

              //        jasus=1;
              //        return reply.view('user');
              //        break;
              //     //console.log(rows[res].username + rows[res].password);
               
              //   //  var dbrole=rows[res].role;
              //   //   if(role=="User")
              //   //   {
              //   //     jasus=1;
              //   //   reply.view('user');
              //   //   break;
              //   // }
              //     //reply.view('info',{user:user ,age:age ,name:name ,email:email ,phone:phone});

              // }


              


             
         }
        // console.log("outside for loop");
        // console.log(jasus);

        if(jasus!=1)
        {
          reply.view('error');
        }   
         



              
             
       });


       

      
       // connection.end();
   }
   });



server.route(
{
   method: 'POST',
   path:'/users.js',

   
  handler: function(request,reply){

//      var password=request.payload.password;

//      bcrypt.hash(password, saltRounds, function(err, hash) {
//Store hash in your password DB. 
// if(err)
// 	throw err;
// else
//  console.log(hash);
// myhash=hash;
  
// });

  	var post = {
   	 username:  request.payload.username,
     password:   request.payload.password,
   	 name  :    request.payload.name,
   	 age   :    request.payload.age,
   	 email :    request.payload.email,
   	 phone :    request.payload.phone,
   	 role  :    request.payload.role
   };

   
    //console.log(age);
   	  connection.query('insert into users SET ?',post,function(err,rows,fields)
       {
             if(err)
            	throw err;
             else
             {
             	reply("data inserted");
             }
              });

      //reply(role);

      }
       
 
   });



server.views(
   {
       engines:{
       	html: require('handlebars')
        //ejs: require('ejs')
       },

       relativeTo:__dirname,
       path: 'templates'
       

   });



server.start(function (err) {  
  console.log('info', 'Server running at: ' + server.info.uri)
})



});




//authentication using bcrypt
// console.log(fields);
     //        for( res in rows)
     //          {

     //           if(rows[res].username==username && rows[res].role=="Manager")
     //           {
     //              //console.log(rows[res].role);

     //             //console.log(rows[res].username + rows[res].password);
     //           var dbpass=rows[res].password;
     //           //console.log(typeof(dbpass));
     //           var myjson = JSON.stringify(dbpass);
     //           //console.log(typeof(myjson));
     //           //var stringpass=dbpass.toString();
     //           //console.log(stringpass);
     //           console.log("above compare");
     //           bcrypt.compare(password, myjson, function(err, res) {
     // // res == true 
     //             //console.log(res);
     //             if(err)
     //               console.log(err);
     //             else
                 
                   
     //               return reply.view('manager');
                  
     //             // reply("password matched");
                    
     //            });
     //            console.log("outside bcrypt.compare");
     //            var user=rows[res].username;
     //                var name=rows[res].name;

     //                var age=rows[res].age;
     //                var email=rows[res].email;
     //                var phone=rows[res].phone;
     //              //return reply.view('manager');

     //             //reply.view('info',{user:user ,age:age ,name:name ,email:email ,phone:phone});

     //          }
