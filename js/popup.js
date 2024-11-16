function setDOMInfo(info) {
    $('#tabURL').text(info.tab);
    // var objMedia = JSON.stringify(info.media, null, '<br />');
    // console.log(objMedia);
    // $('#mediaURL').html(objMedia);
    try {
        var node = new PrettyJSON.view.Node({
            el: $('#result'),
            data: info.media
        });
    }
    catch (e) {
        $('#tabURL').text(e);
    }

    if (info.opt.dest !== undefined) $('#dest').text(info.opt.dest);
    if (info.opt.source !== undefined) $('#src').text(info.opt.source);
    if (!info.opt.output) $('#output').hide();

    $('#dest').on('click', function () {
        var dest_url = new URL(info.opt.dest);
        window.open(dest_url.origin);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.runtime.sendMessage({
            event: 'getMedia',
            tabId: tabs[0].id
        }, setDOMInfo);
    });
});

// $('#go-to-options').on('click', function() {
//   if (chrome.runtime.openOptionsPage) {
//     chrome.runtime.openOptionsPage();
//   } else {
//     window.open(chrome.runtime.getURL('options.html'));
//   }
// });