/**
 * Created by david on 5/9/16.
 */
angular.module('cca-client').controller('UserCtrl', function($scope, $state, $stateParams, Api, Messages) {
    $scope.data = {};
    $scope.pagination = {};
    $scope.per_page = PER_PAGE;

    $scope.get = function(page) {
        var _params = {
            page: page,
            keywords: $('#keywords').val().trim(),
        }
        Api.get('users', _params).then(function(response){
            $scope.data = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        }, function(error){});
    }

    // search with year and keywords filter
    $scope.search = function() {
        $scope.get(1);
    }

    $scope.addNew = function() {
        $state.go('people.usersnew');
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
                        var params = {
                            id: sy_ids.join(','),
                            keywords: $('#keywords').val().trim()
                        }
                        Api.delete('users/', params).then(function (response) {
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

    $scope.get(1);
});

angular.module('cca-client').controller('UserNewCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService, ValidateCF, $timeout) {
    $scope.activeTitle = 'Nuevo';
    $scope.departamentos = DEPTOS;
    $scope.Person = {};
    $scope.User = {};
    $scope.CustomFields = {};
    $scope.createuser = 0;
    $scope.invalid_rol = 0;
    $scope.invalid_pass = 0;
    $scope.Picture = {profilePicture: '', profileCroppedPicture: '', pictureSet: false};
    $scope.profilePicturePlaceholder = 'http://placehold.it/450x450/f1f1f1f1/55555?text=FOTO';
    $scope.photoLabel = 'Agregar foto de perfil';

    $scope.roles = localStorageService.get('rol');
    $scope.persontypes = localStorageService.get('persontype');
    _.remove($scope.persontypes, function(o){ return o.id == 5 || o.id == 1;});

    $scope.getCustomFields = function() {
        var personType = $scope.Person.person_type_id;
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

    $scope.save = function(force) {

        $scope.$broadcast('show-errors-check-validity');

        if ($scope.frmPerson.date_of_birth.$error.date) {return;}
        if(!ValidateCF.validate()) { return; }
        if ($scope.frmPerson.$invalid) { return; }

        if ($scope.validateUser() == false) {
            return;
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
        var params = {Person: $scope.Person, CustomFields: customvalues};

        if($('input[name="date_of_birth"]').val().length > 0) {
            var dob = $('input[name="date_of_birth"]').val();
            dob = moment(dob, 'DD/MM/YYYY').valueOf();
            if (isNaN(dob)) {
                $('.date_of_birth-error-message').parent().addClass('has-error').removeClass('has-success');
                $('.date_of_birth-error-message').show();
                return;
            } else {
                dob = $('input[name="date_of_birth"]').val();
                $scope.Person.date_of_birth = moment(dob, 'DD/MM/YYYY').format('DD/MM/YYYY');
                $('.date_of_birth-error-message').parent().addClass('has-success').removeClass('has-error');
                $('.date_of_birth-error-message').hide();
            }
        }

        if (force) {
            params.ignore = 1;
        }
        $('#myModal').modal('hide');
        $('.modal-backdrop').remove();

        $('.btn-save').prop('disabled',true);
        Api.post('people',params).then(function(response){
            $('#myModal').modal('hide');
            $('.modal-backdrop').remove();
            if (response.status == 200 && (response.data.hasDuplicates == null || response.data.hasDuplicates == undefined)) {
                var data = response.data.data;
                // insert user.
                if ($scope.createuser) {
                    Api.post('users',{User: $scope.User, Person: data}).then(function(response){
                        Messages.success('&Eacute;xito!', 'El nuevo usuario ha sido registrado.');
                        $state.go('people.users');
                    }, function(error){});
                } else {
                    Messages.success('&Eacute;xito!', 'El nuevo usuario ha sido registrado.');
                    $state.go('people.users');
                }
            } else if (response.status == 200 && response.data.hasDuplicates) {
                $scope.duplicates = response.data.data;
                $('#myModal').modal('show');
                $('.btn-save').prop('disabled',false);
            } else {
                Messages.error('Error!', 'El nuevo usuario no pudo ser guardado. Por favor aseg&uacute;rese de haber ingresado todos los datos correctamente.');
                $scope.frmPerson.date_of_birth.$valid = true;
                $('.date_of_birth-error-message').hide();
                $('.btn-save').prop('disabled',false);
            }
        }, function(error){});
    }

    $scope.validateUser = function() {
        // validate if creation of user has been requested.
        if ($scope.createuser == 1) {
            if ($('input[name="email"]').val().length == 0) {
                Messages.error('Error!', 'El campo de correo electrónico es obligatorio para crear un usuario con acceso al sistema.');
                return false;
            }
            var showerror = false;
            if ($scope.User.rol_id == undefined) {
                // add class.
                $('select[name="rol_id"]').parent().addClass('has-error');
                $scope.invalid_rol = 1;
                showerror = true;
            }
            if ($scope.User.password != undefined && $scope.User.password2 != undefined) {
                // add class.
                if ($scope.User.password != $scope.User.password2) {
                    $('input[name="password"]').parent().addClass('has-error');
                    $('input[name="password2"]').parent().addClass('has-error');
                    $scope.invalid_pass = 1;
                    showerror = true;
                }
            } else {
                $('input[name="password"]').parent().addClass('has-error');
                $('input[name="password2"]').parent().addClass('has-error');
                $scope.invalid_pass = 1;
                showerror = true;
            }
            if (showerror) {
                return false;
            }
        }
    }

    $scope.validateRol = function() {
        if ($scope.createuser == 1) {
            if ($scope.User.rol_id == undefined) {
                // add class.
                $('select[name="rol_id"]').parent().addClass('has-error').removeClass('has-success');
                $scope.invalid_rol = 1;
            }
            if ($scope.User.rol_id != undefined) {
                $('select[name="rol_id"]').parent().removeClass('has-error').addClass('has-success');
                $scope.invalid_rol = 0;
            }
        }
    }

    $scope.validatePass = function() {
        if ($scope.createuser == 1) {
            if ($scope.User.password != undefined && $scope.User.password2 != undefined) {
                // add class.
                if ($scope.User.password != $scope.User.password2) {
                    $('input[name="password"]').parent().addClass('has-error').removeClass('has-success');
                    $('input[name="password2"]').parent().addClass('has-error').removeClass('has-success');
                    $scope.invalid_pass = 1;
                } else {
                    $('input[name="password"]').parent().addClass('has-success').removeClass('has-error');
                    $('input[name="password2"]').parent().addClass('has-success').removeClass('has-error');
                    $scope.invalid_pass = 0;
                }
            } else {
                $('input[name="password"]').parent().addClass('has-error').removeClass('has-success');
                $('input[name="password2"]').parent().addClass('has-error').removeClass('has-success');
                $scope.invalid_pass = 1;
            }
        }
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

});

angular.module('cca-client').controller('UserUpdateCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService, ValidateCF, $timeout) {
    $scope.activeTitle = 'Actualizar';
    $scope.departamentos = DEPTOS;
    $scope.Person = {};
    $scope.User = {};
    $scope.CustomFields = {};
    $scope.createuser = 0;
    $scope.invalid_rol = 0;
    $scope.invalid_pass = 0;
    $scope.cf_values = {};
    $scope.Picture = {profilePicture: '', profileCroppedPicture: '', pictureSet: false};
    $scope.profilePicturePlaceholder = 'http://placehold.it/450x450/f1f1f1f1/55555?text=FOTO';
    $scope.photoLabel = 'Cambiar foto de perfil';

    $scope.getCustomFields = function() {
        var personType = $scope.Person.person_type_id;
        Api.get('catalogs/customfield/persontype', {persontype: personType}).then(function(response){
            $scope.customfields = response.data.data;
            _.forEach($scope.customfields, function(item, index){
                if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
                    item.values = item.values.split(',');
                }
                $scope.CustomFields[item.name] = '';
            });
            $scope.setCfValues();
        }, function(error){});
    }

    $scope.validateUser = function() {
        // validate if creation of user has been requested.
        if ($scope.createuser == 1) {
            if ($('input[name="email"]').val().length == 0) {
                Messages.error('Error!', 'El campo de correo electrónico es obligatorio para crear un usuario con acceso al sistema.');
                return false;
            }
            var showerror = false;
            if ($scope.User.rol_id == undefined) {
                // add class.
                $('select[name="rol_id"]').parent().addClass('has-error');
                $scope.invalid_rol = 1;
                showerror = true;
            }
            if ($scope.User.password != undefined && $scope.User.password2 != undefined) {
                // add class.
                if ($scope.User.password != $scope.User.password2) {
                    $('input[name="password"]').parent().addClass('has-error');
                    $('input[name="password2"]').parent().addClass('has-error');
                    $scope.invalid_pass = 1;
                    showerror = true;
                }
            } else {
                $('input[name="password"]').parent().addClass('has-error');
                $('input[name="password2"]').parent().addClass('has-error');
                $scope.invalid_pass = 1;
                showerror = true;
            }
            if (showerror) {
                return false;
            }
        }
    }

    $scope.validateRol = function() {
        if ($scope.createuser == 1) {
            if ($scope.User.rol_id == undefined) {
                // add class.
                $('select[name="rol_id"]').parent().addClass('has-error').removeClass('has-success');
                $scope.invalid_rol = 1;
            }
            if ($scope.User.rol_id != undefined) {
                $('select[name="rol_id"]').parent().removeClass('has-error').addClass('has-success');
                $scope.invalid_rol = 0;
            }
        }
    }

    $scope.validatePass = function() {
        if ($scope.createuser == 1) {
            if ($scope.User.password != undefined && $scope.User.password2 != undefined) {
                // add class.
                if ($scope.User.password != $scope.User.password2) {
                    $('input[name="password"]').parent().addClass('has-error').removeClass('has-success');
                    $('input[name="password2"]').parent().addClass('has-error').removeClass('has-success');
                    $scope.invalid_pass = 1;
                } else {
                    $('input[name="password"]').parent().addClass('has-success').removeClass('has-error');
                    $('input[name="password2"]').parent().addClass('has-success').removeClass('has-error');
                    $scope.invalid_pass = 0;
                }
            } else {
                $('input[name="password"]').parent().addClass('has-error').removeClass('has-success');
                $('input[name="password2"]').parent().addClass('has-error').removeClass('has-success');
                $scope.invalid_pass = 1;
            }
        }
    }

    $scope.save = function(force) {

        $scope.$broadcast('show-errors-check-validity');
        if(!ValidateCF.validate()) { return; }
        if ($scope.frmPerson.$invalid) { return; }

        if ($scope.validateUser() == false) {
            return;
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
        var params = {Person: $scope.Person, CustomFields: customvalues};

        if($('input[name="date_of_birth"]').val().length > 0) {
            var dob = $('input[name="date_of_birth"]').val();
            dob = moment(dob, 'DD/MM/YYYY').valueOf();
            if (isNaN(dob)) {
                $('.date_of_birth-error-message').parent().addClass('has-error').removeClass('has-success');
                $('.date_of_birth-error-message').show();
                return;
            } else {
                dob = $('input[name="date_of_birth"]').val();
                $scope.Person.date_of_birth = moment(dob, 'DD/MM/YYYY').format('DD/MM/YYYY');
                $('.date_of_birth-error-message').parent().addClass('has-success').removeClass('has-error');
                $('.date_of_birth-error-message').hide();
            }
        }

        $('.btn-save').prop('disabled',true);
        Api.put('people',params).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                // insert user.
                if ($scope.createuser) {
                    Api.post('users',{User: $scope.User, Person: data}).then(function(response){
                        Messages.success('&Eacute;xito!', 'El usuario ha sido actualizado.');
                        $state.go('people.users');
                        $('.btn-save').prop('disabled',false);
                    }, function(error){});
                } else {
                    Messages.success('&Eacute;xito!', 'El usuario ha sido actualizado.');
                    $state.go('people.users');
                }
            }
        }, function(error){
            $('.btn-save').prop('disabled',false);
        });
    }

    $scope.get = function() {
        Inputmask('99/99/9999').mask('input[name="date_of_birth"]');

        var id = $stateParams.id;
        Api.get('users/' + id).then(function(response){
            var data = response.data.data;
            $scope.Person = {
                id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
                middlename: data.middlename,
                date_of_birth: moment(data.dateOfBirth).format('DD-MM-YYYY'),
                gender: data.gender,
                country: data.country,
                zipcode: data.zipcode,
                state: data.state,
                city: data.city,
                address1: data.address1,
                address2: data.address2,
                phone: data.phone,
                email: data.email,
                person_type_id: data.personTypeId
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
            $scope.getCustomFields();
            $scope.cf_values = data.customfields;
            if (data.rolId) {
                $scope.User.rol_id = data.rolId;
            }
            // ---------------
            $scope.roles = localStorageService.get('rol');
            $scope.persontypes = localStorageService.get('persontype');
            _.remove($scope.persontypes, function(o){ return o.id == 5 || o.id == 1;});
            $timeout(function() {
                Inputmask("99/99/9999").mask("input[input-type='date']")
            }, 1500);
        }, function(error){});
    }

    $scope.setCfValues = function()
    {
        _.forEach($scope.cf_values, function(customfield, index){
            if (customfield.type == 'number') {
                $scope.CustomFields[customfield.name] = Number(customfield.value);    
            } else {
                $scope.CustomFields[customfield.name] = customfield.value;
            }
            if (customfield.type == 'date') {
                Inputmask(customfield.pattern).mask('input[name="' + customfield.name + '"]');
            }

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
