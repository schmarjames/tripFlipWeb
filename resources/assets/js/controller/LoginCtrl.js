(function() {

  angular.module('LoginCtrl', []).controller('LoginCtrl', ['appConfig', '$auth', '$state', '$http', '$rootScope', LoginCtrl]);

    function LoginCtrl(appConfig, $auth, $state, $http, $rootScope) {
      var vm = this;

      vm.loginError = false;
      vm.loginErrorText = null;

      vm.login = function() {
        var credentials = {
          email: vm.email,
          password: vm.password
        };


        $auth.login(credentials).then(function() {
          return $http.get(appConfig.url + '/api/authenticate/user');

        }, function(error) {
          vm.loginError = true;
          vm.loginErrorText = error.data.error;
        }).then(function(response) {

          var user = JSON.stringify(response.data.user);
          localStorage.setItem('user', user);
          $rootScope.authenticated = true;
          $rootScope.currentUser = response.data.user;

          console.log(response.data.user);
          $state.go('admin.dashboard').then(function() {
            angular.element(document).ready(function(){
                setTimeout(function(){
                    $('.page-loading-overlay').addClass("loaded");
                    $('.load_circle_wrapper').addClass("loaded");
                },1000);
            });
          });
        });
      };
    }

})();
