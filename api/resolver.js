var sync = require('synchronize');
var request = require('request');

// The API that returns the in-email representation.
module.exports = function(req, res) {
  var url = req.query.url.trim();
  // Reddit comment urls are in the format:
  //https://www.reddit.com/r/<subreddit>/comments/<6 numbers or lowercase letters>/<title>/<7 numbers or lowercase letters>
  var threadUrlMatches = url.match(/(.+)\//);
  var matches = url.match(/reddit.com\/r\/[a-zA-Z\d]+\/comments\/[a-z\d]+\/(.+)\/[a-zA-Z\d]+/);
  if (!matches) {
    res.status(400).send('Invalid URL format');
    return;
  }

  //Get the thread URL without the specific comment id
  //and get the title of the post
  var threadUrl = threadUrlMatches[1];
  var title = matches[1].replace(/_/g, " ");
  title = title.charAt(0).toUpperCase() + title.substr(1);

  //Get the current date in ISO format
  var d = new Date();
  d = d.toISOString();

  //Build the html with reddit's embedded format
  var html = '<div style="height:500px;width=600px;" class="reddit-embed" data-embed-media="www.redditmedia.com" data-embed-parent="false" data-embed-live="true" data-embed-created="' + d + '"><a href="https://www.' + url + '">Comment</a> from discussion <a href="https://www.' + threadUrl + '">' + title + '</a>.</div><script async src="https://www.redditstatic.com/comment-embed.js"></script>';
  
  res.json({
    body: html
    // Add raw:true if you're returning content that you want the user to be able to edit
  });
};
