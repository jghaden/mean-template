angular.module('itemController', ['authServices'])
    .controller('itemCtrl', function(Item, Auth, $timeout, $location) {
        var app = this;

        app.createItem = function(itemData, valid) {
            app.loading = true;
            app.errorMsg = false;
            app.disabled = true;
            
            if(valid) {
                if(Auth.isLoggedIn()) {
                    Auth.getUser()
                    .then(function(data) {
                        Item.create(app.itemData)
                            .then(function(data) {
                                app.loading = false;

                                if(data.data.success) {
                                    app.successMsg = data.data.message;

                                    $timeout(function(){
                                        location.reload();
                                    }, 1000);
                                } else {
                                    app.disabled = false;
                                    app.errorMsg = data.data.message;
                                }
                            });
                    });
                }
            } else {
                app.loading = false;
                app.disabled = false;
                
                app.errorMsg = 'Ensure the form is filled out properly.';
            }
        }

        app.checkPart = function(itemData) {
            app.checkingPart = true;
            app.partMsg = false;
            app.partInvalid = false;

            Item.checkPart(app.itemData)
                .then(function(data) {
                    app.checkingPart = false;
                    app.partMsg = data.data.message;

                    app.partInvalid = (data.data.success) ? false : true;
                });
        }     
    })