var hapi=require('hapi');
var path=require('path');

var server= new hapi.Server();


server.connection(

{
	host:'localhost',
   port:3000

});

server.register(require('vision'),function(err){


//homepage
server.route(
{
   method: 'GET',
   path:'/',
   handler: function(request,reply){
   	reply.view('homepage');
   }
   });


server.route(
{
   method: 'GET',
   path:'/homepage.html',
   handler: function(request,reply){
   	reply.view('homepage');
   }
   });


server.route(
{
   method: 'GET',
   path:'/signupform.html',
   handler: function(request,reply){
   	reply.view('signupform');
   }
   });


/*server.route(
{
   method: 'GET',
   path:'/si',
   handler: function(request,reply){
   	reply.view('signupform');
   }
   });*/


server.route(
{
   method: 'GET',
   path:'/loginform.html',
   handler: function(request,reply){
   	reply.view('loginform');
   }
   });


server.route(
{
   method: 'GET',
   path:'/welcomepage.html',


   handler: function(request,reply){
   	reply.view('welcomepage');
   	//console.log(request.params.email);
   }
   });



//about us


server.route(
{
   method: 'GET',
   path:'/about.html',


   handler: function(request,reply){
   	reply.view('about');
   	//console.log(request.params.email);
   }
   });



/*server.route(
{
   method: 'GET',
   path:'/signupform.html',


   handler: function(request,reply){
   	reply.view('signupform');
   	//console.log(request.params.email);
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



});

server.start(function()
{
    console.log('server running at:',server.info.uri);
});