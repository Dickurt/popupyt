function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function closePopupDelayed() {
  setTimeout(function() {
    window.close();
  }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
  renderStatus('Gaining momentum...');

  // We only have permission to get the active tab.
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  // Get the tabs that match the query
  chrome.tabs.query(queryInfo, function(tabs) {
    // There should only be one tab in the resulting array, so get the first item.
    var tab = tabs[0];
    var url = tab.url;

    var youtubeIdLength = 11;
    var regexYoutubeWatchLink = /https:\/\/www.youtube.com\/watch\?v=/;
    var regexYoutubeEmbedLink = /https:\/\/www.youtube.com\/embed\//;

    // Is it a '/watch?v=', or an '/embed/' link? Is it even a YouTube link at all?
    if(regexYoutubeWatchLink.test(url)) {
      renderStatus('Popping up...');

      // Some nasty string manipulation that I won't understand when I read this two months later, so let's explain:
      // baseYoutubeWatchUrl.length - 5 --> Means url without the 'watch' part
      // baseYoutubeWatchUrl.length + 3 --> Means url beginning after the '/watch?v=' part
      // baseYoutubeWatchUrl.length + 3 + youtubeIdLength --> Means url beginning after the '/watch?v=' part, up to the 11 digits that make up the youtube video id
      var baseYoutubeWatchUrl = 'https://www.youtube.com/watch';
      var newUrl = url.substring(0, baseYoutubeWatchUrl.length - 5) + 'embed/' + url.substring(baseYoutubeWatchUrl.length + 3, baseYoutubeWatchUrl.length + 3 + youtubeIdLength);

      // Update the url, and we're done!
      chrome.tabs.update(tab.id, {url: newUrl}, function() {
        renderStatus('Done popping up!');
        closePopupDelayed();
      });
    } else if(regexYoutubeEmbedLink.test(url)) {
      // We have found that the url is that of an embedded video.
      // So now we'll try to convert it to a regular YouTube page url again.
      renderStatus('Popping back in...');      

      // Some nasty string manipulation that I won't understand when I read this two months later, so let's explain:
      // baseYoutubeEmbedUrl.length - 6 --> Means url without the 'embed/' part
      // baseYoutubeEmbedUrl.length + youtubeIdLength --> Means the 11 digits after '/embed/', i.e. the youtube video id
      var baseYoutubeEmbedUrl = 'https://www.youtube.com/embed/';
      var newUrl = url.substring(0, baseYoutubeEmbedUrl.length - 6) + 'watch?v=' + url.substring(baseYoutubeEmbedUrl.length, baseYoutubeEmbedUrl.length + youtubeIdLength);

      // Update the url, and we're done!
      chrome.tabs.update(tab.id, {url: newUrl}, function() {
        renderStatus('Done popping in!');
        closePopupDelayed();
      });
    } else {
      renderStatus('This is not a YouTube video url/page. Aborting...');
      return;
    }
  });
});
