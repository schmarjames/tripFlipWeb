
/**************************
 Initialize the Angular App
 **************************/

var app = angular.module("app", [
    "ui.router", "ngAnimate", "ui.bootstrap", "flash", "angucomplete",
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
          url: '/',
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl as login'
        })

        .state('logout', {
          url: '/',
          templateUrl: 'templates/login.html'
        });
    }
]);

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

(function() {

  angular.module('dashboard.service', []).factory('dashboard', ['$http', '$q', '$timeout', dashboard]);

    function dashboard($http, $q, $timeout) {
      //var url; dashboard service url
      var factory = {
            getMusicData : getMusicData,
            getEventHistoryData : getEventHistoryData,
            getHighestTipsData : getHighestTipsData
          },
          songs = [
            { name: "Money", artist: "Michael Jackson", request_amount: 4 },
            { name: "What They Say", artist: "Maya Jane Cole", request_amount: 12 },
            { name: "Look Around You", artist: "Chopsticks", request_amount: 8 }
          ],
          event_data = [],
          guest_data = {};

      return factory;

      function getMusicData() {
        // queue music data
        var deferred = $q.defer();

        $timeout(function() {
          deferred.resolve(songs);
        }, 500);

        return deferred.promise;
      }

      function getEventHistoryData() {}

      function getHighestTipsData() {}
    }

})();



/*
 Charting directives
 Provides custom directives for charting elements
 */

angular.module("app.chart.directives", []).directive("gaugeChart", [
        function() {
            return {
                scope: {
                    gaugeData: "=",
                    gaugeOptions: "="
                },
                link: function(scope, ele) {
                    var data, gauge, options;

                    data = scope.gaugeData;
                        options = scope.gaugeOptions;

                        gauge = new Gauge(ele[0]).setOptions(options);
                        gauge.maxValue = data.maxValue;
                        gauge.animationSpeed = data.animationSpeed;
                        gauge.set(data.val);
                }
            };
        }
    ]).directive('chart', function () {
        var baseWidth = 600;
        var baseHeight = 400;

        return {
            restrict: 'E',
            template: '<canvas></canvas>',
            scope: {
                chartObject: "=value",
                data: "="
            },
            link: function (scope, element, attrs) {
                var canvas  = element.find('canvas')[0],
                    context = canvas.getContext('2d'),
                    chart;

                var options = {
                    type:   attrs.type   || "Line",
                    width:  attrs.width  || baseWidth,
                    height: attrs.height || baseHeight
                };
                canvas.width = options.width;
                canvas.height = options.height;
                chart = new Chart(context);

                var chartType = attrs.type;

                chart[chartType](scope.data, options);

                //Update when charts data changes
                scope.$watch(function() { return scope.chartObject; }, function(value) {
                    if(!value) return;
                    var chartType = options.type;
                    chart[chartType](scope.chartObject.data, scope.chartObject.options);
                });
            }
        };
    }).directive("flotChart", [
        function() {
            return {
                restrict: "A",
                scope: {
                    data: "=",
                    options: "="
                },
                link: function(scope, ele) {
                    var data, options, plot;


                    // hard-code color indices to prevent them from shifting as
                    // countries are turned on/off

                    var datasets;

                    datasets = scope.data;

                    var i = 0;
                    $.each(datasets, function(key, val) {
                        val.color = i;
                        ++i;
                    });

                    // insert checkboxes

                    if($(ele[0]).parent().find(".choices").length > 0){

                        // insert checkboxes
                        var choiceContainer = $(ele[0]).parent().find(".choices");

                        choiceContainer.html("");

                        $.each(datasets, function(key, val) {

                            choiceContainer.append("<br/><div class='choice-item'><label for='id" + key + "' class='ui-checkbox'>" +
                            "<input name='" + key +
                            "' type='checkbox' id='id" + key + "' checked='checked' value='option1'>" +
                            "<span>" + val.label + "</span>" +
                            "</label></div>");

                        });

                        var plotAccordingToChoices = function() {

                            var data_to_push = [];

                            choiceContainer.find("input:checked").each(function () {
                                var key = $(this).attr("name");
                                if (key && datasets[key]) {
                                    data_to_push.push(datasets[key]);
                                }
                            });

                            if (data_to_push.length > 0) {
                                $.plot(ele[0], data_to_push, scope.options);
                            }
                        };

                        choiceContainer.find("input").click(plotAccordingToChoices);

                    }



                    //plotAccordingToChoices();

                    return data = scope.data, options = scope.options, plot = $.plot(ele[0], data, options);
                }
            };
        }
    ]).directive("flotChartRealtime", [
        function() {
            return {
                restrict: "A",
                link: function(scope, ele) {
                    var data, getRandomData, plot, totalPoints, update, updateInterval;
                    return data = [], totalPoints = 300, getRandomData = function() {
                        var i, prev, res, y;
                        for (data.length > 0 && (data = data.slice(1)); data.length < totalPoints;){
                            if(data.length > 0){
                                prev = data[data.length - 1];
                            }
                            else{
                                prev = 50;
                            }
                            y = prev + 10 * Math.random() - 5;
                            if(0 > y){
                                y = 0;
                            }else{
                                if(y > 100){
                                    y = 100;
                                }
                            }
                            data.push(y);
                        }
                        for (res = [], i = 0; i < data.length;){
                            res.push([i, data[i]]);
                            ++i;
                        }
                        return res;
                    }, update = function() {
                        plot.setData([getRandomData()]);
                        plot.draw();
                        setTimeout(update, updateInterval);
                    }, data = [], totalPoints = 300, updateInterval = 200, plot = $.plot(ele[0], [getRandomData()], {
                        series: {
                            lines: {
                                show: !0,
                                fill: !0
                            },
                            shadowSize: 0
                        },
                        yaxis: {
                            min: 0,
                            max: 100,
                            show: !0,
                            color:"#f5f5f5"
                        },
                        xaxis: {
                            show: !0,
                            color:"#f5f5f5"
                        },
                        grid: {
                            hoverable: !0,
                            borderWidth: 1,
                            borderColor: "#fff"
                        },
                        colors: ["#383d43"]
                    }), update();
                }
            };
        }
    ]).directive("sparkline", [
        function() {
            return {
                scope: {
                    sparkData: "=",
                    sparkOptions: "="
                },
                link: function(scope, ele) {
                    var data, options, sparkResize, sparklineDraw;

                    data = scope.sparkData;
                        options = scope.sparkOptions;
                        sparkResize = void 0;
                        sparklineDraw = function() {

                            ele.sparkline(data, options);

                        };
                    $(window).resize(function() {
                        return clearTimeout(sparkResize), sparkResize = setTimeout(sparklineDraw, 200);
                    });
                    sparklineDraw();
                }
            };
        }
    ]).directive("morrisChart", [
        function() {
            return {
                scope: {
                    data: "="
                },
                link: function(scope, ele, attrs) {
                    var colors, data, func, options,chart;
                    switch (data = scope.data, attrs.type) {
                        case "line":
                            return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                                element: ele[0],
                                data: data,
                                xkey: attrs.xkey,
                                ykeys: JSON.parse(attrs.ykeys),
                                labels: JSON.parse(attrs.labels),
                                lineWidth: attrs.lineWidth || 2,
                                lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"]
                            },chart = new Morris.Line(options),$(window).resize(function(){
                                chart.redraw();
                            });
                        case "area":
                            return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                                element: ele[0],
                                data: data,
                                xkey: attrs.xkey,
                                ykeys: JSON.parse(attrs.ykeys),
                                labels: JSON.parse(attrs.labels),
                                lineWidth: attrs.lineWidth || 2,
                                lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                                behaveLikeLine: attrs.behaveLikeLine || !1,
                                fillOpacity: attrs.fillOpacity || "auto",
                                pointSize: attrs.pointSize || 4
                            }, chart = new Morris.Area(options),$(window).resize(function(){
                                chart.redraw();
                            });
                        case "bar":
                            return colors = void 0 === attrs.barColors || "" === attrs.barColors ? null : JSON.parse(attrs.barColors), options = {
                                element: ele[0],
                                data: data,
                                xkey: attrs.xkey,
                                ykeys: JSON.parse(attrs.ykeys),
                                labels: JSON.parse(attrs.labels),
                                barColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                                stacked: attrs.stacked || null
                            }, chart = new Morris.Bar(options),$(window).resize(function(){
                                //chart.redraw();
                            });
                        case "donut":
                            /*jslint evil: true */
                            return colors = void 0 === attrs.colors || "" === attrs.colors ? null : JSON.parse(attrs.colors), options = {
                                element: ele[0],
                                data: data,
                                colors: colors || ["#0B62A4", "#3980B5", "#679DC6", "#95BBD7", "#B0CCE1", "#095791", "#095085", "#083E67", "#052C48", "#042135"]
                            }, attrs.formatter && (func = new Function("y", "data", attrs.formatter), options.formatter = func), chart = new Morris.Donut(options),$(window).resize(function(){
                                chart.redraw();
                            });
                    }
                }
            };
        }
    ]);


/*
 App custom Directives
 Custom directives for the app like custom background, minNavigation etc
 */

angular.module("app.directives", []).directive("imgHolder", [
        function() {
            return {
                link: function(scope, ele) {
                    return Holder.run({
                        images: ele[0]
                    });
                }
            };
        }
    ]).directive("customBackground", function() {
        return {
            controller: ["$scope", "$element", "$location",
                function($scope, $element, $location) {
                    var addBg, path;
                    return path = function() {
                        return $location.path();
                    }, addBg = function(path) {
                        switch ($element.removeClass("body-home body-special body-tasks body-lock"), path) {
                            case "/":
                                return $element.addClass("body-home");
                            case "/404":
                            case "/pages/500":
                            case "/pages/signin":
                            case "/pages/signup":
                            case "/pages/forgot":
                                return $element.addClass("body-special");
                            case "/pages/lock-screen":
                                return $element.addClass("body-special body-lock");
                            case "/tasks":
                                return $element.addClass("body-tasks");
                        }
                    }, addBg($location.path()), $scope.$watch(path, function(newVal, oldVal) {
                        return newVal !== oldVal ? addBg($location.path()) : void 0;
                    });
                }
            ]
        };
    }).directive("uiColorSwitch", [
        function() {
            return {
                restrict: "A",
                link: function(scope, ele) {
                    return ele.find(".color-option").on("click", function(event) {
                        var $this, hrefUrl, style;
                        if ($this = $(this), hrefUrl = void 0, style = $this.data("style"), "loulou" === style){
                            hrefUrl = "styles/main.css";
                            $('link[href^="styles/main"]').attr("href", hrefUrl);
                        }
                        else {
                            if (!style) return !1;
                            style = "-" + style;
                            hrefUrl = "styles/main" + style + ".css";
                            $('link[href^="styles/main"]').attr("href", hrefUrl);
                        }
                        return event.preventDefault();
                    });
                }
            };
        }
    ]).directive("toggleMinNav", ["$rootScope",
        function($rootScope) {
            return {
                link: function(scope, ele) {
                    var $content, $nav, $window, Timer, app, updateClass;

                    return app = $("#app"), $window = $(window), $nav = $("#nav-container"), $content = $("#content"), ele.on("click", function(e) {

                        if(app.hasClass("nav-min")){
                            app.removeClass("nav-min");
                        }
                        else{
                            app.addClass("nav-min");
                            $rootScope.$broadcast("minNav:enabled");
                            e.preventDefault();
                        }

                    }), Timer = void 0, updateClass = function() {
                        var width;
                        return width = $window.width(), 980 > width ? app.addClass("nav-min") : void 0;
                    },initResize = function() {
                        var width;
                        return width = $window.width(), 980 > width ? app.addClass("nav-min") : app.removeClass("nav-min");
                    }, $window.resize(function() {
                        var t;
                        return clearTimeout(t), t = setTimeout(updateClass, 300);
                    }),initResize();

                }
            };
        }
    ]).directive("collapseNav", [
        function() {
            return {
                link: function(scope, ele) {
                    var $a, $aRest, $lists, $listsRest, app;
                    return $lists = ele.find("ul").parent("li"),
                        $lists.append('<i class="fa fa-arrow-circle-o-right icon-has-ul"></i>'),
                        $a = $lists.children("a"),
                        $listsRest = ele.children("li").not($lists),
                        $aRest = $listsRest.children("a"),
                        app = $("#app"),
                        $a.on("click", function(event) {
                            var $parent, $this;
                            return app.hasClass("nav-min") ? !1 : ($this = $(this),
                                $parent = $this.parent("li"),
                                $lists.not($parent).removeClass("open").find("ul").slideUp(),
                                $parent.toggleClass("open").find("ul").stop().slideToggle(), event.preventDefault());
                        }), $aRest.on("click", function() {
                        return $lists.removeClass("open").find("ul").slideUp();
                    }), scope.$on("minNav:enabled", function() {
                        return $lists.removeClass("open").find("ul").slideUp();
                    });
                }
            };
        }
    ]).directive("highlightActive", [
        function() {
            return {
                controller: ["$scope", "$element", "$attrs", "$location",
                    function($scope, $element, $attrs, $location) {
                        var highlightActive, links, path;
                        return links = $element.find("a"), path = function() {
                            return $location.path();
                        }, highlightActive = function(links, path) {
                            return path = "#" + path, angular.forEach(links, function(link) {
                                var $li, $link, href;
                                return $link = angular.element(link), $li = $link.parent("li"), href = $link.attr("href"), $li.hasClass("active") && $li.removeClass("active"), 0 === path.indexOf(href) ? $li.addClass("active") : void 0;
                            });
                        }, highlightActive(links, $location.path()), $scope.$watch(path, function(newVal, oldVal) {
                            return newVal !== oldVal ? highlightActive(links, $location.path()) : void 0;
                        });
                    }
                ]
            };
        }
    ]).directive("toggleOffCanvas", [
        function() {
            return {
                link: function(scope, ele) {
                    return ele.on("click", function() {
                        return $("#app").toggleClass("on-canvas").toggleClass("nav-min");
                    });
                }
            };
        }
    ]).directive("slimScroll", [
        function() {
            return {
                link: function(scope, ele, attrs) {
                    return ele.slimScroll({
                        height: attrs.scrollHeight || "100%"
                    });
                }
            };
        }
    ]).directive("goBack", [
        function() {
            return {
                restrict: "A",
                controller: ["$scope", "$element", "$window",
                    function($scope, $element, $window) {
                        return $element.on("click", function() {
                            return $window.history.back();
                        });
                    }
                ]
            };
        }
    ]);



/*
 App Form Ui Directives
 Custom directives for Form Ui elements
 */

angular.module("app.ui.form.directives", []).directive("uiRangeSlider", [
        function() {
            return {
                restrict: "A",
                link: function(scope, ele) {
                    return ele.slider();
                }
            };
        }
    ]).directive("uiFileUpload", [
        function() {
            return {
                restrict: "A",
                link: function(scope, ele) {
                    return ele.bootstrapFileInput();
                }
            };
        }
    ]).directive("uiSpinner", [
        function() {
            return {
                restrict: "A",
                compile: function(ele) {
                    return ele.addClass("ui-spinner"), {
                        post: function() {
                            return ele.spinner();
                        }
                    };
                }
            };
        }
    ]).directive("uiWizardForm", [
        function() {
            return {
                link: function(scope, ele) {
                    return ele.steps();
                }
            };
        }
    ]);


(function() {

  angular.module('general.service', []).factory('general', ['appConfig', '$http', '$q', '$timeout', general]);

  function general(appConfig, $http, $q, $timeout) {
    var factory = {
          getAcceptedPhotos : getAcceptedPhotos,
          getApprovedPhotos : getApprovedPhotos,
          getRejectedPhotos : getRejectedPhotos,
          approvePhoto      : approvePhoto,
          rejectPhoto       : rejectPhoto,
          acceptPhoto       : acceptPhoto,
          removePhoto       : removePhoto,
          setPhotoToApprovalStatus : setPhotoToApprovalStatus,
          getLocations : getLocations
        };

    return factory;

    function getAcceptedPhotos(lastId, locations) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/photos/100/"+lastId+"/"+JSON.stringify(locations);
      $http({
        method: 'POST',
        url: url
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function getApprovedPhotos(lastId, locations) {
      console.log(JSON.stringify(locations));
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/approvedphotos/100/"+lastId+"/"+JSON.stringify(locations);
      $http({
        method: 'POST',
        url: url
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function getRejectedPhotos(lastId) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/rejects/photos/100/"+lastId;
      $http({
        method: 'POST',
        url: url
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function approvePhoto(id) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/store/"+id;
      $http({
        method: 'POST',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function rejectPhoto(id) {
      console.log(id);
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/transfer/"+id;
      $http({
        method: 'POST',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function acceptPhoto(id) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/rejects/transfer/"+id;
      $http({
        method: 'POST',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function removePhoto(id) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/rejects/"+id;
      $http({
        method: 'DELETE',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function setPhotoToApprovalStatus(table, id) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/"+table+"/approve/"+id;

      $http({
        method: 'POST',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function getLocations() {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/locations";

      $http({
        method: 'GET',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }
  }
})();


/**************************
 App ui Services

 loggit - Creates a logit type message for all logging

 **************************/
(function() {

  angular.module("app.ui.services", []).factory("loggit", loggit);

      function loggit() {
          var logIt;
          return toastr.options = {
              closeButton: !0,
              positionClass: "toast-top-right",
              timeOut: "3000"
          }, logIt = function(message, type) {
              return toastr[type](message);
          }, {
              log: function(message) {
                  logIt(message, "info");
              },
              logWarning: function(message) {
                  logIt(message, "warning");
              },
              logSuccess: function(message) {
                  logIt(message, "success");
              },
              logError: function(message) {
                  logIt(message, "error");
              }
          };
      }

})();

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

(function() {

  angular.module('AcceptedCtrl', []).controller('AcceptedCtrl', ['$rootScope', '$scope', '$filter', '$location', '$state', '$modal', 'general', 'Flash', AcceptedCtrl]);

  function AcceptedCtrl($rootScope, $scope, $filter, $location, $state, $modal, general, Flash) {
    var init;
    var vm = this;

    vm.filteredAccepts = [];
    vm.searchKeywords = "";
    vm.row = "";
    vm.numPerPageOpt = [3, 5, 10, 20, 100];
    vm.numPerPage = vm.numPerPageOpt[2];
    vm.currentPage = 1;
    vm.currentPageAccepts = [];
    vm.newShow = {};
    vm.next = false;
    vm.accepts = "";
    vm.lastPhotoId = null;
    vm.pageTotal = 0;

    vm.locations = null;
    vm.filters = {
      approved : false,
      location : {
        country : "",
        stateRegion : "",
        city : ""
      }
    };

    vm.select = function(page) {
        var end, start;

        if (page > (vm.pageTotal-5)) {
          if (vm.filters.approved) {
            general.getApprovedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
          } else {
            general.getAcceptedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
          }
        }
        return start = (page - 1) * vm.numPerPage, end = start + vm.numPerPage, vm.currentPageAccepts = vm.filteredAccepts.slice(start, end);
    };

    vm.search = function() {
        return vm.filteredAccepts = $filter("filter")(vm.accepts, vm.searchKeywords), vm.onFilterChange();
    };

    vm.onFilterChange = function() {
        return vm.select(vm.currentPage), vm.currentPage = vm.currentPage, vm.row = "";
    };

    vm.onNumPerPageChange = function() {
        return vm.select(1), vm.currentPage = 1;
    };

    vm.onOrderChange = function() {
        return vm.select(1), vm.currentPage = 1;
    };

    vm.order = function(rowName) {
        return vm.row !== rowName ? (vm.row = rowName, vm.filteredAccepts = $filter("orderBy")(vm.acceptss, rowName), vm.onOrderChange()) : void 0;
    };

    vm.approvePhoto = function(id, idx) {
      if ($rootScope.currentUser.permission_type === 1) {
          general.approvePhoto(id).then(function(data) {
            console.log(data);
            var message = data;
            Flash.create('success', message);
            // remove this photo from the vm.accepted array
            delete vm.accepts[idx];
            currentPage = vm.currentPage;

            //reset table
            vm.search();
            vm.currentPage = currentPage;
          });
      }

      else if ($rootScope.currentUser.permission_type === 2) {
          general.setPhotoToApprovalStatus("accepts", id).then(function(data) {
            console.log(data);
            var message = data;
            Flash.create('success', message);
            // remove this photo from the vm.accepted array
            delete vm.accepts[idx];
            currentPage = vm.currentPage;

            //reset table
            vm.search();
            vm.currentPage = currentPage;
          });
      }
    };

    vm.filterTable = function(data) {
      console.log(data);
      var approved = Boolean(data.approved),
          location = (data.selectedLocation !== null) ? data.selectedLocation.originalObject : null;

      if (approved !== vm.filters.approved || location !== null) {
          vm.filters.approved = approved;
          vm.filters.location.country = location.country || "";
          vm.filters.location.stateRegion = location.stateRegion || "";
          vm.filters.location.city = location.city || "";
          vm.lastPhotoId = null;
          vm.accepts = [];
          
          if (approved) {
            // query approved photos
            general.getApprovedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
          } else {
            // query all photos
            general.getAcceptedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
          }
      }
    };

    vm.rejectPhoto = function(id, idx) {
      if ($rootScope.currentUser.permission_type === 1) {
        general.rejectPhoto(id).then(function(data) {
          console.log(data);
          var message = data;
          Flash.create('success', message);
          // remove this photo from the vm.accepted array
          delete vm.accepts[idx];
          currentPage = vm.currentPage;

          //reset table
          vm.search();
          vm.currentPage = currentPage;
        });
      }
    };

    vm.processPhotoData = function(data) {
      var photo_url = "";
      for (var i=0; i<data.length; i++) {
        data[i].photo_data = JSON.parse(data[i].photo_data);
        photo_url = "https://farm" + data[i].photo_data.farm + ".staticflickr.com/" + data[i].photo_data.server + "/" + data[i].photo_data.id + "_" + data[i].photo_data.secret + ".jpg";
        console.log(data);
        data[i].approved = (data[i].approved !== null) ? Boolean(data[i].approved) : false;
        data[i].photo_data = photo_url;
        data[i].index = i;

        if (i === (data.length-1)) {
          vm.lastPhotoId = data[i].id;
        }
        console.log(photo_url);
      }

      if (vm.accepts.length === 0) {
          vm.accepts = data;
      } else {
          vm.accepts = vm.accepts.concat(data);
      }
      vm.pageTotal = vm.accepts.length / vm.numPerPage;
      vm.search();
    };

    general.getAcceptedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
    general.getLocations().then(function(data) {
      console.log(data);
      vm.locations = data.locations;
    });

    (init = function() {
        console.log("INIT");
        return vm.search(), vm.select(vm.currentPage);
    });
  }
})();

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

(function() {

  angular.module('RejectedCtrl', []).controller('RejectedCtrl', ['$rootScope', '$scope', '$filter', '$location', '$state', '$modal', 'general', 'Flash', RejectedCtrl]);

  function RejectedCtrl($rootScope, $scope, $filter, $location, $state, $modal, general, Flash) {
    var init;
    var vm = this;

    vm.filteredRejects = [];
    vm.searchKeywords = "";
    vm.row = "";
    vm.numPerPageOpt = [3, 5, 10, 20, 100];
    vm.numPerPage = vm.numPerPageOpt[2];
    vm.currentPage = 1;
    vm.currentPageRejects = [];
    vm.newShow = {};
    vm.next = false;
    vm.rejects = [];
    vm.lastPhotoId = null;
    vm.pageTotal = 0;

    vm.select = function(page) {
        var end, start;

        if (page > (vm.pageTotal-5)) {
            general.getRejectedPhotos(vm.lastPhotoId).then(vm.processPhotoData);
        }
        return start = (page - 1) * vm.numPerPage, end = start + vm.numPerPage, vm.currentPageRejects = vm.filteredRejects.slice(start, end);
    };

    vm.search = function() {
        return vm.filteredRejects = $filter("filter")(vm.rejects, vm.searchKeywords), vm.onFilterChange();
    };

    vm.onFilterChange = function() {
        return vm.select(vm.currentPage), vm.currentPage = vm.currentPage, vm.row = "";
    };

    vm.onNumPerPageChange = function() {
        return vm.select(1), vm.currentPage = 1;
    };

    vm.onOrderChange = function() {
        return vm.select(1), vm.currentPage = 1;
    };

    vm.order = function(rowName) {
        return vm.row !== rowName ? (vm.row = rowName, vm.filteredRejects = $filter("orderBy")(vm.rejectss, rowName), vm.onOrderChange()) : void 0;
    };

    vm.acceptPhoto = function(id, idx) {
      if ($rootScope.currentUser.permission_type === 1) {
        general.acceptPhoto(id).then(function(data) {
          console.log(data);
          var message = data;
          Flash.create('success', message);
          // remove this photo from the vm.rejects array
          delete vm.rejects[idx];
          currentPage = vm.currentPage;

          //reset table
          vm.search();
          vm.currentPage = currentPage;
        });
      }

      else if ($rootScope.currentUser.permission_type === 2) {
        general.setPhotoToApprovalStatus("rejects", id).then(function(data) {
          console.log(data);
          var message = data;
          Flash.create('success', message);
          // remove this photo from the vm.accepted array
          delete vm.accepts[idx];
          currentPage = vm.currentPage;

          //reset table
          vm.search();
          vm.currentPage = currentPage;
        });
      }

    };

    vm.removePhoto = function(id, idx) {
      if ($rootScope.currentUser.permission_type === 1) {
          general.removePhoto(id).then(function(data) {
            console.log(data);
            var message = data;
            Flash.create('success', message);
            // remove this photo from the vm.rejects array
            delete vm.rejects[idx];
            currentPage = vm.currentPage;

            //reset table
            vm.currentPage = currentPage;
            vm.search();
          });
      }
    };

    vm.processPhotoData = function(data) {
      var photo_url = "";
      for (var i=0; i<=data.length; i++) {
        if (data[i] !== undefined) {
          data[i].photo_data = JSON.parse(data[i].photo_data);
          photo_url = "https://farm" + data[i].photo_data.farm + ".staticflickr.com/" + data[i].photo_data.server + "/" + data[i].photo_data.id + "_" + data[i].photo_data.secret + ".jpg";

          data[i].approved = (data[i].approved !== null) ? Boolean(data[i].approved) : false;
          data[i].photo_data = photo_url;
          data[i].index = i;

          if (i === (data.length-1)) {
            vm.lastPhotoId = data[i].id;
          }
          console.log(photo_url);
        }
      }

      if (vm.rejects.length === 0) {
          vm.rejects = data;
      } else {
          vm.rejects = vm.rejects.concat(data);
      }
      vm.pageTotal = vm.rejects.length / vm.numPerPage;
      vm.search();
    };

    general.getRejectedPhotos(vm.lastPhotoId).then(vm.processPhotoData);

    (init = function() {
        console.log("INIT");
        return vm.search(), vm.select(vm.currentPage);
    });
  }
})();

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

//# sourceMappingURL=app.js.map
