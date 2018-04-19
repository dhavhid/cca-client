/**
 * Created by david on 3/28/16.
 */
'use strict';
angular.module('cca-client').controller('CustomfieldCtrl', function($scope, $state, Api, Messages){
    $scope.data = [];
    $scope.pagination = {};
    $scope.per_page = 5000;

    $scope.sortableOptions = {
        handle: '.fa-reorder',
        stop: function(e, ui) {
            var sy_ids = $('input.chk').map(function() {
                return this.value;
            }).get();
            Api.put('catalogs/customfield/order',{ids: sy_ids.join(",")});
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
        Api.get('catalogs/customfields', _params).then(function(response){
            $scope.data = response.data.data;
            _.forEach(response.data.data, function(customfield, i){
                var pt = [];
                _.forEach(customfield.persontype, function(person, j){
                    pt.push(person.name);
                });
                $scope.data[i].persontype = pt.join(', ');
            });
            $scope.pagination = response.data.meta.pagination;
        },function(error){});
    }
    $scope.addNew = function() {
        $state.go('catalogs.customfieldsnew');
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
                        Api.delete('catalogs/customfields/', {id: sy_ids.join(','), per_page: 5000}).then(function (response) {
                            $scope.data = response.data.data;
                            _.forEach(response.data.data, function(customfield, i){
                                var pt = [];
                                _.forEach(customfield.persontype, function(person, j){
                                    pt.push(person.name);
                                });
                                $scope.data[i].persontype = pt.join(', ');
                            });
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
angular.module('cca-client').controller('CustomfieldNewCtrl', function($scope, $state, Api, Flash, Slug){
    $scope.Customfield = {};
    $scope.types = [];
    $scope.persontypeid = [];
    $scope.activeTitle = 'Nuevo';

    $scope.getPersonType = function() {
        Api.get('catalogs/persontype', {page:1}).then(function(response){
            _.forEach(response.data.data, function(person, index){
                $scope.types.push({id:person.id, name:person.name});
            });
        },function(error){});
    }

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmCustomfield.$invalid)
            return;

        var persontype = [];
        $('.person-type').map(function() { if (this.checked) persontype.push(this.value); });
        if (persontype.length == 0) {
            return;
        }
        if ($scope.Customfield.required) $scope.Customfield.required = 1;
        else $scope.Customfield.required = 0;

        $scope.Customfield.name = Slug.slugify($scope.Customfield.label) + '-' + moment().unix();

        Api.post('catalogs',{Catalog: {
            "catalog": "customfields",
            "Customfield" : $scope.Customfield,
            "persontype": persontype
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.customfields');
        },function(error){});
    }
    $scope.getPersonType();
});
angular.module('cca-client').controller('CustomfieldUpdateCtrl', function($scope, $state, $stateParams, Api, Flash){
    $scope.Customfield = {};
    $scope.persontypeid = [];
    $scope.types = [];
    $scope.activeTitle = 'Actualizar';
    $scope.get = function() {
        var id = $stateParams.id;
        if (!isNaN(id)) {
            Api.get('catalogs/customfields/' + id).then(function(response){
                var data = response.data.data;
                $scope.Customfield = {
                    id: data.id,
                    name: data.name,
                    label: data.label,
                    type: data.type,
                    required: data.required,
                    values: data.values,
                    pattern: data.pattern,
                    order: data.order
                };
                _.forEach(data.persontype, function (person, index) {
                   $scope.persontypeid.push(person.id);
                });
            },function(error){
                $state.go('catalogs.customfields');
            });
            Api.get('catalogs/persontype', {page:1}).then(function(response){
                _.forEach(response.data.data, function(person, index){
                    $scope.types.push({id:person.id, name:person.name});
                });
            },function(error){});
        } else {
            $state.go('catalogs.customfields');
        }
    }
    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmCustomfield.$invalid)
            return;

        var persontype = [];
        $('.person-type').map(function() { if (this.checked) persontype.push(this.value); });
        if (persontype.length == 0) {
            return;
        }

        if ($scope.Customfield.required) $scope.Customfield.required = 1;
        else $scope.Customfield.required = 0;

        Api.put('catalogs',{Catalog: {
            "catalog": "customfields",
            "Customfield" : $scope.Customfield,
            "persontype": persontype
        }}).then(function(response){
            Flash.setMessage('El registro se guard&oacute; correctamente.');
            $state.go('catalogs.customfields');
        },function(error){});
    }
    $scope.get();
});
