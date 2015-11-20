(function() {

  angular.module('dashboard.controller', []).controller('dashbardCtrl', ["$scope", 'dashboard', dashbardCtrl]);

  function dashbardCtrl($scope, dashboard) {

    var pieColors = ["#383d43", "#db5031", "#c1bfc0"];

    /*$scope.chartjsPie = [{
      value: 4,
      color:"#383d43",
      highlight: "#383d43",
      label: "Blue"
    },
    {
        value: 12,
        color: "#db5031",
        highlight: "#db5031",
        label: "Orange"
    },
    {
        value: 8,
        color: "#c1bfc0",
        highlight: "#c1bfc0",
        label: "Gray"
    }];*/

      dashboard.getMusicData().then(function(data) {
        chartData = [];
        i = 0;
        angular.forEach(data, function(value, key) {
          obj = {
            value: value.request_amount,
            color: pieColors[i],
            highlight: pieColors[i],
            label: value.name
          };
          chartData.push(obj);
          i++;
        });

        $scope.chartjsPie = chartData;
        console.log($scope.chartjsPie);

        //return $scope.chartjsPie;
      });

    function displayEventHistory() {
      // get data from dashboard service

    }

    function displayTipStats() {
      // get data from dashboard service
    }



  }

})();
