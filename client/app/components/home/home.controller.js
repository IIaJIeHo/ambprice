import { NgTableParams } from 'ng-table';
import jQuery from 'jquery';
import store from '../../common/store';
import initSlider from './initSlider';

class HomeController {
  static $inject = ['$scope','$http', 'AmberFactory', 'AmberAjaxFactory'];

  constructor($scope,$http, AmberFactory, AmberAjaxFactory) {

    let convert = AmberFactory.convert;

    console.log(AmberFactory);

    var that = this;

    that.$scope = $scope;

    that.$scope.events = new NgTableParams({count:100},{dataset: [{a:1}]}); /* test */

    let custom_filter = function() {
        return AmberFactory.functions.customFilter(that.$scope.main,that.$scope.criteria);
    }

    let current_currency = function (date) {
        return AmberFactory.functions.currentCurrency(date,that.$scope.currency,that.$scope.state.date,that.$scope.format_date);
    }

    function init_default_data(){
        that.$scope.basestate = AmberFactory.base.baseState;
        that.$scope.state = AmberFactory.base.state;
        that.$scope.select_options = AmberFactory.base.selectOptions;
        that.$scope.indostate = AmberFactory.base.indoState;
        that.$scope.table_state = AmberFactory.base.tableState;

        that.$scope.graph = {
            graph_time: AmberFactory.base.selectOptions.graph_time[0],
            graph_type: AmberFactory.base.selectOptions.graph_type[0]
        };


        that.$scope.format_date = AmberFactory.functions.formatDate;

        that.$scope.tables = {};

        that.$scope.display = function() { /* todo to object instead of list of variables */
            return AmberFactory.functions.display(custom_filter,current_currency,that.$scope.currency,that.$scope.state.currency,that.$scope.multidata,that.$scope.options);
        }

        that.$scope.criteria = criteria_func();

        that.$scope.multidata=[];

        that.$scope.multidata_base =[];

        that.$scope.options = AmberFactory.options;

        that.$scope.options.chart.x = function(d){ 
            if (!d) { 
                if (jQuery('[ng-bind="item.form0.toFixed(2)"]')[0]) {
                    jQuery('[ng-bind="item.form0.toFixed(2)"]')[0].click();
                } else {
                }
            } else {
                return d.x;
            } 
        }
        that.$scope.options.chart.y = function(d){ if (!d) {that.$scope.change_state(that.$scope.basestate);} else {return d.y;} }

        if (that.$scope.multilines){
            that.$scope.options.chart = Object.assign({},that.$scope.options.chart,AmberFactory.multilineOptions);
        }

    }

    let set_default_state_for_amber_type = function(amber_type) {
        let payload = AmberFactory.functions.setDefautStateByAmberType(amber_type, that.$scope.state.amber_class);
        that.$scope.state = Object.assign({},that.$scope.state,payload);
    }

    let postupdate = function(data){
        return AmberFactory.functions.postUpdate(data); /* Update raw data into object*/
    }

    let splice_array = function(main,second) {
        return AmberFactory.functions.spliceArray(main,second); /* Update data inside bundle array */
    }

    let make_date_bundle = function(){
            that.$scope.data_bundle = AmberFactory.parseBundle.dataBundle(that.$scope.bundle); /* bundle out of scope */

            if (that.$scope.data_bundle){
                that.$scope.select_options.date = AmberFactory.functions.selectOptionDate(that.$scope.data_bundle, AmberFactory.functions.formatDate);
                that.$scope.state.date = that.$scope.select_options.date[that.$scope.select_options.date.length -1];
            }         
    }

    let get_current_bundle = function(date,am_class,am_type){
        return AmberFactory.functions.getCurrentBundle(date, am_class, am_type, that.$scope.data_bundle);
    }

    let set_currency = function(base){
        return AmberFactory.functions.setCurrency(base, that.$scope.currency, current_currency, that.$scope.state);
    }

    function get_element_table(sort_param){
        return AmberFactory.functions.getElementTable(sort_param,that.$scope.state.country,that.$scope.init_date,that.$scope.price_table, that.$scope.current);            
    }

    let filter_index_country = function (ind) {
      return AmberFactory.view.filterIndexCountry(ind, current_currency, that.$scope.state);
    }

    let render_table_raw = function(){
        that.$scope.current = that.$scope.state.date ? get_current_bundle(that.$scope.state.date.value, that.$scope.state.amber_class,'Rough') : null;
        that.$scope.current ? AmberFactory.render.tableRaw.base([], that.$scope.state.amber_class, that.$scope.select_options, get_element_table, set_currency, that.$scope.tables) : null;
    }

    let render_table_ball = function(){
        that.$scope.current = that.$scope.state.date ? get_current_bundle(that.$scope.state.date.value, that.$scope.state.amber_class,'Beads') : null;
        that.$scope.current ? AmberFactory.render.tableBall.base([], that.$scope.state.amber_class, that.$scope.select_options, get_element_table, set_currency, that.$scope.tables) : null;
    }

    let provide_pricelist = function(){
        return AmberFactory.functions.providePricelist(that.$scope.state.date,that.$scope.pricelist);
    }

    let add_plus_for_positive = function(num){
        return AmberFactory.functions.addPlusForPositive(num);
    }

    let filter_index_country_small = function(ind) {
        return AmberFactory.functions.filterIndexCountrySmall(ind,that.$scope.state.country,current_currency,that.$scope.state.currency)
    }

  function make_things_done(main){ /* to do */
            that.$scope.bundle = main;
            that.$scope.main = AmberFactory.parseBundle.main(main,that.$scope.state); /* parse all these things to class p = new parseBundle(main) */
            that.$scope.currency = AmberFactory.parseBundle.currency(main);
            that.$scope.store_indexes = AmberFactory.parseBundle.storeIndexes(main);
            that.$scope.pricelist = AmberFactory.parseBundle.priceList(main);
            that.$scope.descriptionindex = AmberFactory.parseBundle.descriptionIndex(main);
            that.$scope.deals = AmberFactory.view.makeUpDeals(main);

            let index_data = filter_index_country(angular.copy(that.$scope.store_indexes));
            if (index_data.length >0) {
                index_data[index_data.length - 1].data = index_data[index_data.length - 1].data.map(function(ind){
                                return Object.assign({},ind,{value:ind.value,diff:add_plus_for_positive(ind.diff),diff_absolute:add_plus_for_positive(ind.diff_absolute)});
                            });
                            that.$scope.amberindex = index_data[index_data.length - 1].data.filter(function(val){
                    return val.sub_type == 'Amber Index (AI)';
                })[0];
                that.$scope.indexes = new NgTableParams({count:100},{dataset: index_data[index_data.length - 1].data});
                that.$scope.select_indexes = index_data[index_data.length - 1].data;

                if (that.$scope.select_indexes.length > 0){
                    var index_type = {};
                    var sub_type = [];
                    that.$scope.select_indexes.forEach(function (ind) {
                        index_type[ind.index_type] = 1;
                    });
                    index_type = Object.keys(index_type);
                    index_type.forEach(function(ind_type){
                        sub_type[ind_type] = [];
                        that.$scope.select_indexes.forEach(function (ind) {
                            if (ind.index_type == ind_type){
                                sub_type[ind_type].push(ind.sub_type);
                            }
                        });
                    });
                    that.$scope.index_types = index_type;
                    that.$scope.sub_types = sub_type;
                }

            }

            make_date_bundle();
            render_table_raw();
            render_table_ball();

            that.$scope.link_to_pricelist = provide_pricelist();

            var display = that.$scope.display();

            if (display&&display.values&&display.values[0]&&display.values[0].y != 0){
                that.$scope.data = [that.$scope.display()];
            }
            if (that.$scope.api){
                that.$scope.api.refresh();
            }
            
            that.$scope.showapp = true;
  }

    function call_ajax_to_first(posts_per_page) {
        AmberAjaxFactory.ajaxToFirst(posts_per_page)
            .then(function(data){
                if (data.data.length != 0) {
                    console.log("GGGGGGGOOOOOOOOOO")
                    var main = postupdate(data);
                    if (counter_main < 7){
                        that.$scope.bundle = splice_array(that.$scope.bundle,main);
                        make_things_done(that.$scope.bundle);
                    }
                } 
        });
    }
    /* test call */
    call_ajax_to_first(15);

  function start_calling() {
    call_ajax_to_first(15);
    var posts_per_page = 5;
    var page = 1;
    for(var i = page;i<8;i++){
        call_ajax_to_add_data(posts_per_page,i);
    }
  }

  function call_version() {
    $http.get('http://amberprice.net/wp-json/posts?type[]=tableme&filter[category_name]=version')
        .then(function(data){
            try{
                if (that.$scope.get_from_localStorage){
                    var ver = data.data[0].content.slice(3,-5)
                    .replace(/&#171;/g, '"')
                    .replace(/&#187;/g, '"')
                    .replace(/&#8212;/g, '-')
                    .replace(/&#8243;/g, '"');
                    ver = unicode.unescape(ver);
                    ver = JSON.parse(ver);
                    ver = ver[0][0];
                    if (that.$scope.version != ver){
                        if (window.localStorage){
                        store.set('version',ver);
                        store.remove('tabledata');
                        start_calling();
                        }
                        
                    }
                } 
            } catch(e){

            }

        });
  }
  function call_data(){
    init_default_data();

    set_default_state_for_amber_type();

    if (window.localStorage){

        var tabledata = store.get('tabledata');
        that.$scope.version = store.get('version');
        call_version();
    } 
    if (tabledata){
        that.$scope.get_from_localStorage = true;
        make_things_done(tabledata);
        first_call(tabledata.length,start_calling);
    } else {
        start_calling();
    }
    call_ajax_to_every(15);
  }



  function first_call(length,callback){
    $http.get('http://amberprice.net/wp-json/posts?filter[posts_per_page]=1&type[]=tableme&page='+(length+1))
        .then(function(data){
            if (data.data.length > 0) {
                callback();
            }
        });
  }

  function call_ajax_to_data() {
    $http.get('http://amberprice.net/wp-json/posts?filter[posts_per_page]=100&type[]=tableme')
        .then(function(data){

            var main = postupdate(data);

            if (window.localStorage){
            store.remove('tabledata');
            store.set('tabledata',main);
        }
            make_things_done(main);
        });
  }


  var tempmain = [];
  var counter_main = 0;
  var counter_bundle = 0;

  function call_ajax_to_every(posts_per_page) {
    $http.get('http://amberprice.net/wp-json/posts?filter[posts_per_page]='+posts_per_page+'&type[]=tableme&filter[category_name]=every')
        .then(function(data){

            if (data.data.length != 0) {
                var main = postupdate(data);
                if (counter_main < 7){
                    that.$scope.bundle = splice_array(that.$scope.bundle,main);
                    make_things_done(that.$scope.bundle);
                }
            } else {

            }
        });
  }

  function call_ajax_to_add_data(posts_per_page,page) {
    $http.get('http://amberprice.net/wp-json/posts?filter[posts_per_page]='+posts_per_page+'&type[]=tableme&page='+page)
        .then(function(data){
 
            if (data.data.length != 0) {
                var main = postupdate(data);
                tempmain = tempmain.concat(main);
   
                that.$scope.bundle = splice_array(that.$scope.bundle,main);
                counter_bundle++;
                if ((counter_bundle%5) == 0){
                    make_things_done(that.$scope.bundle);
                } 
                
                call_ajax_to_add_data(posts_per_page,page+7);
            } else {
                counter_main++;
                
                if (counter_main == 7){
                    
                    make_things_done(tempmain);
                    if (window.localStorage){
                    store.remove('tabledata');
                    store.set('tabledata',tempmain);
                }
                }
            }
        });
  }

 

        $http.get('http://amberprice.net/wp-json/posts?type[]=events&&filter[posts_per_page]=1000')
        .then(function(data){
            
            var main = data.data.map(function(event){
                var terms = event.terms,
                    obj = {};
                obj.link = decodeURIComponent(event.link);
                obj.title = decodeURIComponent(event.title);
                if (event.excerpt){
                    obj.excerpt = decodeURIComponent(event.excerpt.slice(3,100)+"...");
                    obj.excerpt = obj.excerpt.replace(/<\/p>/g, '"');
                }
                
                
                if (event.featured_image) {
                    obj.image = decodeURIComponent(event.featured_image.source);
                }
                for (let key in terms){
                    obj[key] = decodeURIComponent(terms[key][0].name);
                }
                return obj;
                
            });
            
                main = main.map(function (event) {
                    if (event.start_time && event.end_date){
                    var newdate = event.start_time.slice(3,5)+'/'+event.start_time.slice(0,2)+'/'+event.start_time.slice(6);
                    var newenddate = event.end_date.slice(3,5)+'/'+event.end_date.slice(0,2)+'/'+event.end_date.slice(6);
                    return Object.assign({},event,{'start_date': +(new Date(Date.parse(newdate))),'end_date':+(new Date(Date.parse(newenddate)))});
                    }
                });


            
            var current_month = (new Date()).getMonth();
            var months = ['January','Febrary','March','April','May','June','July','August','September','October','November','December'];
            that.$scope.new_monthes = [];
            while (that.$scope.new_monthes.length != 12){
                that.$scope.new_monthes.push(months[current_month]);
                current_month++;
                if (current_month == 12){
                    current_month = 0;
                }
            }
            initSlider();
            that.$scope.current_event_month = (new Date()).getMonth();
            that.$scope.event_state =[];
            that.$scope.example_events = [];
            main.forEach(function (event) {
                if (event&&event.start_date){
                    var start_date_month= new Date(event.start_date).getMonth();
                } else {
                    var start_date_month = -1;
                }
                
                if (!that.$scope.event_state[start_date_month]) that.$scope.event_state[start_date_month] = [];
                that.$scope.event_state[start_date_month].push(event);
            });
            that.$scope.example_events = main.filter(function (arr) {
                return arr&&arr.master&&arr.master.length > 0;
            })
            that.$scope.event_container = {};
            main.forEach(function (event) {

                if (event){
                    Object.keys(event).forEach(function (key) {
                        if (!that.$scope.event_container[key]){
                            that.$scope.event_container[key] = [];
                        }
                        that.$scope.event_container[key].push({id:event[key],title:event[key]});
                    });
                }


            });
            main = main.filter(function(event){
                return (event&&event.title&&(event.title.length > 0));
            });

            that.$scope.event_container["start_date"] = that.$scope.event_container["start_date"].map(function (date) {
                return {id:date.id,title:that.$scope.format_date(date.title)};
            });
            that.$scope.event_container["end_date"] = that.$scope.event_container["end_date"].map(function (date) {
                return {id:date.id,title:that.$scope.format_date(date.title)};
            });

            that.$scope.events = new NgTableParams({count:100},{dataset: main});
            that.$scope.showevent = true;
            });

        

        that.$scope.change_current_event_month = function(increase) {
            that.$scope.current_event_month = increase ? ++that.$scope.current_event_month : --that.$scope.current_event_month;
        }
         call_data();

        
        that.$scope.$watch('state',function(new_one,old_one){
            console.log('state');
            console.log(that.$scope.state);

            if (!that.$scope.multidata){
                that.$scope.options.noData = "No data";
            }
            that.$scope.criteria = criteria_func();
            if ((new_one.amber_type != old_one.amber_type)||(new_one.amber_class != old_one.amber_class)){
                that.$scope.main = that.$scope.bundle.filter(function(data){
                    return ((data.amber_type == that.$scope.state.amber_type)&&(data.amber_class == that.$scope.state.amber_class));
                }).sort(function(data1,data2){
                    return data1.time - data2.time;
                });
                set_default_state_for_amber_type(new_one.amber_type);
                if ((new_one.amber_class == 'Indonesian (Sumatra)')&&(new_one.amber_type == 'Rough')){
                    that.$scope.state.frakcii = '<50g.';
                }
                if ((new_one.amber_class == 'Dominican')&&(new_one.amber_type == 'Rough')){
                    that.$scope.state.frakcii = '>100g.';
                }
                if ((new_one.amber_class != old_one.amber_class)&&(new_one.amber_class == "Dominican")){
                    if (!that.$scope.multilines) that.$scope.table_state = 'Rough (blue)';
                    that.$scope.state.sort = 'Blue';
                    that.$scope.state.form = 'ААА';
                    if (new_one.amber_type == 'Rough'){
                        that.$scope.state.frakcii = ">100g.";
                        that.$scope.state.sort = 'Blue';
                    that.$scope.state.form = 'ААА';
                    } else if (new_one.amber_type == 'Beads'){
                        that.$scope.state.frakcii = "20+/5+";
                        that.$scope.state.sort = 'Blue';
                    that.$scope.state.form = 'ААА';
                    }
                }
                if ((new_one.amber_class == 'Dominican')&&(new_one.amber_type == 'Beads')){
                    that.$scope.state.frakcii = '20+/5+';
                }
                if (new_one.amber_type != old_one.amber_type){
                    var index_data = filter_index_country(angular.copy(that.$scope.store_indexes));
    
                    if (that.$scope.currency){
                        index_data = index_data.map(function(index){
                            debugger;
                            var temp_ = current_currency();
                            var cur = current_currency()[that.$scope.state.currency];
      
                            index.data = index.data.map(function(ind){
                                return Object.assign({},ind,{value:Math.round(ind.value*100)/100,diff:add_plus_for_positive(Math.round(ind.diff*100)/100),diff_absolute:add_plus_for_positive(Math.round(ind.diff_absolute*100)/100)});
                            })
                            return index;
                        });

                        that.$scope.amberindex = index_data[index_data.length - 1].data.filter(function(val){
                            return val.sub_type == 'Amber Index (AI)';
                        })[0];
                        if ((that.$scope.multidata.length > 0) && (new_one.currency != old_one.currency)){
                            var temp_multidata = angular.copy(that.$scope.multidata_base);
                            temp_multidata = temp_multidata.map(function(chart){
                                var chart_value = chart.values;
                                chart_value = chart_value.map(function(point){
                                    point.y = point.y*current_currency()[that.$scope.state.currency];
                                    return point;
                                });
                                chart.values = chart_value;
                                return chart;
                            });
                            that.$scope.multidata = temp_multidata;
                            yDomainRe();
                            that.$scope.api.refresh();
                        }
                    }

                    that.$scope.indexes = new NgTableParams({count:100},{dataset: index_data[index_data.length - 1].data});
                    that.$scope.indexes.reload();
                }

                if((new_one.amber_class != old_one.amber_class)&&(that.$scope.multilines)){
                var index_data = filter_index_country(angular.copy(that.$scope.store_indexes));

                    index_data = index_data.map(function(index){
                        var cur = current_currency()[that.$scope.state.currency];

                        index.data = index.data.map(function(ind){
                            return Object.assign({},ind,{value:Math.round(ind.value*100)/100,diff:add_plus_for_positive(Math.round(ind.diff*100)/100),diff_absolute:add_plus_for_positive(Math.round(ind.diff_absolute*100)/100)});
                        })
                        return index;
                    });
                    that.$scope.select_indexes = index_data[index_data.length - 1].data;
                    if (that.$scope.select_indexes.length > 0){
                        var index_type = {};
                        var sub_type = [];
                        that.$scope.select_indexes.forEach(function (ind) {
                            index_type[ind.index_type] = 1;
                        });
                        index_type = Object.keys(index_type);
                        index_type.forEach(function(ind_type){
                            sub_type[ind_type] = [];
                            that.$scope.select_indexes.forEach(function (ind) {
                                if (ind.index_type == ind_type){
                                    sub_type[ind_type].push(ind.sub_type);
                                }
                            });
                        });
                        that.$scope.index_types = index_type;
                        that.$scope.sub_types = sub_type;
                        that.$scope.state.sub_type = that.$scope.sub_types[that.$scope.state.index_type][1];
                    }
                }
            }
            if (new_one.index_type != old_one.index_type) {

                var index_data = filter_index_country(angular.copy(that.$scope.store_indexes));

                    index_data = index_data.map(function(index){
                        var cur = current_currency()[that.$scope.state.currency];
 
                        index.data = index.data.map(function(ind){
                            return Object.assign({},ind,{value:Math.round(ind.value*100)/100,diff:add_plus_for_positive(Math.round(ind.diff*100)/100),diff_absolute:add_plus_for_positive(Math.round(ind.diff_absolute*100)/100)});
                        })
                        return index;
                    });
                    that.$scope.select_indexes = index_data[index_data.length - 1].data;
                    if (that.$scope.select_indexes.length > 0){
                        var index_type = {};
                        var sub_type = [];
                        that.$scope.select_indexes.forEach(function (ind) {
                            index_type[ind.index_type] = 1;
                        });
                        index_type = Object.keys(index_type);
                        index_type.forEach(function(ind_type){
                            sub_type[ind_type] = [];
                            that.$scope.select_indexes.forEach(function (ind) {
                                if (ind.index_type == ind_type){
                                    sub_type[ind_type].push(ind.sub_type);
                                }
                            });
                        });
                        that.$scope.index_types = index_type;
                        that.$scope.sub_types = sub_type;
                        that.$scope.state.sub_type = that.$scope.sub_types[that.$scope.state.index_type][1];
                    }
                that.$scope.state.sub_type = that.$scope.sub_types[new_one.index_type][0];
            }

            if (new_one.amber_class != old_one.amber_class){
                if (new_one.amber_class == "Indonesian (Sumatra)"){
                    that.$scope.table_state = 'Rough';
                } else if (new_one.amber_class == "Mexican (Chiapas)"){
                    that.$scope.table_state = 'Beads';
                } else if (new_one.amber_class == "Dominican"){
                    if (!that.$scope.multilines) that.$scope.table_state = 'Rough (blue)';
                    that.$scope.state.sort = 'Blue';
                    that.$scope.state.form = 'ААА';
                    if (new_one.amber_type == 'Rough'){
                        that.$scope.state.frakcii = ">100g.";
                        that.$scope.state.sort = 'Blue';
                    that.$scope.state.form = 'ААА';
                    } else if (new_one.amber_type == 'Beads'){
                        that.$scope.state.frakcii = "20+/5+";
                        that.$scope.state.sort = 'Blue';
                    that.$scope.state.form = 'ААА';
                    }
                } else {
                    that.$scope.table_state = 'Rough (medium fractions)';
                }
                if (new_one.amber_type == 'Rough'){
                    render_table_raw();
                } else if (new_one.amber_type == 'Beads'){
                    render_table_ball();
                }
            }
            if ((new_one.country != old_one.country)||(new_one.currency != old_one.currency)){
                if (new_one.amber_type == 'Rough'){
                    render_table_raw();
                } else if (new_one.amber_type == 'Beads'){
                    render_table_ball();
                }
                store.set('currency',new_one.currency);

                var index_data = filter_index_country(angular.copy(that.$scope.store_indexes));

                if (that.$scope.currency){
                    index_data = index_data.map(function(index){
                        var cur = current_currency()[that.$scope.state.currency];
               
                        index.data = index.data.map(function(ind){
                            return Object.assign({},ind,{value:Math.round(ind.value*100)/100,diff:add_plus_for_positive(Math.round(ind.diff*100)/100),diff_absolute:add_plus_for_positive(Math.round(ind.diff_absolute*100)/100)});
                        })
                        return index;
                    });

                    that.$scope.amberindex = index_data[index_data.length - 1].data.filter(function(val){
                        return val.sub_type == 'Amber Index (AI)';
                    })[0];
                    if ((that.$scope.multidata.length > 0) && (new_one.currency != old_one.currency)){
                        rebuild_multibundle(that.$scope.graph.graph_time,that.$scope.graph.graph_type);
                        // var temp_multidata = angular.copy(that.$scope.multidata_base);
                        // temp_multidata = temp_multidata.map(function(chart){
                        //     var chart_value = chart.values;
                        //     chart_value = chart_value.map(function(point){
                        //         point.y = point.y*current_currency()[that.$scope.state.currency];
                        //         return point;
                        //     });
                        //     chart.values = chart_value;
                        //     return chart;
                        // });
                        // that.$scope.multidata = temp_multidata;
                        // yDomainRe();
                        // that.$scope.api.refresh();
                    }
                }

                that.$scope.indexes = new NgTableParams({count:100},{dataset: index_data[index_data.length - 1].data});
                that.$scope.indexes.reload();
            }
            if (that.$scope.state.amber_class != 'Dominican'){
               
                that.$scope.indostate.form = new_one.form.split('/')[1];
                if (['100g.','200g.','300g.','500g.','1000g.'].some(function (k) {
                    return new_one.frakcii == k;
                })) {
                    that.$scope.indostate.frakcii = ">"+new_one.frakcii;
                } else {
                    that.$scope.indostate.frakcii = new_one.frakcii;
                }
            }

            
            if ((that.$scope.main)&&(that.$scope.multidata.length == 0)){
                var display = that.$scope.display();
                if (display&&display.values&&display.values[0]&&display.values[0].y != 0){
                    that.$scope.data = [that.$scope.display()];
                    if (that.$scope.api){
                        that.$scope.api.refresh();
                    }
                }
                //that.$scope.data = [that.$scope.display()];
            }
            if ((new_one.date)&&(old_one.date)&&(new_one.date.value != old_one.date.value)){
                var index_data = filter_index_country(angular.copy(that.$scope.store_indexes));
                var myindex = index_data.filter(function (ind) {
                    return that.$scope.state.date.value == ind.time.toString();
                });
                        if (that.$scope.currency.length > 0){
                            var cur = current_currency()[that.$scope.state.currency];
                        } else {
                            var cur = 1;
                        }
                        
                        
                if (myindex.length > 0) {
                    myindex= myindex[0].data.map(function(ind){
                                    return Object.assign({},ind,{value:ind.value,diff:add_plus_for_positive(ind.diff),diff_absolute:add_plus_for_positive(ind.diff_absolute)});
                           });
                    that.$scope.amberindex = myindex.filter(function(val){
                        return val.sub_type == 'Amber Index (AI)';
                    })[0];
                } else {
                    myindex = null;
                }

                that.$scope.indexes = new NgTableParams({count:100},{dataset: myindex});
                that.$scope.indexes.reload();
            }
            

            if (that.$scope.data_bundle){
                try {
                    that.$scope.price_table = that.$scope.data_bundle[that.$scope.state.date.value][that.$scope.state.amber_class];
                    //that.$scope.init_date = 'Rough';
                    render_table_raw();
                    //that.$scope.init_date = 'Beads';
                    render_table_ball();
                    that.$scope.init_date = false;
                } 
                catch (e){
                    
                }

            }
            
        },true);

        that.$scope.$watch('showapp',function (new_value) {
            var userAgent = window.navigator.userAgent;

            if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
                that.$scope.state.amber_class = 'Indonesian (Sumatra)';
                setTimeout(function (ar) {
                    that.$scope.state.amber_class = 'Baltic';
                },50);
            }
        })

        that.$scope.$watch('table_state',function(new_value){
            if (that.$scope.state&&!that.$scope.multilines){
                if ((new_value.indexOf('rough') != -1)||(new_value.indexOf('Rough') != -1)){
                    that.$scope.state.amber_type = "Rough";
                } else if ((new_value.indexOf('Beads') != -1)||(new_value.indexOf('beads') != -1)) {
                    that.$scope.state.amber_type = "Beads";
                } else {
                    that.$scope.state.amber_type = "Indexes";
                }
                
                if ((new_value.indexOf('blue') != -1)||(new_value.indexOf('Blue') != -1)){
                    that.$scope.state.sort = 'Blue';
                } else if ((new_value.indexOf('green') != -1)||(new_value.indexOf('Green') != -1)){
                    that.$scope.state.sort = 'Green';
                } else if ((new_value.indexOf('yellow') != -1)||(new_value.indexOf('Yellow') != -1)){
                    that.$scope.state.sort = 'Yellow';
                } 
            }

        },true);

        
        that.$scope.$watch('graph',function(new_value){
            rebuild_multibundle(new_value.graph_time,new_value.graph_type);
        },true);

        that.$scope.$watch('indostate',function(new_value){
            if (that.$scope.state.amber_class == 'Indonesian (Sumatra)') {
                that.$scope.state.form = 'Opaque/'+new_value.form;
            }
            if (new_value.frakcii[0] == '>'){
                that.$scope.state.frakcii = new_value.frakcii.slice(1);
            } else {
                that.$scope.state.frakcii = new_value.frakcii;
            }
        },true);
        
        that.$scope.$watch('data', function(new_data){
          if (new_data){
            var arr = new_data[0].values,
                length = arr.length,
                last,
                prev,
                obj = {};
            if (length > 1){
                last = arr[arr.length - 1].y,
                prev = arr[arr.length - 2].y;
                obj.value = last - prev;
                obj.persent = ((last - prev)/prev*100).toFixed(2)+"%";
                obj.positive = obj.value > 0;
                obj.actual = last;
            } else {
                obj.value = 0;
                obj.persent = 0;
                obj.positive = false;
                obj.actual = 0;
            }
            that.$scope.index = obj;
          }

            
        },true);

        that.$scope.makemoresymbol = function(s){
            return AmberFactory.functions.concato('>',s);
        }

        var height_of_chart = 550;

        that.$scope.clear_them_all = function () {
            that.$scope.multidata = [];
            that.$scope.multidata_base = [];
        }

        function yDomainRe(pass_data) {
            that.$scope.options.chart.yDomain = AmberFactory.multiCharts.yDomainRe(pass_data, that.$scope.multidata);            
        }

        function xDomainRe(pass_data) {
            that.$scope.options.chart.xDomain = AmberFactory.multiCharts.xDomainRe(pass_data, that.$scope.multidata); 
        }


        function rebuild_multibundle(time,type) {
            var now = (new Date()).getTime();
            var localtime;
            if (time == "3 months"){
                localtime = now - 1000*60*60*24*30*3; 
            } else if (time == "6 months"){
                localtime = now - 1000*60*60*24*30*6;
            } else if (time == "1 year"){
                localtime = now - 1000*60*60*24*30*12;
            } else {
                localtime = 0;
            }
                            
            if (type == 'Absolute values'){
                            var temp_multidata = angular.copy(that.$scope.multidata_base);
                            temp_multidata = temp_multidata.map(function(chart){
                                var chart_value = chart.values;
                                chart_value = chart_value.filter(function(point){
                                    return localtime < point.x;
                                });
                                chart_value = chart_value.map(function(point){
                                    point.y = point.y*current_currency(point.x)[that.$scope.state.currency];
                                    return point;
                                });
                                chart.values = chart_value;
                                return chart;
                            });

                            xDomainRe(temp_multidata);   
                            that.$scope.multidata = temp_multidata;
                            yDomainRe();
                            if (that.$scope.api){
                                that.$scope.api.refresh();
                            }
            } else if (type == 'Percent Change'){
                            var temp_multidata = angular.copy(that.$scope.multidata_base);
                            temp_multidata = temp_multidata.map(function(chart){
                                var chart_value = chart.values;
                                chart_value = chart_value.filter(function(point){
                                    return localtime < point.x;
                                });
                                chart_value = chart_value.sort(function(el1,el2){
                                   return el1.x - el2.x;
                                });
                                var start = chart_value[0].y;
                                var chart1 = angular.copy(chart_value);
                                chart_value.map(function(point,i,arr){
                                    if (i == 0){
                                        point.y = (point.y - start)/start*100;
                                    } else {
                                        point.y = (chart1[i].y - chart1[i - 1].y)/chart1[i - 1].y*100;
                                    }
                                    
                                    return point;
                                });
                                chart.values = chart_value;
                                return chart;
                            });
                            xDomainRe(temp_multidata); 
                            yDomainRe(temp_multidata);
                            that.$scope.multidata = temp_multidata;
                            if (that.$scope.api){
                                that.$scope.api.refresh();
                            }
            }
            if (that.$scope.multilines){
                height_of_chart +=25;
                setTimeout(function(){jQuery('svg.nvd3-svg').height(height_of_chart)},200);
            }

        }
        that.$scope.add_to_bundle = function(){
            //that.$scope.options.chart.height += 25;
            var temp = that.$scope.display();
            
            temp.color = getRandomColor();
            if (that.$scope.state.amber_type == 'Rough'){
                temp.key = that.$scope.state.amber_type + ' | ' + that.$scope.state.amber_class + ' | ' + that.$scope.state.form + ' | ' + that.$scope.state.frakcii + ' | ' + that.$scope.state.sort;
            } else if (that.$scope.state.amber_type == 'Beads') {
                temp.key = that.$scope.state.amber_type + ' | ' + that.$scope.state.amber_class + ' | ' + that.$scope.state.form + ' | ' + that.$scope.state.frakcii;
            } else if ((that.$scope.state.amber_type == 'index')||(that.$scope.state.amber_type == 'Indexes')) {
                temp.key = that.$scope.state.amber_type + ' | ' + that.$scope.state.amber_class + ' | ' +that.$scope.state.index_type + '/'+ that.$scope.state.sub_type;
            }
            var k = that.$scope.multidata.filter(function(i){
                return temp.key == i.key;
            });
            
            if (k.length != 0){
                setTimeout(function(){jQuery('svg.nvd3-svg').height(height_of_chart)},200);
                xDomainRe(that.$scope.multidata); 
                yDomainRe(that.$scope.multidata);
                return;
            }
            
            var base = custom_filter();
            var values_to_line_to_base = base.map(function(el){
                        return {
                            x:+(new Date(el.x.split('.').join('/'))),
                            y:+el.y
                        }
                    }).sort(function(el1,el2){
                   return el1.x - el2.x;
                });
            var temp_base = Object.assign({},temp,{values: values_to_line_to_base});
            that.$scope.multidata_base.push(temp_base);
            rebuild_multibundle(that.$scope.graph.graph_time,that.$scope.graph.graph_type);
            
        }

        
        var base = [];
        

        that.$scope.cutedges = function(input){
            if (input){
                return input.split('/')[1][0]+input.split('/')[0][0];
            }
        }

        that.$scope.getFirstWord = function (input) {
            if (input){
                return input.split('/')[0];
            }
        }
            
        
        that.$scope.change_state = function(updates) {
            that.$scope.state = Object.assign(that.$scope.state,updates);
        };
        
        function getRandomColor() {
            return AmberFactory.functions.getRandomColor();
        }

        function criteria_func(){
           if (that.$scope.state.amber_type == 'Rough'){
                if (that.$scope.state.amber_class == 'Indonesian (Sumatra)'){
                    return function(value){
                        return ((value.country == that.$scope.state.country)&&(value.frakcii == that.$scope.state.frakcii)&&(value.sort == that.$scope.state.sort));
                    }
                } else {
                    return function(value){
                        return ((value.country == that.$scope.state.country)&&(value.form == that.$scope.state.form)&&(value.frakcii == that.$scope.state.frakcii)&&(value.sort == that.$scope.state.sort));
                    }  
                }

           } else if (that.$scope.state.amber_type == 'Beads'){
                if ((that.$scope.state.sort == 'Blue')||(that.$scope.state.sort == 'Green')||(that.$scope.state.sort == 'Yellow')){
                    return function(value){
                        return ((value.country == that.$scope.state.country)&&(value.frakcii == that.$scope.state.frakcii)&&(value.form == that.$scope.state.form)&&(value.sort == that.$scope.state.sort));
                    }
                } else {
                   return function(value){
                       return ((value.country == that.$scope.state.country)&&(value.form == that.$scope.state.form)&&(value.frakcii == that.$scope.state.frakcii));
                   }
               }
           } else if ((that.$scope.state.amber_type == 'index')||(that.$scope.state.amber_type == 'Indexes')){
                return function(value){
                   return ((value.country == that.$scope.state.country)&&(value.sub_type == that.$scope.state.sub_type));
               }
           }
           return function(){
               return true;
           }
       }
       
  }
}

export default HomeController;
