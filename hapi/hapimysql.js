var hapi=require('hapi');
var mysql=require('mysql');
var res=[];
var connection=mysql.createConnection(


	{

	host:        'localhost',
	user:        'root',
	password:    'root',
	database:    'student'  

});



connection.connect();


var server=new hapi.Server();



server.connection(

{
	host:'localhost',
    port:3000


});



server.route(
{
   method:'GET',
   path:'/',

   handler:  function(request,reply)
   {
         
   	//console.log(request.method);
   	//console.log(request.method);
       connection.query('select * from info',function(err,rows,fields)
       {
             if(err)
            	throw err;
            for(i=0;i<rows.length;i++)
              {
              	res.push(rows[i].name);
              }
             

                          

          

            console.log(res);

             reply(res);

            //reply('Data Fetched:'+rows[1].Name);
       });
        connection.end();

       
       
          }
        

});




server.start(function()
{
     console.log('server running at:',server.info.uri);

});