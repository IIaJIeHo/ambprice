import angular from 'angular';
import uiRouter from 'angular-ui-router';
import chartsComponent from './charts.component';

let chartsModule = angular.module('charts', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('charts', {
      url: '/charts',
      component: 'charts'
    });
})

.component('charts', chartsComponent)

.name;

export default chartsModule;
