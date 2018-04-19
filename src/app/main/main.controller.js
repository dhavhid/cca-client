'use strict';

angular.module('cca-client')
  .controller('MainCtrl', function ($scope, $state) {

    this.userName = 'Juan Pérez';
    this.helloText = 'Welcome in INSPINIA Gulp SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects.';

  });
