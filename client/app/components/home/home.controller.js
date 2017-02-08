import { NgTableParams } from 'ng-table';
import jQuery from 'jquery';
import store from '../../common/store';

class HomeController {
  static $inject = ['$scope','$http', 'AmberFactory'];

  constructor($scope,$http, AmberFactory) {

    let convert = AmberFactory.convert;

    console.log(AmberFactory);

    var that = this;

    that.$scope = $scope;

    that.$scope.events = new NgTableParams({count:100},{dataset: [{a:1}]}); /* test */

    function init_default_data(){
        that.$scope.basestate = AmberFactory.base.baseState;
        that.$scope.state = AmberFactory.base.state;
        that.$scope.select_options = AmberFactory.base.selectOptions;

        that.$scope.graph = {
            graph_time: AmberFactory.base.selectOptions.graph_time[0],
            graph_type: AmberFactory.base.selectOptions.graph_type[0]
        };

        that.$scope.indostate = AmberFactory.base.indoState;

        that.$scope.table_state = AmberFactory.base.tableState;

        that.$scope.format_date = AmberFactory.functions.formatDate;

        that.$scope.tables = {};

        that.$scope.display = function () { /* (1) to do */
            var data = custom_filter(), values_to_line,values_to_line_to_base;
            if (data[0]){
                if (that.$scope.currency.length == 0){
                    that.$scope.currency = [{'EUR':1}];
                }
                if (!that.$scope.state.currency) {
                    that.$scope.state.currency = 'EUR';
                }
                values_to_line = data.map(function(el){
                        return {
                            x:+(new Date(el.x.split('.').join('/'))),
                            y:+el.y*current_currency(el.x)[that.$scope.state.currency]
                        }
                    });
                
                values_to_line = values_to_line.sort(function(el1,el2){
                   return el1.x - el2.x;
                });

                var xDomainMin = values_to_line[0].x - 1000*60*60*24*1;
                var xDomainMax = 1000*60*60*24*1 + values_to_line[values_to_line.length - 1].x;

                if (that.$scope.multidata.length > 0){
                    that.$scope.options.chart.xDomain[0] = xDomainMin > that.$scope.options.chart.xDomain[0] ? that.$scope.options.chart.xDomain[0] : xDomainMin;
                    that.$scope.options.chart.xDomain[1] = xDomainMax > that.$scope.options.chart.xDomain[1] ? xDomainMax : that.$scope.options.chart.xDomain[1];
                } else {
                    that.$scope.options.chart.xDomain = [xDomainMin, xDomainMax];
                }
                
                var y_values = values_to_line.sort(function(el1,el2){
                   return el1.y - el2.y;
                });
                var yDomainMin = values_to_line[0].y*0.96;
                var yDomainMax = values_to_line[values_to_line.length -1].y*1.04;
                if (that.$scope.multidata.length > 0){
                    that.$scope.options.chart.yDomain[0] = yDomainMin > that.$scope.options.chart.yDomain[0] ? that.$scope.options.chart.yDomain[0] : yDomainMin;
                    that.$scope.options.chart.yDomain[1] = yDomainMax > that.$scope.options.chart.yDomain[1] ? yDomainMax : that.$scope.options.chart.yDomain[1];
                } else {
                    that.$scope.options.chart.yDomain = [yDomainMin, yDomainMax];
                }
                
                values_to_line.sort(function(el1,el2){
                   return el1.x - el2.x;
                });
                return {
                    values: values_to_line,
                    key: 'Value('+that.$scope.state.currency+')',
                    color: '#74aa9d',
                    strokeWidth: 2,
                    classed: 'dashed'
                };
            }
            return {
                values: {x:0,y:0},
                key: 'Value('+that.$scope.state.currency+')',
                color: '#74aa9d',
                strokeWidth: 2,
                classed: 'dashed'
            };               
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

  function splice_array(main,second){
    if (main){
        var titles = main.map(function(obj){
            return obj.title;
        });
        second.forEach(function(obj){
            if (titles.indexOf(obj.title) != -1){
                var removed = main.splice(titles.indexOf(obj.title), 1, obj);
            } else {
                main.push(obj);
            }
            
        });
        return main;
    } else {
        return second;
    }

  }
  function make_things_done(main){
            that.$scope.bundle = main;
            that.$scope.main = that.$scope.bundle.filter(function(data){
                return ((data.amber_type == that.$scope.state.amber_type)&&(data.amber_class == that.$scope.state.amber_class));
            }).sort(function(data1,data2){
                return data1.time - data2.time;
            });
            that.$scope.currency = that.$scope.bundle.filter(function(data){
                return data.type == 'currency';
            });
            if (that.$scope.currency.length > 0) {
                that.$scope.currency = that.$scope.currency[0].data.filter(function(data){
                   return !!data.date; 
                }).map(function(data){
                    return Object.assign({},data,{string_date:data.date, date:+(new Date(data.date.split('.').join('/')))});
                }).sort(function(data1,data2){
                    return data1.date - data2.date;
                }); 
            }
            console.log('currency');
            console.log(that.$scope.currency);
            that.$scope.store_indexes = that.$scope.bundle.filter(function(data){
                return data.amber_type == 'Indexes';
            }).sort(function(data1,data2){
                return data1.time - data2.time;
            });

            var index_data = filter_index_country(angular.copy(that.$scope.store_indexes));
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

            

            that.$scope.pricelist = that.$scope.bundle.filter(function(data){
                return data.type == 'pricelist';
            });
            var tempdescription= that.$scope.bundle.filter(function (data) {
                return data.type == 'descriptionindex';
            });

            if (tempdescription&&tempdescription[0]){
                that.$scope.descriptionindex = tempdescription[0].data;
            }
            make_up_deals(that.$scope.bundle.filter(function(data){
                return data.type == 'deals';
            }));

            count_current();
            
        
            if (that.$scope.multilines){
                that.$scope.options.chart.width = 800;
                that.$scope.options.chart.height = 500;
                that.$scope.options.chart.legendPosition = 'bottom';
                that.$scope.options.chart.legend =  {padding: 320,width:400,expanded:true,maxKeyLength:100,margin:{top:15}};
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

  function round_to_two(str) {
      return Math.round(parseFloat(str)*100)/100;
  }

  function postupdate(data){
        return data.data.map(function(plans){
                var my_array = plans.content.slice(3,-5)
                .replace(/&#171;/g, '"')
                .replace(/&#187;/g, '"')
                .replace(/&#8212;/g, '-')
                .replace(/&#8243;/g, '"');
                my_array = unicode.unescape(my_array);
                my_array = JSON.parse(my_array);
                var meta_data = plans.title.split('/');
                
                if (meta_data[0] == 'amber') {
                    if (meta_data[2] == 'raw'){
                        if (meta_data[3] == 'indonezian'){
                            my_array = my_array.map(function(arr){
                                var random = getRandomInt(100,1000);
                                return {
                                    frakcii: repa(arr[0]),
                                    sort: convert[arr[1]],
                                    country: arr[2],
                                    value: round_to_two(arr[3])
                                }
                            });
                        } else if (meta_data[3] == 'domenic'){
                            my_array = my_array.map(function(arr){
                                var random = getRandomInt(100,1000);
                                return {
                                    frakcii: repa(arr[0]),
                                    sort: convert[arr[2]],
                                    form: convert[arr[1]],
                                    country: arr[3],
                                    value: round_to_two(arr[4])
                                }
                            });
                        } else {
                            my_array = my_array.map(function(arr){
                                var random = getRandomInt(100,1000);
                                return {
                                    frakcii: repa(arr[0]),
                                    form: convert[arr[2]],
                                    sort: convert[arr[1]],
                                    country: arr[3],
                                    value: round_to_two(arr[4])
                                }
                            });
                        }

                    } else if (meta_data[2] == 'ball'){
                        if (meta_data[3] == 'domenic'){
                            my_array = my_array.map(function(arr){
                                var random = getRandomInt(100,1000);
                                return {
                                    frakcii: arr[0],
                                    form: arr[1],
                                    sort: convert[arr[2]],
                                    country: arr[3],
                                    value: round_to_two(arr[4])
                                }
                            });
                        } else {
                            my_array = my_array.map(function(arr){
                                var random = getRandomInt(100,1000);
                                return {
                                    frakcii: repa(arr[0]),
                                    form: convert[arr[1]],
                                    country: arr[2],
                                    value: round_to_two(arr[3])
                                }
                            });
                        }                    
                        
                    } else if (meta_data[2] == 'index'){
                        my_array = my_array.map(function(arr){
                            var random = getRandomInt(100,1000);
                            var rand_diff = getRandomInt(-100,100);
                            var type;
                            if (arr[0] == "-"){
                                type = "General";
                            } else{
                                type = convert[arr[0]];
                            }
                            return {
                                index_type: type,
                                sub_type: arr[1],
                                country: arr[2],
                                value: round_to_two(arr[3])
                            }
                        });
                        
                    }
                    return {
                      title: plans.title,
                      type: meta_data[0],
                      time: +(new Date(meta_data[1].split('.').join('/'))),
                      data: my_array,
                      amber_type: convert[meta_data[2]],
                      amber_class: convert[meta_data[3]]
                    };  

                } else if (meta_data[0] == 'currency'){
                    var labels = my_array[0];
                    my_array = my_array.slice(1).map(function(arr){
                        var temp = new Object();
                        for(var i=0;i<arr.length;i++){
                            temp[labels[i]] = arr[i];
                        }
                        return temp;
                    });
                    return {
                        title: plans.title,
                        type: meta_data[0],
                        data: my_array
                    }
                } else if (meta_data[0] == 'deals'){
                    my_array = my_array.map(function(arr){
                        return {
                            datetime: +(new Date(arr[0].split('.').join('/') + " "+ arr[1])),
                            description: arr[2],
                            weight: arr[3],
                            old_value: arr[4],
                            value: arr[5],
                            diff: arr[6],
                            title: plans.title,
                        }
                    });
                    return {
                        type: meta_data[0],
                        data: my_array
                    }
                } else if (meta_data[0] == 'pricelist'){
                    my_array = my_array.map(function(arr){
                        var newdate = arr[0].slice(3,5)+'/'+arr[0].slice(0,2)+'/'+arr[0].slice(6);
                        return {
                            datetime: +(new Date(Date.parse(newdate))),
                            link: arr[1],
                        }
                    });
                    return {
                        type: meta_data[0],
                        data: my_array,
                        title: plans.title
                    }
                } else if (meta_data[0] == 'descriptionindex') {
                    var nicearr = {};
                    my_array.forEach(function(arr){
                        nicearr[arr[0]]=arr[1];
                    });
                    return {
                        type: meta_data[0],
                        data: nicearr,
                        title: plans.title
                    }
                }
                return {};
        });
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

  function repa(val){
    return val.replace(/г/g, 'g').replace(/мм/g, 'mm');
  }

  function start_calling() {
    call_ajax_to_first(15);
    var posts_per_page = 5;
    var page = 1;
    for(var i = page;i<8;i++){
        call_ajax_to_add_data(posts_per_page,i);
    }
  }

  var tempmain = [];
  var counter_main = 0;
  var counter_bundle = 0;
  function call_ajax_to_first(posts_per_page) {
    $http.get('http://amberprice.net/wp-json/posts?filter[posts_per_page]='+posts_per_page+'&type[]=tableme&filter[category_name]=first')
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
            window.init_slider();
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

            // Object.keys(that.$scope.event_container).forEach(function (keys) {
            //     var temp = that.$scope.event_container[keys].filter(function (elem,index,self) {
            //         return index == self.indexOf(elem);
            //     });
            //     temp = temp.map(function (t) {
            //         return {id:t,title:t};
            //     })
            //     that.$scope.event_container[key] = temp;
            // });

            that.$scope.event_container["start_date"] = that.$scope.event_container["start_date"].map(function (date) {
                return {id:date.id,title:that.$scope.format_date(date.title)};
            });
            that.$scope.event_container["end_date"] = that.$scope.event_container["end_date"].map(function (date) {
                return {id:date.id,title:that.$scope.format_date(date.title)};
            });

            // console.log('that.$scope.container1');
            // console.log(that.$scope.event_container);
            // that.$scope.event_container = that.$scope.event_container.map(function (events) {
            //     return events.map(function (event) {
            //         return {id:event,title:event};
            //     })
            // });
            // console.log('that.$scope.container2');
            // console.log(that.$scope.event_container);
            // console.log(main);
            that.$scope.events = new NgTableParams({count:100},{dataset: main});
            that.$scope.showevent = true;
            });

        

        that.$scope.change_current_event_month = function(increase) {
            if (increase){
                that.$scope.current_event_month+=1;
            } else{
                that.$scope.current_event_month-=1;
            }
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
          console.log('new_data');
          console.log(new_data);
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


        function provide_pricelist(){
            if (that.$scope.state.date){
                var date = that.$scope.state.date.value;
                if (that.$scope.pricelist[0]){
                    var pricelist = that.$scope.pricelist[0].data.filter(function (price) {
                        return price.datetime == date;
                    })[0];
                    if (!pricelist) pricelist = that.$scope.pricelist[0].data;
                    return pricelist.link; 
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    



        function make_date_bundle(){
            that.$scope.data_bundle = {};
            that.$scope.bundle.forEach(function(table){
                if (table.time&&table.amber_class&&table.amber_type){
                    if (!that.$scope.data_bundle[table.time]){
                        that.$scope.data_bundle[table.time] = {};
                    }
                    
                    if (!that.$scope.data_bundle[table.time][table.amber_class]){
                        that.$scope.data_bundle[table.time][table.amber_class] = {};
                    }
                    that.$scope.data_bundle[table.time][table.amber_class][table.amber_type] = table.data;
                }
            });

            if (that.$scope.data_bundle){
                that.$scope.select_options.date = Object.keys(that.$scope.data_bundle);
                that.$scope.select_options.date = that.$scope.select_options.date.map(function(date){
                    return {
                        name: that.$scope.format_date(date),
                        value: date
                    }
                }).sort(function (date1,date2) {
                    return date1.value - date2.value;
                })
                that.$scope.state.date = that.$scope.select_options.date[that.$scope.select_options.date.length -1];
            }
    
            //fill the gaps
            
        }

        function get_current_bundle(date,am_class,am_type){
            var list_of_dates = Object.keys(that.$scope.data_bundle).sort(function (date1,date2) {
                    return parseInt(date1) - parseInt(date2);
                });
            if(that.$scope.data_bundle){
                var curr_index = list_of_dates.indexOf(date);
                var target;
                for (var i = curr_index;i >= 0;i--){
                    if (that.$scope.data_bundle[list_of_dates[i]]){
                        if (that.$scope.data_bundle[list_of_dates[i]][am_class]){
                            target = that.$scope.data_bundle[list_of_dates[i]][am_class][am_type];
                        }
                    }
                    if (target){
                        return target;
                    }
                }
            }
            return null;
        }



        function make_event_current_list(event_list){
            
        }




        function add_plus_for_positive(num){

            if (typeof num == "number"){
                return num > 0 ? "+"+num.toFixed(2) : num.toFixed(2);
            }
            else {
                if (num[0] == "-"){
                    return num;
                } else{
                    return "+"+num;
                }
            }
        }

        that.$scope.makemoresymbol = function(s){
            return concato('>',s);
        }

        function concato() {
            return [].slice.call(arguments,0).reduce(function (s,i) {
                return s+i;
            });
        }
        
        function filter_index_country(ind){
            /* convert to currency */
            ind = ind.filter(function (indo) {
                return that.$scope.state.amber_class == indo.amber_class;
            });
            var indo = ind.map(function(index,i){
                
                index.data = index.data.filter(function(data){
                    return (data.country == that.$scope.state.country);
                });
                console.log('before');
                console.dir(index);
                index.data = index.data.map(function(data){
                    return Object.assign({},data,{value: data.value*current_currency(index.time)[that.$scope.state.currency]})
                });
                console.log('after');
                console.dir(index);

                return index;
            });
            return indo.map(function(index,i){
                
                index.data = index.data.map(function(data,j){
                    data = Object.assign({},data);
                    if (ind[i - 1]){
                        
                        try{
                            data.diff_absolute = Math.round((data.value - indo[i - 1].data[j].value) * 100)/100;
                        } catch(e) {
                            data.diff_absolute = 0;
                        }
                        
                    } else {
                        data.diff_absolute = 0;
                    }
                    
                    data.positive = (data.diff_absolute > 0);
                    data.diff = Math.round((data.diff_absolute/(data.value-data.diff_absolute) *100)*100)/100;
                    return data;
                });

                

                return index;
            })
        }

        function filter_index_country_small (ind) {
            return index.filter(function(data){
                    return data.country == that.$scope.state.country;
                })
                .map(function(data){
                    return Object.assign({},data,{value: data.value*current_currency()[that.$scope.state.currency]})
                })
                .map(function(data,j){
                    if (ind[i - 1]){
                        data.diff_absolute = data.value - ind[i - 1].data[j].value;
                    } else {
                        data.diff_absolute = 0;
                    }
                    
                    data.positive = (data.diff_absolute > 0);
                    data.diff = (data.diff_absolute/(data.value-data.diff_absolute) *100).toFixed(2);
                    return data;
                });
        }
        function set_default_state_for_amber_type(amber_type){
            if (amber_type == 'Rough'){
                that.$scope.state.frakcii = "20-50g.";
                that.$scope.state.sort = "ААА";
                that.$scope.state.form = "Opaque/Beadable";
                that.$scope.state.country = "Европа";
            } else if (amber_type == 'Beads'){
                that.$scope.state.frakcii = "12mm+/1g+";
                if (that.$scope.state.amber_class != 'Dominican'){
                    that.$scope.state.form = "Opaque/ААА";
                }
                
                that.$scope.state.country = "Европа";
            } else if (amber_type == 'Indexes'){
                that.$scope.state.index_type = "General";
            }
        }
        var height_of_chart = 550;
        that.$scope.clear_them_all = function () {
            that.$scope.multidata = [];
            that.$scope.multidata_base = [];
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
        
        function count_current(){
            that.$scope.curr = {};
            that.$scope.select_options.amber_type.forEach(function(type){
                var cur = that.$scope.bundle.filter(function(data){
                    return type == data.amber_type
                }).sort(function(data1,data2){
                    return data1.time - data2.time
                });
                that.$scope.select_options.amber_class.forEach(function(subclass){
                    var nextcur = cur.filter(function(data){
                        return subclass == data.amber_class;
                    }).sort(function(data1,data2){
                        return data1.time - data2.time
                    });
                    that.$scope.curr[type+subclass] = nextcur[nextcur.length - 1];
                });
            });
        }

        
        var base = [];

        function render_table_ball(){
            base = [];
            if (that.$scope.state.date){
                that.$scope.current = get_current_bundle(that.$scope.state.date.value,that.$scope.state.amber_class,'Beads');
            }
            if (that.$scope.current){
                if (that.$scope.state.amber_class == 'Dominican'){
                    that.$scope.select_options.domenic.frakcii.ball.forEach(function(option){
                        base.push({
                            frakcii: option
                        });
                    });
                    var base_blue = angular.copy(base).map(function(arr){
                        that.$scope.select_options.domenic.form.forEach(function(fo,i){
                                arr["form"+i] = get_element_table({
                                    frakcii: arr.frakcii,
                                    sort: 'Blue',
                                    form: fo,
                                    type: 'Beads'
                                });
                        });
                        arr.mm = arr.frakcii.split('/')[0];
                        arr.gr = arr.frakcii.split('/')[1];
                        return arr;
                    });
                    var base_green = angular.copy(base).map(function(arr){
                        that.$scope.select_options.domenic.form.forEach(function(fo,i){
                                arr["form"+i] = get_element_table({
                                    frakcii: arr.frakcii,
                                    sort: 'Green',
                                    form: fo,
                                    type: 'Beads'
                                });
                        });
                        arr.mm = arr.frakcii.split('/')[0];
                        arr.gr = arr.frakcii.split('/')[1];
                        return arr;
                    });
                    var base_yellow = angular.copy(base).map(function(arr){
                        that.$scope.select_options.domenic.form.forEach(function(fo,i){
                                arr["form"+i] = get_element_table({
                                    frakcii: arr.frakcii,
                                    sort: 'Yellow',
                                    form: fo,
                                    type: 'Beads'
                                });
                        });
                        arr.mm = arr.frakcii.split('/')[0];
                        arr.gr = arr.frakcii.split('/')[1];
                        return arr;
                    });
                    base_blue = set_currency(base_blue);
                    base_green = set_currency(base_green);
                    base_yellow = set_currency(base_yellow);
                    that.$scope.tables.ball_blue = new NgTableParams({count:100}, {dataset: base_blue});
                    that.$scope.tables.ball_green = new NgTableParams({count:100}, {dataset: base_green});
                    that.$scope.tables.ball_yellow = new NgTableParams({count:100}, {dataset: base_yellow});
                    that.$scope.tables.ball_blue.reload();
                    that.$scope.tables.ball_green.reload(); 
                    that.$scope.tables.ball_yellow.reload();
                    
                } else {
                that.$scope.select_options.ball.frakcii.forEach(function(option){
                    base.push({
                        frakcii:option
                    });
                });


                var base_opacue = angular.copy(base).map(function(arr){
                    that.$scope.select_options.ball.form.slice(0,5).forEach(function(fo,i){
                        arr["form"+i] = get_element_table({
                            frakcii: arr.frakcii,
                            form: fo,
                            type: 'Beads'
                        });
                    });
                    arr.mm = arr.frakcii.split('/')[0];
                    arr.gr = arr.frakcii.split('/')[1];
                    return arr;
                });
                var base_transparent = angular.copy(base).map(function(arr){
                    that.$scope.select_options.ball.form.slice(5,10).forEach(function(fo,i){
                        arr["form"+i] = get_element_table({
                            frakcii: arr.frakcii,
                            form: fo,
                            type: 'Beads'
                        });
                    });
                    arr.mm = arr.frakcii.split('/')[0];
                    arr.gr = arr.frakcii.split('/')[1];
                    return arr;
                });
                base_opacue = set_currency(base_opacue);
                base_transparent = set_currency(base_transparent);

                that.$scope.tables.ball = new NgTableParams({count:100}, {dataset: base_opacue});
                that.$scope.tables.ball_opacue = new NgTableParams({count:100}, {dataset: base_opacue});
                that.$scope.tables.ball_transparent = new NgTableParams({count:100}, {dataset: base_transparent});
                that.$scope.tables.ball.reload();
                that.$scope.tables.ball_opacue.reload(); 
                that.$scope.tables.ball_transparent.reload();
            }
            } else {
                that.$scope.tables.ball = null;
                that.$scope.tables.ball_opacue = null;
                that.$scope.tables.ball_transparent = null;
            }

            
        }
        
        function set_currency(base){
            var cur;
            if (that.$scope.currency.length == 0) {
                cur = 1;
            } else {
                cur = current_currency()[that.$scope.state.currency];
            }
            return base.map(function(item){
               return Object.assign({},item,{form0:Math.round(item.form0*cur * 100) / 100,
                                            form1:Math.round(item.form1*cur * 100) / 100,
                                            form2:Math.round(item.form2*cur * 100) / 100,
                                            form3:Math.round(item.form3*cur * 100) / 100,
                                            form4:Math.round(item.form4*cur * 100) / 100,
                                            form5:Math.round(item.form5*cur * 100) / 100,
                                            sort1:Math.round(item.sort1*cur * 100) / 100,
                                            sort2:Math.round(item.sort2*cur * 100) / 100,
                                            sort0:Math.round(item.sort0*cur * 100) / 100,
                                            sort3:Math.round(item.sort3*cur * 100) / 100,
                                            sort4:Math.round(item.sort4*cur * 100) / 100 //переделать в более компактный вид
                                            }) 
            });
        }

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
        function render_table_raw(){
            base = [];
            if (that.$scope.state.date){
            that.$scope.current = get_current_bundle(that.$scope.state.date.value,that.$scope.state.amber_class,'Rough');
        }
            if (that.$scope.current) {
            if (that.$scope.state.amber_class == 'Indonesian (Sumatra)'){
                that.$scope.select_options.indonezian.frakcii.forEach(function(option){
                    base.push({
                        frakcii: option
                    });
                });
            } else if (that.$scope.state.amber_class == 'Dominican'){
                            that.$scope.select_options.domenic.frakcii.raw.big.forEach(function(option){
                                base.push({
                                    frakcii: option
                                });
                            });
                    var base_blue = angular.copy(base).map(function(arr){
                        that.$scope.select_options.domenic.form.forEach(function(fo,i){
                                arr["form"+i] = get_element_table({
                                    frakcii: arr.frakcii,
                                    sort: 'Blue',
                                    form: fo,
                                    type: 'Rough'
                                });
                        });
                        arr.mm = arr.frakcii.split('/')[0];
                        arr.gr = arr.frakcii.split('/')[1];
                        return arr;
                    });
                    base_blue = set_currency(base_blue);
                    that.$scope.tables.raw_blue = new NgTableParams({count:100}, {dataset: base_blue});
                    that.$scope.tables.raw_blue.reload();
                    base = [];

                            that.$scope.select_options.domenic.frakcii.raw.small.forEach(function(option){
                                base.push({
                                    frakcii: option
                                });
                            });
                    var base_green = angular.copy(base).map(function(arr){
                        that.$scope.select_options.domenic.form.forEach(function(fo,i){
                                arr["form"+i] = get_element_table({
                                    frakcii: arr.frakcii,
                                    sort: 'Green',
                                    form: fo,
                                    type: 'Rough'
                                });
                        });
                        arr.mm = arr.frakcii.split('/')[0];
                        arr.gr = arr.frakcii.split('/')[1];
                        return arr;
                    });
                    base_green = set_currency(base_green);
                    that.$scope.tables.raw_green = new NgTableParams({count:100}, {dataset: base_green});
                    that.$scope.tables.raw_green.reload(); 
                    base = [];

                            that.$scope.select_options.domenic.frakcii.raw.small.forEach(function(option){
                                base.push({
                                    frakcii: option
                                });
                            });

                    var base_yellow = angular.copy(base).map(function(arr){
                        that.$scope.select_options.domenic.form.forEach(function(fo,i){
                                arr["form"+i] = get_element_table({
                                    frakcii: arr.frakcii,
                                    sort: 'Yellow',
                                    form: fo,
                                    type: 'Rough'
                                });
                        });
                        arr.mm = arr.frakcii.split('/')[0];
                        arr.gr = arr.frakcii.split('/')[1];
                        return arr;
                    });
                    
                    
                    base_yellow = set_currency(base_yellow);
                    
                    
                    that.$scope.tables.raw_yellow = new NgTableParams({count:100}, {dataset: base_yellow});
                    
                    
                    that.$scope.tables.raw_yellow.reload();
                        


            } else {
                that.$scope.select_options.frakcii.forEach(function(option){
                        var b = ['100g.','200g.','300g.','500g.','1000g.'].reverse();
                            var biggy = !b.some(function(el){
                                return el == option;
                            });
                            base.push({
                                frakcii:option,
                                form:"Opaque/Beadable"
                            });
                            base.push({
                                frakcii:option,
                                form:"Transparent/Beadable"
                            });
                            if (biggy){
                                base.push({
                                    frakcii:option,
                                    form:"Opaque/Flat"
                                });
                            }


                            if (biggy){
                                base.push({
                                    frakcii:option,
                                    form:"Transparent/Flat"
                                });
                            }

                });
            }

            if (that.$scope.state.amber_class == 'Indonesian (Sumatra)'){
                base.map(function(arr){
                    that.$scope.select_options.indonezian.sort.forEach(function(so,i){
                        arr["form"+i]= get_element_table({
                            frakcii: arr.frakcii,
                            form: arr.form,
                            sort: so,
                            type: 'Rough'
                        });
                    });
                    return arr;
                });
            } else {
                base.map(function(arr){
                    that.$scope.select_options.sort.forEach(function(so,i){
                    
                        arr["form"+i]= get_element_table({
                            frakcii: arr.frakcii,
                            form: arr.form,
                            sort: so,
                            type: 'Rough'
                        });
                    });
                    return arr;
                });
               
            }

            base = set_currency(base);
            var big_base = base.filter(function(row){
                var b = ['100g.','200g.','300g.','500g.','1000g.'].reverse();
                return b.some(function(val){
                    return row.frakcii == val;
                });
            });
            that.$scope.tables.bigraw = new NgTableParams({count:100}, {dataset: big_base});
            that.$scope.tables.bigraw.reload();
            var small_base = base.filter(function(row){
                var b = ['100g.','200g.','300g.','500g.','1000g.'].reverse();
                return b.every(function(val){
                    return row.frakcii != val;
                });
            });
            that.$scope.tables.raw = new NgTableParams({count:100}, { dataset: small_base});
            that.$scope.tables.raw.reload();
            }

        }
        
        function make_up_deals(deals){
            if(deals[0]){
                deals = deals[0].data.map(function(deal) {
                    return Object.assign({},deal,{positive:(+(deal.diff)>0)});
                })
                that.$scope.deals = new NgTableParams({count:100},{dataset: deals});
            }
        }
        
        function get_element_table(sort_param){
            var criteria,result;
            sort_param.country = that.$scope.state.country;
            if (sort_param.type == 'Rough') {
                if ((sort_param.sort == "Низкое") || (sort_param.sort == "Черный лак")){
                    criteria = function(value){
                        return ((value.country == sort_param.country)&&(value.frakcii ==  sort_param.frakcii)&&(value.sort == sort_param.sort));
                    }   
                } else {
                    criteria = function(value){
                        return ((value.country == sort_param.country)&&(value.form == sort_param.form)&&(value.frakcii ==  sort_param.frakcii)&&(value.sort == sort_param.sort));
                    }
                }
                
            } else if (sort_param.type = 'Beads'){
                if ((sort_param.sort == 'Blue')||(sort_param.sort == 'Green')||(sort_param.sort == 'Yellow')){
                    criteria = function(value){
                            return ((value.country == sort_param.country)&&(value.frakcii ==  sort_param.frakcii)&&(value.form == sort_param.form)&&(value.sort == sort_param.sort));
                    }
                } else {
                    criteria = function(value){
                            return ((value.country == sort_param.country)&&(value.frakcii ==  sort_param.frakcii)&&(value.form == sort_param.form));
                    }
                }

            }
            if (that.$scope.init_date == 'Rough'){
                result = that.$scope.price_table['Rough'].filter(criteria)[0];
            } else if (that.$scope.init_date == 'Beads'){
                result = that.$scope.price_table['Beads'].filter(criteria)[0];
            } else {
                result = that.$scope.current.filter(criteria)[0];
            }
            if (result){
                return result.value;
            } else {
                return 0;
            }
            
        }
        
        
  
        function current_currency(date){
            console.log(date);
            if (date){
                if (typeof date == "number"){
                    var current_date = that.$scope.format_date(date).split('.');
                    current_date = current_date[2] + '.' +current_date[1] + '.' + current_date[0];
                } else {
                    var current_date = date;
                }
                
            } else {
                if (that.$scope.state.date){
                    var current_date = that.$scope.state.date.name.split('.');
                    current_date = current_date[2] + '.' +current_date[1] + '.' + current_date[0];
                } else {
                    if (that.$scope.currency) {
                        return that.$scope.currency[that.$scope.currency.length -1];
                    }
                }

            }
            var current_currency_object = that.$scope.currency.filter(function (cur) {
               return cur.string_date === current_date;
            });
            if (current_currency_object.length == 0){
              current_currency_object.push(that.$scope.currency[that.$scope.currency.length -1]);
            }
            return current_currency_object[0];
        }
        
        
        that.$scope.change_state = function(updates) {
            that.$scope.state = Object.assign(that.$scope.state,updates);
        };
        
        function getRandomColor() {
            var letters = '0123456789abcdef';
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        //that.$scope.data = sinAndCos();

        function yDomainRe(pass_data) {
            if (!pass_data) pass_data = that.$scope.multidata;
            var yDomainMin=Number.POSITIVE_INFINITY,yDomainMax=0;
            pass_data.forEach(function (graph) {
                graph.values.forEach(function (data) {

                    if (data.y > yDomainMax){
                        yDomainMax = data.y;
                    }
                    if (data.y < yDomainMin){
                        yDomainMin = data.y;
                    }
                });
            });
            if (yDomainMin < 0){
                that.$scope.options.chart.yDomain = [yDomainMin*1.04, yDomainMax*1.04];
            } else {
                that.$scope.options.chart.yDomain = [yDomainMin*0.96, yDomainMax*1.04];
            }
            

        }

        function xDomainRe(pass_data) {
            if (!pass_data) pass_data = that.$scope.multidata;
            var xDomainMin=Number.POSITIVE_INFINITY,xDomainMax=0;
            pass_data.forEach(function (graph) {

                graph.values.forEach(function (data) {
                    if (data.x > xDomainMax){
                        xDomainMax = data.x;
                    }
                    if (data.x < xDomainMin){
                        xDomainMin = data.x;
                    }
                });
            });
            that.$scope.options.chart.xDomain = [xDomainMin, xDomainMax];

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
       
        
        function custom_filter(){
            return that.$scope.main&&that.$scope.main.map(function(date){
                var val = date.data.filter(that.$scope.criteria)[0] || {value:0};
                return {
                    x: date.title.split('/')[1],
                    y: val.value
                }
            })
        }
        
        function getRandomInt(min, max)
        {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }


        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e',  //color - optional: choose your own line color.
                    strokeWidth: 2,
                    classed: 'dashed'
                }
            ];
        };
  }
}

window.init_slider = function(){
  jQuery('#checkbox').change(function(){
    setInterval(function () {
        moveRight();
    }, 3000);
  });
  
    var slideCount = jQuery('#slider ul li').length;
    var slideWidth = jQuery('#slider ul li').width();
    var slideHeight = jQuery('#slider ul li').height();
    var sliderUlWidth = slideCount * slideWidth;
    
    jQuery('#slider').css({ width: slideWidth, height: slideHeight });
    
    jQuery('#slider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
    
    jQuery('#slider ul li:last-child').prependTo('#slider ul');

    function moveLeft() {
        jQuery('#slider ul').animate({
            left: + slideWidth
        }, 200, function () {
            jQuery('#slider ul li:last-child').prependTo('#slider ul');
            jQuery('#slider ul').css('left', '');
        });
    };

    function moveRight() {
        jQuery('#slider ul').animate({
            left: - slideWidth
        }, 200, function () {
            jQuery('#slider ul li:first-child').appendTo('#slider ul');
            jQuery('#slider ul').css('left', '');
        });
    };

    jQuery('a.control_prev').click(function () {
        moveLeft();
    });

    jQuery('a.control_next').click(function () {
        moveRight();
    });
} 
jQuery( document ).ready(function() {
jQuery('.b-news .fusion-post-content-container p:last-of-type').each(function() {
  jQuery(that.$scope).text(jQuery(that.$scope).text()+'...');
});
    jQuery('.related-posts .title-heading-left').text('Other publications');
});




var unicode = {
  escape: function(s) {
    return s.replace(/^[-~]|\\/g, function(m) {
      var code = m.charCodeAt(0);
      return '\\u' + ((code < 0x10) ? '000' : ((code < 0x100) ? '00' : ((code < 0x1000) ? '0' : ''))) + code.toString(16);
    });
  },
  unescape : function (s) {
    return s.replace(/\\u([a-fA-F0-9]{4})/g, function(matched, g1) {
      return String.fromCharCode(parseInt(g1, 16))
    })
  }
}

export default HomeController;
