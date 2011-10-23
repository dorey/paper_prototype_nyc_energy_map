
$(function(){
    $('.scenario-table').each(function(){
        var $elem = $(this),
            scsv = $elem.data('scenarioCsv');
        $.get(scsv).done(function(csv){
            buildScenarioTable(csv)
                .appendTo($elem);
        });
    });
    $('.scenario-images').each(function(){
        var $elem = $(this),
            scid = $elem.data('scenarioImages');
        var sc = scs[scid];
        buildScenarioImages(sc)
            .appendTo($elem);
    });
//    $('body').text(JSON.stringify(scs));
});

var CSV = (function(){
    function load(csv) {
        var file = _(csv.split("\n")).chain()
            .map(function(row){
                while(!!row.match(/,,/)) {
                    row = row.replace(",,", ",null,");
                }
                if(!!row.match(/^,/)) row = row.replace(/^,/, "null,")
                if(!!row.match(/,$/)) row = row.replace(/,$/, ",null")
                return "[" + row + "]";
            })
            .map(JSON.parse)
            .value();
        return file;
    }
    return {
        load: load
    }
})();

function buildScenarioTable(csv) {
    var thead = $('<thead />'),
        tbody = $('<tbody />');
    var file = CSV.load(csv);
    var classes = _(file[0]).map(function(t){
        return 'sc-' + t.toLowerCase().replace(' ', '-');
    });
    var values = [];
    _.each(file, function(row, i){
        var dest,
            tr = $('<tr />');
        if(i==0) {
            dest = [thead, '<th />', false];
        } else {
            dest = [tbody, '<td />', true];
        }
        $(dest[1])
            .text(dest[2] ? i : '')
            .addClass('sc-row-count')
            .appendTo(tr);
        _.each(row, function(col, ii){
            var val = !!col ? col : '&nbsp;',
                repeat = false;
            if(val===values[ii]) repeat = true;
            values[ii]=val;
            var thisClass = classes[ii];
            $(dest[1])
                .html(val)
                .addClass(thisClass)
                .addClass(repeat ? 'repeat' : 'no-repeat')
                .appendTo(tr);
        });
        if(row.length!==0) tr.appendTo(dest[0]);
    });
    return $('<table />')
        .append(thead)
        .append(tbody)
}

scs = {
  "bb1.json": {
    "images": [
      {
        "page": "Home",
        "file": "imgs/f1.png",
        "description": "The home page prompts the user for their NYC address."
      },
      {
        "page": "Search results",
        "file": "imgs/f2.png"
      },
      {
        "page": "Tax Lot Level Info",
        "file": "imgs/f4.png"
      }
    ]
  },
  "rr1.json": {
    "images": [
      {
        "page": "Home",
        "file": "imgs/f1.png",
        "description": "The home page prompts the user for their NYC address."
      },
      {
        "page": "Search results",
        "file": "imgs/f2.png"
      },
      {
        "file": "imgs/f3.png"
      },
      {
        "page": "Tax Lot Level Info",
        "file": "imgs/f4.png"
      },
      {
        "file": "imgs/f5.png"
      },
      {
        "page": "Square Footage Entry",
        "file": "imgs/f6.png"
      },
      {
        "page": "Tax Lot Level Info",
        "file": "imgs/f7.png"
      },
      {
        "file": "imgs/f8.png"
      }
    ]
  }
};

function buildScenarioImages(sc) {
    var ul = $('<ul />', {'class':'media-grid'});
    
    var a, img, li;
    function scImage(data) {
        a = $('<a />', {'href':data.file, 'target': '_BLANK'});
        img = $('<img />', {'src': data.file})
                .css({'width':150})
                .addClass('thumbnail')
                .appendTo(a);
        $('<h5 />')
            .html(data.page || '&hellip;')
            .appendTo(a);
        return $('<li />').html(a);
    }
    
    _.each(sc.images, function(im, i){
        scImage(im)
            .appendTo(ul);
    });
    return ul;
}
