//Showing Date
head.js("assets/js/clock/date.js");

//Date Range Picker for filtering data

var dateStart="2014-01-01", dateEnd="2014-12-31";
head.js("assets/js/datepicker/daterangepicker.js", "assets/js/datepicker/moment.min.js", function() {

    $(document).ready(function() {
      $('#daterange').daterangepicker({
          "startDate": dateStart,
          "endDate": dateEnd,
            "locale": {
              format: 'YYYY-MM-DD'
            }
      }, function(start, end, label) {
            dateStart = start;
            dateEnd = end;
            //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
      });
    });
});


//NEWS STICKER
head.js("assets/js/newsticker/jquery.newsTicker.js", function() {
    var nt_title = $('#nt-title').newsTicker({
        row_height: 18,
        max_rows: 1,
        duration: 5000,
        pauseOnHover: 0
    });
});

//-------------------------------------------------------------

//SEARCH MENU
head.js("assets/js/search/jquery.quicksearch.js", function() {
    $('input.id_search').quicksearch('#menu-showhide li, .menu-left-nest li');
});
//-------------------------------------------------------------



//EASY PIE CHART
head.js("assets/js/gage/jquery.easypiechart.min.js", function() {

    $(function() {

        $('.chart').easyPieChart({
            easing: 'easeOutBounce',
            trackColor: '#ffffff',
            scaleColor: '#ffffff',
            barColor: '#FF0064',
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });
        var chart = window.chart = $('.chart').data('easyPieChart');
        $('.js_update').on('click', function() {
            chart.update(Math.random() * 100);
        });

        $('.speed-car').easyPieChart({
            easing: 'easeOutBounce',
            trackColor: 'rgba(0,0,0,0.3)',
            scaleColor: 'transparent',
            barColor: '#0085DF',

            lineWidth: 8,
            onStep: function(from, to, percent) {
                $(this.el).find('.percent2').text(Math.round(percent));
            }
        });
        var chart = window.chart = $('.chart2').data('easyPieChart');
        $('.js_update').on('click', function() {
            chart.update(Math.random() * 100);
        });
        $('.overall').easyPieChart({
            easing: 'easeOutBounce',
            trackColor: 'rgba(0,0,0,0.3)',
            scaleColor: '#323A45',
            lineWidth: 35,
            lineCap: 'butt',
            barColor: '#FFB900',
            onStep: function(from, to, percent) {
                $(this.el).find('.percent3').text(Math.round(percent));
            }
        });
    });

});
//-------------------------------------------------------------

//TOOL TIP

head.js("assets/js/tip/jquery.tooltipster.js", function() {

    $('.tooltip-tip-x').tooltipster({
        position: 'right'

    });

    $('.tooltip-tip').tooltipster({
        position: 'right',
        animation: 'slide',
        theme: '.tooltipster-shadow',
        delay: 1,
        offsetX: '-12px',
        onlyOne: true

    });
    $('.tooltip-tip2').tooltipster({
        position: 'right',
        animation: 'slide',
        offsetX: '-12px',
        theme: '.tooltipster-shadow',
        onlyOne: true

    });
    $('.tooltip-top').tooltipster({
        position: 'top'
    });
    $('.tooltip-right').tooltipster({
        position: 'right'
    });
    $('.tooltip-left').tooltipster({
        position: 'left'
    });
    $('.tooltip-bottom').tooltipster({
        position: 'bottom'
    });
    $('.tooltip-reload').tooltipster({
        position: 'right',
        theme: '.tooltipster-white',
        animation: 'fade'
    });
    $('.tooltip-fullscreen').tooltipster({
        position: 'left',
        theme: '.tooltipster-white',
        animation: 'fade'
    });
    //For icon tooltip

});
//-------------------------------------------------------------

//DIGITAL CLOCK
head.js("assets/js/clock/jquery.clock.js", function() {
    //clock
    $('#digital-clock').clock({
        offset: '+8',
        type: 'digital'
    });
});


//Time of day select picker
$(".btn-tod").click(function(e) {
     $(this).removeClass('btn-default').addClass('active').addClass('btn-success').siblings().removeClass('active').removeClass('btn-success');
    $('#day').val($(this).val());
});

$('#getting-started').countdown('2015/01/01', function(event) {
    $(this).html(event.strftime('<span>%M</span>' + '<span class="start-min">:</span>' + '<span class="start-min">%S</span>'));
});

//Autocomplete search field (not working due to CSS)
//head.js("assets/js/bootstrap3-typeahead.min.js", function(){
    //$.get('http://get', function(data){
        //$("#locale").typeahead({ source:["new york","new jersey","Maryland"] });
   // },'json');
//});
