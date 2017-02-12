import angular from 'angular';
import uiRouter from 'angular-ui-router';
import indexesComponent from './indexes.component';

let indexesModule = angular.module('indexes', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('indexes', {
      url: '/indexes',
      component: 'indexes'
    });
})

.component('indexes', indexesComponent)

.name;

export default indexesModule;
