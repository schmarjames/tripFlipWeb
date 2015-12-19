
/**************************
 Initialize the Angular App
 **************************/

var app = angular.module("app", [
    "ui.router", "ngAnimate", "ui.bootstrap", "flash", "angucomplete", "angular-loading-bar",
    "ngStorage", "satellizer",
    "general.service",
    "APIInterceptor",
    "dashboard.service",
    "AdminAppCtrl",
    "datepicker.controller",
    "timepicker.controller",
    "signUp.controller",
    "dashboard.controller",
    "LoginCtrl",
    "AcceptedCtrl",
    "RejectedCtrl"]).run(["$rootScope", "$state",
    function ($rootScope, $state) {

      $rootScope.$on('$stateChangeStart', function(event, toState) {
        var login = toState.data.requiresLogin && (JSON.parse(localStorage.getItem('user')) !== null);

        if(login) {
          $rootScope.authenticated = true;
          $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));
          if(toState.name === "login") {
            $state.go('admin.dashboard');
            event.preventDefault();
            return;
          }
        }

        if(!login) {
          $state.go('login');
          event.preventDefault();
          return;
        }
      });

      angular.element(document).ready(function(){
          setTimeout(function(){
              $('.page-loading-overlay').addClass("loaded");
              $('.load_circle_wrapper').addClass("loaded");
          },1000);
      });

    }])
    .constant('appConfig', {
      url : 'http://104.236.8.148'
    })
    .config(["appConfig", "$stateProvider", "$urlRouterProvider", "$authProvider", "$httpProvider", "$provide",
    function(appConfig, $stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide) {

      $httpProvider.interceptors.push('APIInterceptor');
      $authProvider.loginUrl  = appConfig.url + '/api/adminauth';
      $urlRouterProvider.otherwise("/admin/dashboard");

      $stateProvider
        .state('admin', {
          url: '/admin',
          templateUrl: 'templates/admin.html',
          data: {requiresLogin : true }
        })

        .state('admin.dashboard', {
          url: '/dashboard',
          templateUrl: 'templates/admin.dashboard.html',
          controller: 'dashbardCtrl',
          data: {requiresLogin : true }
        })

        .state('admin.rejects', {
          url: '/rejects',
          templateUrl: 'templates/admin.rejected.html',
          controller: 'RejectedCtrl as rejected',
          data: {requiresLogin : true }
        })

        .state('admin.accepts', {
          url: '/accepts',
          templateUrl: 'templates/admin.accepted.html',
          controller: 'AcceptedCtrl as accepted',
          data: {requiresLogin : true }
        })

        .state('admin.locationQueries', {
          url: '/locationqueries',
          templateUrl: 'templates/admin.locationqueries.html',
          controller: 'LocationQueriesCtrl as locationquery',
          data: {requireLogin : true }
        })

        .state('login', {
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl as login'
        })

        .state('logout', {
          url: '/login',
          templateUrl: 'templates/login.html'
        });
    }
]);
