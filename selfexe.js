


setTimeout( function(){
	
function async1(callback)
{
	setTimeout(function()
	{
		console.log("asynchoronous --1")
		callback();
	}, 3000);
}

function sync2()
{
	console.log("synchoronous -- 2");
}

},4000);