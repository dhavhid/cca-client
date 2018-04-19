'use strict';

//Directive used to set metisMenu and minimalize button
app.directive('sideNavigation', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                // Call metsi to build when user signup
                scope.$watch('authentication.user', function() {
                    $timeout(function() {
                        element.metisMenu();
                    });
                });

            }
        };
    })
    .directive('minimalizaSidebar', function ($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope, $element) {
                $scope.minimalize = function () {
                    angular.element('body').toggleClass('mini-navbar');
                    if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        angular.element('#side-menu').hide();
                        // For smoothly turn on menu
                        $timeout(function () {
                            angular.element('#side-menu').fadeIn(400);
                        }, 200);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        angular.element('#side-menu').removeAttr('style');
                    }
                };
            }
        };
    })
    .directive('actionButtons', function(){
        return {
            restrict: 'AE',
            template: '<div class="row"> <div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 visible-xs"> <div class="btn-group" role="group"> <button type="button" class="btn btn-primary" ng-click="addNew();"><i class="fa fa-plus"></i></button> <button type="button" class="btn btn-default" ng-click="toPrint();"><i class="fa fa-print"></i></button> <button type="button" class="btn btn-default" ng-click="toTrash();"><i class="fa fa-trash"></i></button> </div></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 hidden-xs"> <div class="btn-group" role="group"> <button type="button" class="btn btn-primary" ng-click="addNew();"><i class="fa fa-plus"></i> Nuevo</button> <button type="button" class="btn btn-default" ng-click="toPrint();"><i class="fa fa-print"></i> Imprimir</button> <button type="button" class="btn btn-default" ng-click="toTrash();"><i class="fa fa-trash"></i> Eliminar</button> </div></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-8"> <form> <div class="input-group"> <input type="text" name="keywords" id="keywords" class="form-control" value="" placeholder="buscar..."> <div class="input-group-btn"> <button class="btn btn-default hidden-xs" ng-click="search();">Buscar</button> <button class="btn btn-default visible-xs" ng-click="search();"><i class="fa fa-search"></i></button> </div></div></form> </div></div><br/>'
        }
    })
    .directive('appMessage', function(){
        return {
            restrict: 'A',
            template: '<div class="row"><div class="col-md-12" id="appMessage"></div></div>'
        }
    })
    .directive('appForminfo', function(){
        return {
            restrict: 'A',
            template: '<div class="row"><div class="col-md-12">' +
            '<div class="alert alert-info">' +
            '<strong>Instrucciones: </strong>' +
            ' Por favor complete el siguiente formulario. Todos los campos marcados con <font color="red">*</font> son obligatorios.' +
            '</div></div></div>'
        }
    })
    .directive('checkAll', function(){
        return {
            restrict: 'AE',
            template: '<input type="checkbox" id="check-all" value="1">',
            link: function(scope, element, attrs, controller, transcludeFn) {
                angular.element('#check-all').on('click', function() {
                    if (this.checked) {
                        $('input.chk').map(function() {
                            this.checked = true;
                        });
                    } else {
                        $('input.chk').map(function() {
                            this.checked = false;
                        });
                    }
                });
            }
        }
    })
    .directive('transformCustomFieldType', function(){
        return {
            restrict: 'E',
            template: '<div> <span ng-if="value==\'textarea\'">Texto Largo</span> <span ng-if="value==\'text\'">Texto</span> <span ng-if="value==\'wysiwyg\'">Editor HTML</span> <span ng-if="value==\'number\'">N&uacute;mero</span> <span ng-if="value==\'tel\'">Tel&eacute;fono</span> <span ng-if="value==\'date\'">Fecha</span> <span ng-if="value==\'time\'">Hora</span> <span ng-if="value==\'datetime\'">Fecha y Hora</span> <span ng-if="value==\'email\'">E-Mail</span> <span ng-if="value==\'url\'">Url</span> <span ng-if="value==\'select\'">Lista</span> <span ng-if="value==\'checkbox\'">M&uacute;ltiple Selecci&oacute;n</span> <span ng-if="value==\'radio\'">Selecci&oacute;n Simple</span></div>',
            replace: true,
            scope: {
                value: '@'
            }
        }
    })
    .directive('multiplePersonType', function(){
        return {
            restrict: 'E',
            template: '<div class="form-group"> <div class="col-sm-3 control-label"> <label> Por favor seleccione los tipos de personas a los que desea agregar el campo personalizado <span>*</span><br/> <small class="text-navy">Por favor seleccione por lo menos 1 opci&oacute;n</small> </label> </div><div class="col-sm-9"> <div class="checkbox" ng-repeat="person in personType"> <label> <input type="checkbox" class="person-type" name="{{name}}" value="{{person.id}}" ng-checked="value.indexOf(person.id) > -1">{{person.name}}</label> </div></div></div>',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                personType: '='
            }
        }
    })
    .directive('singlePersonType', function(){
        return {
            restrict: 'E',
            template: '<div class="form-group"> <div class="col-sm-3 control-label"> <label> Por favor seleccione los tipos de personas a los que desea agregar el campo personalizado <span>*</span><br/> <small class="text-navy">Por favor seleccione por lo menos 1 opci&oacute;n</small> </label> </div><div class="col-sm-9"> <div class="radio" ng-repeat="person in personType"> <label> <input type="radio" class="person-type" name="{{name}}" value="{{person.id}}" ng-checked="value.indexOf(person.id) > -1">{{person.name}}</label> </div></div></div>',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                personType: '='
            }
        }
    })
    .directive('inputText', function(){
        return {
            restrict: 'E',
            template: '<input type="text" name="{{ name }}" value="{{ value }}" class="form-control">',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                required: '@',
                format: '@'
            },
            link: function(scope, element, attrs) {
                if (scope.format != undefined) {
                    if (scope.format.length > 0) {
                        Inputmask(scope.format).mask($(element));
                    }
                }
            }
        }
    })
    .directive('inputTextLong', function(){
        return {
            restrict: 'E',
            template: '<textarea type="text" name="{{ name }}" class="form-control" rows="6">{{ value }}</textarea>',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                required: '@'
            }
        }
    })
    .directive('inputNumber', function(){
        return {
            restrict: 'E',
            template: '<input type="number" min="{{ min }}" max="{{ max }}" name="{{ name }}" value="{{ value }}" class="form-control">',
            replace: true,
            scope: {
                name: '@',
                min: '@',
                max: '@',
                value: '=ngModel',
                required: '@'
            },
            link: function(scope, element, attrs) {
                element.on('keydown', function(event){
                    return ( event.ctrlKey || event.altKey
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9)
                    || (event.keyCode>34 && event.keyCode<40)
                    || (event.keyCode==46) );
                });
            }
        }
    })
    .directive('inputFloat', function(){
        return {
            restrict: 'E',
            template: '<input type="number" min="{{ min }}" max="{{ max }}" name="{{ name }}" value="{{ value }}" class="form-control">',
            replace: true,
            scope: {
                name: '@',
                min: '@',
                max: '@',
                value: '=ngModel',
                required: '@'
            },
            link: function(scope, element, attrs) {
                element.on('keydown', function(event){
                    return ( event.ctrlKey || event.altKey || (event.keyCode == 190 && element.val().indexOf('.') == -1)
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9)
                    || (event.keyCode>34 && event.keyCode<40)
                    || (event.keyCode==46) );
                });
            }
        }
    })
    .directive('inputPhone', function(){
        return {
            restrict: 'E',
            template: '<input type="tel" name="{{ name }}" value="{{ value }}" class="form-control">',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                required: '@'
            },
            link: function(scope, element, attrs) {
                Inputmask("9999-9999").mask('input[type="tel"]');
            }
        }
    })
    .directive('inputDate', function(){
        return {
            restrict: 'E',
            template: '<div class="input-group"><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span><input type="text" name="{{ name }}" value="{{ value }}" class="form-control datepicker" readonly></div>',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                required: '@'
            },
            link: function(scope, element, attrs) {
                $('.datepicker').datepicker({
                    format: 'dd-mm-yyyy',
                    autoclose: true,
                    language: 'es'
                });
            }
        }
    })
    .directive('inputDateText', function(){
        return {
            restrict: 'E',
            template: '<div class="input-group"><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span><input type="datetext" name="{{ name }}" value="{{ value }}" class="form-control" placeholder="dd/mm/aaaa"></div>',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                required: '@'
            },
            link: function(scope, element, attrs) {
                Inputmask("99/99/9999").mask('input[type="datetext"]');
            }
        }
    })
    .directive('inputEmail', function(){
        return {
            restrict: 'E',
            template: '<input type="email" name="{{ name }}" value="{{ value }}" class="form-control">',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                required: '@'
            }
        }
    })
    .directive('inputUrl', function(){
        return {
            restrict: 'E',
            template: '<input type="url" name="{{ name }}" value="{{ value }}" class="form-control">',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                required: '@'
            }
        }
    })
    .directive('inputList', function(){
        return {
            restrict: 'E',
            template: '<select name="{{ name }}" class="form-control"><option ng-repeat="option in options" value="{{ option }}">{{ option }}</option></select>',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                required: '@',
                options: '='
            }
        }
    })
    .directive('inputMultipleOptions', function(){
        return {
            restrict: 'E',
            template: '<div class="checkbox" ng-repeat="option in options"> <label> <input type="checkbox" value="{{option}}" ng-checked="value.indexOf(option) > -1">{{option}}</label></div>',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                options: '='
            }
        }
    })
    .directive('inputSingleOption', function(){
        return {
            restrict: 'E',
            template: '<div class="radio" ng-repeat="option in options"> <label> <input type="radio" value="{{option}}" ng-checked="value.indexOf(option) > -1">{{option}}</label></div>',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                options: '='
            }
        }
    })
    .directive('inputSlug', function(){
        return {
            restrict: 'E',
            template: '<input type="text" value="{{ value }}" class="form-control">',
            replace: true,
            scope: {
                name: '@',
                value: '=ngModel',
                required: '@'
            },
            link: function(scope, element, attrs) {
                element.on('keydown', function(event){
                    return (event.keyCode >= 65 && event.keyCode <= 90 && event.shiftKey==false) // lower case chars
                        || (event.keyCode >= 48 && event.keyCode <= 57 && event.shiftKey==false) // digits
                        || (event.keyCode >= 96 && event.keyCode <= 105 && event.shiftKey==false) // num lock digits
                        || event.keyCode == 37 || event.keyCode == 39 // arrows
                        || event.keyCode == 8 || event.keyCode == 109 || event.keyCode == 45 || event.keyCode == 173 || event.keyCode == 9; // backspace, num lock dash, dash
                });
                element.on('keyup', function(event){
                    element.val(element.val().toLowerCase());
                });
            }
        }
    })
    .directive('datePicker', function(){
        return {
            restrict: 'A',
            template: '',
            replace: false,
            link: function(scope, element, attrs) {
                $('.datepicker').datepicker({
                    format: 'dd-mm-yyyy',
                    autoclose: true,
                    language: 'es'
                });
            }
        }
    })
    .directive('yearPicker', function(){
        return {
            restrict: 'AE',
            template: '',
            replace: false,
            link: function(scope, element, attrs) {
                $('.yearpicker').datepicker({
                    format: 'yyyy',
                    autoclose: true,
                    language: 'es'
                });
            }
        }
    })
    .directive('includeReplace', function () {
        return {
            require: 'ngInclude',
            restrict: 'A', /* optional */
            link: function (scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });

