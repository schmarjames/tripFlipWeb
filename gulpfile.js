var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {

    mix.copy('resources/vendor/jquery/dist/jquery.min.js', 'public/js/jquery.min.js');
    mix.copy('resources/vendor/bootstrap/dist/fonts/*.*', 'public/fonts/');
    mix.copy('resources/vendor/weather-icons/fonts/*.*', 'public/fonts/');
    mix.copy('resources/vendor/font-awesome/fonts/*.*', 'public/fonts/');
    mix.copy('resources/vendor/marketing-styles.css', 'public/css/marketing-styles.css');

    mix.styles([
        'fontawesome/css/font-awesome.min.css',
        'weather-icons/css/weather-icons.min.css',
        'bootstrap/dist/css/bootstrap.min.css',
        'bootstrap/dist/css/bootstrap-theme.min.css',
        'angucomplete/angucomplete.css',
        'angular-loading-bar/src/loading-bar.css',
        'main.css'
    ], 'public/css/main.css', 'resources/vendor/');

    mix.scripts([
      'bootstrap/dist/js/bootstrap.min.js',
                    'gmap.js',
                    'slimScroll/jquery.slimscroll.min.js',
                    'angular/angular.min.js',
                    'angular-animate/angular-animate.min.js',
                    'angular-loading-bar/src/loading-bar.js',
                    'angular-route/angular-route.min.js',
                    'angular-ui-router/release/angular-ui-router.js',
                    'angular-sanitize/angular-sanitize.min.js',
                    'underscore/underscore-min.js',
                    'raphael/raphael-min.js',
                    'morrisjs/morris.min.js',
                    'flot/jquery.flot.js',
                    'flot/jquery.flot.canvas.js',
                    'flot/jquery.flot.categories.js',
                    'flot/jquery.flot.crosshair.js',
                    'flot/jquery.flot.image.js',
                    'flot/jquery.flot.navigate.js',
                    'flot/jquery.flot.time.js',
                    'flot/jquery.flot.pie.js',
                    'flot/jquery.flot.resize.js',
                    'flot/jquery.flot.selection.js',
                    'flot/jquery.flot.stack.js',
                    'chartjs/Chart.min.js',
                    'checklist-model/checklist-model.js',
                    'jquery.sparkline.build/dist/jquery.sparkline.min.js',
                    'easypie/dist/angular.easypiechart.min.js',
                    'angular-wizard/dist/angular-wizard.js',
                    'rangy/rangy-core.min.js',
                    'rangy/rangy-selectionsaverestore.min.js',
                    'textAngular/dist/textAngular.min.js',
                    'angular-ui-tree/dist/angular-ui-tree.js',
                    'jqvmap/dist/jquery.vmap.min.js',
                    'angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'ngstorage/ngStorage.min.js',
                    'satellizer/satellizer.min.js',
                    'angular-flash-alert/dist/angular-flash.min.js',
                    'angucomplete/angucomplete.js',
                    'other_charts.js',
                    'extras.js'
    ], 'public/js/vendor.js', 'resources/vendor/');

    mix.scripts([
      'app.js',
      'APIInteceptor.js',
      'dashboardService.js',
      'directives.js',
      'generalService.js',
      'services.js',
      'userService.js',
      'controller/*.js',
    ], 'public/js/app.js');

});
