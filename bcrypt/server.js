var bcrypt = require('bcrypt');
var saltRounds = 10;
var myPlaintextPassword = 'shivam';
var myhash;
//var someOtherPlaintextPassword = 'not_bacon';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  // Store hash in your password DB. 
if(err)
	throw err;
else
  console.log(hash);
myhash=hash;
  
});






 bcrypt.compare(myPlaintextPassword, myhash, function(err, res) {
     // res == true 
     console.log("true");
 });
// bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
//     // res == false 
// });