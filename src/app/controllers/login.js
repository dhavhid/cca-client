/**
 * Created by david on 4/27/16.
 */
angular.module('cca-client').controller('LoginCtrl', function($scope, $state, localStorageService, Api, $timeout){
    $scope.Login = {};

    $scope.login = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmLogin.$invalid) { return; }

        Api.login($scope.Login.username, $scope.Login.password).then(function(response){
            if (response.status == 200 && localStorageService.get('access_token') != undefined) {
                // get the catalogs and add them to the local storage.
                Api.get('catalogs/all').then(function(response){
                    var catalogs = response.data.data;
                    localStorageService.set('module',catalogs.module.data);
                    localStorageService.set('rol',catalogs.rol.data);
                    localStorageService.set('relationshiptype',catalogs.relationshiptype.data);
                    localStorageService.set('persontype',catalogs.persontype.data);
                    localStorageService.set('customfields',catalogs.customfields.data);
                    localStorageService.set('year',catalogs.year.data);
                    localStorageService.set('section',catalogs.section.data);
                    localStorageService.set('subject',catalogs.subject.data);
                    localStorageService.set('enrollmentyear',catalogs.enrollmentyear.data);
                    localStorageService.set('settings', catalogs.settings.data);
                    localStorageService.set('paymenttype', catalogs.paymenttype.data);
                    localStorageService.set('cities', catalogs.cities.data);
                }, function(error){});
                // get user profile info
                Api.get('users/current',{}).then(function(response){
                    localStorageService.set('currentuser', response.data.data);
                }, function(error){});
                $timeout(function(){
                    $state.go('people.students');
                }, 2000);
            }
        }, function(error){
        });
    }

    $scope.keypressLogin = function(event) {
        if (event.which == 13 || event.keyCode == 13) {
            $scope.login();
        }
    }

    $scope.init = function () {
        var access_token = localStorageService.get('access_token');
        var expires = localStorageService.get('access_token_expires');
        if (expires != null) {
            // check if the access token is expired.
            if (expires > moment().unix()) {
                $state.go('people.students');
            }
        }
    }

    $scope.init();

});
angular.module('cca-client').controller('LogoutCtrl', function($scope, $state, localStorageService){
    localStorageService.remove(
        'access_token',
        'access_token_expires',
        'module',
        'rol',
        'relationshiptype',
        'persontype',
        'customfields',
        'year',
        'section',
        'subject',
        'enrollmentyear',
        'settings',
        'currentuser',
        'paymenttype',
        'cities'
    );
    $state.go('login');
});
