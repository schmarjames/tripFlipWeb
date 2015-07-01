angular
  .module('travelbloc', ['ui.router', 'ui.bootstrap', 'ngStorage'])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function config($stateProvider, $urlRouterProvider, $httpProvider) {

      $stateProvider
        .state('login', {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        });

      $urlRouterProvider.otherwise('/');
    }]);
