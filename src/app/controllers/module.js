/**
 * Created by david on 3/28/16.
 */
'use strict';
angular.module('cca-client').controller('ModuleCtrl', function($scope, $state, Api, Messages, localStorageService, CatalogsAll){
    $scope.data = [];
    $scope.pagination = {};
    $scope.per_page = PER_PAGE;
    $scope.get = function(page) {
        var keywords = angular.element('input[name="keywords"]').val();
        if (keywords != undefined) {
            keywords = keywords.trim();
        } else keywords = '';
        var _params = {
            page: page,
            keywords: keywords
        };
        Api.get('catalogs/module', _params).then(function(response){
            $scope.data = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        },function(error){});
        CatalogsAll.get();
    }
    $scope.addNew = function() {
        $state.go('catalogs.modulenew');
    }
    $scope.toTrash = function() {
        var sy_ids = $('input.chk:checked').map(function() {
            return this.value;
        }).get();
        var confirmObj = Messages.confirm('&iquest;Est&aacute; seguro?', 'Los registros borrados no pueden ser recuperados.');
        if (Array.isArray(sy_ids) && sy_ids.length > 0) {
            swal(confirmObj, function (isConfirm) {
                if (isConfirm) {
                    if (sy_ids.length > 0) {
                        Api.delete('catalogs/module/', {id: sy_ids.join(','), per_page: 5000}).then(function (response) {
                            $scope.data = response.data.data;
                            $scope.pagination = response.data.meta.pagination;
                            localStorageService.set('module',$scope.data);
                            Messages.success('&Eacute;xito!', 'Los regitro(s) han sido borrado(s)');
                        }, function (error) {
                        });
                    }
                }
            });
        }
    }
    $scope.search = function() {
        $scope.get(1);
    }
    $scope.get(1);
});
angular.module('cca-client').controller('ModuleNewCtrl', function($scope, $state, Api, Flash){
    $scope.Module = {};
    $scope.activeTitle = 'Nuevo';
    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmModule.$invalid)
            return;

        Api.post('catalogs',{Catalog: {
            "catalog": "module",
            "Module" : $scope.Module
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.module');
        },function(error){});
    }
});
angular.module('cca-client').controller('ModuleUpdateCtrl', function($scope, $state, $stateParams, Api, Flash){
    $scope.Module = {};
    $scope.activeTitle = 'Actualizar';
    $scope.get = function() {
        var id = $stateParams.id;
        if (!isNaN(id)) {
            Api.get('catalogs/module/' + id).then(function(response){
                var data = response.data.data;
                $scope.Module = {
                    id: data.id,
                    name: data.name,
                    description: data.description
                };
            },function(error){
                $state.go('catalogs.module');
            });
        } else {
            $state.go('catalogs.module');
        }
    }
    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmModule.$invalid)
            return;

        Api.put('catalogs',{Catalog: {
            "catalog": "module",
            "Module" : $scope.Module
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.module');
        },function(error){});
    }
    $scope.get();
});
