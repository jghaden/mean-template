angular.module('itemServices', [])
    .factory('Item', function($http) {
        itemFactory = {};

        itemFactory.create = function(itemData) {
            return $http.post('/api/item/create', itemData);
        };

        itemFactory.checkPart = function(itemData) {
            return $http.post('/api/checkPart', itemData);
        };        
        
        itemFactory.getItems = function() {
            return $http.get('/api/items');
        };
        
        itemFactory.getItem = function(part) {
            return $http.get('/api/item/' + part);
        };

        itemFactory.deleteItem = function(item) {
            return $http.delete('/api/item/delete/' + item);
        };

        itemFactory.update = function(itemData) {
            return $http.patch('/api/item/update', itemData);
        };

        return itemFactory;
    });