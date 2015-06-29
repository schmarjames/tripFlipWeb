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
    mix.copy('vendor/bower_components/bootstrap/fonts/', 'public/fonts');
    mix.less('app.less', 'resources/assets/build/app.css');
    mix.styles([
        'resources/assets/css/vendor/bootstrap.min.css',
        'resources/assets/css/vendor/bootstrap-theme.min.css',
        'assets/build/app.css'
    ], 'public/css/app.css', 'resources/');
    mix.copy(
            'vendor/bower_components/bootstrap/dist/css/bootstrap.css.map',
            'public/css/bootstrap.css.map'
        );
    mix.copy(
            'vendor/bower_components/bootstrap/dist/css/bootstrap-theme.css.map',
            'public/css/bootstrap-theme.css.map'
        );
    mix.scripts([
        'resources/assets/js/vendor/angular.js',
    ], 'public/js/site.js', 'resources/');

});
