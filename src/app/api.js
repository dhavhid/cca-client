/**
 * Created by david on 3/22/16.
 */
'use strict';
app.factory('Api',function($http, $httpParamSerializer, $q, $cookies, localStorageService, $state, Auth){
    return {
        _baseurl       : localStorageService.get('baseurl'),
        _apipath       : '/api/v1/',
        _params        : '',
        _client_id     : localStorageService.get('client_id'),
        _client_secret : localStorageService.get('client_secret'),
        _access_token  : localStorageService.get('access_token'),
        _expires       : localStorageService.get('access_token_expires'),

        config: function(endpoint) {
            var url = this._baseurl + this._apipath;
            this._access_token = localStorageService.get('access_token');
            this._expires = localStorageService.get('access_token_expires');
            if (endpoint.indexOf(url) != -1) {
                url = '';
            }
            var req = {
                url: url + endpoint
            }
            if (this._access_token) {
                req.headers = {Authorization: 'Bearer ' + this._access_token};
            }
            // check if access token still valid
            //Auth.check();
            return req;
        },
        login: function(username, pass){
            var _url = this._baseurl + this._apipath + 'oauth/access_token';
            var defer = $q.defer();
            var req = {
                method: 'POST',
                url: _url,
                headers: {
                   "Content-Type": 'application/x-www-form-urlencoded'
                },
                data: 'client_id=' + this._client_id + '&client_secret=' + this._client_secret + '&username=' + encodeURI(username) + '&password=' + encodeURI(pass) + '&grant_type=password'
            }
            $http(req).then(function(response){
                if (response.status == 200) {
                    localStorageService.set('access_token', response.data.access_token);
                    localStorageService.set('access_token_expires',moment().unix() + parseInt(response.data.expires_in));
                }
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        },
        get: function(endpoint,r_params){
            var req = this.config(endpoint);
            req.params = r_params;
            var defer = $q.defer();
            $http.get(req.url, req).then(
                function(response){
                    if (response.status === 401) {
                        localStorageService.remove('access_token','access_token_expires');
                        $state.go('logout');
                    }
                    defer.resolve(response);
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },
        post: function(endpoint,data) {
            var req = this.config(endpoint);
            var defer = $q.defer();
            $http.post(req.url, data, req).then(
                function(response){
                    if (response.status === 401) {
                        localStorageService.remove('access_token','access_token_expires');
                        $state.go('logout');
                    }
                    defer.resolve(response);
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },
        put: function(endpoint,data) {
            var req = this.config(endpoint);
            var defer = $q.defer();
            $http.put(req.url, data, req).then(
                function(response){
                    if (response.status === 401) {
                        localStorageService.remove('access_token','access_token_expires');
                        $state.go('logout');
                    }
                    defer.resolve(response);
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },
        delete: function(endpoint,r_params){
            var req = this.config(endpoint);
            req.params = r_params;
            var defer = $q.defer();
            $http.delete(req.url, req).then(
                function(response){
                    if (response.status === 401) {
                        localStorageService.remove('access_token','access_token_expires');
                        $state.go('logout');
                    }
                    defer.resolve(response);
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        }
    };
});
