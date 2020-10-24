angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function(Auth, $rootScope, $timeout, $location) {
        var app = this;

        app.loaded = false;

        $rootScope.$on('$routeChangeStart', function() {
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser()
                    .then(function(data) {
                        app.username = data.data.username;
                        app.email = data.data.email;

                        Auth.getProfile(app.username)
                            .then(function(data) {
                                if(data.data.success) {
                                    app.name = data.data.user.name;
                                    app.profession = data.data.user.profession;
                                    app.location = data.data.user.location;
                                    app.website = data.data.user.website;
                                    app.github = data.data.user.github;
                                    app.linkedin = data.data.user.linkedin;

                                    var date = new Date(data.data.user.created);
                                    app.created = date.toUTCString();
                                }
                            });
                    });
            } else {
                app.isLoggedIn = false;
                app.username = '';
                app.email = '';
            }

            app.loaded = true;
        });

        this.getProfile = function(userData) {
            Auth.getProfile(userData)
                .then(function(data) {
                    console.log(data);
                })
        }

        this.doLogin = function(loginData) {
            app.loading = true;
            app.errorMsg = false;
            app.expired = false;
            app.disabled = true;

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

        this.logout = function() {
            Auth.logout();
            app.disabled = false;

            $location.path('/logout');
            $timeout(function() {
                $location.path('/');
            }, 1000);
        }
    });

        