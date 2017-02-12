import template from './calendar.html';
import controller from '../home/home.controller';
import './calendar.scss';

let calendarComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller
};

export default calendarComponent;
