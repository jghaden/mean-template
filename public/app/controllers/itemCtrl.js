angular.module('itemController', ['authServices'])
    .controller('itemCreateCtrl', function(Item, Auth, $timeout, $location) {
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

    .controller('itemEditCtrl', function(Item, Auth, $timeout, $location, $route) {
        var app = this;

        app.loading = true;
        app.errorMsg = false;
        app.tempPart = false;

        function getItem() {
            Item.getItem($route.current.params.part)
                .then(function(data) {
                    if(data.data.success) {
                        app.tempPart = data.data.item.part;

                        var validItemClasses = ['form-control', 'ng-not-empty', 'ng-dirty', 'ng-valid-parse', 'ng-valid', 'ng-valid-required', 'is-valid', 'ng-touched'];

                        $('[name="itemForm"]').removeClass().addClass(['ng-valid-min', 'ng-valid-url', 'ng-dirty', 'ng-valid-parse', 'ng-valid', 'ng-valid-required']);

                        $('[name="part"]').val(data.data.item.part);
                        $('[name="quanity"]').val(data.data.item.quanity);
                        $('[name="category"]').val(data.data.item.category);

                        $('[name="part"]').removeClass().addClass(validItemClasses);
                        $('[name="quanity"]').removeClass().addClass(validItemClasses);
                        $('[name="category"]').removeClass().addClass(validItemClasses);                        

                        var noteVal = data.data.item.note;
                        var urlVal = data.data.item.url;

                        if(noteVal != "N/A") {
                            $('[name="note"]').val(data.data.item.note).removeClass().addClass(validItemClasses);
                        } else {
                            $('[name="note"]').val();
                        }

                        if(urlVal != "N/A") {
                            $('[name="url"]').val(data.data.item.url).removeClass().addClass(validItemClasses);
                        } else {
                            $('[name="url"]').val();
                        }                        
                        
                        app.loading = false;
                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;

                        $location.path('/items/list');
                    }
                });
        }

        getItem();

        app.updateItem = function(itemData, valid) {
            app.loading = true;
            app.errorMsg = false;
            app.disabled = true;
            
            if(valid) {
                if(Auth.isLoggedIn()) {
                    Auth.getUser()
                    .then(function(data) {
                        Item.update(app.itemData)
                            .then(function(data) {
                                app.loading = false;
                                if(data.data.success) {
                                    app.successMsg = data.data.message;
                                    
                                    $timeout(function(){
                                        $location.path('/items/view/' + app.itemData.part);
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
                    if(app.tempPart == app.itemData.part) {
                        app.checkingPart = false;
    
                        app.partInvalid = false;
                    } else {
                        app.checkingPart = false;
                        app.partMsg = data.data.message;
    
                        app.partInvalid = (data.data.success) ? false : true;
                    }
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

        app.editItem = function(id) {
            $location.path('/items/edit/' + id);
        }

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

                        app.item.created = DateFormatted(data.data.item.created);
                        
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