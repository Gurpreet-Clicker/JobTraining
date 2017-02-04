var Hapi = require('hapi');

var server = new Hapi.Server();
var Boom=require('boom');



var mongo=require('mongoose');

var url='mongodb://localhost/student';
mongo.connect(url ,function (err,db)
	{
		//console.log(db);
		console.log("Database Connected");
	});

var schema=new mongo.Schema({
           rollno:Number,
           name:String

});

var info=mongo.model('info',schema);
//var info2=mongo.model('info2',schema);






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




server.route(
{
   method: 'GET',
   path:'/',

   
  handler: function(request,reply){
   	
   	
   	reply.view('index');
   }
   });


server.route(
{
   method: 'GET',
   path:'/fetch',

   
  handler: function(request,reply){


  	info.find({},function(err,docs)
  	{
       if(err)
       	throw err;
       else
       {
       	// var data={age:29 ,job:'ninja',hobbies:['eating','fight','playing']};
       	reply.view('show',{users:docs});
       }
  	});

    // var cursor=db.collection('infos').find();
    // cursor.each(function(err,doc)
    // {
    //        console.log(doc);
    // });
   	
   	
   	
   }
   });



server.route(
{
   method: 'POST',
   path:'/enter',

   
  handler: function(request,reply){
   	
   	 var user = new info();
   	 //var user2 = new info2();

                user.rollno = request.payload.rollno;
                user.name = request.payload.name;
   	user.save(function(err, user){
                        if(err) {
                            throw Boom.badRequest(err);
                        }
                        reply("Data Saved");
                        
         
                    });
   	
   }
   });






server.views(
   {
       engines:{
       	//ejs: require('handlebars'),
       	//html: require('handlebars'),
       	ejs: require('ejs') 
       },

       relativeTo:__dirname,
       path: 'templates',
       


   });



server.start(function (err) {  
  console.log('info', 'Server running at: ' + server.info.uri)
})