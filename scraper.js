function scrape(player, playerList) {

  var csv = fs.open(player["output"], 'wb');

  // grab all the page data

  var data = this.evaluate(function () {

    return _.map($('.responsive-datatable__scrollable').eq(1), function(ele) {
      
      var filteredHeaders = _.filter($('thead span'), function(elem) {
        return !$(elem).attr('class')
      })

      var abbreviatedHeaders = _.map(filteredHeaders, function(elem) {
        return elem.childNodes[0].nodeType == 3 ? $(elem).html() : 
          $(elem).find('abbr').html()
      })

      return _.map($(ele).find('tbody tr[data-index]'), function(elem) {
          return _.map($(elem).find('span'), function(elemental) {
            return $(elemental).html()
          })
      })
    })
  });

  // grab all the fields that will be saved

  var headers = this.evaluate(function() {

    return _.map($('.responsive-datatable__scrollable').first(), function(ele) {

      var filteredHeaders = _.filter($('thead span'), function(elem) {
        return !$(elem).attr('class')
      })

      var html = _.map(filteredHeaders, function(elem) {
        return elem.childNodes[0].nodeType == 3 ? $(elem).html() : 
          $(elem).find('abbr').html()
      })

      return _.uniq(html)
    })
  })

  // write the headers and data to a csv file

  headers.forEach(function(ele) {
    csv.write(ele + "\n");
  })

  data[0].forEach(function(ele) {
    csv.write(ele + "\n");
  })
      
  csv.flush();

  csv.close();

  // fetch the next player in the list

  if (playerList.length > 0) {

    var next = playerList.pop();

    casper.thenOpen(next.url)
    .then(function () {
      casper.waitFor(function () {
        return this.evaluate(function () {
          return $('.responsive-datatable__scrollable').length == 2
        })
      }, function () {

        console.log('finished scraping for player : ', player.name)

        console.log('about to start scraping for player : ', next.name)

        scrape.call(this, next, playerList)
      })
    })
  }
}

module.exports = {
  scraper : scrape
}