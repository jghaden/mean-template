// Non API Angular routes accessed via the browser to deliver pages for the end user
var app = angular.module('mainRoutes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
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
                controller: 'itemCtrl',
                controllerAs: 'item',
                authenticated: true
            })

            .when('/items/view/list', {
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

            .otherwise({ redirectTo: '/'});

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
                    // Checks permission of the logged in user from the database before allowing access to admin/moderator content
                    User.getPermission()
                        .then(function(data) {
                            // Redirects user to the main page if the permissions for the disered page are not met
                            if(next.$$route.permission[0] !== data.data.permission) {
                                if(next.$$route.permission[1] !== data.data.permission) {
                                    event.preventDefault();
                                    $location.path('/');
                                }
                            }
                        });
                }
            } 
        }
    });
}]);