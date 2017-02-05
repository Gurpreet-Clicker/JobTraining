var Hapi = require('hapi');

var server = new Hapi.Server();
var jwt=require('jwt-simple');

var secret = 'xxx';

var Bcrypt = require('bcrypt') ; 
var myhash;

var saltRounds = 10;
var path=require('path');
var CookieAuth = require('hapi-auth-cookie');
var Boom=require('boom');

//var BasicAuth = require('hapi-auth-basic');
//var Joi=require('joi');


var mongo=require('mongoose');

var url='mongodb://localhost/Training';
mongo.connect(url ,function (err,db)
	{
		//console.log(db);
		console.log("Database Connected");
	});

var schema=new mongo.Schema({
           username:{ type: String, required: true, index: { unique: true } },
           password:String

});


var usersSchema=new mongo.Schema({
           empid   :    { type: Number, required: true, index: { unique: true } },
           username:    {type:String,required:true ,index: { unique: true }},
           password:    {type:String,required:true},
           name    :    {type:String,required:true},
           age     :    {type:Number,required:true},
           email   :    {type:String,required:true , index: { unique: true } },
           phone   :    {type:Number,required:true},
           roleType:    {type:String,required:true}
}); 

var admin=mongo.model('admin',schema);

var users=mongo.model('users',usersSchema);







server.connection({  
  host: 'localhost',
  port: 3000
});




function hashPassword(password, cb){
    Bcrypt.genSalt(10, function(err, salt){
        Bcrypt.hash(password, salt, function(err, hash){
            return cb(err, hash);
        });
    });
}





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
    var username = session.password;
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
  	if (request.auth.isAuthenticated) {
  		console.log(request.auth.isAuthenticated);
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
    
    
    reply.file('/home/adminint1/user_management(mongo)/templates/css/style.css');
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
   method: 'GET',
   path:'/FetchMaxEmpId',

   
  handler: function(request,reply){
  	//var user=new users();
//   	users.findOne({}).sort({empid:-1}).run( function(err, doc) {
//      var max = doc.empid;
//      reply(max);
// });
  	users.find({}, function(err, doc) {
      //var max = doc.empid;
     reply(doc);
 });
   	
   	
   	
   }
   });





server.route(
{
   method: 'POST',
   path:'/admin.js',
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

     	if (request.auth.isAuthenticated) {
     		console.log(request.auth.isAuthenticated);
          console.log("in / vale if authenticated");
          return reply.view('users');
        }
  	//var payload=request.payload;
   	var username=request.payload.username;
   	var password=request.payload.password;
   	//console.log(username);

    admin.findOne({username:username},function(err,result)
  	{
       // if(docs==null)
       // 	reply.view('error');
       
       	// var data={age:29 ,job:'ninja',hobbies:['eating','fight','playing']};
       	console.log(typeof(result));
       	if(result)
       	{
       	if(password==result.password)
       	{
       		request.cookieAuth.set(result);
       		return reply.view('users');
       	}
       	else
       	{
       		return reply.view('error');
       	}
       }
       else
       {
       	 return reply.view('error');
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


   	users.findOne({username:username},function(err,result)
  	{
       // if(docs==null)
       // 	reply.view('error');
       
       	// var data={age:29 ,job:'ninja',hobbies:['eating','fight','playing']};
       	console.log(typeof(result));
       	if(result)
       	{

       		Bcrypt.compare(password,result.password,function(err, isValid){
                    if(isValid){
                        //console.log("fulfill",user);
                       // reply.view('info',{result:result});
                       if(result.roleType=="Intern")
                       	reply("Welcome Intern");
                          else if(result.roleType=="Hr")
                       	    reply("Welcome Hr");
                       	      else if(result.roleType=="Trainer")
                       	      	reply("Welcome Trainer");
                       	         else if(result.roleType=="Co-Ordinator")
                       	         	reply("Welcome Co-Ordinator");
                        else 
                           reply("UnAuthorized Entry !!!");  


                    }
                    else{
                        return reply.view('error');
                    }
                });
       
       }
       else
       {
       	 reply.view('error');
       }
     });
        
   
   }
   });



server.route(
{
   method: 'POST',
   path:'/users.js',

   config:{

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


  	     if(request.auth.isAuthenticated)
  	     {	
          var user = new users();
   	

                user.empid = request.payload.empid;
                user.username=request.payload.username;
               // user.password=request.payload.password;
                user.name=request.payload.name;
                user.age=request.payload.age;
                user.email=request.payload.email;
                user.phone=request.payload.phone;
                user.roleType=request.payload.role;



                hashPassword(request.payload.password, function(err, hash){
                    if(err) {
                        throw Boom.badRequest(err);
                    }
                    user.password = hash;
                    user.save(function(err, user){
                        if(err) {
                            return reply(Boom.badRequest(err));
                        }
                        else
                           return reply("Data Saved Successfully !!!");
                    });
                });
        
        

         }
         else
         	return reply("Session Expired Plz Login Again");
    }
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
