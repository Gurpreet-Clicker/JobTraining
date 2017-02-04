function sync(i)
{
	setTimeout(function cb(){
		console.log(i);
	},1000);
}




for(var i=0;i<=100;i++)
{
	sync(i);
}