require('isomorphic-fetch')

/*
The official Firebase API (https://github.com/HackerNews/API) requires multiple network
connections to be made in order to fetch the list of Top Stories (indices) and then the
summary content of these stories. Directly requesting these resources makes server-side
rendering cumbersome as it is slow and ultimately requires that you maintain your own
cache to ensure full server renders are efficient.

To work around this problem, we can use one of the unofficial Hacker News APIs, specifically
https://github.com/cheeaun/node-hnapi which directly returns the Top Stories and can cache
responses for 10 minutes. In ReactHN, we can use the unofficial API for a static server-side
render and then 'hydrate' this once our components have mounted to display the real-time
experience.

The benefit of this is clients loading up the app that are on flakey networks (or lie-fi)
can still get a fast render of content before the rest of our JavaScript bundle is loaded.
 */

/**
 * Fetch top stories
 */
exports.fetchNews = function(page) {
	page = page || ''
	return fetch('http://node-hnapi.herokuapp.com/news' + page).then(function(response) {
	  return response.json()
	}).then(function(json) {
	  var stories = '<div class="container main-content Items_list" start="1">'
	  json.forEach(function(data, index) {
	      var story = '<div class="post-controls"><h1><i class="fa fa-user" aria-hidden="true"></i></h1> </div><li class="ListItem debuggg" style="margin-bottom: 16px;">' +
	          '<div class="Item__title" style="font-size: 18px;"><a href="' + data.url + '">' + data.title + '</a> ' +
	          '<span class="Item__host">(' + data.domain + ')</span></div>' +
	          '<div class="Item__meta"><span class="Item__score">' + data.points + ' points</span> ' +
	          '<span class="Item__by">by <a href="https://news.ycombinator.com/user?id=' + data.user + '">' + data.user + '</a></span> ' +
	          '<time class="Item__time">' + data.time_ago + ' </time> | </div>'
	      '</li>'
	      stories += story
	  })
	  stories += '</div>'
	  return stories
	})
}

exports.fetchItem = function(itemId) {
	return fetch('https://node-hnapi.herokuapp.com/item/' + itemId).then(function(response) {
		return response.json()
	})
}
