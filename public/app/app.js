// Load controllers and services into Angular
angular.module('userApp', 
    [
        'mainRoutes',
        'userControllers',
        'userServices',
        'mainController',
        'authServices',
        'emailController',
        'itemServices',
        'itemController'
    ])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    });