import angular from 'angular';
import uiRouter from 'angular-ui-router';
import pricelistComponent from './pricelist.component';

let pricelistModule = angular.module('pricelist', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('pricelist', {
      url: '/pricelist',
      component: 'pricelist'
    });
})

.component('pricelist', pricelistComponent)

.name;

export default pricelistModule;
