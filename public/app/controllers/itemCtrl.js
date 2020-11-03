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

    .controller('itemListCtrl', function(Item, User, $location) {
        var app = this;

        app.loading = true;
        app.deleteItemName = false;

        User.getPermission()
            .then(function(data) {
                if(data.data.permission == 'admin' || data.data.permission == 'moderator') {
                    app.authorized = true;
                }
            });

        app.viewItem = function(id) {
            $location.path('/items/view/' + id);
        }

        app.rowHover = function(id, flag) {
            if(flag) {
                app.row = id;
            } else {
                app.row = false;
            }
        }

        function getItems() {
            Item.getItems()
                .then(function(data) {
                    if(data.data.success) {
                        app.items = data.data.items;

                        app.loading = false;
                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }
                });
        }

        getItems();

        app.deleteItem = function(item) {
            Item.deleteItem(item)
                .then(function(data) {
                    if(data.data.success) {
                        getItems();
                    } else {
                        app.errorMsg = data.data.message;
                    }
                });
        };
    })

    .controller('itemViewCtrl', function(Item, $route, $location) {
        var app = this;

        app.loading = true;

        function getItem() {
            Item.getItem($route.current.params.part)
                .then(function(data) {
                    if(data.data.success) {
                        app.item = data.data.item;

                        var date = new Date(data.data.item.created);
                        app.item.created = date.toUTCString();
                        
                        app.loading = false;
                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;

                        $location.path('/');
                    }
                });
        }

        getItem();
    })