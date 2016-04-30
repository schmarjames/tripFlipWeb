import globals from '../utils/Globals';
import JQuery from 'jquery';
import ls from 'local-storage';

var Photos = {
      photoType: {
        collection: {
          url: `${globals.baseUrl}photo/collection`,
          prepareData: function(obj) {
            return JSON.stringify({
              amount : obj.amount,
              latest : (obj.latest !== null) ? obj.latest : 0,
              lastQueryId : (obj.lastQueryId !== null) ? obj.lastQueryId : "",
              category : (obj.category === undefined) ? null : obj.category
            });
          }
        },
        userlocationcollection: {
          url: `${globals.baseUrl}gallery/userlocationcollection`,
          prepareData: function(obj) {
            var locations = JSON.stringify([
                obj.countryId,
                obj.stateRegionId,
                obj.cityId
              ]);

            return JSON.stringify({
              amount : obj.amount,
              lastQueryId : (obj.lastQueryId !== null) ? obj.lastQueryId : null,
              locationData : (locations) ? locations : null
            });
          }
        },
        usercategorycollection: {
          url: `${globals.baseUrl}gallery/usercategorycollection`,
          prepareData: function(obj) {
            var locations;
            if (obj.hasOwnProperty('location')) {
              locations = JSON.stringify([
                obj.location.countryId,
                obj.location.stateRegionId,
                obj.location.cityId
              ]);
            }

            return JSON.stringify({
              amount : obj.amount,
              lastQueryId : (obj.lastQueryId !== null) ? obj.lastQueryId : "",
              category : (obj.category === undefined) ? null : obj.category,
              locationData : (locations) ? locations : null
            });
          }
        },
        randomcollection: {
          url: `${globals.baseUrl}photo/randomcollection`,
          prepareData: function(obj) {
            return JSON.stringify({
              userId : ls.get('userData').id,
              viewedPhotos : (obj.views !== null) ? obj.views : []
            });
          }
        }
      },
      queryPhotos: function (data, cb) {
        var queryType = this.photoType[data.urlType],
            user = ls.get('userData');
        if ((user && user.token === undefined) || user === null) { return cb(undefined); }
        var promise = fetch(queryType.url, {
              method: "post",
              headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : user.token
              },
              body: queryType.prepareData(data.data)
          });

        this.handleResult(promise, (result) => {
          cb(result);
        });
      },

      getCategoryPhotos: function (cb) {
        var url = `${globals.baseUrl}photo/categoryphotos`,
            user = ls.get('userData');

        if ((user && user.token === undefined) || user === null) { return cb(undefined); }

        var promise = fetch(url, {
            method: "get",
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

      getUserAlbumPhotos: function(type, cb) {
        var url = `${globals.baseUrl}gallery/albumcollection`,
            user = ls.get('userData');

        if ((user && user.token === undefined) || user === null) { return cb(undefined); }

        var promise = fetch(url, {
          method : "post",
          headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : user.token
          },
          body : JSON.stringify({
            type : type
          })
        });
        this.handleResult(promise, (result) => {
          cb(result);
        });
      },

      likePhoto: function (photoId) {
        var url = `${globals.baseUrl}photo/like`,
            user = ls.get('userData'),
            userId;

        if ((user && user.token === undefined) || user === null) { return cb(undefined); }
        var promise = fetch(url, {
          method: "post",
          headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : user.token
          },
          body: JSON.stringify({
            userId : user.id,
            like : photoId
          })
        });

        this.handleResult(promise);
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
          if (cb) {
            cb(result);
          }
        })
        .catch((err) => {
          if (cb) {
            return cb(err);
          }
        });
      }
};

export default Photos;
