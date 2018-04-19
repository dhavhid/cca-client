/**
 * Created by david on 2/20/16.
 */
'use strict';
angular.module('cca-client').controller('SchoolYearCtrl', function($scope, $state, Api, Messages, localStorageService, CatalogsAll){
    $scope.sy_data = [];
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
        Api.get('catalogs/enrollmentyear', _params).then(function(response){
            $scope.sy_data = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        },function(error){});
        CatalogsAll.get();
    }
    $scope.addNew = function() {
        $state.go('catalogs.schoolyearnew');
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
                        Api.delete('catalogs/enrollmentyear/', {id: sy_ids.join(','), per_page: 5000}).then(function (response) {
                            $scope.sy_data = response.data.data;
                            localStorageService.set('enrollmentyear', $scope.sy_data);
                            $scope.pagination = response.data.meta.pagination;
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
angular.module('cca-client').controller('SchoolYearNewCtrl', function($scope, $state, Api, Flash, localStorageService){
    $scope.EnrollmentYear = {};

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmEnrollmentYear.$invalid)
            return;

        Api.post('catalogs',{Catalog: {
            "catalog": "enrollmentyear",
            "EnrollmentYear" : $scope.EnrollmentYear
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.schoolyear');
        },function(error){});
    }
});
angular.module('cca-client').controller('SchoolYearUpdateCtrl', function($scope, $state, $stateParams, Api, Flash){
    $scope.EnrollmentYear = {};

    $scope.get = function() {
        var id = $stateParams.id;
        if (!isNaN(id)) {
            Api.get('catalogs/enrollmentyear/' + id).then(function(response){
                var data = response.data.data;
                $scope.EnrollmentYear = {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    is_active: data.isActive
                };
            },function(error){
                $state.go('catalogs.schoolyear');
            });
        } else {
            $state.go('catalogs.schoolyear');
        }
    }
    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmEnrollmentYear.$invalid)
            return;

        Api.put('catalogs',{Catalog: {
            "catalog": "enrollmentyear",
            "EnrollmentYear" : $scope.EnrollmentYear
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.schoolyear');
        },function(error){});
    }
    $scope.get();
});
