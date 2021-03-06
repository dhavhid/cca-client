/**
 * Created by david on 3/28/16.
 */
'use strict';
angular.module('cca-client').controller('SubjectCtrl', function($scope, $state, Api, Messages, localStorageService, CatalogsAll){
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
        Api.get('catalogs/subject', _params).then(function(response){
            $scope.data = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        },function(error){});
        CatalogsAll.get();
    }
    $scope.addNew = function() {
        $state.go('catalogs.subjectnew');
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
                        Api.delete('catalogs/subject/', {id: sy_ids.join(','), per_page: 5000}).then(function (response) {
                            $scope.data = response.data.data;
                            $scope.pagination = response.data.meta.pagination;
                            localStorageService.set('subject', $scope.data);
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
angular.module('cca-client').controller('SubjectNewCtrl', function($scope, $state, Api, Flash){
    $scope.Subject = {};
    $scope.activeTitle = 'Nueva';
    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmSubject.$invalid)
            return;

        Api.post('catalogs',{Catalog: {
            "catalog": "subject",
            "Subject" : $scope.Subject
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.subject');
        },function(error){});
    }
});
angular.module('cca-client').controller('SubjectUpdateCtrl', function($scope, $state, $stateParams, Api, Flash){
    $scope.Subject = {};
    $scope.activeTitle = 'Actualizar';
    $scope.get = function() {
        var id = $stateParams.id;
        if (!isNaN(id)) {
            Api.get('catalogs/subject/' + id).then(function(response){
                var data = response.data.data;
                $scope.Subject = {
                    id: data.id,
                    name: data.name,
                    description: data.description
                };
            },function(error){
                $state.go('catalogs.subject');
            });
        } else {
            $state.go('catalogs.subject');
        }
    }
    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmSubject.$invalid)
            return;

        Api.put('catalogs',{Catalog: {
            "catalog": "subject",
            "Subject" : $scope.Subject
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.subject');
        },function(error){});
    }
    $scope.get();
});
