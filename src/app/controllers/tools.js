/**
 * Created by david on 8/20/16.
 */
'use strict';
angular.module('cca-client').controller('ToolsCtrl', function($scope, $cookies, $state, Api, Messages, localStorageService){
    $scope.frmPromotion = {}
    $scope.Promotion = {}
    $scope.frmTalonarios = {}
    $scope.Talonarios = {}

    $scope.initPoint = function() {
        $scope.enrollmentyears = localStorageService.get('enrollmentyear');
        var i = -1;
        _.forEach($scope.enrollmentyears, function(item, index){
            if (item.isActive) {
                i = index;
            }
        });
        $scope.enrollmentyears.splice(i,1);
    }

    $scope.save = function() {
        if (($scope.Promotion.students || $scope.Promotion.paymentplans) && $scope.Promotion.enrollment_year_id) {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.frmPromotion.$invalid) { return; }

            if ($scope.Promotion.students) {
                Api.post('tools/promoteStudents',{nextEnrollmentYear: $scope.Promotion.enrollment_year_id, selectedYears: 'All'}).then(function(response) {
                    if ($scope.Promotion.paymentplans) {
                        $scope.paymentplan();
                    } else {
                        Messages.success('&Eacute;xito!', 'La promoci&oacute;n se realiz&oacute; correctamente.');
                    }
                }, function(error) {
                    Messages.error('Error!', 'La promoci&oacute;n no pudo realizarse correctamente. Por favor intente de nuevo m&aacute;s tarde.');
                });
            } else if ($scope.Promotion.paymentplans) {
                $scope.paymentplan();
            }
        }
    }

    $scope.paymentplan = function() {
        Api.post('tools/promotePaymentPlans', {nextEnrollmentYear: $scope.Promotion.enrollment_year_id}).then(function(response) {
            Messages.success('&Eacute;xito!', 'La promoci&oacute;n se realiz&oacute; correctamente.');
        }, function (error) {
            Messages.error('Error!', 'La promoci&oacute;n no pudo realizarse correctamente. Por favor intente de nuevo m&aacute;s tarde.');
        });
    }

    $scope.generarTalonarios = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmTalonarios.$invalid) { return; }
        if ($scope.Talonarios.enrollment_year_id) {
            Api.post('tools/generateTalonarios', {nextEnrollmentYear: $scope.Talonarios.enrollment_year_id}).then(function(response) {
                Messages.success('&Eacute;xito!', 'Los talonarios se generaron correctamente.');
            }, function(error) {
                Messages.error('Error!', 'No se pudo generar los talonarios correctamente. Por favor intente de nuevo m&aacute;s tarde.');
            });
        }
    }

    $scope.getExcel = function() {
        if ($scope.Talonarios.enrollment_year_id) {
            var i_frame = jQuery('#exportframe');
            i_frame.prop('src',localStorageService.get('baseurl') + '/api/v1/tools/createTalonariosReport?nextEnrollmentYear=' + $scope.Talonarios.enrollment_year_id + '&access_token=' + localStorageService.get('access_token'));
        }
    };

    $scope.initPoint();
});
