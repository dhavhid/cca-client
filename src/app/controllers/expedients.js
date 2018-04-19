/**
 * Created by david on 6/16/16.
 */
'use strict';
angular.module('cca-client').controller('PeopleExpedientCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService) {
    $scope.isStudent = false;
    $scope.activeTitle = '';
    $scope.expedients = [];

    $scope.getPerson = function() {
        var id = $stateParams.id;
        Api.get('people/' + id).then(function (response) {
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Person = data;
                $scope.activeTitle = $scope.Person.firstname + ' ' + $scope.Person.lastname;
                if ($scope.Person.personTypeId == 5) {
                    $scope.isStudent = true;
                }
            }
        }, function (error) {
        });
    }

    $scope.get = function(page) {
        var id = $stateParams.id;
        var keywords = angular.element('input[name="keywords"]').val();
        if (keywords != undefined) {
            keywords = keywords.trim();
        } else keywords = '';
        var _params = {
            page: page,
            keywords: keywords
        };
        Api.get('people/' + id + '/expedients', _params).then(function(response){
            if (response.status >= 200) {
                $scope.expedients = response.data.data;
                $scope.pagination = response.data.meta.pagination;
            }
        }, function(error){});
    }

    $scope.addNew = function() {
        $state.go('people.expedientnew',{id: $stateParams.id});
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
                        Api.delete('people/' + $stateParams.id + '/expedient', {id: sy_ids.join(','), page:1}).then(function (response) {
                            $scope.expedients = response.data.data;
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
    $scope.getPerson();
    $scope.get(1);
});

angular.module('cca-client').controller('PeopleExpedientNewCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService) {
    $scope.isStudent = false;
    $scope.activeTitle = 'Nuevo Expediente';
    $scope.Expedient = {};
    $scope.nombrePersona = '';
    $scope.summernoteoptions = {
        height: 300,
        focus: true,
        airMode: false,
        toolbar: [
            ['edit',['undo','redo']],
            ['headline', ['style']],
            ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
            ['fontface', ['fontname']],
            ['textsize', ['fontsize']],
            ['fontclr', ['color']],
            ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link','hr']],
        ]
    };

    $scope.get = function() {
        var id = $stateParams.id;
        Api.get('people/' + id).then(function (response) {
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Person = data;
                $scope.nombrePersona = $scope.Person.firstname + ' ' + $scope.Person.lastname;
                if ($scope.Person.personTypeId == 5) {
                    $scope.isStudent = true;
                }
            }
        }, function (error) {
        });
    }

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmExpedient.$invalid)
            return;

        if($('input[name="date_of_event"]').val().length > 0) {
            var dob = $('input[name="date_of_event"]').val();
            dob = moment(dob, 'DD/MM/YYYY').valueOf();
            if (isNaN(dob) || dob <= 0) {
                $('.date_of_event-error-message').parent().addClass('has-error').removeClass('has-success');
                $('.date_of_event-error-message').show();
                return;
            } else {
                dob = $('input[name="date_of_event"]').val();
                $scope.Expedient.date_of_event = moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
                $('.date_of_event-error-message').parent().addClass('has-success').removeClass('has-error');
                $('.date_of_event-error-message').hide();
            }
        }

        Api.post('people/' + $stateParams.id + '/expedient',{Expedient: $scope.Expedient}).then(function(response){
            Messages.success('&Eacute;xito!', 'El registro se guard&oacute; correctamente.');
            $state.go('people.expedient',{id: $stateParams.id});
        },function(error){});
    }

    Inputmask('99/99/9999').mask('input[name="date_of_event"]');
    $scope.Expedient.person_id = $stateParams.id;
    $scope.personId = $stateParams.id;
    $scope.get();
});

angular.module('cca-client').controller('PeopleExpedientUpdateCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService) {
    $scope.isStudent = false;
    $scope.activeTitle = 'Actualizar Expediente';
    $scope.Expedient = {};
    $scope.nombrePersona = '';
    $scope.summernoteoptions = {
        height: 300,
        focus: true,
        airMode: false,
        toolbar: [
            ['edit',['undo','redo']],
            ['headline', ['style']],
            ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
            ['fontface', ['fontname']],
            ['textsize', ['fontsize']],
            ['fontclr', ['color']],
            ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link','hr']],
        ]
    };

    $scope.get = function() {
        var id = $stateParams.personId;
        Api.get('people/' + id).then(function (response) {
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Person = data;
                $scope.nombrePersona = $scope.Person.firstname + ' ' + $scope.Person.lastname;
                if ($scope.Person.personTypeId == 5) {
                    $scope.isStudent = true;
                }
            }
        }, function (error) {
        });
        Api.get('people/' + $stateParams.personId + '/expedient/' + $stateParams.id + '/').then(function(response){
            if (response.status >= 200) {
                var data = response.data.data;
                $scope.Expedient = {
                    id: data.id,
                    subject: data.subject,
                    location: data.location,
                    description: data.description,
                    event_result: data.eventResult,
                    date_of_event: moment(data.dateOfEvent).format('DD/MM/YYYY')
                }
            }
        }, function(error){});
    }

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmExpedient.$invalid)
            return;

        if($('input[name="date_of_event"]').val().length > 0) {
            var dob = $('input[name="date_of_event"]').val();
            dob = moment(dob, 'DD/MM/YYYY').valueOf();
            if (isNaN(dob) || dob <= 0) {
                $('.date_of_event-error-message').parent().addClass('has-error').removeClass('has-success');
                $('.date_of_event-error-message').show();
                return;
            } else {
                dob = $('input[name="date_of_event"]').val();
                $scope.Expedient.date_of_event = moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
                $('.date_of_event-error-message').parent().addClass('has-success').removeClass('has-error');
                $('.date_of_event-error-message').hide();
            }
        }

        Api.put('people/' + $stateParams.personId + '/expedient/' + $stateParams.id,{Expedient: $scope.Expedient}).then(function(response){
            Messages.success('&Eacute;xito!', 'El registro se guard&oacute; correctamente.');
            $state.go('people.expedient',{id: $stateParams.personId});
        },function(error){});
    }

    Inputmask('99/99/9999').mask('input[name="date_of_event"]');
    $scope.personId = $stateParams.personId;
    $scope.get();
});
