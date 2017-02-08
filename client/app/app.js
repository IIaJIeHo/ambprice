import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import nvd3 from 'angular-nvd3';
import { ngTableModule } from 'ng-table';
import { exception, compileProvider} from 'angular-es6';
import 'normalize.css';

angular.module('app', [
    uiRouter,
    Common,
    Components,
    nvd3,
    ngTableModule.name
  ])
  .config(exception)
  .config(compileProvider)
  .config(($locationProvider) => {
    "ngInject";
    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');
  })

  .component('app', AppComponent);
