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

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    var youtubeIdLength = 11;
    var regexYoutubeWatchLink = /https:\/\/www.youtube.com\/watch\?v=/;
    var regexYoutubeEmbedLink = /https:\/\/www.youtube.com\/embed\//;
    if(regexYoutubeWatchLink.test(url)) {
      renderStatus('Popping up...');

      var baseYoutubeWatchUrl = 'https://www.youtube.com/watch';
      var newUrl = url.substring(0, baseYoutubeWatchUrl.length - 5) + 'embed/' + url.substring(baseYoutubeWatchUrl.length + 3, baseYoutubeWatchUrl.length + 3 + youtubeIdLength);

      chrome.tabs.update(tab.id, {url: newUrl}, function() {
        renderStatus('Done popping up!');
        closePopupDelayed();
      });
    } else if(regexYoutubeEmbedLink.test(url)) {
      renderStatus('Popping back in...');      

      var baseYoutubeEmbedUrl = 'https://www.youtube.com/embed/';
      var newUrl = url.substring(0, baseYoutubeEmbedUrl.length - 6) + 'watch?v=' + url.substring(baseYoutubeEmbedUrl.length, baseYoutubeEmbedUrl.length + youtubeIdLength);

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
