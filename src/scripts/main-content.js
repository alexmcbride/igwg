// Module to encapsulate writing the main content, as some dynamic modules 
// can update this themselves as needed.
var mainContent = (function () {
    var content = null;

    // Sets the main content element.
    var initialize = function(contentEl) {
        content = contentEl;
    };

    // Puts the HTML onto the main content.
    var render = function (html) {
        document.getElementById(content).innerHTML = html;
    };

    return {
        render: render,
        initialize: initialize
    }
})();
