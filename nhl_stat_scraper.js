// currently have 2013 and 2016, need 2015, 2015, and 2017

var fs = require('fs')

var casper = require('casper').create({
	pageSettings: {
		userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.21 (KHTML, like Gecko) Chrome/25.0.1349.2 Safari/537.21'
	}
});

var data = [];

var _ = require('underscore.js')

var baseString = 'cayenneExp=seasonId={first}{second}%20and%20gameTypeId=2&gamesPlayed>=1'

// this list represents a single year of stats

var urlTemplate = [
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=skatersummary&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,1', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/basic/season/skatersummary?', string : baseString, type : 'skater_summary', players  : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=goals&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/basic/season/goals?', string : baseString, type : 'goals', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=points&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/basic/season/points?', string : baseString, type : 'points', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=faceoffs&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/basic/season/faceoffs?', string : baseString, type : 'faceoffs', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=powerplay&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/basic/season/powerplay?', string : baseString, type : 'power_plays', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=penaltykill&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/basic/season/penaltykill?', string : baseString, type : 'penalty_kill', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=realtime&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/basic/season/realtime?', string : baseString, type : 'misc_other', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=penalties&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/basic/season/penalties?', string : baseString, type : 'penalties', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=timeonice&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/basic/season/timeonice?', string : baseString, type : 'time_on_ice', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=skatershootout&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/shootout/season/skatershootout?', string : baseString, type : 'shootout', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=skaterpercentages&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/shooting/season/skaterpercentages?', string : baseString, type : 'SAT_percentage', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=skatersummaryshooting&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/shooting/season/skatersummaryshooting?', string : baseString, type : 'shot_attempts', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=skaterscoring&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/core/season/skaterscoring?', string : baseString, type : 'points_penalties_per_60_minutes', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=faceoffsbyzone&pos=S&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/skaters/core/season/faceoffsbyzone?', string : baseString, type : 'faceoffs_by_zone', players : 'skaters'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=goaliesummary&pos=G&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/goalies/goalie_basic/season/goaliesummary?', string : baseString, type : 'goalie_summary', players : 'goalies'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=goaliebystrength&pos=G&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/goalies/goalie_basic/season/goaliebystrength?', string : baseString, type : 'goalie_strength', players : 'goalies'},
  {baseUrl : 'http://www.nhl.com/stats/player?aggregate=1&gameType=2&report=goalieshootout&pos=G&reportType=season&seasonFrom={first}{second}&seasonTo={first}{second}&filter=gamesPlayed,gte,', year : 2016, url : 'http://www.nhl.com/stats/rest/individual/goalies/goalie_shootout/season/goalieshootout?', string : baseString, type : 'goalie_shootout', players : 'goalies'}
]

var years = [2013, 2014, 2015, 2016, 2017]

// create a list of urls for each year we're interested in. Adding or removing years to this list will affect which years are grabbed.

var urlList = _.map(years, function (year) {

  return _.map(urlTemplate, function (elem) {

      var newBaseUrl = elem.baseUrl.replace(/({first})/g, year - 1).replace(/({second})/g, year)

      var newBaseString = baseString.replace(/({first})/g, year - 1).replace(/({second})/g, year)

      return _.object(['baseUrl', 'year', 'url', 'string', 'type', 'players'], [newBaseUrl, year, elem.url, newBaseString, elem.type, elem.players])
  })
})

var urls = _.flatten(urlList)

casper.start(urls[0].baseUrl);

casper.eachThen(urls, function(ele) {
  console.log('caching data for report type : ' + ele.data.type + ' in the year : ' + ele.data.year)
  var wsurl = ele.data.url + ele.data.string
  var cached = this.evaluate(function (wsurl) {
    return JSON.parse(__utils__.sendAJAX(wsurl, 'GET', null, false))
  }, {wsurl : wsurl})
  data.push(_.object(['data', 'output'], [cached.data, ele.data.year + '_' + ele.data.players + '_' + ele.data.type + '.json']))
  var randomTime = (Math.floor(Math.random() * 240) + 60) * 1000;
  console.log('the delay until next request is : ', randomTime);
  this.wait(randomTime);
})

casper.then(function () {
  _.each(data, function (ele) {
    var json = fs.open(ele.output, 'wb')
    console.log('writing data to : ' + ele.output)
    _.each(ele.data, function (elem) {
      json.write(JSON.stringify(elem) + '\n')
      json.flush()
    })
    json.close()
  })
})

casper.run();