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
      currency: store.get('currency') || "EUR",
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
      currency: store.get('currency') || "EUR",
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

  let functions = {
    formatDate: function(date) {
                    var d= new Date(parseInt(date));
                    var dd = d.getDate();
                    var mm = d.getMonth()+1;//January is 0!`

                    var yyyy = d.getFullYear();
                    if(dd<10){dd='0'+dd}
                    if(mm<10){mm='0'+mm}
                    return dd+'.'+mm+'.'+yyyy;
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
