var Hapi = require('hapi')  
var Bcrypt = require('bcrypt')  
var BasicAuth = require('hapi-auth-basic')





// hardcoded users object … just for illustration purposes
var users = {  
  future: {
    id: '1',
    username: 'future',
    password: '$2a$04$YPy8WdAtWswed8b9MfKixebJkVUhEZxQCrExQaxzhcdR2xMmpSJiG'  // 'studio'
  }
}

// create new server instance
var server = new Hapi.Server();

server.connection({  
  host: 'localhost',
  port: 4000
});

// register plugins to server instance
server.register(BasicAuth, function (err) {  
  if (err) {
    throw err
  }

  // validation function used for hapi-auth-basic
  var basicValidation  = function (request, username, password, callback) {
    var user = users[ username ]
    console.log(username);
   // console.log(user);


if (!user) {
      return callback(null, false)
      //console.log("username is invalid");
    }

    Bcrypt.compare(password, users.future.password, function (err, isValid) {
      console.log(password);

      //console.log(users.future.password);

      callback(err, isValid, { id: user.id, name: user.name })
    })
  }

  server.auth.strategy('sample', 'basic', { validateFunc: basicValidation })

  server.route({
    method: 'GET',
    path: '/sample',
    config: {
      auth: 'sample',
      handler: function (request, reply) {
        reply('Yeah! This message is only available for authenticated users!')
      }
    }
  })

  // start your server after plugin registration
  server.start(function (err) {
    if (err) {

      throw err
    }

    console.log('info', 'Server running at: ' + server.info.uri)
  })
})