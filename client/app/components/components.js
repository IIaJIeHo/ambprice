import angular from 'angular';
import Home from './home/home';
import About from './about/about';
import Charts from './charts/charts';
import Calendar from './calendar/calendar';
import Pricelist from './pricelist/pricelist';
import Indexes from './indexes/indexes';

let componentModule = angular.module('app.components', [
  Home,
  About,
  Charts,
  Calendar,
  Pricelist,
  Indexes
])

.name;

export default componentModule;
