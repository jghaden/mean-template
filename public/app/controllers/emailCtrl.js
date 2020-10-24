angular.module('emailController', ['userServices'])
    .controller('emailCtrl', function($routeParams, User, $timeout, $location) {
        app = this;

        User.activateAccount($routeParams.token)
            .then(function(data) {
                app.successMsg = false;
                app.errorMsg = false;

                if(data.data.success) {
                    app.successMsg = data.data.message;

                    $timeout(function() {
                        $location.path('/login');
                    }, 1000)
                } else {
                    app.errorMsg = data.data.message;
                }
            });
    })

    .controller('resendCtrl', function(User) {
        app = this;

        app.checkCredentials = function(loginData) {
            app.errorMsg = false;
            app.successMsg = false;
            app.disabled = true;

            User.checkCredentials(app.loginData)
                .then(function(data) {
                    if(data.data.success) {
                        User.resendLink(app.loginData)
                            .then(function(data) {
                                if(data.data.success) {
                                    app.successMsg = data.data.message;
                                } else {
                                    app.disabled = false;
                                    app.errorMsg = data.data.message;
                                }
                            });
                    } else {
                        app.disabled = false;
                        app.errorMsg = data.data.message;
                    }
                });
        };
    })

    .controller('usernameCtrl', function(User) {
        app = this;
        
        app.sendUsername = function(userData, valid) {
            app.errorMsg = false;
            app.loading = true;
            app.disabled = true;

            if(valid) {
                User.sendUsername(app.userData.email)
                    .then(function(data) {
                        app.loading = false;

                        if(data.data.success) {
                            app.successMsg = data.data.message;
                        } else {
                            app.loading = false;
                            app.disabled = false;
                            app.errorMsg = data.data.message;
                        }
                    });
            } else {
                app.loading = false;
                app.disabled = false;
                app.errorMsg = 'Enter a valid email.'
            }
        };
    })

    .controller('passwordCtrl', function(User) {
        app = this;
        
        app.sendPassword = function(resetData, valid) {
            app.errorMsg = false;
            app.loading = true;
            app.disabled = true;

            if(valid) {
                User.sendPassword(app.resetData)
                    .then(function(data) {
                        app.loading = false;

                        if(data.data.success) {
                            app.successMsg = data.data.message;
                        } else {
                            app.loading = false;
                            app.disabled = false;
                            app.errorMsg = data.data.message;
                        }
                    });
            } else {
                app.loading = false;
                app.disabled = false;
                app.errorMsg = 'Enter a valid username.'
            }
        };
    })

    .controller('resetCtrl', function(User, $routeParams, $scope, $timeout, $location) {
        app = this;
        app.hide = true;

        User.resetPassword($routeParams.token)
            .then(function(data) {
                if(data.data.success) {
                    app.hide = false;
                    app.successMsg = 'Enter a new password';
                    $scope.username = data.data.user.username;
                } else {
                    app.errorMsg = data.data.message;
                }
        });

        app.savePassword = function(regData, valid, isConfirmed) {
            app.errorMsg = false;
            app.loading = true;
            app.disabled = true;
            
            if(valid && isConfirmed) {
                app.regData.username = $scope.username;

                User.savePassword(app.regData)
                    .then(function(data) {
                        if(data.data.success) {
                            app.successMsg = data.data.message;

                            $timeout(function() {
                                $location.path('/login');
                            }, 1000);
                        } else {
                            app.loading = false;
                            app.disabled = false;
                            app.errorMsg = data.data.message;
                        }
                    });
            } else {
                app.loading = false;
                app.disabled = false;
                app.errorMsg = 'Ensure the form is filled out properly.';
            }
        };
    });