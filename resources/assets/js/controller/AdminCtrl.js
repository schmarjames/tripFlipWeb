angular.module("AdminAppCtrl", []).controller("AdminAppCtrl", ["$scope", "$location",
        function($scope, $location) {
            $scope.checkIfOwnPage = function() {

                return _.contains(["/404", "/pages/500", "/pages/login", "/pages/signin", "/pages/signin1", "/pages/signin2", "/pages/signup", "/pages/signup1", "/pages/signup2", "/pages/forgot", "/pages/lock-screen"], $location.path());

            };

            $scope.info = {
                theme_name: "SOUNIORITY",
                user_name: "Jane Doe"
            };


        }
    ]).controller("NavCtrl", ["$scope",
        function($scope) {

            $scope.navInfo = {
                tasks_number: 5,
                widgets_number: 13
            };

        }
    ]).controller("DashboardCtrl", ["$scope",
        function($scope) {


        }
    ]);
