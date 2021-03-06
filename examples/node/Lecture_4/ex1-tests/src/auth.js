var jwt = require('jsonwebtoken');
var cookieName = 'dogServiceCookie';
var secret = 'HanSoloShootsFirst';
var issuer = 'Peter Griffin';
var twoMinutes = '2';

var Auth = function() {
  var verifyAuth = function(request) {
    var cookie = request.cookies[cookieName];
    if(cookie) {
      try {
        request.token = jwt.verify(cookie,
          secret,
          {issuer: issuer,
            ignoreExpiration: false});
        return true;
      } catch(error) {
        console.log('Request unauthorized. Error decoding token.');
        return false;
      }
    } else {
      console.log('Request unauthorized. No token available.');
      return false;
    }
  };

  this.isAuthenticated = function(request, response, next){

    if(verifyAuth(request)) {
      next();
    } else {
      response.sendStatus(407);
    }
  };

  this.signToken = function(payload) {
    return jwt.sign(payload, secret, {issuer: issuer,
      expiresInMinutes: twoMinutes});
  };
};

module.exports = new Auth();