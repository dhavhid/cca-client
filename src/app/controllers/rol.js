/**
 * Created by david on 3/28/16.
 */
'use strict';
angular.module('cca-client').controller('RolCtrl', function($scope, $state, Api, Messages, localStorageService, CatalogsAll){
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
        Api.get('catalogs/rol', _params).then(function(response){
            $scope.data = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        },function(error){});
        CatalogsAll.get();
    }
    $scope.addNew = function() {
        $state.go('catalogs.rolnew');
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
                        Api.delete('catalogs/rol/', {id: sy_ids.join(','), per_page: 5000}).then(function (response) {
                            $scope.data = response.data.data;
                            $scope.pagination = response.data.meta.pagination;
                            localStorageService.set('rol', $scope.data);
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
angular.module('cca-client').controller('RolNewCtrl', function($scope, $state, Api, Flash, localStorageService){
    $scope.Rol = {};
    $scope.Modules = localStorageService.get("module");
    $scope.activeTitle = 'Nuevo';
    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmRol.$invalid)
            return;

        Api.post('catalogs',{Catalog: {
            "catalog": "rol",
            "Rol" : $scope.Rol
        }}).then(function(response){
            var data = response.data.data;
            // now update modules.
            $scope.ModulesRol = {
                rol_id: data.id,
                data: []
            }
            _.forEach($scope.ModuleRol, function(module,index) {
                $scope.ModulesRol.data.push({
                    module_id: module,
                    rol_id: data.id,
                    writable: 1
                });
            });
            Api.post('catalogs/permissions',$scope.ModulesRol);
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.rol');
        },function(error){});
    }
});
angular.module('cca-client').controller('RolUpdateCtrl', function($scope, $state, $stateParams, Api, Flash, localStorageService){
    $scope.Rol = {};
    $scope.Modules = localStorageService.get("module");
    $scope.activeTitle = 'Actualizar';
    $scope.get = function() {
        var id = $stateParams.id;
        if (!isNaN(id)) {
            Api.get('catalogs/rol/' + id).then(function(response){
                var data = response.data.data;
                $scope.Rol = {
                    id: data.id,
                    name: data.name,
                    description: data.description
                };
            },function(error){
                $state.go('catalogs.rol');
            });
            Api.get('catalogs/permissions/list/' + id).then(function(response) {
                var data = response.data.data;
                $scope.ModuleRol = [];
                _.forEach(data, function(item, index) {
                    $scope.ModuleRol.push(item.module_id);
                });
            }, function(error) {});
        } else {
            $state.go('catalogs.rol');
        }
    }
    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmRol.$invalid)
            return;

        Api.put('catalogs',{Catalog: {
            "catalog": "rol",
            "Rol" : $scope.Rol
        }}).then(function(response){
            // now update modules.
            $scope.ModulesRol = {
                rol_id: $stateParams.id,
                data: []
            }
            _.forEach($scope.ModuleRol, function(module,index) {
                $scope.ModulesRol.data.push({
                    module_id: module,
                    rol_id: $stateParams.id,
                    writable: 1
                });
            });
            Api.post('catalogs/permissions',$scope.ModulesRol);
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.rol');
        },function(error){});
    }
    $scope.get();
});
