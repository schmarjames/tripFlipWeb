import globals from '../utils/Globals';
import JQuery from 'jquery';

var Photos = {
      photoType: {
        collection: {
          url: `${globals.baseUrl}photo/collection`,
          prepareData: (obj) => {
            return JSON.stringify({
              amount : obj.amount,
              latest : (obj.latest !== null) ? obj.latest : 0,
              lastQueryId : (obj.id !== null) ? obj.id : "",
              category : (obj.category === undefined) ? null : obj.category
            });
          }
        },
        userlocationcollection: {
          url: `${globals.baseUrl}gallery/userlocationcollection`,
          prepareData: (obj) => {
            return JSON.stringify({
              amount : obj.amount,
              lastQueryId : (obj.lastQueryId !== null) ? obj.lastQueryId : null,
              locationData : locations
            });
          }
        },
        usercategorycollection: {
          url: `${globals.baseUrl}gallery/usercategorycollection`,
          prepareData: (obj) => {
            var locations;
            if (obj.hasOwnProperty('location')) {
              locations = JSON.stringify([
                obj.location.countryId,
                obj.location.stateRegionId,
                obj.location.cityId
              ]);
            }

            return data = JSON.stringify({
              amount : obj.amount,
              lastQueryId : (obj.lastQueryId !== null) ? obj.lastQueryId : "",
              category : (obj.category === undefined) ? null : obj.category,
              locationData : locations
            });
          }
        }
      },
      queryPhotos: (data, cb) => {
        var queryType = this.photoType[data.urlType],
            user = ls.get('userData');

        if (user && user.token === null) { return cb(undefined); }
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

      likePhoto: (photoId) => {
        var url = `${globals.baseUrl}photo/like`,
            user = ls.get('userData'),
            userId;

        if (user && user.token === null) { return cb(undefined); }
        var promise = fetch(url, {
          method: "post",
          headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : user.token
          },
          body: JSON.stringify({
            userId : user.Id,
            like : photoId
          })
        });

        self.handleResult(promise);
      },

      handleResult: (promise, cb) => {
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

export default Photos;
