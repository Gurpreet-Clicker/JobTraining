var Boom = require('boom')
var Bcrypt = require('bcrypt')
var Users = require('./users-db')


var routes = [
  {
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
        console.log("after logout");
        if (request.auth.isAuthenticated) {
          return reply.view('profile')
        }
        reply.view('index')
      }
    }
  },
  {
    method: 'POST',
    path: '/',
    config: {
     // auth: 'session',
      auth: {
        mode: 'try'
      },
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      },
      handler: function (request, reply) {
        console.log("first time");

        if (request.auth.isAuthenticated) {
          console.log("in is authenticated");
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
  },

  {
    method: 'GET',
    path: '/logout',
    config: {
      auth: 'session',
      handler: function (request, reply) {
        request.cookieAuth.clear();
        reply.view('index')
      }
    }
  }]

module.exports = routes
