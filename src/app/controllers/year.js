/**
 * Created by david on 3/28/16.
 */
'use strict';
angular.module('cca-client').controller('YearCtrl', function($scope, $state, Api, Messages, localStorageService, CatalogsAll){
    $scope.y_data = [];
    $scope.pagination = {};
    $scope.per_page = PER_PAGE;

    $scope.sortableOptions = {
        handle: '.fa-reorder',
        stop: function(e, ui) {
            var sy_ids = $('input.chk').map(function() {
                return this.value;
            }).get();
            Api.put('catalogs/year/order',{ids: sy_ids.join(",")});
        }
    }

    $scope.get = function(page) {
        var keywords = angular.element('input[name="keywords"]').val();
        if (keywords != undefined) {
            keywords = keywords.trim();
        } else keywords = '';
        var _params = {
            page: page,
            per_page: 5000,
            keywords: keywords
        };
        Api.get('catalogs/year', _params).then(function(response){
            $scope.y_data = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        },function(error){});
        CatalogsAll.get();
    }
    $scope.addNew = function() {
        $state.go('catalogs.yearnew');
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
                        Api.delete('catalogs/year/', {id: sy_ids.join(','), per_page: 5000}).then(function (response) {
                            $scope.y_data = response.data.data;
                            $scope.pagination = response.data.meta.pagination;
                            localStorageService.set('year', $scope.y_data);
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
angular.module('cca-client').controller('YearNewCtrl', function($scope, $state, Api, Flash){
    $scope.Year = {};
    $scope.activeTitle = 'Nuevo';
    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmYear.$invalid)
            return;

        Api.post('catalogs',{Catalog: {
            "catalog": "year",
            "Year" : $scope.Year
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.year');
        },function(error){});
    }
});
angular.module('cca-client').controller('YearUpdateCtrl', function($scope, $state, $stateParams, Api, Flash){
    $scope.Year = {};
    $scope.activeTitle = 'Actualizar';

    $scope.get = function() {
        var id = $stateParams.id;
        if (!isNaN(id)) {
            Api.get('catalogs/year/' + id).then(function(response){
                var data = response.data.data;
                $scope.Year = {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    order: data.order
                };
            },function(error){
                $state.go('catalogs.year');
            });
        } else {
            $state.go('catalogs.year');
        }
    }

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmYear.$invalid)
            return;

        Api.put('catalogs',{Catalog: {
            "catalog": "year",
            "Year" : $scope.Year
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.year');
        },function(error){});
    }
    $scope.get();
});
