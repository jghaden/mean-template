var app = angular.module('appRoutes', ['ngRoute'])
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
                controllerAs: 'register'
            })

            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })

            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html',
                authenticated: true
            })

            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html',
                authenticated: true
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
                controller: 'itemCtrl',
                controllerAs: 'item',
                authenticated: true
            })

            .when('/items/view', {
                templateUrl: 'app/views/pages/items/view.html',
                controller: 'itemCtrl',
                controllerAs: 'item'
            })

            .when('/manage', {
                templateUrl: 'app/views/pages/manage/manage.html',
                controller: 'manageCtrl',
                controllerAs: 'manage',
                authenticated: true,
                permission: ['admin', 'moderator']
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
            if(next.$$route.authenticated === true) {
                if(!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/');
                } else if (next.$$route.permission) {
                    User.getPermission()
                        .then(function(data) {
                            if(next.$$route.permission[0] !== data.data.permission) {
                                if(next.$$route.permission[1] !== data.data.permission) {
                                    event.preventDefault();
                                    $location.path('/');
                                }
                            }
                        });

                }
            } else if (next.$$route.authenticated === false) {
                if(Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/profile');
                }
            }
        }
    });
}]);