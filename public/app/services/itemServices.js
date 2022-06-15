angular.module('itemServices', [])
    .factory('Item', ($http) => {
        itemFactory = {};

        itemFactory.create = (itemData) => {
            return $http.post('/api/items/', itemData);
        };

        itemFactory.checkPart = (itemData) => {
            return $http.post('/api/items/checkPart', itemData);
        };        
        
        itemFactory.getItems = () => {
            return $http.get('/api/items');
        };
        
        itemFactory.getItem = (part) => {
            return $http.get(`/api/items/${part}`);
        };

        itemFactory.deleteItem = (item) => {
            return $http.delete(`/api/items/${item}`);
        };

        return itemFactory;
    });