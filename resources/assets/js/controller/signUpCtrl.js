(function() {

  angular.module('signUp.controller', []).controller('signUpCtrl', ['$scope', '$http', signUpCtrl]);


    function signUpCtrl($scope, $http) {
          var original;
          var url = 'http://localhost:3000/register';
          var user = { name : "Loyd", password: "Cherries" };
          return $scope.user = {
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              age: ""
          }, $scope.showInfoOnSubmit = !1, original = angular.copy($scope.user), $scope.revert = function() {
              return $scope.user = angular.copy(original), $scope.form_signup.$setPristine(), $scope.form_signup.confirmPassword.$setPristine();
          }, $scope.canRevert = function() {
              return !angular.equals($scope.user, original) || !$scope.form_signup.$pristine;
          }, $scope.canSubmit = function() {
              return $scope.form_signup.$valid && !angular.equals($scope.user, original);
          }, $scope.submitForm = function() {

              $http.post(url, user)
                .success(function(res) {
                  console.log(res);
                })
                .error(function(err) {
                  alert('issues');
                });

            //  return $scope.showInfoOnSubmit = !0, $scope.revert();
          };
    }

})();
