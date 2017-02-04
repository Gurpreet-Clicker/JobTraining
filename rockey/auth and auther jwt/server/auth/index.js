var Joi = require('joi');
var Boom = require('boom');
var Promise = require('promise');
var Bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var Url = require('url');
var mongoose = require('mongoose');
var secret = 'authenticate';

var url = 'mongodb://localhost:27017/practice';

mongoose.connect(url);

var userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    userType: { type: String, required: true }
});
var User = mongoose.model('user',userSchema);

var validate = function(decode, request, callback){

    return callback(null, true);
}

function hashPassword(password, cb){
    Bcrypt.genSalt(10, function(err, salt){
        Bcrypt.hash(password, salt, function(err, hash){
            return cb(err, hash);
        });
    });
}

function createToken(user){
    let scopes;
    console.log("createToken", user);
    var jwttoken =  jwt.sign({id: user._id, email:user.email, scope:user.userType}, secret, {algorithm: 'HS256', expiresIn: "1h"});
    console.log(user.userTypes);
    return jwttoken;
}

exports.register = function(server, options, next){

    server.register([
        {
            register: require('hapi-auth-jwt2')
        }
    ], function(err) {
        if (err) {
            console.error('Failed to load a plugin:', err);
            throw err;
        }

        // Set our server authentication strategy
        server.auth.strategy('jwt', 'jwt', {
            key: secret,
            validateFunc: validate,
            verifyOptions: {algorithms: ['HS256']}
            });

    });

    server.auth.default({
        strategy: 'jwt',
        scope: ['admin']
    });

    server.state('token', {
    ttl: null,
    isSecure: false,
    isHttpOnly: false,
    encoding: 'none',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});

    server.route({
        method: 'POST',
        path: '/login',
        config: {
            auth: false,
            state: {
                parse: true,
                failAction: 'error'
            },
            handler: function(request, reply) {

                getValidatedUser(request.payload.email, request.payload.password)
                    .then(function(user){
                        if (user) {
                            if(("user".localeCompare(user.userType))===0)
                            {
                                console.log("token", user);
                               return reply.file('userprofile.html').state('token',createToken(user));
                            }
                            else if(("admin".localeCompare(user.userType))===0)
                            {
                                return reply.file('adminaccess.html').state('token',createToken(user));
                            }
                            else
                                return reply("not authorized");
                        } else {
                            return reply(Boom.unauthorized('Bad email or password'));
                        }

                    })
                    .catch(function(err){
                        return reply('error has been caught');
                    });

            }
        }
    });

    server.route({
        method: 'POST',
        path: '/signup/{path*}',
        config: {
            auth: false,
            state: {
                parse: true, // parse and store in request.state
                failAction: 'error' 
            },
            handler: function(request,reply){
                console.log(typeof(request.path));
                var user = new User();
                user.fname = request.payload.fname;
                user.lname = request.payload.lname;
                user.email = request.payload.email;
                if(("/signup/user".localeCompare(request.path))==0){
                    user.userType = 'user';
                }
                else if(("/signup/admin".localeCompare(request.path))==0){
                    user.userType = "admin";
                }
                else
                {
                    user.userType = "unauthorized";
                }
                hashPassword(request.payload.password, function(err, hash){
                    if(err) {
                        throw Boom.badRequest(err);
                    }
                    user.password = hash;
                    user.save(function(err, user){
                        if(err) {
                            throw Boom.badRequest(err);
                        }
                        console.log("saved data");
                    });
                });

                return reply('success').state('token',createToken(user));
                
            }
            
        }
    });


    

    next();
}

exports.register.attributes = {
    name: 'auth'
};



/**
 * REALLY STUPID GET VALID USER - NOT FOR PRODUCITON USE.
 * Replace this with your own database lookup and make sure
 * you encrypt the passwords. Plain text passwords should not be used.
 * AGAIN THIS IS JUST TO GET THIS EXAMPLE WORKING!
 */

function getValidatedUser(email, password){
    return new Promise(function(fulfill, reject){
        console.log("IN promise");
        User.findOne({email: email},function(err,user){
            if(err) {
                console.log("user not found");
                return reject(null);
            }
            if(user==null){
                console.log("no user available");
                return reject(null);
            }
            if(user){
                Bcrypt.compare(password,user.password,function(err, isValid){
                    if(isValid){
                        console.log("fulfill",user);
                        return fulfill(grabCleanUser(user));
                    }
                    else{
                        return reject(Boom.badRequest("incorrect password"));
                    }
                });
            }
            else{
                return reject(Boom.badRequest("incorrect email"));
            }
            console.log(user);
        });
        
                
        // This is done to remove the password before being sent.
        function grabCleanUser(user) {
            if(undefined){
                console.log("not allowed this thing");
                return null;
            }
            var user = user;
            delete user.password;
            console.log("clean user",user);
            return user;
        };

    });

        User.close();
}
