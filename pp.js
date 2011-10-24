var teaserMustacheTmpl, sceneMustacheTmpl;

function scenarioTeaser(elem, pages) {
    if(teaserMustacheTmpl===undefined) {
        teaserMustacheTmpl = $('#teaser-tmpl').html();
    }
    var pageData = { pages: [] };
    _.each(pages, function(val, key){
        pageData.pages.push(_.extend({
            scenario_id: key
        }, val))
    });
    elem.append($.mustache(teaserMustacheTmpl, pageData));
}

function scenarioDetails(elem, scenario_id, scenario) {
    if(sceneMustacheTmpl===undefined) {
        sceneMustacheTmpl = $('#scenario-tmpl').html()
    }
    elem.append($.mustache(sceneMustacheTmpl, _.extend({
            scenario_id: scenario_id
        }, scenario)));
}

$(function(){
    var teaser = $('div#teaser'),
        scene = $('div#scenarios');
    scenarioTeaser(teaser, pages);
    _.each(pages, function(p, pid){
        scenarioDetails(scene, pid, p);
    });
    $('.scenario-table').each(function(){
        var $elem = $(this),
            scsv = $elem.data('scenarioCsv');
        $.get(scsv).done(function(csv){
            buildScenarioTable(csv)
                .appendTo($elem);
        });
    });
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
                .addClass(thisClass)
                .addClass(repeat ? 'repeat' : 'no-repeat')
                .html(val)
                .appendTo(tr);
        });
        if(row.length!==0) tr.appendTo(dest[0]);
    });
    return $('<table />')
        .append(thead)
        .append(tbody)
}

var pages = {
  "bb1": {
    "name": "Bobby BuildingOwner",
    "description": "Bobby owns a building in NYC. He wants to look up information about his building's heating and power usage.",
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
    ],
    "pages": [
      {
        "name": "Home",
        "notes": [
          "Map in background.",
          "Something prompting the user to 'search for NYC address' shows up over the map"
        ]
      },
      {
        "name": "Search results",
        "notes": [
          "Map in background.",
          "If the address is found, it shows up on a list.",
          "If there's a duplicate, then the options are presented in a list.",
          "The user can select one address and click through to view."
        ]
      },
      {
        "name": "Tax Lot Level Info",
        "notes": [
          "Map in background.",
          "Info is presented to the user",
          "User has the option to print"
        ]
      }
    ]
  },
  "rr1": {
    "name": "Ralph Renter",
    "description": "Ralph rents a medium-sized apartment in NYC. He wants to see data relevant to him. He knows that his apartment is 1000 square feet.\nHe wants to print up his data and put it on his fridge.",
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
        "page": "Apartment Level Info",
        "file": "imgs/f7.png"
      },
      {
        "file": "imgs/f8.png"
      }
    ],
    "pages": [
      {
        "name": "Home",
        "notes": [
          "Map in background.",
          "Something prompting the user to 'search for NYC address' shows up over the map"
        ]
      },
      {
        "name": "Search results",
        "notes": [
          "Map in background.",
          "If the address is found, it shows up on a list.",
          "If there's a duplicate, then the options are presented in a list.",
          "The user can select one address and click through to view."
        ]
      },
      {
        "name": "Tax Lot Level Info",
        "notes": [
          "Map in background.",
          "Info is presented to the user",
          "User has the option to enter their square footage",
          "User has the option to print"
        ]
      },
      {
        "name": "Square Footage Entry",
        "notes": [
          "Exactly like the 'Tax Lot Level Info' page, except a the user is prompted to enter their address."
        ]
      },
      {
        "name": "Apartment Level Info",
        "notes": [
          "Similar to the 'Tax Lot Level Info' except adds (or substitutes) personalized data based on user input.",
          "User has the option to print"
        ]
      }
    ]
  }
};
