// Module to help drawing main content
var content = (function () {
    var content = null;

    var initialize = function(contentEl) {
        content = contentEl;
    }

    var render = function (html) {
        document.getElementById(content).innerHTML = html;
    }

    return {
        render: render,
        initialize: initialize
    }
})();
