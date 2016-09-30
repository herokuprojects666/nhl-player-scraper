var fs = require('fs')

var json = require('player_list.json')

var casper = require('casper').create({
	pageSettings: {
		userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.21 (KHTML, like Gecko) Chrome/25.0.1349.2 Safari/537.21'
	},
  clientScripts : ['underscore.js', 'jquery.js']
});

var scrape = require('scraper.js')

var firstPlayer = json.pop();

casper.start(firstPlayer.url)

casper.on('load.finished', function(status) {
  casper.waitFor(function() {
    return this.evaluate(function() {
      return $('.responsive-datatable__scrollable').length == 2
    });
  },
  function () {
    scrape.scraper.call(this, firstPlayer, json);
  })
})

casper.run();