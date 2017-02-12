import template from './pricelist.html';
import controller from '../home/home.controller';
import './pricelist.scss';

let pricelistComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller
};

export default pricelistComponent;
