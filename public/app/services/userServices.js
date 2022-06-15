angular.module('userServices', [])
    .factory('User', ($http) => {
        userFactory = {};

        userFactory.create = (regData) => {
            return $http.post('/api/users', regData);
        };

        userFactory.checkEmail = (regData) => {
            return $http.post('/api/users/check/email', regData);
        };
        
        userFactory.checkUsername = (regData) => {
            return $http.post('/api/users/check/username', regData);
        };

        userFactory.activateAccount = (token) => {
            return $http.put(`/api/users/activate/${token}`);
        };

        userFactory.resendActivatonLink = (username) => {
            return $http.put('/api/users/resend/activation', username);
        };
        
        userFactory.sendUsernameResetLink = (userData) => {
            return $http.get(`/api/users/reset/username/${userData}`);
        };

        userFactory.sendPasswordResetLink = (resetData) => {
            return $http.put('/api/users/reset/password', resetData);
        };

        userFactory.resetPasswordVerify = (token) => {
            return $http.get(`/api/users/reset/password/${token}`);
        };

        userFactory.updatePassword = (regData) => {
            return $http.put('/api/users/update/password', regData);
        };

        userFactory.getProfile = (username) => {
            return $http.get(`/api/users/profile/${username}`);
        }
        
        userFactory.getPermission = () => {
            return $http.get('/api/users/permission');
        };

        userFactory.getUsers = () => {
            return $http.get('/api/users');
        };
        
        userFactory.deleteUser = (userEmail) => {
            return $http.delete(`/api/users/${userEmail}`);
        };

        return userFactory;
    });