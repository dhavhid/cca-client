'use strict';
var PER_PAGE = 15;
var DEPTOS = ['Ahuachapan', 'Santa Ana', 'Sonsonate', 'Chalatenango', 'La Libertad', 'San Salvador', 'Cuscatlan', 'Cabañas', 'La Paz', 'Usulutan', 'San Vicente', 'San Miguel', 'Morazan', 'La Union'];
var STUDENT = 5;
var PARENT = 1;

var app = angular.module('cca-client',
    [
        'ngAnimate',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.showErrors',
        'angularUtils.directives.dirPagination',
        'LocalStorageModule',
        'ui.sortable',
        'slugifier',
        'localytics.directives',
        'ngImgCrop',
        'summernote',
        'ngCsvImport'
    ]
).config(function ($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) {
    $stateProvider.state('index', {
        url: "/index",
        templateUrl: "components/templates/index.html",
        middleware: ['Auth'],
        module: 0
    })
    /*
    * Login
    * */
    .state('login', {
        url: "/session/login",
        templateUrl: "components/templates/session/login.html",
        controller: "LoginCtrl",
        module: 0
    })
    /*
    * Logout
    * */
    .state('logout', {
        url: '/session/logout',
        templateUrl: "components/templates/session/login.html",
        controller: "LogoutCtrl",
        module: 0
    })
    /*
    * Catalogs
    * */
    .state('catalogs', {
        abstract: true,
        templateUrl: "components/templates/gn_container.html",
        module: 0
    })
    /*
    * SCHOOL YEARS
    * */
    .state('catalogs.schoolyear', {
        url: "/catalogs/schoolyear",
        templateUrl: "components/templates/enrollment_years/index.html",
        controller: "SchoolYearCtrl as sy",
        middleware: ['Auth'],
        module: 4
    }).state('catalogs.schoolyearnew', {
        url: "/catalogs/schoolyear/new",
        templateUrl: "components/templates/enrollment_years/form.html",
        controller: "SchoolYearNewCtrl as synew",
        middleware: ['Auth'],
        module: 4
    }).state('catalogs.schoolyearupdate', {
        url: '/catalogs/schoolyear/update/:id',
        templateUrl: "components/templates/enrollment_years/form.html",
        controller: "SchoolYearUpdateCtrl as syupdate",
        middleware: ['Auth'],
        module: 4
    })
    /*
    * YEARS
    * */
    .state('catalogs.year', {
        url: "/catalogs/year",
        templateUrl: "components/templates/years/index.html",
        controller: "YearCtrl",
        middleware: ['Auth'],
        module: 5
    }).state('catalogs.yearnew', {
        url: "/catalogs/year/new",
        templateUrl: "components/templates/years/form.html",
        controller: "YearNewCtrl",
        middleware: ['Auth'],
        module: 5
    }).state('catalogs.yearupdate', {
        url: '/catalogs/year/update/:id',
        templateUrl: "components/templates/years/form.html",
        controller: "YearUpdateCtrl",
        middleware: ['Auth'],
        module: 5
    })
    /*
     * MODULES
     * */
    .state('catalogs.module', {
        url: "/catalogs/module",
        templateUrl: "components/templates/modules/index.html",
        controller: "ModuleCtrl",
        middleware: ['Auth'],
        module: 12
    }).state('catalogs.modulenew', {
        url: "/catalogs/module/new",
        templateUrl: "components/templates/modules/form.html",
        controller: "ModuleNewCtrl",
        middleware: ['Auth'],
        module: 12
    }).state('catalogs.moduleupdate', {
        url: '/catalogs/module/update/:id',
        templateUrl: "components/templates/modules/form.html",
        controller: "ModuleUpdateCtrl",
        middleware: ['Auth'],
        module: 12
    })
    /*
     * PAYMENT TYPE
     * */
    .state('catalogs.paymenttype', {
        url: "/catalogs/paymenttype",
        templateUrl: "components/templates/paymenttypes/index.html",
        controller: "PaymentTypeCtrl",
        middleware: ['Auth'],
        module: 9
    }).state('catalogs.paymenttypenew', {
        url: "/catalogs/paymenttype/new",
        templateUrl: "components/templates/paymenttypes/form.html",
        controller: "PaymentTypeNewCtrl",
        middleware: ['Auth'],
        module: 9
    }).state('catalogs.paymenttypeupdate', {
        url: '/catalogs/paymenttype/update/:id',
        templateUrl: "components/templates/paymenttypes/form.html",
        controller: "PaymentTypeUpdateCtrl",
        middleware: ['Auth'],
        module: 9
    })
    /*
    * ROLES
    * */
    .state('catalogs.rol', {
        url: "/catalogs/rol",
        templateUrl: "components/templates/roles/index.html",
        controller: "RolCtrl",
        middleware: ['Auth'],
        module: 13
    }).state('catalogs.rolnew', {
        url: "/catalogs/rol/new",
        templateUrl: "components/templates/roles/form.html",
        controller: "RolNewCtrl",
        middleware: ['Auth'],
        module: 13
    }).state('catalogs.rolupdate', {
        url: '/catalogs/rol/update/:id',
        templateUrl: "components/templates/roles/form.html",
        controller: "RolUpdateCtrl",
        middleware: ['Auth'],
        module: 13
    })
    /*
    * PLANS
    * */
    .state('catalogs.plan', {
        url: "/catalogs/plan",
        templateUrl: "components/templates/plans/index.html",
        controller: "PlanCtrl",
        middleware: ['Auth'],
        module: 8
    })
    .state('catalogs.plannew', {
        url: "/catalogs/plan/new",
        templateUrl: "components/templates/plans/form.html",
        controller: "PlanNewCtrl",
        middleware: ['Auth'],
        module: 8
    })
    .state('catalogs.planupdate', {
        url: "/catalogs/plan/update/:id",
        templateUrl: "components/templates/plans/form.html",
        controller: "PlanUpdateCtrl",
        middleware: ['Auth'],
        module: 8
    })
    .state('catalogs.fee', {
        url: "/catalogs/plan/:id/fees",
        templateUrl: "components/templates/fees/index.html",
        controller: "FeeCtrl",
        middleware: ['Auth'],
        module: 8
    })
    .state('catalogs.feenew', {
        url: "/catalogs/plan/:id/fees/new",
        templateUrl: "components/templates/fees/form.html",
        controller: "FeeNewCtrl",
        middleware: ['Auth'],
        module: 8
    })
    .state('catalogs.feeupdate', {
        url: "/catalogs/plan/:id/fees/:feeid/update",
        templateUrl: "components/templates/fees/form.html",
        controller: "FeeUpdateCtrl",
        middleware: ['Auth'],
        module: 8
    })
    /*
     * RELATIONSHIP TYPE
     * */
    .state('catalogs.relationshiptype', {
        url: "/catalogs/relationshiptype",
        templateUrl: "components/templates/relationshiptypes/index.html",
        controller: "RelationshipTypeCtrl",
        middleware: ['Auth'],
        module: 10
    }).state('catalogs.relationshiptypenew', {
        url: "/catalogs/relationshiptype/new",
        templateUrl: "components/templates/relationshiptypes/form.html",
        controller: "RelationshipTypeNewCtrl",
        middleware: ['Auth'],
        module: 10
    }).state('catalogs.relationshiptypeupdate', {
        url: '/catalogs/relationshiptype/update/:id',
        templateUrl: "components/templates/relationshiptypes/form.html",
        controller: "RelationshipTypeUpdateCtrl",
        middleware: ['Auth'],
        module: 10
    })
    /*
     * TIPO DE PERSONAS
     * */
    .state('catalogs.persontype', {
        url: "/catalogs/persontype",
        templateUrl: "components/templates/persontypes/index.html",
        controller: "PersonTypeCtrl",
        middleware: ['Auth'],
        module: 15
    }).state('catalogs.persontypenew', {
        url: "/catalogs/persontype/new",
        templateUrl: "components/templates/persontypes/form.html",
        controller: "PersonTypeNewCtrl",
        middleware: ['Auth'],
        module: 15
    }).state('catalogs.persontypeupdate', {
        url: '/catalogs/persontype/update/:id',
        templateUrl: "components/templates/persontypes/form.html",
        controller: "PersonTypeUpdateCtrl",
        middleware: ['Auth'],
        module: 15
    })
    /*
     * SECCIONES
     * */
    .state('catalogs.section', {
        url: "/catalogs/section",
        templateUrl: "components/templates/sections/index.html",
        controller: "SectionCtrl",
        middleware: ['Auth'],
        module: 6
    }).state('catalogs.sectionnew', {
        url: "/catalogs/section/new",
        templateUrl: "components/templates/sections/form.html",
        controller: "SectionNewCtrl",
        middleware: ['Auth'],
        module: 6
    }).state('catalogs.sectionupdate', {
        url: '/catalogs/section/update/:id',
        templateUrl: "components/templates/sections/form.html",
        controller: "SectionUpdateCtrl",
        middleware: ['Auth'],
        module: 6
    })
    /*
     * MATERIAS
     * */
    .state('catalogs.subject', {
        url: "/catalogs/subject",
        templateUrl: "components/templates/subjects/index.html",
        controller: "SubjectCtrl",
        middleware: ['Auth'],
        module: 7
    }).state('catalogs.subjectnew', {
        url: "/catalogs/subject/new",
        templateUrl: "components/templates/subjects/form.html",
        controller: "SubjectNewCtrl",
        middleware: ['Auth'],
        module: 7
    }).state('catalogs.subjectupdate', {
        url: '/catalogs/subject/update/:id',
        templateUrl: "components/templates/subjects/form.html",
        controller: "SubjectUpdateCtrl",
        middleware: ['Auth'],
        module: 7
    })
    /*
     * Custom Fields
     * */
    .state('catalogs.customfields', {
        url: "/catalogs/customfields",
        templateUrl: "components/templates/customfields/index.html",
        controller: "CustomfieldCtrl",
        middleware: ['Auth'],
        module: 11
    }).state('catalogs.customfieldsnew', {
        url: "/catalogs/customfields/new",
        templateUrl: "components/templates/customfields/form.html",
        controller: "CustomfieldNewCtrl",
        middleware: ['Auth'],
        module: 11
    }).state('catalogs.customfieldsupdate', {
        url: '/catalogs/customfields/update/:id',
        templateUrl: "components/templates/customfields/form.html",
        controller: "CustomfieldUpdateCtrl",
        middleware: ['Auth'],
        module: 11
    })
    /*
    * Students
    * */
    .state('people', {
        abstract: true,
        templateUrl: "components/templates/gn_container.html",
        module: 0
    })
    .state('people.students', {
        url: '/people/students',
        templateUrl: 'components/templates/students/index.html',
        controller: 'StudentCtrl',
        middleware: ['Auth'],
        module: 2
    })
    .state('people.studentsnew', {
        url: '/people/students/new',
        templateUrl: 'components/templates/people/form.html',
        controller: 'StudentNewCtrl',
        middleware: ['Auth'],
        module: 2
    })
    .state('people.studentsupdate', {
        url: '/people/students/:id/update',
        templateUrl: 'components/templates/people/form.html',
        controller: 'StudentUpdateCtrl',
        middleware: ['Auth'],
        module: 2
    })
    /*
    * Relatives
    * */
    .state('people.studentsrelatives', {
        url: '/people/students/:id/relatives',
        templateUrl: 'components/templates/people/relativesindex.html',
        controller: 'StudentRelativeCtrl',
        middleware: ['Auth'],
        module: 2
    })
    .state('people.studentsrelativesnew', {
        url: '/people/students/:id/relatives/new',
        templateUrl: 'components/templates/people/relativesform.html',
        controller: 'StudentRelativeNewCtrl',
        middleware: ['Auth'],
        module: 2
    })
    .state('people.studentsrelativesupdate', {
        url: '/people/students/:id/relatives/update/:referral_id',
        templateUrl: 'components/templates/people/relativesform.html',
        controller: 'StudentRelativeUpdateCtrl',
        middleware: ['Auth'],
        module: 2
    })
    /*
    * Enrollment.
    * */
    .state('people.studentsenrollment', {
        url: '/people/students/:id/enrollment',
        templateUrl: 'components/templates/people/enrollment.html',
        controller: 'StudentEnrollmentCtrl',
        middleware: ['Auth'],
        module: 2
    })
    /*
     * Payments
     * */
    .state('people.studentspayment', {
        url: '/people/students/:id/payments',
        templateUrl: 'components/templates/people/payments.html',
        controller: 'PaymentCtrl',
        middleware: ['Auth'],
        module: 1
    })
    .state('people.paymentscontrol', {
        url: '/people/paymentscontrol',
        templateUrl: 'components/templates/people/paymentscontrol.html',
        controller: 'PaymentControlCtrl',
        middleware: ['Auth'],
        module: 1
    })
    /*
    * USERS
    * */
    .state('people.users', {
        url: '/people/users',
        templateUrl: 'components/templates/users/index.html',
        controller: 'UserCtrl',
        middleware: ['Auth'],
        module: 14
    })
    .state('people.usersnew', {
        url: '/people/users/new',
        templateUrl: 'components/templates/users/form.html',
        controller: 'UserNewCtrl',
        middleware: ['Auth'],
        module: 14
    })
    .state('people.usersupdate', {
        url: '/people/users/:id/update',
        templateUrl: 'components/templates/users/form.html',
        controller: 'UserUpdateCtrl',
        middleware: ['Auth'],
        module: 14
    })
    .state('people.settings', {
        url: '/settings',
        templateUrl: 'components/templates/settings/form.html',
        controller: 'SettingCtrl',
        middleware: ['Auth'],
        module: 15
    })
    .state('people.expedient', {
        url: '/people/:id/expedient',
        templateUrl: 'components/templates/people/expedient.html',
        controller: 'PeopleExpedientCtrl',
        middleware: ['Auth'],
        module: 2
    })
    .state('people.expedientnew', {
        url: '/people/:id/expedient/new',
        templateUrl: 'components/templates/people/expedientform.html',
        controller: 'PeopleExpedientNewCtrl',
        middleware: ['Auth'],
        module: 2
    })
    .state('people.expedientupdate', {
        url: '/people/:personId/expedient/:id/update',
        templateUrl: 'components/templates/people/expedientform.html',
        controller: 'PeopleExpedientUpdateCtrl',
        middleware: ['Auth'],
        module: 2
    })
    .state('people.tools', {
        url: '/tools',
        templateUrl: 'components/templates/tools/form.html',
        controller: 'ToolsCtrl',
        middleware: ['Auth']
    })
    .state('reports', {
        abstract: true,
        templateUrl: "components/templates/gn_container.html",
        module: 0
    })
    .state('reports.list', {
        url: '/reports/list',
        templateUrl: 'components/templates/reports/index.html',
        controller: 'ReportsListCtrl',
        middleware: ['Auth'],
        module: 3
    })
    .state('reports.listparams', {
        url: '/reports/list/:year_id/:report_id',
        templateUrl: 'components/templates/reports/index.html',
        controller: 'ReportsListCtrl',
        middleware: ['Auth'],
        module: 3
    })
    .state('reports.new', {
        url: '/reports/new',
        templateUrl: 'components/templates/reports/form.html',
        controller: 'ReportsNewCtrl',
        middleware: ['Auth'],
        module: 3
    })
    .state('reports.update', {
        url: '/reports/update/:id',
        templateUrl: 'components/templates/reports/form.html',
        controller: 'ReportsUpdateCtrl',
        middleware: ['Auth'],
        module: 3
    })
    .state('reports.profile', {
        url: '/reports/profile/:id/:type',
        templateUrl: 'components/templates/reports/profile.html',
        controller: 'ReportsProfileCtrl',
        middleware: ['Auth'],
        module: 3
    })
    .state('reports.jslist', {
        url: '/reports/jslist',
        templateUrl: 'components/templates/reports/jslist.html',
        controller: 'ReportsJSListCtrl',
        middleware: ['Auth'],
        module: 3
    });

$urlRouterProvider.otherwise('/people/paymentscontrol');
    $httpProvider.interceptors.push('ApiInterceptor');
    localStorageServiceProvider.setPrefix('CCA');
});

app.run(function(localStorageService, $location, $injector, $rootScope, $timeout){
    // set up client id and client secret.
    localStorageService.set('client_id', '898dbf1c5fae058fb3475c4d2becfb69');
    localStorageService.set('client_secret', 'f8faf35fee4f162889821eb84c6a4181');
    // set up base url
    var url = $location.protocol() + '://' + $location.host();
    var port = $location.port();
    if (port != '80') {
        url = url + ':' + port;
    }
    // for local development
    url = url.replace('localhost:3000', 'cca.local');
    localStorageService.set('baseurl', url);

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var currentState = toState;

        callMiddlewares(event, currentState);

        function callMiddlewares(event, state){
            if(state && state.hasOwnProperty('middleware')){
                if (typeof currentState.middleware === 'object') {
                    angular.forEach(state.middleware, function (middleWare) {
                        callMiddleware(middleWare, state, event);
                    });
                    return;
                }
            }
        }

        function callMiddleware(middleWare, state, event) {
            try{
                $injector.get(middleWare).run(state, event);
            }catch(e){
                console.error('the factory : ' + middleWare + ' does not exist');
            }
        };
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $('#myModal').modal('hide');
        $timeout(function() {
            $('div.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            $("html, body").animate({
                scrollTop: 0
            }, 600);
        }, 1000);
    });
});
