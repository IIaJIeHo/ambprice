import store from '../store';
import { NgTableParams } from 'ng-table';

let AmberFactory = function () {

  let convert = { 
    raw : 'Rough',
    ball: 'Beads',
    index: 'Indexes',
    domenic:'Dominican',
    dominic:'Dominican',
    baltic:'Baltic',
    ukranian:'Ukrainian',
    mexican:'Mexican (Chiapas)',
    indonezian:'Indonesian (Sumatra)',
    'Матовый/Компактный':'Opaque/Beadable',
    'Прозрачный/Компактный':'Transparent/Beadable',
    'Прозрачный/Плоский':'Transparent/Flat',
    'Матовый/Плоский':'Opaque/Flat',
    'МИКС':'MIX',
    'ААА':'ААА',
    'АА':'АА',
    'А':'А',
    'В':'В',
    'С':'С',
    'Голубой':'Blue',
    'Зеленый':'Green',
    'Желтый':'Yellow',
    'Матовый/ААА':'Opaque/ААА',
    'Матовый/АА':"Opaque/АА",
    'Матовый/А':"Opaque/А",
    'Матовый/В':"Opaque/В",
    'Матовый/С':"Opaque/С",
    'Прозрачный/ААА':'Transparent/ААА',
    'Прозрачный/АА':"Transparent/АА",
    'Прозрачный/А':"Transparent/А",
    'Прозрачный/В':"Transparent/В",
    'Прозрачный/С':"Transparent/С",
    'Сырец': 'Rough',
    'Шар':'Ball'
  };

  let base = {
    baseState: {
      type: "amber",
      country: "Европа",
      form: "Opaque/Beadable",
      frakcii: "20-50g.",
      sort: "АА",
      currency: store.get('currency') || "RUB",
      amber_class: "Baltic",
      amber_type: "Rough",
      index_type: "General",
      date: null,
      sub_type: "Amber Index (AI)"
    },
    state: {
      type: "amber",
      country: "Европа",
      form: "Opaque/Beadable",
      frakcii: "20-50g.",
      sort: "ААА",
      currency: store.get('currency') || "RUB",
      amber_class: "Baltic",
      amber_type: "Rough",
      index_type: "General",
      date: null,
      sub_type: "Amber Index (AI)"
    },
    indoState: {form: "ААА", frakcii: ">1000g."},
    tableState: "Rough (medium fractions)",
    selectOptions: {
        country : ["Россия","Европа","Гонконг"],
        currency: ["EUR","RUB","USD","CNY","HKD","JPY","TRY","INR","MXN"],
        amber_class: ["Baltic","Indonesian (Sumatra)","Ukrainian","Mexican (Chiapas)","Dominican"],
        amber_type: ["Rough","Beads","Indexes"],
        index_type: ["Rough","Beads","Indexes"],
        sort: ["ААА","А","В","MIX","С"],
        form: ["Opaque/Beadable","Transparent/Beadable","Opaque/Flat","Transparent/Flat"],
        frakcii: ["1000g.","500g.","300g.","200g.","100g.","50-100g.","20-50g.","10-20g.","5-10g.","2.5-5g."],
        table: ["Rough (medium fractions)","Rough (large fractions)","Opaque beads","Transparent beads","Indexes"],
        graph_time: ["3 months","6 months","1 year","All data"],
        graph_type: ["Absolute values","Percent Change"],
        special: {
            amber_class: ["Baltic","Indonesian (Sumatra)","Ukrainian","Dominican"],
            frakcii: ["50-100g.","20-50g.","10-20g.","5-10g.","2.5-5g."],
            frakcii2: [">1000g.",">500g.",">300g.",">200g.",">100g.","50-100g.","20-50g.","10-20g.","5-10g.","2.5-5g."]
        },
        indonezian: {
            frakcii: [">300g.","50-300g.","<50g."],
            sort: ["ААА","АА","А","В","С"],
            table: ["Rough","Beads","Indexes"],
            form: ["ААА","АА","А","В","С"]
        },
        domenic: {
            frakcii: {
                raw:{
                    big: [">100g.","75-100g.","50-75g.","40-50g.","30-40g.","20-30g.","10-20g.","<10g."],
                    small: [">100g.","50-100g.","<50g."],
                },
                ball:["20+/5+","15+/2+","12+/1+","10+/0.5+","8+/0.25+","6+/0.1+","6-/0.1-"]
            },
            form: ["ААА","АА","А"],
            sort: ["Blue","Green","Yellow"],
            table: ["Rough (blue)","Rough (green)","Rough (yellow)","Beads (blue)","Beads (green)","Beads (yellow)","Indexes"],
        },
        mexican: {
            table: ["Beads","Indexes"],
            amber_type:["Beads","Indexes"],
            form: ["Opaque/ААА","Opaque/АА","Opaque/А","Opaque/В","Opaque/С"]
        },
        ball: {
            frakcii: ["40mm+/30g+",
                        "35mm+/25g+",
                        "30mm+/20g+",
                        "25mm+/10g+",
                        "20mm+/5g+",
                        "15mm+/2g+",
                        "12mm+/1g+",
                        "10mm+/0.5g+",
                        "8mm+/0.25g+",
                        "6mm+/0.1g+",
                        "6мм-/0.1g-"],
            form: ["Opaque/ААА","Opaque/АА","Opaque/А","Opaque/В","Opaque/С","Transparent/ААА","Transparent/АА","Transparent/А","Transparent/В","Transparent/С"]
        }
    }
  };

let repa = function(val){
    return val.replace(/г/g, 'g').replace(/мм/g, 'mm');
}

let unicode = {
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

let round_to_two = function(str) {
    return Math.round(parseFloat(str)*100)/100;
}

  let functions = {
    formatDate: function(date) {
                    var d= new Date(parseInt(date));
                    var dd = d.getDate();
                    var mm = d.getMonth()+1;//January is 0!`

                    var yyyy = d.getFullYear();
                    if(dd<10){dd='0'+dd}
                    if(mm<10){mm='0'+mm}
                    return dd+'.'+mm+'.'+yyyy;
                },
    customFilter: function(main,criteria){ 
        console.log(main);
        return main&&main.map(function(date){
            var val = date.data.filter(criteria)[0] || {value:0};
            return {
                x: date.title.split('/')[1],
                y: val.value
            }
        })
    },
    currentCurrency: function(date,currency,state_date,format_date){
        if (date){
            if (typeof date == "number"){
                var current_date = format_date(date).split('.');
                current_date = current_date[2] + '.' +current_date[1] + '.' + current_date[0];
            } else {
                var current_date = date;
            }
            
        } else {
            if (state_date){
                var current_date = state_date.name.split('.');
                current_date = current_date[2] + '.' +current_date[1] + '.' + current_date[0];
            } else {
                if (currency) {
                    return currency[currency.length -1];
                }
            }

        }
        var current_currency_object = currency.filter(function (cur) {
           return cur.string_date === current_date;
        });
        if (current_currency_object.length == 0){
          current_currency_object.push(currency[currency.length -1]);
        }
        return current_currency_object[0];
    },
    display:function(custom_filter,current_currency,currency,state_currency,multidata,options) {
            var data = custom_filter(), values_to_line,values_to_line_to_base;
            if (data[0]){
                if (currency.length == 0){
                    currency = [{'EUR':1}];
                }
                if (!state_currency) {
                    state_currency = 'EUR';
                }
                values_to_line = data.map(function(el){
                        return {
                            x:+(new Date(el.x.split('.').join('/'))),
                            y:+el.y*current_currency(el.x)[state_currency]
                        }
                    });
                
                values_to_line = values_to_line.sort(function(el1,el2){
                   return el1.x - el2.x;
                });

                var xDomainMin = values_to_line[0].x - 1000*60*60*24*1;
                var xDomainMax = 1000*60*60*24*1 + values_to_line[values_to_line.length - 1].x;

                if (multidata.length > 0){
                    options.chart.xDomain[0] = xDomainMin > options.chart.xDomain[0] ? options.chart.xDomain[0] : xDomainMin;
                    options.chart.xDomain[1] = xDomainMax > options.chart.xDomain[1] ? xDomainMax : options.chart.xDomain[1];
                } else {
                    options.chart.xDomain = [xDomainMin, xDomainMax];
                }
                
                var y_values = values_to_line.sort(function(el1,el2){
                   return el1.y - el2.y;
                });
                var yDomainMin = values_to_line[0].y*0.96;
                var yDomainMax = values_to_line[values_to_line.length -1].y*1.04;
                if (multidata.length > 0){
                    options.chart.yDomain[0] = yDomainMin > options.chart.yDomain[0] ? options.chart.yDomain[0] : yDomainMin;
                    options.chart.yDomain[1] = yDomainMax > options.chart.yDomain[1] ? yDomainMax : options.chart.yDomain[1];
                } else {
                    options.chart.yDomain = [yDomainMin, yDomainMax];
                }
                
                values_to_line.sort(function(el1,el2){
                   return el1.x - el2.x;
                });
                return {
                    values: values_to_line,
                    key: 'Value('+state_currency+')',
                    color: '#74aa9d',
                    strokeWidth: 2,
                    classed: 'dashed'
                };
            }
            return {
                values: {x:0,y:0},
                key: 'Value('+state_currency+')',
                color: '#74aa9d',
                strokeWidth: 2,
                classed: 'dashed'
            };               
    },
    setDefautStateByAmberType: function(amber_type,amber_class){
        if (amber_type == 'Rough'){
            return {
                frakcii: "20-50g.",
                sort: "ААА",
                form: "Opaque/Beadable",
                country: "Европа"
            }
        } else if (amber_type == 'Beads'){
            if (amber_class != 'Dominican'){
                return {
                    form: "Opaque/ААА",
                    frakcii: "12mm+/1g+",
                    country: "Европа"
                }
            } else {
                return {
                    frakcii: "12mm+/1g+",
                    country: "Европа"
                }
            }
        } else if (amber_type == 'Indexes'){
            return {
                index_type: "General"
            }
        }
    },
    postUpdate: function(data){
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
                                return {
                                    frakcii: repa(arr[0]),
                                    sort: convert[arr[1]],
                                    country: arr[2],
                                    value: round_to_two(arr[3])
                                }
                            });
                        } else if (meta_data[3] == 'domenic'){
                            my_array = my_array.map(function(arr){
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
    },
    spliceArray: function(main,second) {
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
      },
    selectOptionDate: function(data_bundle, format_date){
        let date = Object.keys(data_bundle);
        date = date.map(function(date){
            return {
                name: format_date(date),
                value: date
            }
        }).sort(function (date1,date2) {
            return date1.value - date2.value;
        });
        return date;
    },
    getCurrentBundle: function(date, am_class, am_type, data_bundle){
        var list_of_dates = Object.keys(data_bundle).sort(function (date1,date2) {
                return parseInt(date1) - parseInt(date2);
            });
        if(data_bundle){
            var curr_index = list_of_dates.indexOf(date);
            var target;
            for (var i = curr_index;i >= 0;i--){
                if (data_bundle[list_of_dates[i]]){
                    if (data_bundle[list_of_dates[i]][am_class]){
                        target = data_bundle[list_of_dates[i]][am_class][am_type];
                    }
                }
                if (target){
                    return target;
                }
            }
        }
        return null;
    },
    setCurrency: function(base, currency, current_currency, state){
        var cur;
        if (currency.length == 0) {
            cur = 1;
        } else {
            cur = current_currency()[state.currency];
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
    },
    getElementTable: function(sort_param, country, init_date, price_table, current) {
        var criteria,result;
        sort_param.country = country;
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
        if (init_date == 'Rough'){
            result = price_table['Rough'].filter(criteria)[0];
        } else if (init_date == 'Beads'){
            result = price_table['Beads'].filter(criteria)[0];
        } else {
            result = current.filter(criteria)[0];
        }
        if (result){
            return result.value;
        } else {
            return 0;
        }
        
    },
    providePricelist: function(date,pricelist){
        if (date){
            var date = date.value;
            if (pricelist&&pricelist[0]){
                var my_pricelist = pricelist[0].data.filter(function (price) {
                    return price.datetime == date;
                })[0];
                if (!my_pricelist) my_pricelist = pricelist[0].data;
                return my_pricelist.link; 
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    addPlusForPositive: function(num){
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
    },
    concato: function() {
        return [].slice.call(arguments,0).reduce(function (s,i) {
            return s+i;
        });
    },
    filterIndexCountrySmall: function(ind, country, current_currency, currency) {
        return index.filter(function(data){
                return data.country == country;
            })
            .map(function(data){
                return Object.assign({},data,{value: data.value*current_currency()[currency]})
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
    },
    getRandomColor: function() {
        var letters = '0123456789abcdef';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
  }

let parseBundle = {
    main: function(bundle, state){
        return bundle.filter(function(data){
                return ((data.amber_type == state.amber_type)&&(data.amber_class == state.amber_class));
        }).sort(function(data1,data2){
            return data1.time - data2.time;
        });
    },
    currency: function (bundle) {
        let currency = bundle.filter(function(data){
                return data.type == 'currency';
            });

        if (currency.length > 0) {
            currency = currency[0].data.filter(function(data){
               return !!data.date; 
            }).map(function(data){
                return Object.assign({},data,{string_date:data.date, date:+(new Date(data.date.split('.').join('/')))});
            }).sort(function(data1,data2){
                return data1.date - data2.date;
            }); 
        }

        return currency;
    },
    storeIndexes: function (bundle) {
        return bundle.filter(function(data){
            return data.amber_type == 'Indexes';
        }).sort(function(data1,data2){
            return data1.time - data2.time;
        });
    },
    priceList: function (bundle) {
        return bundle.filter(function(data){
                return data.type == 'pricelist';
            });
    },
    descriptionIndex: function (bundle) {
        var tempdescription= bundle.filter(function (data) {
            return data.type == 'descriptionindex';
        });

        if (tempdescription&&tempdescription[0]){
            return tempdescription[0].data;
        } else {
            return null;
        }
    },
    deals: function (bundle) {
        return bundle.filter(function(data){
            return data.type == 'deals';
        })
    },
    dataBundle: function(bundle){
        let data_bundle = {};
        bundle.forEach(function(table){
            if (table.time&&table.amber_class&&table.amber_type){
                if (!data_bundle[table.time]){
                    data_bundle[table.time] = {};
                }
                
                if (!data_bundle[table.time][table.amber_class]){
                    data_bundle[table.time][table.amber_class] = {};
                }
                data_bundle[table.time][table.amber_class][table.amber_type] = table.data;
            }
        });

        return data_bundle;
    }


}

let view = {
    filterIndexCountry: function (ind, current_currency, state){
        ind = ind.filter(function (indo) {
            return state.amber_class == indo.amber_class;
        });

        var indo = ind.map(function(index,i){
            
            index.data = index.data.filter(function(data){
                return (data.country == state.country);
            });

            index.data = index.data.map(function(data){
                return Object.assign({},data,{value: data.value*current_currency(index.time)[state.currency]})
            });

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
    },
    makeUpDeals: function(bundle) {
        let deals = parseBundle.deals(bundle);

        if(deals&&deals[0]){
            deals = deals[0].data.map(function(deal) {
                return Object.assign({},deal,{positive:(+(deal.diff)>0)});
            })
            return new NgTableParams({count:100},{dataset: deals});
        }
    }
}

  let options = {
    chart: {
        type: 'lineChart',
        width: 600,
        height: 300,
        margin : {
            top: 20,
            right: 20,
            bottom: 40,
            left: 75
        },
        noData:"Add charts for comparision",
        useInteractiveGuideline: true,
        dispatch: {
            stateChange: function(e){ console.log("stateChange"); },
            changeState: function(e){ console.log("changeState"); },
            tooltipShow: function(e){ console.log("tooltipShow"); },
            tooltipHide: function(e){ console.log("tooltipHide"); }
        },
        xAxis: {
            axisLabel: '',
            tickFormat: function(d) {
                return d3.time.format('%d.%m.%y')(new Date(d))
            },
        },
        yAxis: {
            axisLabel: '',
            tickFormat: function(d){
                return d3.format('.02f')(d);
            },
            axisLabelDistance: -10
        },
        callback: function(chart){
            console.log("!!! lineChart callback !!!");
        },
        refreshDataOnly: true,
    },
    title: {
        enable: true,
        text: ''
    },
    subtitle: {
        enable: true,
        text: '',
        css: {
            'text-align': 'center',
            'margin': '10px 13px 0px 7px'
        }
    },
    caption: {
        enable: false,
        html: 'Дата и Стоимость',
        css: {
            'text-align': 'justify',
            'margin': '10px 13px 0px 7px'
        }
    }
};

let multilineOptions = {
    width: 800,
    height: 500,
    legendPosition : 'bottom',
    legend: {padding: 320,width:400,expanded:true,maxKeyLength:100,margin:{top:15}}
}

let multiCharts = {
    yDomainRe: function(pass_data, multidata) {
        if (!pass_data) pass_data = multidata;
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
        return yDomainMin < 0 ? [yDomainMin*1.04, yDomainMax*1.04] : [yDomainMin*0.96, yDomainMax*1.04]    
    },
    xDomainRe: function(pass_data, multidata) {
        if (!pass_data) pass_data = multidata;
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
        return [xDomainMin, xDomainMax];
    }
}

let render = {
    tableRaw: {
        base: function(base, amber_class, select_options, get_element_table, set_currency, tables){
            if (amber_class == 'Indonesian (Sumatra)'){
                select_options.indonezian.frakcii.forEach(function(option){
                    base.push({
                        frakcii: option
                    });
                });
            } else if (amber_class == 'Dominican'){
                select_options.domenic.frakcii.raw.big.forEach(function(option){
                    base.push({
                        frakcii: option
                    });
                });
                var base_blue = angular.copy(base).map(function(arr){
                    select_options.domenic.form.forEach(function(fo,i){
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
                tables.raw_blue = new NgTableParams({count:100}, {dataset: base_blue});
                tables.raw_blue.reload();
                base = [];

                select_options.domenic.frakcii.raw.small.forEach(function(option){
                    base.push({
                        frakcii: option
                    });
                });
                var base_green = angular.copy(base).map(function(arr){
                    select_options.domenic.form.forEach(function(fo,i){
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
                tables.raw_green = new NgTableParams({count:100}, {dataset: base_green});
                tables.raw_green.reload(); 
                base = [];

                select_options.domenic.frakcii.raw.small.forEach(function(option){
                    base.push({
                        frakcii: option
                    });
                });

                var base_yellow = angular.copy(base).map(function(arr){
                    select_options.domenic.form.forEach(function(fo,i){
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
                
                
                tables.raw_yellow = new NgTableParams({count:100}, {dataset: base_yellow});
                
                tables.raw_yellow.reload();
            } else {
                select_options.frakcii.forEach(function(option){
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

            if (amber_class == 'Indonesian (Sumatra)'){
                base.map(function(arr){
                    select_options.indonezian.sort.forEach(function(so,i){
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
                    select_options.sort.forEach(function(so,i){
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
            tables.bigraw = new NgTableParams({count:100}, {dataset: big_base});
            tables.bigraw.reload();
            var small_base = base.filter(function(row){
                var b = ['100g.','200g.','300g.','500g.','1000g.'].reverse();
                return b.every(function(val){
                    return row.frakcii != val;
                });
            });
            tables.raw = new NgTableParams({count:100}, { dataset: small_base});
            tables.raw.reload();
        }
    },
    tableBall: {
        base: function(base, amber_class, select_options, get_element_table, set_currency, tables){
            if (amber_class == 'Dominican'){
                select_options.domenic.frakcii.ball.forEach(function(option){
                    base.push({
                        frakcii: option
                    });
                });
                var base_blue = angular.copy(base).map(function(arr){
                    select_options.domenic.form.forEach(function(fo,i){
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
                    select_options.domenic.form.forEach(function(fo,i){
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
                    select_options.domenic.form.forEach(function(fo,i){
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
                tables.ball_blue = new NgTableParams({count:100}, {dataset: base_blue});
                tables.ball_green = new NgTableParams({count:100}, {dataset: base_green});
                tables.ball_yellow = new NgTableParams({count:100}, {dataset: base_yellow});
                tables.ball_blue.reload();
                tables.ball_green.reload(); 
                tables.ball_yellow.reload();
                
            } else {
                select_options.ball.frakcii.forEach(function(option){
                    base.push({
                        frakcii:option
                    });
                });


                var base_opacue = angular.copy(base).map(function(arr){
                    select_options.ball.form.slice(0,5).forEach(function(fo,i){
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
                    select_options.ball.form.slice(5,10).forEach(function(fo,i){
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

                tables.ball = new NgTableParams({count:100}, {dataset: base_opacue});
                tables.ball_opacue = new NgTableParams({count:100}, {dataset: base_opacue});
                tables.ball_transparent = new NgTableParams({count:100}, {dataset: base_transparent});
                tables.ball.reload();
                tables.ball_opacue.reload(); 
                tables.ball_transparent.reload();
            }
        }
    }
}

  return {
    convert: convert,
    base: base,
    functions: functions,
    options: options,
    parseBundle: parseBundle,
    view: view,
    multilineOptions: multilineOptions,
    render: render,
    multiCharts: multiCharts
  };
};

export default AmberFactory;
