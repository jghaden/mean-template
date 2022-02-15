// Non API Angular routes accessed via the browser to deliver pages for the end user
var app = angular.module('mainRoutes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })

            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })

            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: false
            })

            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })

            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html',
                authenticated: true
            })

            .when('/profile/:username', {
                templateUrl: 'app/views/pages/users/profile.html',
                controller: 'profileCtrl',
                controllerAs: 'profile'
            })

            .when('/activate/:token', {
                templateUrl: 'app/views/pages/users/activation/activate.html',
                controller: 'emailCtrl',
                controllerAs: 'email',
                authenticated: false
            })

            .when('/resend', {
                templateUrl: 'app/views/pages/users/activation/resend.html',
                controller: 'resendCtrl',
                controllerAs: 'resend',
                authenticated: false
            })

            .when('/resetusername', {
                templateUrl: 'app/views/pages/users/reset/username.html',
                controller: 'usernameCtrl',
                controllerAs: 'username',
                authenticated: false
            })

            .when('/resetpassword', {
                templateUrl: 'app/views/pages/users/reset/password.html',
                controller: 'passwordCtrl',
                controllerAs: 'password',
                authenticated: false
            })

            .when('/reset/:token', {
                templateUrl: 'app/views/pages/users/reset/newpassword.html',
                controller: 'resetCtrl',
                controllerAs: 'reset',
                authenticated: false
            })

            .when('/items/create', {
                templateUrl: 'app/views/pages/items/create.html',
                controller: 'itemCreateCtrl',
                controllerAs: 'itemCreate',
                authenticated: true
            })

            .when('/items/edit/:part', {
                templateUrl: 'app/views/pages/items/edit.html',
                controller: 'itemEditCtrl',
                controllerAs: 'itemEdit',
                authenticated: true
            })

            .when('/items/view', {
                templateUrl: 'app/views/pages/items/list.html',
                controller: 'itemListCtrl',
                controllerAs: 'itemList'
            })

            .when('/items/view/:part', {
                templateUrl: 'app/views/pages/items/view.html',
                controller: 'itemViewCtrl',
                controllerAs: 'itemView'
            })

            .otherwise({ redirectTo: '/'});

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
    });

app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if(next.$$route !== undefined) {
            // Checks if current page requires authentication
            if(next.$$route.authenticated === true) {
                // Redirects end user to login page
                if(!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/login');
                }
            } else if(next.$$route.authenticated === false) {
                if(Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/');
                }
            }
        }
    });
}]);