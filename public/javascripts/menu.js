//a menu manager module that allows the user to navigate around your spa

var menu = (function () {
    var pageMap = [];

    var addPage = function(route, linkText) {
        pageMap[route] = linkText;
    }

    var generateHtml = function (pages) {
        var html = '<ul>';
        for (var key in pageMap) {
            if (pageMap.hasOwnProperty(key)) {
                html += '<li><a href="#' + key + '">' + pageMap[key] + '</a></li>';
            }
        }
        return html + '</ul>';
    }

    var display = function (menuElementId) {
        var html = generateHtml();
        var menuDiv = document.getElementById(menuElementId);
        menuDiv.innerHTML = html;
    }

    return {
        display: display,
        addPage: addPage
    };
})();
