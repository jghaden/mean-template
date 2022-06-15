angular.module('userController', ['userServices'])
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
                    app.name       = `${data.data.public_user.nameFirst} ${data.data.public_user.nameLast}`;
                    app.username   = data.data.public_user.username;
                    app.email      = data.data.public_user.email;
                    app.avatar     = data.data.public_user.avatar;

                    app.profession = data.data.public_user.social.profession;
                    app.location   = data.data.public_user.social.location;
                    app.website    = data.data.public_user.social.website;
                    app.github     = data.data.public_user.social.github;
                    app.linkedin   = data.data.public_user.social.linkedin;
                    app.about      = data.data.public_user.social.about;
                    app.topics     = '';

                    if(data.data.public_user.social.topics) {
                        for(var i = 0; i < data.data.public_user.social.topics.length; i++) {
                            if(i < (data.data.public_user.social.topics.length - 1)) {
                                app.topics += data.data.public_user.social.topics[i] + ', ';
                            } else {
                                app.topics += data.data.public_user.social.topics[i];
                            }
                        }
                    }

                    app.created = DateFormatted(data.data.public_user.created, false, false);
                    $('#profile-creation-date').attr('title', DateFormatted(data.data.public_user.created));

                    $('.profile-avatar').attr('src', 'users/avatar/' + data.data.public_user._id + '.jpg');

                    StartListeners();
                    
                    $('.prop-edit').on('focus', function() {
                        TextEdit($(this), true, false);
                    }).on('focusout', function() {
                        TextEdit($(this), false, false);
                    });

                    $('.prop-edit-parent').on('focus', function() {
                        TextEdit($(this).parent(), true, false);
                    }).on('focusout', function() {
                        TextEdit($(this).parent(), false, false);
                    });
                } else {
                    // Redirect to home path if user profile is not found
                    $location.path('/')
                }
            });

        
    });