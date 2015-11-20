(function() {

  angular.module("user.service", []).factory("user", ['$http', '$q', '$timeout', user]);

  function user($http, $q, $timeout) {
    var factory = {

    },
    userAccountInfo = {},
    userSubscription = {},
    userBillingInfo = {};


    function getUserInfo() {
      var deferred = $q.defer();

      $timeout(function() {
        deferred.resolve();
      }, 500);

      return deferred.promise;
    }
  }

})();
