import angular from 'angular';
import uiRouter from 'angular-ui-router';
import calendarComponent from './calendar.component';

let calendarModule = angular.module('calendar', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('calendar', {
      url: '/calendar',
      component: 'calendar'
    });
})

.component('calendar', calendarComponent)

.name;

export default calendarModule;
