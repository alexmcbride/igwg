// Module to encapsulate JSON requests.
var ajax = (function() {
    // Gets the URL with an AJAX request and calls the callback with the results.
    var getJson = function (url, callback) {
        var xhr = (typeof window.XMLHttpRequest === "function") ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLDOM");
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/json; charset=utf-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback({ success: true, response: xhr.responseText });
                } else {
                    callback({ success: false, response: "XHR failed: " + xhr.statusText + " status: " + xhr.status });
                }
            }
        };
        xhr.send(null);
    };

    return {
        getJson: getJson
    };
})();