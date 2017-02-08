import angular from 'angular';
import AmberFactory from './amber.factory';

let amberModule = angular.module('app.amber', [])

.factory('AmberFactory', AmberFactory)
  
.name;

export default amberModule;
