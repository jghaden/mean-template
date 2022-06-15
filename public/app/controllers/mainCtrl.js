angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function(Auth, $rootScope, $timeout, $location, User, AuthToken) {
        var app = this;

        app.loaded = false;
        app.authorized = false;
        app.initalLogin = false;

        $rootScope.$on('$routeChangeStart', function() {
            app.navTitle = undefined;

            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser()
                    .then(function(data) {
                        app.username = data.data.username;
                        app.email = data.data.email;

                        if(data.data.success == false) {
                            app.logout();
                        } else if(!app.initalLogin) {
                            User.getProfile(app.username)
                                .then(function(data) {
                                    if(data.data.success) {
                                        app.name       = data.data.public_user.name;
                                        app.username   = data.data.public_user.username;
                                        app.avatar     = data.data.public_user.avatar;

                                        var date = new Date(data.data.public_user.created);
                                        app.created = date.toUTCString();

                                        $('.nav-avatar').attr('src', 'users/avatar/' + data.data.public_user._id + '.jpg');
                                    }
                                });

                            app.initalLogin = true;
                        }
                    });
            } else {
                app.isLoggedIn = false;
            }

            app.setNavTitle();
            app.loaded = true;

            $('*').off('contextmenu');
        });

        app.doLogin = function(loginData) {
            app.loading = true;
            app.errorMsg = false;
            app.expired = false;
            app.disabled = true;
            app.resend = false;

            app.isSidenavOpen = false;
            app.isUsernavOpen = false;

            Auth.login(app.loginData)
                .then(function(data) {
                    app.loading = false;

                    if(data.data.success) {
                        app.successMsg = data.data.message;

                        $timeout(function() {
                            $location.path(`/profile/${data.data.username}`);
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
            User.resendActivatonLink(app.loginData)
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

        app.sidenavOpen = function(flag) {
            if(flag) {
                $timeout(function() {
                    app.isSidenavOpen = true;
                    $('#sidenav').addClass('open-sidenav');
                    setOverlay('#main');
                }, 20);
            } else {
                app.isSidenavOpen = false;
                $('#sidenav').removeClass('open-sidenav');
                setOverlay('#main', false);
            }
        }

        app.usernavOpen = function(flag) {
            if(flag) {
                $timeout(function() {
                    app.isUsernavOpen = true;
                    $('#usernav').addClass('open-usernav');
                    setOverlay('#main');
                }, 20);
            } else {
                app.isUsernavOpen = false;
                $('#usernav').removeClass('open-usernav');
                setOverlay('#main', false);
            }
        }

        app.setNavTitle = function(text) {
            if(text) {
                app.navTitle = text;
                SetTitle(text);
            } else {
                app.navTitle = undefined;
                SetTitle();
            }
        }

        if (window.history && window.history.pushState) {
            $(window).on('popstate', function() {
                var hashLocation = location.hash;
                var hashSplit = hashLocation.split("#!/");
                var hashName = hashSplit[1];
            
                if (hashName !== '') {
                    var hash = window.location.hash;
                    if (hash === '') {
                        app.usernavOpen(false);
                        app.sidenavOpen(false);
                    }
                }
            });
        }
    });