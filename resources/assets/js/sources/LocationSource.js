import globals from '../utils/Globals';
import JQuery from 'jquery';
import ls from 'local-storage';

var Location = {
  getSearchOptions: function(cb) {
    var url = `${globals.baseUrl}gallery/locationoptions`,
        user = ls.get('userData');

if ((user && user.token === undefined) || user === null) { return cb(undefined); };

    var promise = fetch(url, {
      method: "post",
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization' : user.token
      }
    });

    this.handleResult(promise, (result) => {
      cb(result);
    });
  },

  handleResult: function(promise, cb) {
    promise.then((response) => {
      if (response.status >= 200 && response.status < 300) {
          return response;
      }
      throw {
        badCredentials: response.status == 401,
        unknownError: response.status != 401
      }
    })
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      cb(result);
    })
    .catch((err) => {
      return cb(err);
    });
  }
};

export default Location;
