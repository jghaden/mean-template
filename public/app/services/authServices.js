angular.module('authServices', [])
    .factory('Auth', ($http, AuthToken) => {
        var authFactory = {};

        authFactory.login = (loginData) => {
            return $http.post('/api/users/auth', loginData)
                .then((data) => {
                    AuthToken.setToken(data.data.token);
                    return data;
                });
        }

        authFactory.isLoggedIn = () => {
            if(AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }
        }

        authFactory.getUser = () => {
            if(AuthToken.getToken()) {
                return $http.post('/api/users/me');
            } else {
                $q.reject({ message: 'User has no token' });
            }
        }

        authFactory.logout = () => {
            AuthToken.setToken();
        }

        return authFactory;
    })

    .factory('AuthToken', ($window) => {
        var authTokenFactory = {};

        authTokenFactory.setToken = (token) => {
            if(token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        }

        authTokenFactory.getToken = () => {
            return $window.localStorage.getItem('token')
        }

        return authTokenFactory;
    })

    .factory('AuthInterceptors', (AuthToken) => {
        var authInterceptorsFactory = {};

        authInterceptorsFactory.request = (config) => {
            var token = AuthToken.getToken();

            if(token) {
                config.headers['x-access-token'] = token;
            }

            return config;
        }

        return authInterceptorsFactory;
    });