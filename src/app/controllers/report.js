/**
 * Created by david on 8/26/16.
 */
'use strict';
var TABLE = {
    id: {
        text: "ID",
        type: "int",
        width: 10,
        sort: false
    },
    code: {
        text: "Código",
        type: "string",
        width: 20,
        sort: false
    },
    lastname: {
        text: "Apellidos",
        type: "string",
        width: 35,
        sort: true
    },
    firstname: {
        text: "Nombres",
        type: "string",
        width: 35,
        sort: true
    },
    gender: {
        text: "Sexo",
        type: "string",
        width: 10,
        sort: true
    },
    date_of_birth: {
        text: "Fecha de Nacimiento",
        type: "date",
        format: "d-m-Y",
        width: 20,
        sort: true
    },
    state: {
        text: "Departamento",
        type: "string",
        width: 25,
        sort: true
    },
    city: {
        text: "Ciudad",
        type: "string",
        width: 25,
        sort: true
    },
    enrollment_id: {
        text: "ID de Matrícula",
        type: "int",
        width: 20,
        sort: false
    },
    year_id: {
        text: "ID de Grado",
        type: "int",
        width: 15,
        sort: true
    },
    year_name: {
        text: "Grado",
        type: "string",
        width: 20,
        sort: true
    },
    section_id: {
        text: "ID de Sección",
        type: "int",
        width: 20,
        sort: false
    },
    section_name: {
        text: "Sección",
        type: "string",
        width: 20,
        sort: true
    },
    talonario: {
        text: "Talonario",
        type: "string",
        width: 25,
        sort: false
    },
    enrollment_year_id: {
        text: "ID de Año Escolar",
        type: "int",
        width: 15,
        sort: true
    },
    payment_id: {
        text: "ID de Pago",
        type: "int",
        width: 15,
        sort: false
    },
    payment_base: {
        text: "Valor de la Colegiatura (USD)",
        type: "currency",
        width: 25,
        sort: false
    },
    payment_payed: {
        text: "Colegiatura Pagada (USD)",
        type: "currency",
        width: 25,
        sort: false
    },
    payment_penalty: {
        text: "Multa Pagada (%)",
        type: "string",
        width: 25,
        sort: false
    },
    date_of_payment: {
        text: "Fecha de Pago",
        type: "date",
        format: "d-m-Y",
        width: 20,
        sort: true
    },
    paymenttype_id: {
        text: "ID de Forma de Pago",
        type: "int",
        width: 15,
        sort: false
    },
    paymenttype_name: {
        text: "Forma de Pago",
        type: "string",
        width: 25,
        sort: true
    },
    paymenttype_discount: {
        text: "Descuento (USD)",
        type: "currency",
        width: 25,
        sort: false
    },
    fee_name: {
        text: "Concepto",
        type: "string",
        width: 35,
        sort: false
    },
    fee_date: {
        text: "Fecha Última de Pago",
        type: "date",
        format: "d-m-Y",
        width: 20,
        sort: false
    },
    is_mandatory: {
        text: "Pago Obligatorio",
        type: "bool",
        width: 15,
        sort: false
    },
    year_order: {
        text: "Orden del Grado",
        type: "int",
        width: 15,
        sort: true
    },
    fee_order: {
        text: "Orden de Pago",
        type: "int",
        width: 15,
        sort: true
    }
};
var COLUMNS = [
    {
        value: "code",
        text: "Código",
        profile: true,
        default: true
    },
    {
        value: "lastname",
        text: "Apellidos",
        profile: true,
        default: true
    },
    {
        value: "firstname",
        text: "Nombre",
        profile: true,
        default: true
    },
    {
        value: "gender",
        text: "Género",
        profile: true
    },
    {
        value: "date_of_birth",
        text: "Fecha de Nacimiento",
        profile: true
    },
    {
        value: "address",
        text: "Dirección",
        profile: true
    },
    {
        value: "city",
        text: "Ciudad",
        profile: true,
        default: true
    },
    {
        value: "state",
        text: "Departamento",
        profile: true
    },
    {
        value: "enrollment_year_name",
        text: "Año Escolar",
        profile: false
    },
    {
        value: "talonario",
        text: "Talonario",
        profile: false
    },
    {
        value: "year_name",
        text: "Grado",
        profile: true,
        default: true
    },
    {
        value: "section_name",
        text: "Sección",
        profile: true
    },
    {
        value: "fee_name",
        text: "Mes de Colegiatura",
        profile: false,
        default: true
    },
    {
        value: "payment_payed",
        text: "Total Pagado (USD)",
        profile: false,
        default: true
    },
    {
        value: "payment_penalty",
        text: "Mora (%)",
        profile: false
    },
    {
        value: "paymenttype_discount",
        text: "Descuento (USD)",
        profile: false
    },
    {
        value: "date_of_payment",
        text: "Fecha de Pago",
        profile: false,
        default: true
    },
    {
        value: "paymenttype_name",
        text: "Forma de Pago",
        profile: false
    }
];
var CATEGORIES = [
    {
        value: "payments",
        text: "Control de Pagos"
    },
    {
        value: "profile",
        text: "Registro Académico"
    }
];
var TYPES = [
    {
        value: "grid",
        text: "Detallado"
    },
    {
        value: "chart",
        text: "Gerencial"
    }
];
var LAYOUT = [
    {
        value: "portrait",
        text: "Vertical"
    },
    {
        value: "landscape",
        text: "Horizontal"
    }
];
var FILTERTYPES = [
    {
        value: "and",
        text: "Todos los filtros deben cumplirse"
    },
    {
        value: "or",
        text: "Por lo menos un filtro debe cumplirse"
    }
];
var FILTERS = [
    {
        value: "fee_date",
        text: "Mes de Colegiatura"
    },
    {
        value: "paymenttype_id",
        text: "Forma de Pago"
    },
    {
        value: "payment_penalty",
        text: "Pago Puntual (Pago con/sin multa)"
    },
    {
        value: "payment_ontime",
        text: "Pago al día"
    },
    {
        value: "year_id",
        text: "Grado"
    },
    {
        value: "section_id",
        text: "Sección"
    },
    {
        selector: "year_id",
        value: "student_id",
        text: "Alumno"
    },
    {
        value: "gender",
        text: "Género"
    },
    {
        value: "date_of_birth",
        text: "Año de Nacimiento"
    },
    {
        value: "city",
        text: "Ciudad"
    },
    {
        value: "state",
        text: "Departamento"
    }
];
angular.module('cca-client').controller('ReportsNewCtrl', function($scope, $state, Api, Messages, localStorageService){
    $scope.title = 'Nuevo Reporte';
    $scope.frmReport = {};
    $scope.formType = 'new';
    $scope.jsonReport = {};
    $scope.Report = {};
    $scope.Report.filters = [];
    $scope.Report.sorting = [];
    $scope.Report.groupby = [];
    $scope.availableColumns = [];
    $scope.Report.selectedColumns = [];
    $scope.Report.type = 'payments';
    $scope.Report.layout = 'portrait';
    $scope.sortableOptions = {
        placeholder: "app",
        connectWith: ".apps-container"
    };

    $scope.columns = _.cloneDeep(COLUMNS);
    $scope.categories = _.cloneDeep(CATEGORIES);
    $scope.types = _.cloneDeep(TYPES);
    $scope.filtertypes = _.cloneDeep(FILTERTYPES);
    $scope.filters = _.cloneDeep(FILTERS);
    $scope.layout = _.cloneDeep(LAYOUT);

    $scope.filtervalues = {
        fee_date: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: [
                {id:0,name:'Reserva'},
                {id:1,name:'Matricula+Enero'},
                {id:2,name:'Febrero'},
                {id:3,name:'Marzo'},
                {id:4,name:'Abril'},
                {id:5,name:'Mayo'},
                {id:6,name:'Junio'},
                {id:7,name:'Julio'},
                {id:8,name:'Agosto'},
                {id:9,name:'Septiembre'},
                {id:10,name:'Octubre'},
                {id:11,name:'Noviembre'},
                {id:12,name:'Diciembre'}
            ]
        },
        paymenttype_id: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("paymenttype")
        },
        payment_penalty: {
            conditions: [{value:"is", text:"Igual a"}],
            value: [{value:"0", text:"Pago Puntual"},{value:"1",text:"Pago con Mora"}]
        },
        payment_ontime : {
            conditions: [{value:"is", text:"Igual a"}],
            value: [{value: "-1", text:"Mostrar todos los alumnos"},{value:"0",text:"Alumnos al día"},{value:"1",text:"Alumnos en mora"}]
        },
        year_id: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("year")
        },
        section_id: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("section")
        },
        student_id: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("year")
        },
        gender: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: [{value:"M", text:"Masculino"},{value:"F", text: "Femenino"}]
        },
        date_of_birth: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"},{value: ">=", text:"Mayor ó igual a"},{value:"<=",text:"Menor ó igual a"}]
        },
        city: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("cities")
        },
        state: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: DEPTOS
        }
    }
    $scope.sorting = [
        {
            value: "asc",
            text: "Ascendente"
        },
        {
            value: "desc",
            text: "Descendente"
        }
    ]
    $scope.schoolyears = localStorageService.get("enrollmentyear");
    $scope.Report.schoolyear = _.find($scope.schoolyears, function(o) { return o.isActive; });
    $scope.Report.schoolyear = $scope.Report.schoolyear.id;
    $scope.years = localStorageService.get("year");

    $scope.addFilter = function() {
        $scope.Report.filters.push({filter:"",condition:"",value:""});
    }

    $scope.removeFilter = function(index) {
        $scope.Report.filters.splice(index,1);
    }

    $scope.addSorting = function() {
        $scope.Report.sorting.push({sortBy:"",sortOrder:""});
    }

    $scope.removeSorting = function(index) {
        $scope.Report.sorting.splice(index,1);
    }

    // get students list from API
    $scope.getStudents = function(yearId) {
        var _params = {
            page: 1,
            per_page: 1000,
            keywords: '',
            year: yearId,
            section_id: '%',
            schoolyear: $scope.Report.schoolyear
        }
        Api.get('student', _params).then(function(response){
            $scope.data = response.data.data;
            $scope.students = _.flatMap($scope.data, function(o) { return {id: o.id, name: o.lastname + ', ' + o.firstname} });
            $scope.students = _.sortBy($scope.students,['name']);
            $scope.pagination = response.data.meta.pagination;
        }, function(error){});
    }

    // set up the columns.
    $scope.setUpColumns = function() {
        var category = $scope.Report.type;
        $scope.Report.selectedColumns = [];
        $scope.availableColumns = _.cloneDeep($scope.columns);
        if (category == 'profile') {
            $scope.availableColumns = _.filter($scope.columns, function(o) { return o.profile; });
        }
        // now set up the default selected columns.
        $scope.Report.selectedColumns = _.remove($scope.availableColumns, function(o) { return o.default; });
    }

    $scope.buildOptions = function() {
        $scope.jsonReport = {
            enrollment_year_id: $scope.Report.schoolyear,
            name: $scope.Report.name,
            description: $scope.Report.description,
            type: $scope.Report.type,
            format: $scope.Report.display,
            layout: $scope.Report.layout
        }
        $scope.jsonReport.columns = [];
        _.forEach($scope.Report.selectedColumns, function(item) {
            $scope.jsonReport.columns.push(item.value);
        });
    }

    $scope.buildFiltering = function() {
        $scope.jsonReport.filtertype = $scope.Report.filtertype;
        $scope.jsonReport.filtering = [];
        _.forEach($scope.Report.filters, function(item){
            $scope.jsonReport.filtering.push({
                condition: item.condition,
                field: item.filter,
                value: item.value
            });
        });
    }

    $scope.buildSorting = function() {
        $scope.jsonReport.sorting = [];
        _.forEach($scope.Report.sorting, function(item) {
            $scope.jsonReport.sorting.push({
                sortOrder: item.sortOrder,
                field: item.sortBy
            });
        });
    }

    $scope.buildGrouping = function() {
        $scope.jsonReport.grouping = [];
        _.forEach($scope.Report.groupby, function(item) {
            $scope.jsonReport.grouping.push(item);
        });
    }

    $scope.buildJsonReport = function() {
        // set up the general options.
        $scope.buildOptions();
        // get the filtering options.
        $scope.buildFiltering();
        // get the sorting options
        $scope.buildSorting();
        // get the grouping options
        $scope.buildGrouping();
    }

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmReport.$invalid) { return; }
        $scope.buildJsonReport();
        // now send to save.
        Api.post('report',{Report:$scope.jsonReport}).then(function(response){
            Messages.success('&Eacute;xito!', 'El reporte se guard&oacute; correctamente.');
            $state.go('reports.list');
        },function(error){});
    }

    $scope.init = function() {
        $scope.setUpColumns();
    }

    $scope.init();
});

angular.module('cca-client').controller('ReportsUpdateCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService){
    $scope.title = 'Actualizar Reporte';
    $scope.formType = 'update';
    $scope.frmReport = {};
    $scope.jsonReport = {};
    $scope.Report = {};
    $scope.availableColumns = [];
    $scope.Report.type = 'payments';
    $scope.sortableOptions = {
        placeholder: "app",
        connectWith: ".apps-container"
    };

    $scope.columns = _.cloneDeep(COLUMNS);
    $scope.categories = _.cloneDeep(CATEGORIES);
    $scope.types = _.cloneDeep(TYPES);
    $scope.filtertypes = _.cloneDeep(FILTERTYPES);
    $scope.filters = _.cloneDeep(FILTERS);
    $scope.layout = _.cloneDeep(LAYOUT);

    $scope.filtervalues = {
        fee_date: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: [
                {id:0,name:'Reserva'},
                {id:1,name:'Matricula+Enero'},
                {id:2,name:'Febrero'},
                {id:3,name:'Marzo'},
                {id:4,name:'Abril'},
                {id:5,name:'Mayo'},
                {id:6,name:'Junio'},
                {id:7,name:'Julio'},
                {id:8,name:'Agosto'},
                {id:9,name:'Septiembre'},
                {id:10,name:'Octubre'},
                {id:11,name:'Noviembre'},
                {id:12,name:'Diciembre'}
            ]
        },
        paymenttype_id: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("paymenttype")
        },
        payment_penalty: {
            conditions: [{value:"is", text:"Igual a"}],
            value: [{value:0, text:"Pago Puntual"},{value:1,text:"Pago con Mora"}]
        },
        payment_ontime : {
            conditions: [{value:"is", text:"Igual a"}],
            value: [{value: "-1", text:"Mostrar todos los alumnos"},{value:"0",text:"Alumnos al día"},{value:"1",text:"Alumnos en mora"}]
        },
        year_id: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("year")
        },
        section_id: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("section")
        },
        student_id: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("year")
        },
        gender: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: [{value:"M", text:"Masculino"},{value:"F", text: "Femenino"}]
        },
        date_of_birth: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"},{value: ">=", text:"Mayor ó igual a"},{value:"<=",text:"Menor ó igual a"}]
        },
        city: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: localStorageService.get("cities")
        },
        state: {
            conditions: [{value:"=", text:"Igual a"},{value:"!=",text:"No es igual a"}],
            value: DEPTOS
        }
    }
    $scope.sorting = [
        {
            value: "asc",
            text: "Ascendente"
        },
        {
            value: "desc",
            text: "Descendente"
        }
    ]
    $scope.schoolyears = localStorageService.get("enrollmentyear");
    $scope.Report.schoolyear = _.find($scope.schoolyears, function(o) { return o.isActive; });
    $scope.Report.schoolyear = $scope.Report.schoolyear.id;
    $scope.years = localStorageService.get("year");

    $scope.addFilter = function() {
        $scope.Report.filters.push({filter:"",condition:"",value:""});
    }

    $scope.removeFilter = function(index) {
        $scope.Report.filters.splice(index,1);
    }

    $scope.addSorting = function() {
        $scope.Report.sorting.push({sortBy:"",sortOrder:""});
    }

    $scope.removeSorting = function(index) {
        $scope.Report.sorting.splice(index,1);
    }

    // get students list from API
    $scope.getStudents = function(yearId) {
        var _params = {
            page: 1,
            per_page: 1000,
            keywords: '',
            year: yearId,
            section_id: '%',
            schoolyear: $scope.Report.schoolyear
        }
        Api.get('student', _params).then(function(response){
            $scope.data = response.data.data;
            $scope.students = _.flatMap($scope.data, function(o) { return {id: o.id, name: o.lastname + ', ' + o.firstname} });
            $scope.students = _.sortBy($scope.students,['name']);
            $scope.pagination = response.data.meta.pagination;
        }, function(error){});
    }

    // set up the columns.
    $scope.setUpColumns = function() {
        var category = $scope.Report.type;
        $scope.Report.selectedColumns = [];
        $scope.availableColumns = _.cloneDeep($scope.columns);
        if (category == 'profile') {
            $scope.availableColumns = _.cloneDeep(_.filter($scope.columns, function(o) { return o.profile; }));
        }
        // now set up the default selected columns.
        $scope.Report.selectedColumns = _.remove($scope.availableColumns, function(o) { return o.default; });
    }

    $scope.buildOptions = function() {
        $scope.jsonReport = {
            enrollment_year_id: $scope.Report.schoolyear,
            name: $scope.Report.name,
            description: $scope.Report.description,
            type: $scope.Report.type,
            format: $scope.Report.display,
            layout: $scope.Report.layout
        }
        $scope.jsonReport.columns = [];
        _.forEach($scope.Report.selectedColumns, function(item) {
            $scope.jsonReport.columns.push(item.value);
        });
    }

    $scope.buildFiltering = function() {
        $scope.jsonReport.filtertype = $scope.Report.filtertype;
        $scope.jsonReport.filtering = [];
        _.forEach($scope.Report.filters, function(item){
            $scope.jsonReport.filtering.push({
                condition: item.condition,
                field: item.filter,
                value: item.value
            });
        });
    }

    $scope.buildSorting = function() {
        $scope.jsonReport.sorting = [];
        _.forEach($scope.Report.sorting, function(item) {
            $scope.jsonReport.sorting.push({
                sortOrder: item.sortOrder,
                field: item.sortBy
            });
        });
    }

    $scope.buildGrouping = function() {
        $scope.jsonReport.grouping = [];
        _.forEach($scope.Report.groupby, function(item) {
            $scope.jsonReport.grouping.push(item);
        });
    }

    $scope.buildJsonReport = function() {
        // set up the general options.
        $scope.buildOptions();
        // get the filtering options.
        $scope.buildFiltering();
        // get the sorting options
        $scope.buildSorting();
        // get the grouping options
        $scope.buildGrouping();
    }

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmReport.$invalid) { return; }
        $scope.buildJsonReport();
        // now send to save.
        Api.put('report/' + $stateParams.id ,{Report:$scope.jsonReport}).then(function(response){
            Messages.success('&Eacute;xito!', 'El reporte se guard&oacute; correctamente.');
            //$state.go('reports.list');
        },function(error){});
    }

    $scope.getReport = function() {
        var id = $stateParams.id;

        Api.get('report/' + id,{}).then(function(response) {
            var data = response.data.data.report;
            $scope.Report = {
                schoolyear: data.enrollment_year_id,
                name: data.name,
                description: (data.description != undefined) ? data.description : '',
                type: data.type,
                display: data.format,
                filtertype: data.filtertype,
                layout: (data.layout != undefined) ? data.layout : ''
            };
            $scope.setUpColumns();
            // set up the columns
            $scope.Report.selectedColumns = [];
            _.forEach(data.columns, function(item) {
                var element = _.find(COLUMNS, function(o) { return o.value == item; });
                $scope.Report.selectedColumns.push(element);
            });
            //$scope.availableColumns = _.cloneDeep($scope.columns);
            _.forEach($scope.Report.selectedColumns, function(item) {
                _.remove($scope.availableColumns, function(o) { return o.value == item.value; });
            });
            // set up the filters
            $scope.Report.filters = [];
            _.forEach(data.filtering, function(item) {
                $scope.Report.filters.push({
                    filter: item.field,
                    condition: item.condition,
                    value: item.value
                });
            });
            // set up the sorting
            $scope.Report.sorting = [];
            _.forEach(data.sorting, function(item) {
                $scope.Report.sorting.push({
                    sortBy: item.field,
                    sortOrder: item.sortOrder
                });
            });
            // set up the grouping options
            $scope.Report.groupby = [];
            _.forEach(data.grouping, function(item) {
                $scope.Report.groupby.push(item);
            });

        }, function(error) {});
    }

    $scope.init = function() {
        $scope.getReport();
    }
    $scope.reportId = $stateParams.id;
    $scope.init();
});

angular.module('cca-client').controller('ReportsListCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService, CatalogsAll){
    $scope.Report = {};
    $scope.table = TABLE;
    $scope.columns = COLUMNS;
    $scope.grouped = false;
    $scope.colspan = 0;
    $scope.schoolyears = localStorageService.get("enrollmentyear");
    $scope.schoolyear = _.find($scope.schoolyears, function(o) { return o.isActive; });
    $scope.schoolyear = $scope.schoolyear.id;

    $scope.init = function() {
        if ($stateParams.year_id != undefined && $stateParams.year_id != null) {
            $scope.schoolyear = parseInt($stateParams.year_id);
        }
        Api.get('report',{per_page:5000, enrollment_year_id: $scope.schoolyear}).then(function(response){
            $scope.reports = response.data.data;
            var pagination = response.data.pagination;
            if ($stateParams.report_id != undefined && $stateParams.report_id != null) {
                $scope.selectedReport = parseInt($stateParams.report_id);
                $scope.display();
            }
        }, function(error){});
    }

    $scope.createReport = function() {
        $state.go('reports.new');
    }

    $scope.display = function() {
        if (_.isNumber($scope.selectedReport)) {
            $('.table-content').hide();
            $('.progress').show();
            Api.get('report/display/' + $scope.selectedReport,{format: 'json'}).then(function(response) {
                $scope.Report = response.data.data;
                $scope.data = _.cloneDeep(response.data.data.data);
                $scope.colspan = $scope.Report.report.columns.length;
                if ($scope.Report.report.groupingFields.length > 0) {
                    $scope.grouped = true;
                } else {
                    $scope.grouped = false;
                }
                $('.progress').hide();
                $('.table-content').show();
            }, function(error) {});
        }
    }

    $scope.getExcel = function() {
        if (_.isNumber($scope.selectedReport)) {
            var i_frame = jQuery('#exportframe');
            i_frame.prop('src',localStorageService.get('baseurl') + '/api/v1/report/display/' + $scope.selectedReport + '?format=spreadsheet&access_token=' + localStorageService.get('access_token'));
        }
    };

    $scope.listReports = function() {
        $scope.init();
    }

    $scope.editReport = function() {
        if (_.isNumber($scope.selectedReport)) {
            $state.go('reports.update', {id: $scope.selectedReport});
        }
    }
    $('.progress').hide();
    $scope.init();
});


angular.module('cca-client').controller('ReportsProfileCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService){

    $scope.schoolyears = localStorageService.get("enrollmentyear");
    $scope.schoolyear = _.find($scope.schoolyears, function(o) { return o.isActive; });
    $scope.schoolyear = $scope.schoolyear.id;
    $scope.title = '';
    
    $scope.init = function() {
        Api.get('report/profile/' + $stateParams.id,{person_type: $stateParams.type, enrollment_year_id: $scope.schoolyear}).then(function(response) {
            $scope.data = response.data.data;
            $scope.person = $scope.data.person;
            $scope.enrollment = $scope.data.enrollment;
            $scope.parents = $scope.data.parents;
            $scope.payments = $scope.data.payments;
            $scope.siblings = $scope.data.siblings;
            $scope.title = $scope.data.person.firstname + ' ' + $scope.data.person.lastname;
        }, function(error){});
    }

    $scope.init();
});

angular.module('cca-client').controller('ReportsJSListCtrl', function($scope, $state, $stateParams, Api, Messages, localStorageService, CatalogsAll) {
    $scope.schoolyears = localStorageService.get("enrollmentyear");
    $scope.schoolyear = _.find($scope.schoolyears, function(o) { return o.isActive; });
    $scope.schoolyear = $scope.schoolyear.id;

    $scope.extensions = [{id: 'html', name: 'Vista Previa'}, {id: 'pdf', name: 'PDF'}, {id: 'xlsx', name: 'Microsoft Excel'}, {id: 'docx', name: 'Microsoft Word'}, {id: 'csv', name: 'CSV'}, {id: 'rtf', name: 'RTF'}];

    $scope.filters = {
        YEAR_ID: localStorageService.get('year'),
        YEAR_NAME: '',
        SECTION_ID: localStorageService.get('section'),
        SECTION_NAME: '',
        FEE_ID: 0,
        FEE_NAME: '',
        FEE_DATE: '',
        ENROLLMENT_YEAR_ID: localStorageService.get('enrollmentyear'),
        START_DATE: moment().format('01-MM-YYYY'),
        END_DATE: moment().format('DD-MM-YYYY'),
        FECHA_DE_PAGO: moment().format('DD-MM-YYYY'),
        TODAY: '',
        PAYMENT_TYPE_ID: localStorageService.get('paymenttype'),
        PAYMENT_TYPE_NAME: ''
    }

    $scope.reportList = [];

    $scope.JSReports = {
        reportUri: '',
        extension: 'html',
        YEAR_ID: 0,
        YEAR_NAME: '',
        SECTION_ID: 0,
        SECTION_NAME: '',
        FEE_ID: 0,
        FEE_NAME: '',
        FEE_DATE: '',
        ENROLLMENT_YEAR_ID: $scope.schoolyear,
        START_DATE: moment().format('YYYY-MM-01'),
        END_DATE: moment().format('YYYY-MM-DD'),
        FECHA_DE_PAGO: moment().format('YYYY-MM-DD'),
        TODAY: '',
        PAYMENT_TYPE_ID: 0,
        PAYMENT_TYPE_NAME: ''
    }

    $scope.$watch('JSReports.ENROLLMENT_YEAR_ID', function(newValue, oldValue, scope) {
        // verify if JSReports has property fee_date
        if ($scope.JSReports.hasOwnProperty('FEE_DATE')) {
            $scope.getFeeDates();
        }
    });

    $scope.emptyFilters = function() {
        for (var key in $scope.JSReports) {
            if (key != 'reportUri' && key != 'extension' && key != 'ENROLLMENT_YEAR_ID') {
                delete $scope.JSReports[key];
            }
        }
    }

    $scope.addFilters = function (include) {
        for (var filter in include) {
            if (include[filter] != 'ENROLLMENT_YEAR_ID') {
                $scope.JSReports[include[filter]] = '';
            }
        }
        setTimeout(function() {
            if ($('input[name="START_DATE"]') && $('input[name="END_DATE"]')) {
                Inputmask('99/99/9999').mask('input[name="START_DATE"]');
                Inputmask('99/99/9999').mask('input[name="END_DATE"]');
                Inputmask('99/99/9999').mask('input[name="FECHA_DE_PAGO"]');
            }
        }, 1000);
    }

    $scope.getList = function() {
        Api.get('report/list', {folderUri: '/Reports/Production', type: 'reportUnit'}).then(function(response) {
            if (Array.isArray(response.data.data)) {
                var data = response.data.data;
                if (data.length > 0) {
                    $scope.reportList = data;
                    $scope.emptyFilters();
                }
            }
        }, function(error) {});
    }

    $scope.getReportParams = function() {
        Api.get('report/getreportparams', {reportUri: $scope.JSReports.reportUri}).then(function(response) {
            var data = response.data.data;
            $scope.emptyFilters();
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    $scope.addFilters(data);
                }
            }
        }, function(error) {});
    }

    $scope.getFees = function() {
        if ($scope.JSReports.YEAR_ID > 0 && $scope.JSReports.ENROLLMENT_YEAR_ID > 0) {
            Api.get('feebyyear',{year_id: $scope.JSReports.YEAR_ID, enrollment_year_id: $scope.JSReports.ENROLLMENT_YEAR_ID}).then(function(response) {
                var data = response.data.data;
                $scope.filters.FEE_ID = data;
            }, function(error) {});
        }
    }

    $scope.getFeeDates = function() {
        if ($scope.JSReports.ENROLLMENT_YEAR_ID > 0) {
            Api.get('tools/getfees', {enrollment_year_id: $scope.JSReports.ENROLLMENT_YEAR_ID}).then(function(response) {
                var data = response.data.data;
                $scope.filters.FEE_DATE = data;
            }, function(error) {});
        }
    }

    $scope.askForReport = function() {

        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmReport.hasOwnProperty('START_DATE')) {
            if ($scope.frmReport.START_DATE.$error.required) {return;}
        }
        if ($scope.frmReport.hasOwnProperty('END_DATE')) {
            if ($scope.frmReport.END_DATE.$error.required) {return;}
        }
        if ($scope.frmReport.hasOwnProperty('FECHA_DE_PAGO')) {
            if ($scope.frmReport.FECHA_DE_PAGO.$error.required) {return;}
        }

        if ($scope.frmReport.$invalid) { return; }

        // build the params.
        var params = [];
        for (var param in $scope.JSReports) {
            if (param == 'YEAR_ID') {
                var yn = _.find($scope.filters.YEAR_ID, {'id': $scope.JSReports.YEAR_ID});
                params.push('YEAR_ID=' + $scope.JSReports.YEAR_ID);
                params.push('YEAR_NAME=' + yn.name.toUpperCase());
            } else if (param == 'SECTION_ID') {
                var sn = _.find($scope.filters.SECTION_ID, {'id': $scope.JSReports.SECTION_ID});
                params.push('SECTION_ID=' + $scope.JSReports.SECTION_ID);
                params.push('SECTION_NAME=' + sn.name);
            } else if (param == 'FEE_NAME' && $scope.JSReports.hasOwnProperty('FEE_ID')) {
                var fn = _.find($scope.filters.FEE_ID, {'id': $scope.JSReports.FEE_ID});
                params.push('FEE_ID=' + $scope.JSReports.FEE_ID);
                params.push('FEE_NAME=' + fn.name);
            } else if (param == 'FEE_NAME' && $scope.JSReports.hasOwnProperty('FEE_DATE')) {
                var fn = _.find($scope.filters.FEE_DATE, {'fee_date': $scope.JSReports.FEE_DATE});
                params.push('FEE_DATE=' + $scope.JSReports.FEE_DATE);
                params.push('FEE_NAME=' + fn.name);
            } else if (param == 'FECHA_DE_PAGO') {
                moment.locale('es');
                params.push('FECHA_DE_PAGO=' + moment($scope.JSReports.FECHA_DE_PAGO, 'DD/MM/YYYY').format('YYYY-MM-DD'));
                params.push('TODAY=' + moment($scope.JSReports.FECHA_DE_PAGO, 'DD/MM/YYYY').format('DD/MM/YYYY'));
            } else if (param == 'PAYMENT_TYPE_ID') {
                params.push('PAYMENT_TYPE_ID=(' + $scope.JSReports.PAYMENT_TYPE_ID.join(',') + ')');
                var paymentname = [];
                for (var pt in $scope.JSReports.PAYMENT_TYPE_ID) {
                    var pn = _.find($scope.filters.PAYMENT_TYPE_ID, {id: $scope.JSReports.PAYMENT_TYPE_ID[pt]});
                    paymentname.push(pn.name);
                }
                params.push('PAYMENT_TYPE_NAME=' + paymentname.join(', '));
            } else if (param == 'START_DATE') {
                params.push('START_DATE=' + moment($scope.JSReports.START_DATE, 'DD/MM/YYYY').format('YYYY-MM-DD'));
            } else if (param == 'END_DATE') {
                params.push('END_DATE=' + moment($scope.JSReports.END_DATE, 'DD/MM/YYYY').format('YYYY-MM-DD'));
            } else if(param != 'YEAR_NAME' && param != 'SECTION_NAME' && param != 'PAYMENT_TYPE_NAME' && param != 'FEE_NAME' && param != 'TODAY') {
                params.push(param + '=' + $scope.JSReports[param]);
            }
        }
        params = params.join('&');
        var i_frame = jQuery('#exportframe');
        if ($scope.JSReports.extension != 'pdf' && $scope.JSReports.extension != 'html') {            
            i_frame.prop('src',localStorageService.get('baseurl') + '/api/v1/report/run?' + params + '&access_token=' + localStorageService.get('access_token'));
        } else {
            window.open(localStorageService.get('baseurl') + '/api/v1/report/run?' + params + '&access_token=' + localStorageService.get('access_token'),'CCA','resizable=yes,scrollbars=yes,status=yes');
        }
    }

    $scope.getList();
});
