/**
 * Created by david on 4/6/16.
 */
angular.module('cca-client').controller('StudentCtrl', function($scope, $state, Api, Messages, localStorageService){
    // local variables and dictionaries.
    $scope.years = localStorageService.get('year');
    $scope.years = _.orderBy($scope.years, ['order'],['asc']);
    $scope.year = '';
    $scope.schoolyears = localStorageService.get('enrollmentyear');
    $scope.schoolyear = _.find($scope.schoolyears, function(o) { return o.isActive;});
    $scope.schoolyear = $scope.schoolyear.id;
    $scope.sections = localStorageService.get('section');
    $scope.section_id = '%';
    $scope.data = {};
    $scope.pagination = {};
    $scope.per_page = PER_PAGE;
    $scope.profilePicturePlaceholder = 'http://placehold.it/50x50/f1f1f1f1/55555?text=NOFOTO';

    // get students list from API
    $scope.get = function(page) {
        var _params = {
            page: page,
            keywords: $('#keywords').val().trim(),
            year: $scope.year,
            section_id: $scope.section_id,
            schoolyear: $scope.schoolyear
        }
        Api.get('student', _params).then(function(response){
            $scope.data = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        }, function(error){});
    }

    // search with year and keywords filter
    $scope.search = function() {
        $scope.get(1);
    }

    $scope.addNew = function() {
        $state.go('people.studentsnew');
    }

    $scope.toTrash = function() {
        var sy_ids = $('input.chk:checked').map(function() {
            return this.value;
        }).get();
        var confirmObj = Messages.confirm('&iquest;Est&aacute; seguro?', 'Si existen pagos asociados al registro del alumno la matrícula no podrá ser eliminada. Los registros borrados no pueden ser recuperados.');
        if (Array.isArray(sy_ids) && sy_ids.length > 0) {
            swal(confirmObj, function (isConfirm) {
                if (isConfirm) {
                    if (sy_ids.length > 0) {
                        var params = {
                            id: sy_ids.join(','),
                            keywords: $('#keywords').val().trim(),
                            year: $scope.year,
                            schoolyear: $scope.schoolyear
                        }
                        Api.delete('enrollment/', params).then(function (response) {
                            if (response.status == 200 && response.data.data.message == null) {
                                $scope.data = response.data.data;
                                $scope.pagination = response.data.meta.pagination;
                                Messages.success('&Eacute;xito!', 'Los regitro(s) han sido borrado(s)');
                            } else {
                                Messages.error('Error!', response.data.data.message);
                                $scope.get(1);
                            }
                        }, function (error) {});
                    }
                }
            });
        }
    }

    // Initialize
    $scope.get(1);

});

angular.module('cca-client').controller('StudentNewCtrl', function($scope, $state, Api, Messages, ValidateCF, $timeout){
    // load local variables.
    $scope.activeTitle = 'Nuevo';
    $scope.departamentos = DEPTOS;
    $scope.Person = {};
    $scope.CustomFields = {};
    $scope.Picture = {profilePicture: '', profileCroppedPicture: '', pictureSet: false};
    $scope.profilePicturePlaceholder = 'http://placehold.it/450x450/f1f1f1f1/55555?text=FOTO';
    $scope.photoLabel = 'Agregar foto de perfil';

    $scope.save = function(force) {

        $scope.$broadcast('show-errors-check-validity');

        if ($scope.frmPerson.date_of_birth.$error.date) {return;}
        if (!ValidateCF.validate()) { return; }
        if ($scope.frmPerson.$invalid) { return; }

        if($('input[name="date_of_birth"]').val().length > 0) {
            var dob = $('input[name="date_of_birth"]').val();
            dob = moment(dob, 'DD/MM/YYYY').valueOf();
            if (isNaN(dob) || dob <= 0) {
                $('.date_of_birth-error-message').parent().addClass('has-error').removeClass('has-success');
                $('.date_of_birth-error-message').show();
                return;
            } else {
                //dob = $('input[name="date_of_birth"]').val();
                //$scope.Person.date_of_birth = moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
                $('.date_of_birth-error-message').parent().addClass('has-success').removeClass('has-error');
                $('.date_of_birth-error-message').hide();
            }
        }

        $scope.Person.person_type_id = STUDENT;

        // add other fixed data.
        $scope.Person.country = 'El Salvador';
        $scope.Person.zipcode = '503'

        // get data from custom fields ready to be saved.
        var customvalues = [];
        _.forEach($scope.customfields, function(customfield, index) {
            if ($scope.CustomFields[customfield.name] != '') {
                customvalues.push({value: $scope.CustomFields[customfield.name], custom_field_id: customfield.id});
            }
        });
        var params = {Person: $scope.Person, CustomFields: customvalues};
        if (force) {
            params.ignore = 1;
        }

        $('.btn-save').prop('disabled',true);
        Api.post('people',params).then(function(response){
            if (force) {
                $('#myModal').modal('hide');
                $timeout(function() {
                    $('div.modal-backdrop').remove();
                }, 1000);
            }
            if (response.status == 200 && (response.data.hasDuplicates == null || response.data.hasDuplicates == undefined)) {
                Messages.success('&Eacute;xito!', 'El alumno ha sido registrado.');
                $state.go('people.studentsenrollment',{id: response.data.data.id});
            } else if (response.status == 200 && response.data.hasDuplicates) {
                $scope.duplicates = response.data.data;
                $('#myModal').modal('show');
            } else {
                Messages.error('Error!', 'El registro del alumno no pudo ser guardado. Por favor aseg&uacute;rese de haber ingresado todos los datos correctamente.');
                /*if($('input[name="date_of_birth"]').val().length > 0) {
                    var dob = $('input[name="date_of_birth"]').val();
                    $scope.Person.date_of_birth = moment(dob, 'YYYY-MM-DD').format('DD/MM/YYYY');
                }*/
                $('.btn-save').prop('disabled',false);
            }
        }, function(error){});
    }

    $scope.getCustomFields = function(personType) {
        Api.get('catalogs/customfield/persontype', {persontype: personType}).then(function(response){
            $scope.customfields = response.data.data;
            _.forEach($scope.customfields, function(item, index){
                if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
                    item.values = item.values.split(',');
                }
                $scope.CustomFields[item.name] = '';
            });
        }, function(error){});
    }

    $scope.selectPicture = function() {
        $('#myModalPicture').modal('show');
    }

    $scope.setPicture = function() {
        if ($scope.Picture.profileCroppedPicture.length > 0) {
            $scope.Picture.setPicture = true;
            $('#selectedImg').attr('src', $scope.Picture.profileCroppedPicture);
            $scope.Person.profile_picture = $scope.Picture.profileCroppedPicture;
        }
        $('#myModalPicture').modal('hide');
        $timeout(function() {
            $('div.modal-backdrop').remove();
        }, 1000);
    }

    var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
        $scope.$apply(function($scope){
            $scope.Picture.profilePicture = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
      $scope.Picture.pictureSet = false;
    };

    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    Inputmask('99/99/9999').mask('input[name="date_of_birth"]');
    $scope.getCustomFields(5);
});

angular.module('cca-client').controller('StudentUpdateCtrl', function($scope, $state, $stateParams, Api, Messages, ValidateCF, $timeout){
    // load local variables.
    $scope.activeTitle = 'Actualizar';
    $scope.departamentos = DEPTOS;
    $scope.Person = {};
    $scope.CustomFields = {};
    $scope.Picture = {profilePicture: '', profileCroppedPicture: '', pictureSet: false};
    $scope.profilePicturePlaceholder = 'http://placehold.it/450x450/f1f1f1f1/55555?text=FOTO';
    $scope.photoLabel = 'Cambiar foto de perfil';

    $scope.get = function() {
        Inputmask('99/99/9999').mask('input[name="date_of_birth"]');

        var id = $stateParams.id;
        Api.get('people/' + id).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.getCustomFields(data.personTypeId);
                $scope.Person = {
                    id: data.id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    middlename: data.middlename,
                    gender: data.gender.trim(),
                    country: data.country,
                    zipcode: data.zipcode,
                    state: data.state,
                    city: data.city,
                    address1: data.address1,
                    address2: data.address2,
                    phone: data.phone,
                    email: data.email
                };
                if (data.profilePicture) {
                    $scope.profilePicturePlaceholder = data.profilePicture;
                }
                if (!isNaN(data.dateOfBirth)) {
                    if (!isNaN(data.dateOfBirth) && parseInt(data.dateOfBirth) > 0) {
                        $scope.Person.date_of_birth = moment(data.dateOfBirth).format('DD/MM/YYYY');
                        $('input[name="date_of_birth"]').val($scope.Person.date_of_birth);
                    }
                }
                _.forEach(data.customfields, function(customfield, index){
                    $scope.CustomFields[customfield.name] = customfield.value;
                    if (customfield.type == 'date') {
                        $('input[name="' + customfield.name + '"]').datepicker('update', new Date(customfield.value));
                    }
                });
                $scope.activeTitle = $scope.Person.firstname + ' ' + $scope.Person.lastname;

            }
        }, function(error){});

        $scope.getCustomFields = function(personType) {
            Api.get('catalogs/customfield/persontype', {persontype: personType}).then(function(response){
                $scope.customfields = response.data.data;
                _.forEach($scope.customfields, function(item, index){
                    if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
                        item.values = item.values.split(',');
                    }
                    if (!$scope.CustomFields.hasOwnProperty(item.name)) {
                        $scope.CustomFields[item.name] = '';
                    }
                });
            }, function(error){});
        }
    }

    $scope.save = function() {

        $scope.$broadcast('show-errors-check-validity');

        if (!ValidateCF.validate()) { return; }
        if ($scope.frmPerson.$invalid) { return; }

        if($('input[name="date_of_birth"]').val().length > 0) {
            var dob = $('input[name="date_of_birth"]').val();
            dob = moment(dob, 'DD/MM/YYYY').valueOf();
            if (isNaN(dob) || dob <= 0) {
                $('.date_of_birth-error-message').parent().addClass('has-error').removeClass('has-success');
                $('.date_of_birth-error-message').show();
                return;
            } else {
                //dob = $('input[name="date_of_birth"]').val();
                //$scope.Person.date_of_birth = moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
                $('.date_of_birth-error-message').parent().addClass('has-success').removeClass('has-error');
                $('.date_of_birth-error-message').hide();
            }
        }

        $scope.Person.person_type_id = STUDENT;


        // add other fixed data.
        $scope.Person.country = 'El Salvador';
        $scope.Person.zipcode = '503'

        // get data from custom fields ready to be saved.
        var customvalues = [];
        _.forEach($scope.customfields, function(customfield, index) {
            if ($scope.CustomFields[customfield.name] != '') {
                customvalues.push({value: $scope.CustomFields[customfield.name], custom_field_id: customfield.id});
            }
        });
        $('.btn-save').prop('disabled',true);
        Api.put('people',{Person: $scope.Person, CustomFields: customvalues}).then(function(response){
            if (response.status == 200) {
                Messages.success('&Eacute;xito!', 'El registro del alumno ha sido guardado.');
                /*$scope.Person.date_of_birth = moment($scope.Person.date_of_birth, 'YYYY-MM-DD').format('DD/MM/YYYY');
                $scope.frmPerson.date_of_birth.$valid = true;
                $('.date_of_birth-error-message').hide();*/
            }
            $('.btn-save').prop('disabled',false);
        }, function(error){
            $('.btn-save').prop('disabled',false);
        });
    }

    $scope.selectPicture = function() {
        $('#myModalPicture').modal('show');
    }

    $scope.setPicture = function() {
        if ($scope.Picture.profileCroppedPicture.length > 0) {
            $scope.Picture.setPicture = true;
            $('#selectedImg').attr('src', $scope.Picture.profileCroppedPicture);
            $scope.Person.profile_picture = $scope.Picture.profileCroppedPicture;
        }
        $('#myModalPicture').modal('hide');
        $timeout(function() {
            $('div.modal-backdrop').remove();
        }, 1000);
    }

    var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
        $scope.$apply(function($scope){
            $scope.Picture.profilePicture = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
      $scope.Picture.pictureSet = false;
    };

    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    $scope.get();
});

angular.module('cca-client').controller('StudentRelativeCtrl', function($scope, $state, $stateParams, Api, Messages, ValidateCF){
    $scope.activeTitle = '';
    $scope.per_page = PER_PAGE;

    $scope.addNew = function() {
        $state.go('people.studentsrelativesnew',{id: $stateParams.id});
    }

    $scope.get = function() {
        var id = $stateParams.id;
        Api.get('people/' + id).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Person = data;
                $scope.activeTitle = data.firstname + ' ' + data.lastname;
            }
        }, function(error){});
        Api.get('people/' + id + '/relatives').then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Relatives = data;
                $scope.pagination = {};
            }
        }, function(error){});
        Api.get('people/' + id + '/siblings').then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Siblings = data;
            }
        }, function(error){});
    }

    $scope.openModal = function() {
        $('#myModal').modal('show');
    }

    $scope.searchStudent = function() {
        var _params = {
            page: 1,
            per_page: 5000,
            keywords: $('input[name="kw"]').val().trim()
        }
        Api.get('student', _params).then(function(response){
            $scope.siblings = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        }, function(error){});
    }

    $scope.getRelativesByStudent = function(id) {
        $('#myModal').modal('hide');
        $('.modal-backdrop').removeClass('in');
        var linkto_id = $stateParams.id;
        Api.post('people/setrelativesbystudent',{id: id, linkto_id: linkto_id}).then(function(response){
            if (response.status == 200) {
                Messages.success('&Eacute;xito!', 'Los familiares han sido agregados.');
                var data = response.data.data;
                $scope.Relatives = data;
                $scope.pagination = {};
                Api.get('people/' + $stateParams.id + '/siblings').then(function(response){
                    if (response.status == 200) {
                        var data = response.data.data;
                        $scope.Siblings = data;
                    }
                }, function(error){});
            }
        }, function(error){});
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
                        Api.delete('people/relatives/', {relationship_id: sy_ids.join(','), id: $stateParams.id, per_page: 5000}).then(function (response) {
                            $scope.Relatives = response.data.data;
                            Messages.success('&Eacute;xito!', 'Los regitro(s) han sido borrado(s)');
                        }, function (error) {
                        });
                    }
                }
            });
        }
    }

    $scope.get();
});

angular.module('cca-client').controller('StudentRelativeNewCtrl', function($scope, $state, $stateParams, Api, Messages, ValidateCF){
    $scope.types = [];
    $scope.departamentos = DEPTOS;
    $scope.CustomFields = {};
    $scope.title = 'Nuevo';

    $scope.get = function() {
        var id = $stateParams.id;
        Api.get('people/' + id).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Linkto = data;
                $scope.activeTitle = data.firstname + ' ' + data.lastname;
            }
        }, function(error){});

        Api.get('catalogs/relationshiptype', {page:1}).then(function(response){
            _.forEach(response.data.data, function(person, index){
                $scope.types.push({id:person.id, name:person.name});
            });
        },function(error){});

        Api.get('catalogs/customfield/persontype', {persontype: PARENT}).then(function(response){
            $scope.customfields = response.data.data;
            _.forEach($scope.customfields, function(item, index){
                if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
                    item.values = item.values.split(',');
                }
                $scope.CustomFields[item.name] = '';
            });
        }, function(error){});
    }

    $scope.save = function(force) {

        $scope.$broadcast('show-errors-check-validity');
        if(!ValidateCF.validate()) { return; }
        if ($scope.frmPerson.$invalid) { return; }

        $scope.Person.person_type_id = PARENT;
        if($('input[name="date_of_birth"]').val().length > 0) {
            var dob = $('input[name="date_of_birth"]').val();
            dob = moment(dob, 'DD/MM/YYYY').valueOf();
            if (isNaN(dob) || dob <= 0) {
                $('.date_of_birth-error-message').parent().addClass('has-error').removeClass('has-success');
                $('.date_of_birth-error-message').show();
                return;
            } else {
                //dob = $('input[name="date_of_birth"]').val();
                //$scope.Person.date_of_birth = moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
                $('.date_of_birth-error-message').parent().addClass('has-success').removeClass('has-error');
                $('.date_of_birth-error-message').hide();
            }
        }

        // add other fixed data.
        $scope.Person.country = 'El Salvador';
        $scope.Person.zipcode = '503'

        // get data from custom fields ready to be saved.
        var customvalues = [];
        _.forEach($scope.customfields, function(customfield, index) {
            if ($scope.CustomFields[customfield.name] != '') {
                customvalues.push({value: $scope.CustomFields[customfield.name], custom_field_id: customfield.id});
            }
        });
        var params = {Person: $scope.Person, CustomFields: customvalues, Relationship: {relationship_type_id: $scope.relationship_type_id, linkto_id: $scope.Linkto.id}}
        if (force) {
            params.ignore = 1;
        }
        Api.post('people',params).then(function(response){
            if (response.status == 200 && (response.data.hasDuplicates == null || response.data.hasDuplicates == undefined)) {
                Messages.success('&Eacute;xito!', 'El pariente ha sido registrado.');
                $state.go('people.studentsrelatives',{id: $stateParams.id});
            } else if (response.status == 200 && response.data.hasDuplicates) {
                $scope.duplicates = response.data.data;
                $('#myModal').modal('show');
            } else {
                Messages.error('Error!', 'El registro del pariente no pudo ser guardado. Por favor aseg&uacute;rese de haber ingresado todos los datos correctamente.');
            }
        }, function(error){});
    }

    $scope.addRelative = function(person) {

        Api.post('people/addrelative', {Person: {id: person}, Student: {id: $scope.Linkto.id}}).then(function(response){


            if (response.status == 200) {
                Messages.success('&Eacute;xito!', 'El pariente ha sido registrado.');
                $state.go('people.studentsrelatives',{id: $stateParams.id});
            }
        }, function(error){});
    }
    Inputmask('99/99/9999').mask('input[name="date_of_birth"]');
    $scope.get();
});

angular.module('cca-client').controller('StudentRelativeUpdateCtrl', function($scope, $state, $stateParams, Api, Messages, ValidateCF){
    $scope.types = [];
    $scope.departamentos = DEPTOS;
    $scope.CustomFields = {};
    $scope.title = 'Actualizar';

    $scope.get = function() {
        Inputmask('99/99/9999').mask('input[name="date_of_birth"]');
        var id = $stateParams.id;
        var referral_id = $stateParams.referral_id;

        Api.get('people/' + referral_id).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.getCustomFields(data.personTypeId);
                $scope.Person = {
                    id: data.id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    middlename: data.middlename,
                    gender: data.gender,
                    country: data.country,
                    zipcode: data.zipcode,
                    state: data.state,
                    city: data.city,
                    address1: data.address1,
                    address2: data.address2,
                    phone: data.phone,
                    email: data.email,
                    code: data.code
                };

                if (!isNaN(data.dateOfBirth)) {
                    if (!isNaN(data.dateOfBirth) && parseInt(data.dateOfBirth) > 0) {
                        $scope.Person.date_of_birth = moment(data.dateOfBirth).format('DD/MM/YYYY');
                        $('input[name="date_of_birth"]').val($scope.Person.date_of_birth);
                    }
                }
                _.forEach(data.customfields, function(customfield, index){
                    $scope.CustomFields[customfield.name] = customfield.value;
                    if (customfield.type == 'date') {
                        $('input[name="' + customfield.name + '"]').datepicker('update', new Date(customfield.value));
                    }
                });
                $scope.activeTitle = $scope.Person.firstname + ' ' + $scope.Person.lastname;
            }
        }, function(error){});

        Api.get('people/' + id).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Linkto = data;
                $scope.activeTitle = data.firstname + ' ' + data.lastname;
            }
        }, function(error){});

        Api.get('catalogs/relationshiptype', {page:1}).then(function(response){
            _.forEach(response.data.data, function(person, index){
                $scope.types.push({id:person.id, name:person.name});
            });
        },function(error){});

        Api.get('people/getrelationship/' + $stateParams.id +'/' + $stateParams.referral_id).then(function(response){
            if (response.status == 200) {
                $scope.relationship_type_id = response.data.data.relationship_id;
            }
        }, function(error){});
    }

    $scope.save = function() {

        $scope.$broadcast('show-errors-check-validity');
        if(!ValidateCF.validate()) { return; }
        if ($scope.frmPerson.$invalid) { return; }

        $scope.Person.person_type_id = 1;
        if($('input[name="date_of_birth"]').val().length > 0) {
            var dob = $('input[name="date_of_birth"]').val();
            dob = moment(dob, 'DD/MM/YYYY').valueOf();
            if (isNaN(dob) || dob <= 0) {
                $('.date_of_birth-error-message').parent().addClass('has-error').removeClass('has-success');
                $('.date_of_birth-error-message').show();
                return;
            } else {
                //dob = $('input[name="date_of_birth"]').val();
                //$scope.Person.date_of_birth = moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
                $('.date_of_birth-error-message').parent().addClass('has-success').removeClass('has-error');
                $('.date_of_birth-error-message').hide();
            }
        }

        // add other fixed data.
        $scope.Person.country = 'El Salvador';
        $scope.Person.zipcode = '503'

        // get data from custom fields ready to be saved.
        var customvalues = [];
        _.forEach($scope.customfields, function(customfield, index) {
            if ($scope.CustomFields[customfield.name] != '') {
                customvalues.push({value: $scope.CustomFields[customfield.name], custom_field_id: customfield.id});
            }
        });
        Api.put('people',{Person: $scope.Person, CustomFields: customvalues, Relationship: {relationship_type_id: $scope.relationship_type_id, linkto_id: $scope.Linkto.id}}).then(function(response){
            if (response.status == 200) {
                Messages.success('&Eacute;xito!', 'El registro del pariente ha sido actualizado.');
                $state.go('people.studentsrelatives',{id: $stateParams.id});
            }
        }, function(error){});
    }

    $scope.getCustomFields = function(personType) {
        Api.get('catalogs/customfield/persontype', {persontype: personType}).then(function (response) {
            $scope.customfields = response.data.data;
            _.forEach($scope.customfields, function (item, index) {
                if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
                    item.values = item.values.split(',');
                }
                if (!$scope.CustomFields.hasOwnProperty(item.name)) {
                    $scope.CustomFields[item.name] = '';
                }
            });
        }, function (error) {
        });
    }

    $scope.get();
});
angular.module('cca-client').controller('StudentEnrollmentCtrl', function($scope, $state, $stateParams, Api, Messages, ValidateCF, localStorageService){
    $scope.activeTitle = 'Matrícula';
    $scope.payment_title = '';
    $scope.parent_type_id = PARENT;
    $scope.Enrollment = {};

    $scope.get = function() {
        var id = $stateParams.id;
        Api.get('people/' + id).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Person = data;
            }
        }, function(error){});

        // get the enrollment years catalog first.
        if (localStorageService.get('enrollmentyear')) {
            $scope.enrollmentyears = localStorageService.get('enrollmentyear');
            _.forEach($scope.enrollmentyears, function(item, index){
                if (item.isActive) {
                    $scope.enrollment_year_id = item.id;
                }
            });
            $scope.Enrollment.enrollment_year_id = $scope.enrollment_year_id;
            $scope.loadEnrollment();
        }

        // get the sections
        if (localStorageService.get('section')) {
            $scope.sections = localStorageService.get('section');
        } else {
            Api.get('catalogs/section',{per_page: 5000}).then(function(response){
                $scope.sections = response.data.data;
            }, function(error){})
        }
        // get the grades.
        if (localStorageService.get('year')) {
            $scope.years = localStorageService.get('year');
        } else {
            Api.get('catalogs/year', {per_page: 5000}).then(function(response){
                $scope.years = response.data.data;
            }, function(error){});
        }
        // get the enrollment year
        if (localStorageService.get('enrollmnetyear')) {
            $scope.enrollmentyears = localStorageService.get('enrollmentyear');
        } else {
            Api.get('catalogs/enrollmentyear', {per_page: 5000}).then(function(response){
                $scope.enrollmentyears = response.data.data;
            }, function(error){});
        }
        // get the relatives.
        Api.get('people/' + id + '/relatives').then(function(response){
            if (response.status == 200) {
                $scope.relatives = [];
                _.forEach(response.data.data, function(item, index){
                    if (item.personTypeId == PARENT) {
                        $scope.relatives.push({
                            id: item.id,
                            name: item.firstname + ' ' + item.lastname + ' (' + item.relationship_name + ')'
                        });
                    }
                });
            }
        }, function(error){});
    }

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmEnrollment.$invalid) { return; }

        $scope.Enrollment.student_id = parseInt($stateParams.id);
        $scope.Enrollment.date_of_enrollment = moment($scope.Enrollment.date_of_enrollment, 'DD-MM-YYYY').format('YYYY-MM-DD');
        $scope.Enrollment.parent_id = parseInt($scope.Enrollment.parent_id);
        if (isNaN($scope.Enrollment.id)) {
            Api.post('enrollment',{Enrollment: $scope.Enrollment}).then(function(response){
                if (response.status == 200) {
                    Messages.success('&Eacute;xito!', 'La matr&iacute;cula ha sido registrada.');
                    $state.go('people.studentspayment',{id: $stateParams.id});
                }
            }, function(error){});
        } else {
            Api.put('enrollment',{Enrollment: $scope.Enrollment}).then(function(response){
                $scope.Enrollment.date_of_enrollment = moment($scope.Enrollment.date_of_enrollment, 'YYYY-MM-DD').format('DD-MM-YYYY');
                if (response.status == 200) {
                    Messages.success('&Eacute;xito!', 'El registro de la matr&iacute;cula ha sido guardado.');
                }
            }, function(error){});
        }
    }

    $scope.loadEnrollment = function() {
        var id = $stateParams.id;
        var enrollment_id = $scope.Enrollment.enrollment_year_id;
        if (!isNaN(enrollment_id)) {
            Api.get('enrollment/' + enrollment_id + '/' + id).then(function(response){
                if (response.status == 200) {
                    var data = response.data.data;
                    $scope.Enrollment.id = data.id;
                    $scope.Enrollment.talonario = data.talonario;
                    $scope.Enrollment.date_of_enrollment = moment(data.date_of_enrollment).format('DD-MM-YYYY');
                    $scope.Enrollment.student_id = data.student_id;
                    $scope.Enrollment.parent_id = data.parent_id;
                    $scope.Enrollment.enrollment_year_id = data.enrollment_year_id;
                    $scope.Enrollment.section_id = data.section_id;
                    $scope.Enrollment.year_id = data.year_id;
                } else {
                    $scope.Enrollment = {};
                    $scope.Enrollment.enrollment_year_id = enrollment_id;
                }
                if ($scope.Enrollment.date_of_enrollment == null || $scope.Enrollment.date_of_enrollment == '') {
                    // set the enrollment date as today.
                    $scope.Enrollment.date_of_enrollment = moment().format('DD-MM-YYYY');
                    $('input[name="date_of_enrollment"]').val($scope.Enrollment.date_of_enrollment);
                }
            }, function(error){});
        }
    }

    $scope.get();
});
angular.module('cca-client').controller('PaymentControlCtrl', function($scope, $state, $stateParams, $filter, Api, Messages, ValidateCF, localStorageService){

    $scope.Payment = {};
    $scope.frmPayment = {};
    $scope.dateofpayment = moment().format('DD-MM-YYYY');
    $scope.lastpaymentdate = moment().format('DD-MM-YYYY');
    $scope.paymenttypes = localStorageService.get('paymenttype');
    $scope.studentcode = null;
    $scope.penalty = null;
    $scope.csv = {
        content: null,
        header: true,
        separator: ',',
        encoding: 'utf-8',
        result: null,
        accept: '.csv,.txt',
        callback: function() {
            Api.post('payments/csv',{csv: $scope.csv.result}).then(function(response) {
                if (response.status == 200) {
                    var data = response.data.data;
                    $scope.renderResults(data);
                    $('input[name="kw"]').val('');
                }
            }, function(error) {});
        }
    };

    $scope.enterSearch = function(e) {
        if (e.keyCode == 13) {
            $scope.search();
        }
    }

    $scope.cgSearch = function() {
        var kw = $('input[name="kw"]').val().trim();
        if (kw.length == 58 || kw.length == 34) {
            $scope.search();
        }
    }

    $scope.search = function() {
        // count npe or code.
        var kw = $('input[name="kw"]').val().trim();

        if (kw.length == 58 && !isNaN(kw)) { // get the student code and last valid payment date. also ask for the payment date.
            $scope.studentcode = kw.substring(44, 54);
            $scope.lastpaymentdate = kw.substring(32, 40);
            $scope.penalty = kw.substring(56, 58);
            $scope.npe = true;
        }
        if (kw.length == 34 && !isNaN(kw)) { // it is a NPE and just number.
            $scope.studentcode = kw.substring(19, 29);
            $scope.lastpaymentdate = kw.substring(10, 18);
            $scope.penalty = kw.substring(31, 33);
            $scope.npe = true;
        }
        if ($scope.npe) {
            $scope.penalty = parseFloat($scope.penalty.substring(0,1) + '.' + $scope.penalty.substring(1,2));
            var lastpaymentdate = $scope.lastpaymentdate.substring(0,4) + '-' + $scope.lastpaymentdate.substring(4,6) + '-' + $scope.lastpaymentdate.substring(6,8);
            $scope.dateofpayment = $scope.lastpaymentdate.substring(6,8) + '-' + $scope.lastpaymentdate.substring(4,6) + '-' + $scope.lastpaymentdate.substring(0,4);
            $scope.lastpaymentdate = lastpaymentdate;
            $('.datepicker').datepicker('update', $scope.dateofpayment);
        }
        var params = {
            keywords: $('input[name="kw"]').val().trim()
        }
        $('.panel').hide();
        if (!$scope.npe) {
            Api.get('people/getforpayment',params).then(function(response){
                var data = response.data.data;
                if (data.length == 1) {
                    // go to payments.
                    $state.go('people.studentspayment', {id: data[0].id});
                } else {
                    $('.panel, .panel h3').show();
                    $('.panel table').hide();
                }
            }, function(error){});
        } else {
            $('#dateOfPaymentModal').modal('show');
        }
    }

    $scope.processPayment = function() {
        
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmPayment.$invalid) { return; }

        $('#dateOfPaymentModal').modal('hide');
        var dop = $('.datepicker').val().split('-');
        dop = dop[2] + '-' + dop[1] + '-' + dop[0];
        var params = {
            dateofpayment: dop,
            lastpaymentdate: $scope.lastpaymentdate,
            penalty: $scope.penalty,
            studentcode: $scope.studentcode,
            payment_type_id: $scope.Payment.payment_type_id
        }
        Api.post('payments/npe',params).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.renderResults(data);
                $('input[name="kw"]').val('');
            }
        }, function(error){});
    }

    $scope.renderResults = function(data) {
        if (data.length > 0) {
            var body = $('table tbody');
            $('table tbody').empty();
            _.forEach(data, function(item, index){
                var year = '<td>' + item.yearName + '</td>';
                var student = '<td><a href="/#/people/students/' + item.id + '/payments" title="Verificar pagos">' + item.lastname + ', ' + item.firstname + '</a></td>';
                var concepto = '<td>' + item.concepto + '</td>';
                var payed =  '<td align="right">' + $filter('currency')(item.payed, '$ ', 2) + '</td>';
                var penalty =  '<td align="right">' + $filter('currency')(item.penalty, '$ ', 2) + '</td>';
                var dateOfPayment = '<td align="center">' + item.payment_date + '</td>';
                body.append('<tr>' + year + student + concepto + payed + penalty + dateOfPayment + '</tr>');
            });
            $('.panel h3').hide();
            $('.panel, .panel table').show();
        } else {
            $('.panel, .panel h3').show();
            $('.panel table').hide();
        }
    }

});
