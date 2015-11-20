(function() {

  angular.module('APIInterceptor', []).service('APIInterceptor', ["$rootScope", "$q", "$injector", APIInterceptor]);

  function APIInterceptor($rootScope, $q, $injector) {
    vm = this;
    //return vm;
    vm.request = function(config) {
      config.headers.Authorization = "Bearer "+ localStorage.satellizer_token;
      console.log(config);
      return config;
    };

    vm.responseError = function(rejection) {
        console.log(rejection);
        var $state = $injector.get('$state');
        var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

        angular.forEach(rejectionReasons, function(value, key) {
          if(rejection.data.error === value) {

            localStorage.removeItem('user');
            $state.go('login');

          /*  var $auth = $injector.get('$auth');
            var $http = $injector.get('$http');
            var $state = $injector.get('$state');
            var deferred = $q.defer();
            var user = JSON.parse(localStorage.getItem('user'));
            var credentials = {
              email: user.email,
              password: user.password
            };

            if(value === 'token_expired') {

              // update token
              $auth.login(credentials).then(deferred.resolve, deferred.reject);
              return deferred.promise.then(function(data) {
                return $http(rejection.config);
              });
            } else {
              localStorage.removeItem('user');
              $state.go('login');
            } */
          }
        });
        return $q.reject(rejection);
    };
  }

})();
