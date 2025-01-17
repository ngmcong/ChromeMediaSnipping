var mediaStorage = [];

// chrome.webRequest.onBeforeRequest.addListener(
//   function(media) {
//     //console.log(media);
//     chrome.tabs.get(media.tabId, function(tab) {
//       var objValue = { url: media.url };
//       if (!mediaStorage[media.tabId]) mediaStorage[media.tabId] = [ objValue ];
//       else {
//         var containsObject = mediaStorage[media.tabId].map(element => element.url).includes(media.url);
//         if (!containsObject) mediaStorage[media.tabId].push(objValue);
//       }
//     });
//     chrome.pageAction.show(media.tabId);
//   },
//   // filters
//   {
//     urls: ['https://*/*', 'http://*/*'],
//     types: ['media']
//   },
// );

chrome.webRequest.onHeadersReceived.addListener(
  function(media) {
    console.log(media);
    if (media.url.endsWith('.png')) return;
    var contenttype = "";
    var contentLength;
    media.responseHeaders.forEach(function(v,i,a){
      if (v.name.toLowerCase() == "content-type") {
        contenttype = v.value;
      }
      else if (v.name.toLowerCase() == "content-length") {
        contentLength = Math.round(parseFloat(v.value) / 1024 / 1024);
      }
    });
    if (contentLength <= 0) return;
    if (contenttype.indexOf("application/json") > -1
      || contenttype.indexOf("application/javascript") > -1
      || contenttype.indexOf("text/html") > -1
      || contenttype.indexOf("image") > -1
      || contenttype.indexOf("text/plain") > -1) return;
    if (contenttype.indexOf("video/") > -1 && contentLength < 100) return;
    console.log(media);
    chrome.tabs.get(media.tabId, function(tab) {
      var objValue = { url: media.url, contentLength: contentLength, initiator: media.initiator, contenttype: contenttype };
      if (!mediaStorage[media.tabId]) mediaStorage[media.tabId] = [ objValue ];
      else {
        var containsObject = mediaStorage[media.tabId].map(element => element.url).includes(media.url);
        if (!containsObject) mediaStorage[media.tabId].push(objValue);
      }
    });
    chrome.pageAction.show(media.tabId);
  },
  // filters
  {
    urls: ['https://*/*', 'http://*/*'],
    types: ['media','xmlhttprequest']
  },
  ["responseHeaders"],
);

// chrome.webRequest.onCompleted.addListener(
//   function (media) {
//     chrome.tabs.get(media.tabId, function(tab) {
//       console.log(media);
//       if (media.statusCode != 200 || media.type == "image" || media.type == "script" || media.frameType != "sub_frame") return;
//       var contenttype = "";
//       media.responseHeaders.forEach(function(v,i,a){
//         if (v.name.toLowerCase() == "content-type"){
//           contenttype = v.value;
//         }
//       });
//       if (contenttype.indexOf("application/json") > -1
//         || contenttype.indexOf("application/javascript") > -1
//         || contenttype.indexOf("text/html") > -1
//         || contenttype.indexOf("image") > -1
//         || contenttype.indexOf("text/plain") > -1) return;

//       console.log(media);
//       var objValue = { tab: tab.url, url: media.url };
//       if (!mediaStorage[media.tabId]) mediaStorage[media.tabId] = [ objValue ];
//       else mediaStorage[media.tabId].push(objValue);
//       console.log(mediaStorage[media.tabId]);
//     });
//     chrome.pageAction.show(media.tabId);
//   },
//   // filters
//   {
//     urls: [
//       'https://*/*', 'http://*/*'
//     ],
//     types: [
//       'media', "xmlhttprequest"
//     ],
//   },
//   ["responseHeaders"]
// );

chrome.runtime.onMessage.addListener(
  function(req, sender, sendRes) {
    if (req.event !== 'getMedia')
      return;
    chrome.storage.sync.get(null, function(opt) {
      var media = mediaStorage[req.tabId];

      //var src = (opt.source == 'MEDIA URL') ? media.url : media.tab;
      //if (opt.output) sendToPlaylist(src, opt.dest);

      //sendRes({ tab: media.tab, media: media, opt: opt });
      sendRes({ tab: '', media: media, opt: opt });
    });
    return true;
});

// chrome.runtime.onMessage.addListener(
//   function(req, sender, sendRes) {
//     if (req.event !== 'sendToPlaylist')
//       return;
//     chrome.storage.sync.get(null, function(opt) {
//       var result = sendToPlaylist(req.src, opt.dest);

//       sendRes({ tab: req.src, opt: opt, res: result });
//     });
//     return true;
// });

// function sendToPlaylist(media, playlistURL) {
//   var xhr = new XMLHttpRequest(),
//       method = 'POST';

//   xhr.addEventListener("load", function(e) {
//     if (xhr.readyState === XMLHttpRequest.DONE && xhr.staus == 302)
//       return true;
//   });
//   xhr.addEventListener("error", function(e) {
//     console.error(e);
//     return false;
//   });

//   var data = { 'url': media };
//   xhr.open(method, playlistURL);
//   xhr.setRequestHeader('Content-type', 'application/json;');
//   xhr.send(JSON.stringify(data));
// }