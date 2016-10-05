var fs = require('fs')

var json = require('player_list.json')

var original = [];

json.forEach(function(ele) {
  original.push(ele)
})

var casper = require('casper').create({
	pageSettings: {
		userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.21 (KHTML, like Gecko) Chrome/25.0.1349.2 Safari/537.21'
	},
  clientScripts : ['underscore.js', 'jquery.js']
});

var scrape = require('scraper.js')

var firstPlayer = json.shift()

casper.start(firstPlayer.url)

var length = json.length + 1;

var fullPlayerList = [];

var fullHeaderList = [];

var fullOutputList = [];

casper.on('load.finished', function(status) {
  casper.waitFor(function() {
    return this.evaluate(function() {
      var images = $('.news__news-item')
      return images.length > 0
    });
  },
  function () {
    scrape.scraper.call(this, original, length, firstPlayer, json, fullPlayerList, fullHeaderList, fullOutputList);
  })
})

casper.run();