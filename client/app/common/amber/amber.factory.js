import store from '../store';

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

  return {
    convert: convert,
    base: base,
    functions: functions,
    options: options
  };
};

export default AmberFactory;
