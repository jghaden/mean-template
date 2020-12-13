angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function(Auth, $rootScope, $timeout, $location, User) {
        var app = this;

        app.loaded = false;
        app.authorized = false;

        $rootScope.$on('$routeChangeStart', function() {
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser()
                    .then(function(data) {
                        app.username = data.data.username;
                        app.email = data.data.email;
                    });
            } else {
                app.isLoggedIn = false;
                app.username = '';
                app.email = '';
            }

            app.loaded = true;
        });

        app.doLogin = function(loginData) {
            app.loading = true;
            app.errorMsg = false;
            app.expired = false;
            app.disabled = true;
            app.resend = false;

            Auth.login(app.loginData)
                .then(function(data) {
                    app.loading = false;

                    if(data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function(){
                            $location.path('/about');
                            app.loginData = '';
                            app.successMsg = false;
                        }, 1000);
                    } else {
                        app.errorMsg = data.data.message;
                        
                        if(data.data.expired) {
                            app.expired = true;
                        } else {
                            app.expired = false;
                            app.disabled = false;
                        }
                    }
                });
            }

        app.logout = function() {
            Auth.logout();
            app.disabled = false;

            $location.path('/logout');
            $timeout(function() {
                $location.path('/login');
                location.reload();
            }, 50);
        }

        app.resendLink = function(username) {
            User.resendLink(app.loginData)
                .then(function(data) {
                    if(data.data.success) {
                        app.loading = false;
                        app.errorMsg = false;
                        app.successMsg = data.data.message;
                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }
                });
        }
    });

        