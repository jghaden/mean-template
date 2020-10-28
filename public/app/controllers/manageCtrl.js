angular.module('manageController',[])
    .controller('manageCtrl', function(User, $location) {
        var app = this;

        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editAccess = false;
        app.deleteAccess = false;
        app.deleteUsername = false;

        app.viewUser = function(username) {
            $location.path('/profile/' + username);
        }

        app.rowHover = function(id, flag) {
            if(flag) {
                app.row = id;
            } else {
                app.row = false;
            }
        }

        function getUsers() {
            User.getUsers()
            .then(function(data) {
                if(data.data.success) {
                    if(data.data.permission == 'admin' || data.data.permission == 'moderator') {
                        app.users = data.data.users;
                        
                        app.loading = false
                        app.accessDenied = false;

                        if(data.data.permission == 'admin') {
                            app.editAccess = true;
                            app.deleteAccess = true;
                        } else if(data.data.permission == 'moderator') {
                            app.editAccess = true;
                        }
                    } else {
                        app.loading = false;
                        app.errorMsg = 'Insufficient Permissions';
                    }
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        }

        getUsers();

        app.deleteUser = function(username) {
            User.deleteUser(username)
                .then(function(data) {
                    if(data.data.success) {
                        getUsers();
                    } else {
                        app.errorMsg = data.data.message;
                    }
                });
        };
    })

    .controller('editCtrl', function() {
        var app = this;

        app.namePhase = function() {

        };
        
        app.usernamePhase = function() {

        };
        
        app.emailPhase = function() {

        };
        
        app.permissionPhase = function() {

        };
    });