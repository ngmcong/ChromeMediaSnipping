var popupData;

function setDOMInfo(info) {
    $('#tabURL').text(info.tab);
    // var objMedia = JSON.stringify(info.media, null, '<br />');
    // console.log(objMedia);
    // $('#mediaURL').html(objMedia);
    popupData = info.media;
    try {
        var node = new PrettyJSON.view.Node({
            el: $('#result'),
            data: popupData
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

$('#go-to-download').on('click', function() {
    if (popupData.length > 0) {
        var dIndex = popupData.length - 1;
        popupData.sort(function(a, b){return a.contenttype.length-b.contenttype.length});
        var data = { url: popupData[dIndex].url, initiator: popupData[dIndex].initiator };
        console.log(data);
        try {
            $.post("http://127.0.0.1:60024/", JSON.stringify(data));
        }
        catch (e) {
            alert(e);
        }
    }
});