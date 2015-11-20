(function() {

  angular.module('timepicker.controller', []).controller('timepickerCtrl', ['$scope', timepickerCtrl]);

  function timepickerCtrl($scope) {
      return $scope.mytime = new Date(), $scope.hstep = 1, $scope.mstep = 15, $scope.options = {
          hstep: [1, 2, 3],
          mstep: [1, 5, 10, 15, 25, 30]
      }, $scope.ismeridian = !0, $scope.toggleMode = function() {
          $scope.ismeridian = !$scope.ismeridian;
      }, $scope.update = function() {
          var d;
          return d = new Date(), d.setHours(14), d.setMinutes(0), $scope.mytime = d;
      }, $scope.changed = function() {
          return void 0;
      }, $scope.clear = function() {
          $scope.mytime = null;
      };
  }

})();
