var processed = false;

function scrape(original, amount, player, playerList, fullPlayerList, fullHeaderList, playerOutputs) {

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

  var html = this.evaluate(function () {
    return $('#news').find('h5').html()
  })

  // populate the first player

  if (fullPlayerList.length == 0) {

    console.log('caching data for player : ', player.name)

    fullPlayerList.push(data[0]);

    fullHeaderList.push(headers);

    playerOutputs.push(original[fullPlayerList.length - 1].output)
  }

  var item = playerOutputs.filter(function(ele) {
    return ele.replace('.csv', '').replace('_', ' ').toLowerCase() == html.replace(' News', '').toLowerCase() 
  })

  // since the arguments don't even correspond to the page we're on, use the page html to figure out
  // if we haven't populated that player yet

  if (item.length == 0) {

    var specificPlayer = original.filter(function (ele) {
      return ele.name.toLowerCase() == html.replace(' News', '').toLowerCase() 
    })

    console.log('caching data for player : ', specificPlayer[0].name)

    fullPlayerList.push(data[0]);

    fullHeaderList.push(headers);

    playerOutputs.push(specificPlayer[0].output)
  }

  // fetch the next player in the list

  if (playerList.length > 0) {

    var next = playerList.shift();

    this.thenOpen(next.url)
    .then(function () {
      this.waitFor(function () {
    
        return this.evaluate(function () {

          var images = $('.news__news-item')

          return images.length > 0
        })
      }, function () {
        return scrape.call(this, original, amount, next, playerList, fullPlayerList, fullHeaderList, playerOutputs)
      })
    })
  } else {

    if (fullPlayerList.length == amount && !processed) {

      processed = true;

      console.log('creating the csvs. please hold!')

      for (var i = 0; i < fullPlayerList.length; i++) {
  
        var player = fullPlayerList[i]

        var header = fullHeaderList[i]

        var output = playerOutputs[i]

        var csv = fs.open(playerOutputs[i], 'wb');

        header.forEach(function(ele) {
          csv.write(ele + "\n");
        })

        player.forEach(function(ele) {
          csv.write(ele + "\n");
        })

        csv.flush();

        csv.close();
      }
    }
  }
}

module.exports = {
  scraper : scrape
}