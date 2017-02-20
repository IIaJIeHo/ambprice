import store from '../store';
import { NgTableParams } from 'ng-table';

const HTTP = new WeakMap();
const baseUrl = 'http://amberprice.net/wp-json/posts?type[]=tableme';

class AmberAjaxFactory {

  constructor($http)
  {
    HTTP.set(this, $http);
  }

  ajaxToFirst(posts_per_page) {
    return HTTP.get(this).get(baseUrl+'&filter[posts_per_page]='+posts_per_page+'&filter[category_name]=first')
    .then(function(data){
      if (data.data.length != 0){
        return data;
      }
    });
  }

  version() {
    return HTTP.get(this).get(baseUrl+'&filter[category_name]=version');
  }

  firstCall(length){
    return HTTP.get(this).get(baseUrl+'&filter[posts_per_page]=1&page='+(length+1));
  }

  ajaxFullBanch() {
    return HTTP.get(this).get(baseUrl+'&filter[posts_per_page]=200');
  }

  ajaxForEvery(posts_per_page) { /* understand, why do we need to call some data every time */
    return HTTP.get(this).get(baseUrl+'&filter[posts_per_page]='+posts_per_page+'&filter[category_name]=every');
  }

  perPage(posts_per_page,page) {
    return HTTP.get(this).get(baseUrl+'&filter[posts_per_page]='+posts_per_page+'&page='+page);
  }

  events(){
    return HTTP.get(this).get('http://amberprice.net/wp-json/posts?type[]=events&&filter[posts_per_page]=1000');
  }

  static ajaxFactory($http){
    return new AmberAjaxFactory($http);
  }
        
}


AmberAjaxFactory.ajaxFactory.$inject = ['$http'];

export default AmberAjaxFactory.ajaxFactory;