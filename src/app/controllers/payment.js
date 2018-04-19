/**
 * Created by david on 4/19/16.
 */
angular.module('cca-client').controller('PaymentCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService, $timeout){
    $scope.PaymentStudent = {};

    $scope.get = function() {
        var id = $stateParams.id;

        // get the enrollment years catalog first.
        if (localStorageService.get('enrollmentyear')) {
            $scope.enrollmentyears = localStorageService.get('enrollmentyear');
            _.forEach($scope.enrollmentyears, function(item, index){
                if (item.isActive) {
                    $scope.enrollment_year_id = item.id;
                }
            });
            $scope.loadEnrollment();
        } else {
            Api.get('catalogs/enrollmentyear/',{per_page:5000}).then(function(response){
                $scope.enrollmentyears = response.data.data;
                _.forEach($scope.enrollmentyears, function(item, index){
                    if (item.isActive) {
                        $scope.enrollment_year_id = item.id;
                    }
                });
                $scope.loadEnrollment();
            }, function(error){});
        }

        Api.get('people/' + id).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Person = data;
            }
        }, function(error){});
        var schoolyears = localStorageService.get("enrollmentyear");
        // set the selected.
        var activeEnrollmentYear = _.find(schoolyears, function(o) { return o.isActive; });
        activeEnrollmentYear = activeEnrollmentYear.id;
        var params = {
            enrollment_year_id: activeEnrollmentYear
        }
        Api.get('payments/fees/' + id, params).then(function(response){
            if (response.status == 200) {
                $scope.payments = response.data.data;
                $scope.pending = [];
                $scope.payed = [];
                var showPaymentOpt = true;
                _.forEach($scope.payments, function(payment, index){
                    if (payment.isPayed) {
                        payment['showDeleteOpt'] = false;
                        $scope.payed.unshift(payment);
                    } else {
                        if (!payment.isMandatory) {
                            payment['showPaymentOpt'] = true;
                            payment['showDeleteOpt'] = true;
                        } else if (showPaymentOpt) {
                            payment['showPaymentOpt'] = true;
                            showPaymentOpt = false;
                        } else { payment['showPaymentOpt'] = false; }
                        $scope.pending.push(payment);
                    }
                });
                // set delete option to the first element of payed if exists.
                if ($scope.payed.length > 0 ) {
                    var showDeleteOpt = true;
                    _.forEach($scope.payed, function(payment, index) {
                        if (payment.isMandatory && showDeleteOpt) {
                            payment.showDeleteOpt = true;
                            showDeleteOpt = false;
                        }
                        if (!payment.isMandatory) {
                            payment.showDeleteOpt = true;
                        }
                    });
                }
            }
        }, function(error){});
        Api.get('payments/paymenttypes').then(function(response){
            $scope.paymenttypes = response.data.data;
            var defaultPaymentType = _.find($scope.paymenttypes, function(o) {return o.isDefault;});
            $scope.PaymentStudent.payment_type_id = defaultPaymentType.id;
        }, function(error){});
    }

    $scope.loadEnrollment = function() {
        var id = $stateParams.id;
        Api.get('enrollment/' + $scope.enrollment_year_id + '/' + id).then(function(response){
            $scope.enrollment_id = response.data.data.id;
            $scope.PaymentStudent.enrollment_id = $scope.enrollment_id;
        }, function(error){});
    }

    $scope.pay = function(payment_id) {
        $scope.PaymentStudent.date_of_payment = '';
        $('#myModal').modal('show');
        $scope.PaymentStudent.fee_id = payment_id;
    }

    $scope.save = function(n) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmPaymentStudent.$invalid) { return; }
        // get the payment type.
        var payment_type = _.find($scope.paymenttypes, function(o) { return o.id == $scope.PaymentStudent.payment_type_id; });
        // get the fee value.
        var fee = _.find($scope.pending, function(o){ return o.id == $scope.PaymentStudent.fee_id; });
        // calculate the new value
        //$scope.PaymentStudent.value = parseFloat(fee.value) - (parseFloat(fee.value) * (parseFloat(payment_type.discount) * 0.01));
        $scope.PaymentStudent.date_of_payment = moment($scope.PaymentStudent.date_of_payment,'DD-MM-YYYY').format('YYYY-MM-DD');
        Api.post('payments',{PaymentStudent: $scope.PaymentStudent}).then(function(response){
            if (response.status == 200) {
                $scope.payments = response.data.data;
                $scope.pending = [];
                $scope.payed = [];
                var showPaymentOpt = true;
                _.forEach($scope.payments, function(payment, index){
                    if (payment.isPayed) {
                        payment['showDeleteOpt'] = false;
                        $scope.payed.unshift(payment);
                    } else {
                        if (!payment.isMandatory) {
                            payment['showPaymentOpt'] = true;
                            payment['showDeleteOpt'] = true;
                        } else if (showPaymentOpt) {
                            payment['showPaymentOpt'] = true;
                            showPaymentOpt = false;
                        } else { payment['showPaymentOpt'] = false; }
                        $scope.pending.push(payment);
                    }
                });
                $('#myModal').modal('hide');
                $timeout(function() {
                    $('div.modal-backdrop').remove();
                }, 1000);
                if (n == 1) {
                    $state.go('people.paymentscontrol');
                } else {
                    $scope.get();
                }
            }
        }, function(error){});
    }

    $scope.deletePayment = function(id) {
        var confirmObj = Messages.confirm('&iquest;Est&aacute; seguro?', 'Los registros borrados no pueden ser recuperados.');
        swal(confirmObj, function (isConfirm) {
            if (isConfirm) {
                Api.delete('payments/' + id).then(function(response){
                    if (response.status == 200) {
                        $scope.payments = response.data.data;
                        $scope.pending = [];
                        $scope.payed = [];
                        var showPaymentOpt = true;
                        _.forEach($scope.payments, function(payment, index){
                            if (payment.isPayed) {
                                payment['showDeleteOpt'] = false;
                                $scope.payed.unshift(payment);
                            } else {
                                if (!payment.isMandatory) {
                                    payment['showPaymentOpt'] = true;
                                    payment['showDeleteOpt'] = true;
                                } else if (showPaymentOpt) {
                                    payment['showPaymentOpt'] = true;
                                    showPaymentOpt = false;
                                } else { payment['showPaymentOpt'] = false; }
                                $scope.pending.push(payment);
                            }
                        });

                        Messages.success('&Eacute;xito!', 'El registro han sido borrado');
                        $scope.get();
                    }
                }, function(error){});
            }
        });
    }

    $scope.get();
});
