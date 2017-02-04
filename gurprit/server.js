var Hapi = require('hapi')
var Good = require('good')
var Vision = require('vision')
var Users = require('./users-db')
var Handlebars = require('handlebars')
var CookieAuth = require('hapi-auth-cookie')
var Boom = require('boom')
var Bcrypt = require('bcrypt')
var Users = require('./users-db')


// create new server instance
var server = new Hapi.Server()

// add server’s connection information
server.connection({
  host: 'localhost',
  port: 3000
})

// register plugins to server instance
server.register([
  {
    register: Vision
  },
  {
    register: Good,
    options: {
      ops: {
        interval: 10000
      },
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [ { log: '*', response: '*', request: '*' } ]
          },
          {
            module: 'good-console'
          },
          'stdout'
        ]
      }
    }
  },
  {
    register: CookieAuth
  }
], function (err) {
  if (err) {
    server.log('error', 'failed to install plugins')

    throw err
  }

  server.log('info', 'Plugins registered')

  /**
   * view configuration
   */
  server.views({
    engines: {
      html: Handlebars
    },
    path: __dirname + '/views',
    layout: true
  })
  server.log('info', 'View configuration completed')

  // validation function used for hapi-auth-cookie: optional and checks if the user is still existing
  var validation = function (request, session, callback) {
    var username = session.username
    console.log(username);
    var user = Users[ username ]

    if (!user) {
      return callback(null, false)
    }

    server.log('info', 'user authenticated')
    callback(err, true, user)
  }

  server.auth.strategy('session', 'cookie',false, {
   password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC',
    cookie: 'future-studio-hapi-tutorials-cookie-auth-example',
    redirectTo: '/',
    isSecure: false,
    validateFunc: validation
  });

  server.log('info', 'Registered auth strategy: cookie auth')

  // var routes = require('./cookie-routes')
  // server.route(routes)
  // server.log('info', 'Routes registered')



server.route({


    method: 'GET',
    path: '/',
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
      handler: function (request, reply) {
        console.log("first time");
        console.log(request.auth.isAuthenticated);
        if (request.auth.isAuthenticated) {
          console.log("in / vale if authenticated");
          return reply.view('profile')
        }
        reply.view('index');
      }
    }

});

// server.route({
//   method:'GET',
//   path:'/sample',
//   handler: function(request,reply)
//   {
//        return reply.view('sample');
//   }
// });


server.route({



  method: 'POST',
    path: '/login',
    config: {
     // auth: 'session',
      auth: {
        mode: 'try',
        strategy:'session'
      },
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      },
      handler: function (request, reply) {
        //console.log(request.headers);
        console.log(" after login");
       console.log(request.auth.isAuthenticated);
        if (request.auth.isAuthenticated) {
          console.log("in /login vale isauthenticated");
          return reply.view('profile')
        }

        var username = request.payload.username
        var user = Users.kotwal;
        console.log(user);

        if (!user) {
          return reply(Boom.notFound('No user registered '))
        }

        var password = request.payload.password

        return Bcrypt.compare(password, user.password, function (err, isValid) {
          if (isValid) {
            request.server.log('info', 'user authentication successful')
            request.cookieAuth.set(user);

            return reply.view('profile')
          }

          return reply(Boom.notFound('No user registered '))
        })
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
        reply.view('index')
      }
    }
   

});




  // start your server after plugin registration
  server.start(function (err) {
    if (err) {
      server.log('error', 'failed to start server')
      server.log('error', err)

      throw err
    }

    server.log('info', 'Server running at: ' + server.info.uri)
  })
})
