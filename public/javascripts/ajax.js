var Ajax = (function() {
    var getXhrObject = function() {
        return (typeof window.XMLHttpRequest == "function") ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLDOM");
    }

    var getJson = function (url, callback) {
        var xhr = getXhrObject();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/json; charset=utf-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback({ success: true, response: xhr.responseText });
                } else {
                    callback({ success: false, response: "XHR failed: " + xhr.statusText + " status: " + xhr.status });
                }
            }
        };
        xhr.send(null);
    }

    var postJson = function(url, callback, obj) {
        var xhr = getXhrObject();
        xhr.open("POST", url);
        xhr.setRequestHeader("Accept", "application/json; charset=utf-8");
        xhr.send(JSON.stringify(obj));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback({ success: true, response: xhr.responseText });
                } else {
                    callback({ success: false, response: "XHR failed: " + xhr.statusText + " status: " + xhr.status });
                }
            }
        };
        xhr.send(null);
    };

    return {
        getJson: getJson,
        postJson: postJson
    };
})();