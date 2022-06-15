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

            .when('/forgot/username', {
                templateUrl: 'app/views/pages/users/reset/username.html',
                controller: 'usernameCtrl',
                controllerAs: 'username',
                authenticated: false
            })

            .when('/forgot/password', {
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
                templateUrl: 'app/views/pages/items/list.html',
                controller: 'itemListCtrl',
                controllerAs: 'itemList'
            })

            .when('/items/view/:part', {
                templateUrl: 'app/views/pages/items/view.html',
                controller: 'itemViewCtrl',
                controllerAs: 'itemView'
            })

            .when('/manage/users', {
                templateUrl: 'app/views/pages/manage/users/manage.html',
                controller: 'manageCtrl',
                controllerAs: 'manage',
                authenticated: true,
                permission: ['admin', 'moderator']
            })

            .when('/manage/users/edit/:id', {
                templateUrl: 'app/views/pages/manage/users/edit.html',
                controller: 'editCtrl',
                controllerAs: 'edit',
                authenticated: true,
                permission: ['admin', 'moderator']
            })

            .when('/projects', {
                templateUrl: 'app/views/pages/users/projects/dashboard.html',
                controller: 'projDashboardCtrl',
                controllerAs: 'projDashboard',
                authenticated: true
            })

            .when('/project/:id', {
                templateUrl: 'app/views/pages/users/projects/view.html',
                controller: 'projViewCtrl',
                controllerAs: 'projView',
                authenticated: true
            })

            .when('/share/project/:id/:key', {
                templateUrl: 'app/views/pages/users/projects/view.html',
                controller: 'projViewCtrl',
                controllerAs: 'projView',
                authenticated: true
            })

            .otherwise({ 
                redirectTo: '/'
            });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
    });

app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if(next.$$route !== undefined) {
            // Checks if the end user is logged in
            if(next.$$route.authenticated === true) {
                // Redirects end user to login page anytime they load a page requiring user authentication
                if(!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/login');
                } else if (next.$$route.permission) {
                    
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