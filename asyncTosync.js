function sync1()
{
	console.log("synchoronous -- 1");

}


function async1(callback)
{
	setTimeout(function()
	{

		callback();
		console.log("asynchoronous --1");
		
		//sync2();
	}, 3000);
}

function sync2()
{
	console.log("synchoronous -- 2");
}

sync1();
async1(sync2);
//sync2();