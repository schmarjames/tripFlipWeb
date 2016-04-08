import globals from '../utils/Globals';
import JQuery from 'jquery';

var Auth = {
  login: function(credentials) {
    var data = JSON.stringify({
      email: credentials.email,
      password: credentials.password
    });

    return fetch(`${globals.baseUrl}auth`, {
        method : 'post',
        headers : {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        },
        body : data
      })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
              return response;
          }
          throw {
            badCredentials: response.status == 401,
            unknownError: response.status != 401
          }
        })
        .then((response) => {
          return response.json();
        });
  },

  getUserData: function(token, cb) {
    fetch(`${globals.baseUrl}authenticate/user?token=${token}&mobile=1`, {
      method: 'get'
    })
      .then((response) => {
        return response.json();
      })
      .then((userData) => {
        cb(userData.user);
      });
  }
};

export default Auth;
