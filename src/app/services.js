/**
 * Created by david on 3/22/16.
 */
'use strict';
app.service('ApiInterceptor', function($window){
    var service = this;

    service.responseError = function(response) {
        if (response.status === 401) {
            var appMessage = $('#appMessage');
            if (appMessage) {
                appMessage.empty().append('<div class="alert alert-danger" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '<strong><i class="fa fa-warning"></i></strong> ' +
                    'Su identidad no pudo ser verificada.' +
                    '</div>');
            }
        }
        if (response.status === 400) {
            var appMessage = $('#appMessage');
            if (appMessage) {
                appMessage.empty().append('<div class="alert alert-danger" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '<strong><i class="fa fa-warning"></i></strong> ' +
                    response.data.data.message +
                    '</div>');
            }
        }
        /*if (response.status == 404) {
            swal({
                title: '404',
                text: 'P&aacute;gina no encontrada.',
                showCancelButton: false,
                confirmButtonColor: '#1ab394',
                confirmButtonText: 'Aceptar',
                closeOnConfirm: true,
                html: true
            });
            $window.history.back(-1);
        }*/
        return response;
    }
}).service('Messages', function(){
    var service = this;
    service.success = function(header, message) {
        swal({
            title: header,
            text: message,
            type: "success",
            html: true
        });
    }
    service.error = function(header, message) {
        swal({
            title: header,
            text: message,
            type: "error",
            html: true
        });
    }
    service.info = function(header, message) {
        swal({
            title: header,
            text: message,
            type: "info",
            html: true
        });
    }
    service.confirm = function(header, message) {
        return {
            title: header,
            text: message,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            closeOnConfirm: false,
            closeOnCancel: true,
            html: true
        }
    }
}).factory('Flash', function($rootScope){
    var queue = [];
    var currentMessage = "";
    $rootScope.$on('$viewContentLoaded', function(event) {
        currentMessage = queue.shift() || "";
        if (currentMessage) {
            var appMessage = $('#appMessage');
            if (appMessage) {
                appMessage.empty().append('<div class="alert alert-success" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '<strong>&Eacute;xito! </strong> ' +
                    currentMessage +
                    '</div>');
            }
        }
    });

    return {
        setMessage: function(message) {
            queue.push(message);
        },
        getMessage: function() {
            return currentMessage;
        }
    }
}).factory('ValidateCF', function(){
    return {
        validate: function() {
            var valid = true;
            var elements = $('.customfield-group input, .customfield-group select, .customfield-group textarea');
            $.each(elements, function(index, item){
                var item = $(item);
                item.parent().parent();
                if (item.prop('required')) {
                    if (item.prop('type') == 'text' || item.prop('type') == 'number' || item.prop('type') == 'tel') {
                        if (item.val().trim().length == 0) {
                            item.parent().parent().addClass('has-error');
                            valid = false;
                        } else item.parent().parent().removeClass('has-error').addClass('has-success');
                    }
                    if (item.prop('type') == 'email') {
                        if (validator.isEmail(item.val())) {
                            item.parent().parent().addClass('has-error');
                            valid = false;
                        } else item.parent().parent().removeClass('has-error').addClass('has-success');
                    }
                    if (item.prop('type') == 'url') {
                        if (validator.isURL(item.val())) {
                            item.parent().parent().addClass('has-error');
                            valid = false;
                        } else item.parent().parent().removeClass('has-error').addClass('has-success');
                    }
                }
            });
            return valid;
        }
    }
}).factory('Auth', function(localStorageService, $state) {
    return {
        run: function(state, event) {
            var access_token = localStorageService.get('access_token');
            var expires = localStorageService.get('access_token_expires');
            var modules = localStorageService.get('currentuser').access;
            if (access_token == null || expires == null) {
                event.preventDefault();
                $state.go('login');
            }
            if (expires != null) {
                // check if the access token is expired.
                if (expires <= moment().unix()) {
                    event.preventDefault();
                    $state.go('login');
                }
            }
            var module = parseInt(state.module);
            if (module > 0) {
                if (_.find(modules, {'id': module}) == undefined) {
                    event.preventDefault();
                }
            }
        },
        check: function() {
            var access_token = localStorageService.get('access_token');
            var expires = localStorageService.get('access_token_expires');
            // check if no access token.
            if (access_token == null || expires == null) {
                $state.go('login');
            }
            // check if access token is expired.
            if (expires <= moment().unix()) {
                localStorageService.remove('access_token','access_token_expires');
                $state.go('login');
            }
        }
    }
}).factory('CatalogsAll', function(Api, localStorageService){
    return {
        get: function() {
            // get the catalogs and add them to the local storage.
            Api.get('catalogs/all').then(function(response){
                var catalogs = response.data.data;
                localStorageService.set('module',catalogs.module.data);
                localStorageService.set('rol',catalogs.rol.data);
                localStorageService.set('relationshiptype',catalogs.relationshiptype.data);
                localStorageService.set('persontype',catalogs.persontype.data);
                localStorageService.set('customfields',catalogs.customfields.data);
                localStorageService.set('year',catalogs.year.data);
                localStorageService.set('section',catalogs.section.data);
                localStorageService.set('subject',catalogs.subject.data);
                localStorageService.set('enrollmentyear',catalogs.enrollmentyear.data);
            }, function(error){});
        }
    }
})/*.service('DataParser', function(){
    var service = this;
    service.chart = function(data, columns, grouping) {

    }
})*/;
