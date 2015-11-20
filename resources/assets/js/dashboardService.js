(function() {

  angular.module('dashboard.service', []).factory('dashboard', ['$http', '$q', '$timeout', dashboard]);

    function dashboard($http, $q, $timeout) {
      //var url; dashboard service url
      var factory = {
            getMusicData : getMusicData,
            getEventHistoryData : getEventHistoryData,
            getHighestTipsData : getHighestTipsData
          },
          songs = [
            { name: "Money", artist: "Michael Jackson", request_amount: 4 },
            { name: "What They Say", artist: "Maya Jane Cole", request_amount: 12 },
            { name: "Look Around You", artist: "Chopsticks", request_amount: 8 }
          ],
          event_data = [],
          guest_data = {};

      return factory;

      function getMusicData() {
        // queue music data
        var deferred = $q.defer();

        $timeout(function() {
          deferred.resolve(songs);
        }, 500);

        return deferred.promise;
      }

      function getEventHistoryData() {}

      function getHighestTipsData() {}
    }

})();
