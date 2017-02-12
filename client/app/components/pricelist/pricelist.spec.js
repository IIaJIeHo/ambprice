import PricelistModule from './pricelist'
import PricelistController from './pricelist.controller';
import PricelistComponent from './pricelist.component';
import PricelistTemplate from './pricelist.html';

describe('Pricelist', () => {
  let $rootScope, makeController;

  beforeEach(window.module(PricelistModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new PricelistController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(PricelistTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = PricelistComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(PricelistTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(PricelistController);
      });
  });
});
