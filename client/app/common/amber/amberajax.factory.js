import store from '../store';
import { NgTableParams } from 'ng-table';

const HTTP = new WeakMap();
const baseUrl = 'http://amberprice.net/wp-json/posts?type[]=tableme';

class AmberAjaxFactory{

  constructor($http)
  {
    HTTP.set(this, $http);
  }

  ajaxToFirst(posts_per_page) {
    return HTTP.get(this).get(baseUrl+'&filter[posts_per_page]='+posts_per_page+'&filter[category_name]=first');
  }

  static ajaxFactory($http){
    return new AmberAjaxFactory($http);
  }
        
}


AmberAjaxFactory.ajaxFactory.$inject = ['$http'];

export default AmberAjaxFactory.ajaxFactory;