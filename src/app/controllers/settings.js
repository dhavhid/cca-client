/**
 * Created by david on 6/14/16.
 */
'use strict';
angular.module('cca-client').controller('SettingCtrl', function($scope, $state, Api, Messages) {
    $scope.Setting = {}
    $scope.frmSetting = {}
    $scope.Customfields = {}

    $scope.get = function() {
        Api.get('catalogs/settings/1',{}).then(function(response){
            if (parseInt(response.status) >= 200) {
                var data = response.data.data;
                $scope.Setting = {
                    id: parseInt(data.id),
                    per_page: parseInt(data.per_page),
                    overdue_percentage: parseFloat(data.overdue_percentage),
                    search_fields: data.search_fields
                }
                if (data.search_fields.length) {
                    $scope.Setting.search_fields = $scope.Setting.search_fields.split(',');
                } else $scope.Setting.search_fields = [];
            }
        }, function(error){});
        Api.get('catalogs/customfield/persontype',{'persontype': 5}).then(function(response){
            if (parseInt(response.status) >= 200) {
                $scope.Customfields = response.data.data;
            }
        }, function(error){});
    }

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmSetting.$invalid)
            return;

        if ($scope.Setting.search_fields.length > 0) {
            $scope.Setting.search_fields = $scope.Setting.search_fields.join(',');
        } else $scope.Setting.search_fields = null;
        Api.put('catalogs',{Catalog: {
            "catalog": "settings",
            "Setting" : $scope.Setting
        }}).then(function(response){
            Messages.success('&Eacute;xito!', 'La configuraci&oacute;n se guard&oacute; correctamente.');
            $scope.get();
        },function(error){});
    }

    $scope.get();
});
