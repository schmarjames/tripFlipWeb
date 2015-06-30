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
    mix.copy('resources/vendor/bootstrap/fonts/', 'public/fonts');
    mix.less('app.less', 'resources/assets/build/app.css');
    mix.styles([
        'resources/vendor/bootstrap/dist/css/bootstrap.min.css',
        'resources/vendor/bootstrap/dist/css/bootstrap-theme.min.css',
        'resources/vendor/angular-bootstrap/ui-bootstrap-csp.css',
        'assets/build/app.css'
    ], 'public/css/app.css', 'resources/');
    mix.copy(
            'resources/vendor/bootstrap/dist/css/bootstrap.css.map',
            'public/css/bootstrap.css.map'
        );
    mix.copy(
            'resources/vendor/bootstrap/dist/css/bootstrap-theme.css.map',
            'public/css/bootstrap-theme.css.map'
        );
    mix.scripts([
      'resources/vendor/angular/angular.js',
      'resources/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'resources/vendor/angular-bootstrap/ui-bootstrap.min.js',
      'resources/vendor/angular-ui-router/release/angular-ui-router.min.js',
      'resources/vendor/ngstorage/ngStorage.min.js'
      ], 'public/js/vendor.js', 'resources/');
    mix.scripts([
        'resources/assets/js/*.js',
    ], 'public/js/site.js', 'resources/');
});
