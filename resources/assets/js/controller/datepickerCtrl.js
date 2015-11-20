(function() {

  angular.module('datepicker.controller', []).controller('datepickerCtrl', ['$scope', datepickerCtrl]);

  function datepickerCtrl($scope) {
    console.log("datepicker");
    return $scope.today = function() {
                $scope.dt = new Date();
            }, $scope.today(), $scope.showWeeks = !0, $scope.toggleWeeks = function() {
                $scope.showWeeks = !$scope.showWeeks;
            }, $scope.clear = function() {
                $scope.dt = null;
            }, $scope.disabled = function(date, mode) {
                return "day" === mode && (0 === date.getDay() || 6 === date.getDay());
            }, $scope.toggleMin = function() {
                var _ref;
                $scope.minDate = null !== (_ref = $scope.minDate) ? _ref : {
                    "null": new Date()
                };
            }, $scope.toggleMin(), $scope.open = function($event) {
                return $event.preventDefault(), $event.stopPropagation(), $scope.opened = !0;
            }, $scope.dateOptions = {
                "year-format": "'yy'",
                "starting-day": 1
            }, $scope.formats = ["dd-MMMM-yyyy", "yyyy/MM/dd", "shortDate"], $scope.format = $scope.formats[0];
        
  }

})();
