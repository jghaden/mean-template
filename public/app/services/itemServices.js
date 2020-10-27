angular.module('itemServices', [])
    .factory('Item', function($http) {
        itemFactory = {};

        itemFactory.create = function(itemData) {
            return $http.post('/api/items/create', itemData);
        };

        itemFactory.checkPart = function(itemData) {
            return $http.post('/api/checkPart', itemData);
        };

        return itemFactory;
    });