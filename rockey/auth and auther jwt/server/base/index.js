var Boom = require('boom');


exports.register = function(server, options, next){

    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: false,
            handler: function(request, reply){
            return reply.file('login.html'); 
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/admin',
        config: {
            auth: false,
            handler: function(request, reply){
                reply.file('admin.html');
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/{path*}',
        config: {
            auth: false,
            handler: function(request, reply){
                reply(Boom.notFound());
            }
        }
    });

    next();
}

exports.register.attributes = {
    name: 'base'
};
