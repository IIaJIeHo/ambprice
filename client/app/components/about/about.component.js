import template from './about.html';
import controller from '../home/home.controller';
import '../home/home.scss';

let aboutComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller
};

export default aboutComponent;
