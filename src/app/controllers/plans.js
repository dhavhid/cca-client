/**
 * Created by david on 5/8/16.
 */
angular.module('cca-client').controller('PlanCtrl', function($scope, $state, Api, Messages, localStorageService) {
    $scope.activeTitle = "Planes de Pago";
    $scope.per_page = PER_PAGE;
    $scope.schoolyears = localStorageService.get('enrollmentyear');
    $scope.schoolyear = _.find($scope.schoolyears, function(o) { return o.isActive;});
    $scope.schoolyear = $scope.schoolyear.id;

    $scope.get = function(page) {
        var params = {
            per_page: PER_PAGE,
            page: page,
            keywords: $('#keywords').val().trim(),
            enrollment_year_id: $scope.schoolyear
        }
        Api.get('plan',params).then(function(response){
            $scope.plans = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        }, function(error){});
    }

    $scope.search = function() {
        $scope.get(1);
    }

    $scope.addNew = function() {
        $state.go('catalogs.plannew');
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
                        Api.delete('plan', {id: sy_ids.join(','), per_page: 5000}).then(function (response) {
                            $scope.plans = response.data.data;
                            $scope.pagination = response.data.meta.pagination;
                            Messages.success('&Eacute;xito!', 'Los regitro(s) han sido borrado(s)');
                        }, function (error) {
                        });
                    }
                }
            });
        }
    }

    $scope.get(1);
});

angular.module('cca-client').controller('PlanNewCtrl', function($scope, $state, Api, Messages, localStorageService, ValidateCF) {
    $scope.activeTitle = "Nuevo";
    $scope.PaymentPlan = {};
    $scope.frmPaymentPlan = {};
    $scope.syears = localStorageService.get('year');
    $scope.schoolyears = localStorageService.get('enrollmentyear');
    $scope.schoolyear = _.find($scope.schoolyears, function(o) { return o.isActive;});
    $scope.PaymentPlan.enrollment_year_id = $scope.schoolyear.id;

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmPaymentPlan.$invalid) { return; }

        var years = $scope.PaymentPlan.years;
        if (!Array.isArray(years)){ return; }
        var plan = {
            code: $scope.PaymentPlan.code,
            name: $scope.PaymentPlan.name,
            description: $scope.PaymentPlan.description,
            enrollment_fee: $scope.PaymentPlan.enrollment_fee,
            cover: $scope.PaymentPlan.cover,
            enrollment_year_id: $scope.PaymentPlan.enrollment_year_id
        }

        Api.post('plan', {Plan: plan, Years: years}).then(function(response){
            if (response.status == 200) {
                Messages.success('&Eacute;xito!', 'El nuevo plan ha sido guardado.');
                $state.go('catalogs.plan');
            }
        }, function(error){});
    }
});

angular.module('cca-client').controller('PlanUpdateCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService, ValidateCF) {
    $scope.activeTitle = "Actualizar";
    $scope.PaymentPlan = {};
    $scope.frmPaymentPlan = {};
    $scope.syears = localStorageService.get('year');
    $scope.schoolyears = localStorageService.get('enrollmentyear');
    $scope.schoolyear = _.find($scope.schoolyears, function(o) { return o.isActive;});
    $scope.PaymentPlan.enrollment_year_id = $scope.schoolyear.id;

    $scope.get = function() {
        var id = $stateParams.id;
        Api.get('plan/' + id).then(function(response){
            var data = response.data.data;
            $scope.PaymentPlan = {
                id: data.id,
                code: data.code,
                name: data.name,
                description: data.description,
                enrollment_fee: data.enrollment_fee,
                cover: data.cover,
                enrollment_year_id: data.enrollment_year_id,
                years: _.map(data.years, 'id')
            }
        }, function(error){});
    }

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmPaymentPlan.$invalid) { return; }

        var years = $scope.PaymentPlan.years;
        if (!Array.isArray(years)){ return; }
        var plan = {
            id: $scope.PaymentPlan.id,
            code: $scope.PaymentPlan.code,
            name: $scope.PaymentPlan.name,
            description: $scope.PaymentPlan.description,
            enrollment_fee: $scope.PaymentPlan.enrollment_fee,
            cover: $scope.PaymentPlan.cover,
            enrollment_year_id: $scope.PaymentPlan.enrollment_year_id
        }

        Api.put('plan', {Plan: plan, Years: years}).then(function(response){
            if (response.status == 200) {
                Messages.success('&Eacute;xito!', 'El nuevo plan ha sido guardado.');
                $state.go('catalogs.plan');
            }
        }, function(error){});
    }

    $scope.get();
});

angular.module('cca-client').controller('FeeCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService) {
    $scope.per_page = PER_PAGE;

    $scope.get = function(page) {
        var params = {
            per_page: PER_PAGE,
            page: page,
            keywords: $('#keywords').val().trim(),
            payment_plan_id: $stateParams.id
        }
        Api.get('fee', params).then(function(response){
            $scope.fees = response.data.data;
            $scope.pagination = response.data.meta.pagination;
        }, function(error){});

        Api.get('plan/' + $stateParams.id, {}).then(function(response){
            $scope.plan = response.data.data;
        }, function(error){});
    }

    $scope.sortableOptions = {
        handle: '.fa-reorder',
        stop: function(e, ui) {
            var sy_ids = $('input.chk').map(function() {
                return this.value;
            }).get();
            Api.put('fee/order',{id: sy_ids.join(",")});
        }
    }

    $scope.search = function() {
        $scope.get(1);
    }

    $scope.addNew = function() {
        $state.go('catalogs.feenew',{id: $scope.plan.id});
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
                        Api.delete('fee', {id: sy_ids.join(','),'payment_plan_id':$stateParams.id}).then(function (response) {
                                $scope.fees = response.data.data;
                                $scope.pagination = response.data.meta.pagination;
                                Messages.success('&Eacute;xito!', 'Los regitro(s) han sido borrado(s)');
                            }, function (error) {
                        });
                    }
                }
            });
        }
    }

    $scope.get(1);
});

angular.module('cca-client').controller('FeeNewCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService) {
    $scope.activeTitle = 'Nueva';
    $scope.Fee = {};
    $scope.Fee.payment_plan_id = $stateParams.id;
    $scope.Fee.is_mandatory = 1;

    $scope.get = function() {
        Api.get('plan/' + $stateParams.id, {}).then(function(response){
            $scope.plan = response.data.data;
        }, function(error){});
    }

    $scope.save = function() {

        $scope.$broadcast('show-errors-check-validity');

        if($('input[name="fee_date"]').val().length > 0) {
            var fee_date = $('input[name="fee_date"]').val();
            $scope.Fee.fee_date = moment(fee_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        }
        if ($scope.frmFee.$invalid) { return; }

        Api.post('fee',{Fee: $scope.Fee}).then(function(response){
            if (response.status == 200) {
                Messages.success('&Eacute;xito!', 'La nueva colegiatura ha sido guardada.');
                $state.go('catalogs.fee', {id: $scope.plan.id});
            }
        }, function(error){});
    }

    $scope.get();

});

angular.module('cca-client').controller('FeeUpdateCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService) {
    $scope.activeTitle = 'Actualizar';
    $scope.Fee = {};

    $scope.get = function() {
        Api.get('plan/' + $stateParams.id, {}).then(function(response){
            $scope.plan = response.data.data;
        }, function(error){});
        Api.get('fee/' + $stateParams.feeid,{}).then(function(response){
            if (response.status == 200) {
                var data = response.data.data;
                $scope.Fee = {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    value: data.value,
                    fee_date: moment(data.feeDate).format('DD-MM-YYYY'),
                    is_mandatory: data.isMandatory,
                    is_enrollment_fee: data.isEnrollmentFee,
                    is_cover: data.isCover,
                    order: data.order,
                    payment_plan_id: data.payment_plan_id
                }
                $('input[name="fee_date"]').datepicker('update', new Date(data.feeDate));
            }
        }, function(error){});
    }

    $scope.save = function() {

        $scope.$broadcast('show-errors-check-validity');

        if($('input[name="fee_date"]').val().length > 0) {
            var fee_date = $('input[name="fee_date"]').val();
            $scope.Fee.fee_date = moment(fee_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        }
        if ($scope.frmFee.$invalid) { return; }

        Api.put('fee',{Fee: $scope.Fee}).then(function(response){
            if (response.status == 200) {
                Messages.success('&Eacute;xito!', 'El registro de la colegiatura ha sido guardado.');
                $state.go('catalogs.fee', {id: $scope.plan.id});
            }
        }, function(error){});
    }

    $scope.get();

});
