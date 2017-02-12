import IndexesModule from './indexes'
import IndexesController from './indexes.controller';
import IndexesComponent from './indexes.component';
import IndexesTemplate from './indexes.html';

describe('Indexes', () => {
  let $rootScope, makeController;

  beforeEach(window.module(IndexesModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new IndexesController();
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
      expect(IndexesTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = IndexesComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(IndexesTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(IndexesController);
      });
  });
});
