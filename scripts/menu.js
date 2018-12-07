// Draws the main menu.
var menu = (function () {
    var pageMap = [];

    // Clears any previous menu options added.
    var clear = function() {
        pageMap = [];
    }

    // Adds page to menu.
    var addPage = function (route, linkText) {
        pageMap[route] = linkText;
    }

    // Generates HTML for the pages.
    var generateHtml = function (pages) {
        var html = '<ul>';
        for (var key in pageMap) {
            if (pageMap.hasOwnProperty(key)) {
                html += '<li><a href="#' + key + '">' + pageMap[key] + '</a></li>';
            }
        }
        return html + '</ul>';
    }

    // Displays menu on HTML element specified.
    var display = function (menuElementId) {
        var html = generateHtml();
        document.getElementById(menuElementId).innerHTML = html;
        menuElement = menuElementId;
    }

    return {
        clear: clear,
        display: display,
        addPage: addPage
    };
})();
