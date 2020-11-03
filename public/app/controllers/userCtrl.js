angular.module('userControllers', ['userServices'])
    .controller('regCtrl', function($http, $timeout, $location, User) {
        var app = this;

        this.regUser = function(regData, valid, isConfirmed) {
            app.loading = true;
            app.errorMsg = false;
            app.disabled = true;

            if(valid && isConfirmed) {
                User.create(app.regData)
                    .then(function(data) {
                        app.loading = false;

                        if(data.data.success) {
                            app.successMsg = data.data.message;

                            $timeout(function(){
                                $location.path('/');
                            }, 2000);
                        } else {
                            app.disabled = false;
                            app.errorMsg = data.data.message;
                        }
                    });
            } else {
                app.loading = false;
                app.disabled = false;
                
                app.errorMsg = 'Ensure the form is filled out properly.';
            }
        }

        this.checkUsername = function(regData) {
            app.checkingUsername = true;
            app.usernameMsg = false;
            app.usernameInvalid = false;

            User.checkUsername(app.regData)
                .then(function(data) {
                    app.checkingUsername = false;
                    app.usernameMsg = data.data.message;

                    app.usernameInvalid = (data.data.success) ? false : true;
                });
        }

        this.checkEmail = function(regData) {
            app.checkingEmail = true;
            app.emailMsg = false;
            app.emailInvalid = false;

            User.checkEmail(app.regData)
                .then(function(data) {
                    app.checkingEmail = false;
                    app.emailMsg = data.data.message;

                    app.emailInvalid = (data.data.success) ? false : true;
                });
        }      
    })

    .directive('match', function() {
        return {
            restrict: 'A',
            controller: function($scope) {
                $scope.isConfirmed = false;

                $scope.doConfirm = function(values) {
                    values.forEach(function(el) {
                        $scope.isConfirmed = ($scope.confirm == el) ? true : false;
                    });
                }
            },

            link: function(scope, element, attrs) {
                attrs.$observe('match', function() {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });

                scope.$watch('confirm', function() {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
            }
        }
    })

    .controller('profileCtrl', function(User, $route, $location) {
        var app = this;

        User.getProfile($route.current.params.username)
            .then(function(data) {
                if(data.data.success) {
                    app.name       = data.data.user.name;
                    app.username   = data.data.user.username;
                    app.email      = data.data.user.email;
                    app.avatar     = data.data.user.avatar;

                    app.profession = data.data.user.social.profession;
                    app.location   = data.data.user.social.location;
                    app.website    = data.data.user.social.website;
                    app.github     = data.data.user.social.github;
                    app.linkedin   = data.data.user.social.linkedin;

                    var date = new Date(data.data.user.created);
                    app.created = date.toUTCString();
                } else {
                    // Redirect to home path if user profile is not found
                    $location.path('/')
                }
            });
    })