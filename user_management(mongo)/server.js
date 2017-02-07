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


var scheduleSchema=new mongo.Schema({
           day   :    { type: String, required: true, index: { unique: true } },
           topic:    {type:String,required:true},
           tname:    {type:String,required:true},
           tid    :    {type:Number,required:true },
           qname     :    {type:String,required:true},
           qid   :    {type:Number,required:true  },
           ename   :    {type:String,required:true},
           eid:    {type:Number,required:true}
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

//var Schedule=mongo.model('schedule',scheduleSchema);

var Schedule1=mongo.model('schedule1',scheduleSchema);







server.connection({  
  host: 'localhost',
  port: 3000
});




    server.route(
{
   method: 'POST',
   path:'/submitSchedule',

    config:{

   //       auth: {
   //      mode: 'try',
   //      strategy: 'session'
   //    },
   //    plugins: {
   //      'hapi-auth-cookie': {
   //        redirectTo: false
   //      }
   //    },
  
   
  handler: function(request,reply){


        
        //console.log(request.auth.isAuthenticated);


         
          var schedule = new Schedule1();

                schedule.day = request.payload.day;
                schedule.topic=request.payload.topic;
               // user.password=request.payload.password;
                schedule.tname=request.payload.tname;
                schedule.tid=request.payload.tid;
                schedule.qname=request.payload.qname;
                schedule.qid=request.payload.qid;
                schedule.ename=request.payload.ename;
                schedule.eid=request.payload.eid;




                
                    schedule.save(function(err, user){
                        if(err) {
                            return reply(Boom.badRequest(err));
                        }
                        else
                           return reply("Data Saved Successfully !!!");
                    });
                
        
        

         
    }
     } 
 
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
   path:'/css/style(schedule).css',

   
  handler: function(request,reply){
    
    
    reply.file('/home/adminint1/user_management(mongo)/templates/css/style(schedule).css');
   }
   });


server.route(
{
   method: 'GET',
   path:'/images/bgnoise_lg.png',

   
  handler: function(request,reply){
    
    
    reply.file('/home/adminint1/user_management(mongo)/templates/images/bgnoise_lg.png');
   }
   });


server.route(
{
   method: 'GET',
   path:'/images/select-arrow.png',

   
  handler: function(request,reply){
    
    
    reply.file('/home/adminint1/user_management(mongo)/templates/images/select-arrow.png');
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
   path:'/viewSchedule',
   

   
  handler: function(request,reply){

  	//var user=new users();
//   	users.findOne({}).sort({empid:-1}).run( function(err, doc) {
//      var max = doc.empid;
//      reply(max);
// });
  	Schedule1.find({}, function(err, doc) {
      //var max = doc.empid;
     reply.view('show',{users:doc});
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
       		console.log(request.auth.credentials);
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
                       	         	reply.view('schedule');
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
       	//html: require('handlebars'),
        ejs: require('ejs')
       },

       relativeTo:__dirname,
       path: 'templates'

       // layout:true,
       // layoutPath:Path.join(__dirname,'templates');
       

   });



server.start(function (err) {  
  console.log('info', 'Server running at: ' + server.info.uri)
})



});




