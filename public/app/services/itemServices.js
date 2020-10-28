angular.module('itemServices', [])
    .factory('Item', function($http) {
        itemFactory = {};

        itemFactory.create = function(itemData) {
            return $http.post('/api/items/create', itemData);
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

        return itemFactory;
    });