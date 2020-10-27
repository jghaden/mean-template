angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController', 'manageController', 'itemServices', 'itemController'])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    });