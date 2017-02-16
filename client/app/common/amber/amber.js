import angular from 'angular';
import AmberFactory from './amber.factory';
import AmberAjaxFactory from './amberajax.factory';

let amberModule = angular.module('app.amber', [])

.factory('AmberFactory', AmberFactory)

.factory('AmberAjaxFactory', AmberAjaxFactory)
  
.name;

export default amberModule;
