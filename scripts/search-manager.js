// Module to encapsulate searches.
var searchManager = (function () {
    // Renders the search results to the main content.
    var results = function (text, pages) {
        var html = '<h2>Search Results</h2>';
        html += '<p>Results for "' + text + '"...</p>';
        html += '<ul>';
        pages.forEach( function(page) {
            html += '<li>';
            html += '<a href="#' + urlHelper.generateHash(page.type, page.id) + '">' + page.title + '</a>';
            html += '</li>';
        });
        html += '</ul>';
        content.render(html);
    };

    // Renders the 'no results' message to main content.
    var noResults = function() {
        var html = '<h2>Search Results</h2>';
        html += '<p>There are no results to display</p>';
        content.render(html);
    };

    // Displays the search results.
    var display = function () {
        var term = urlHelper.search();
        if (term !== null) {
            var pages = dataStore.search(term);
            if (pages.length === 0) {
                noResults();
            } else {
                results(term, pages);
                document.getElementById('search-input').value = '';
            }
        } else {
            console.log('Search: nothing entered');
        }
    };

    // Called when user clicks go button.
    var go = function () {
        var term = document.getElementById('search-input').value.trim();
        if (term.length > 0) {
            location.hash = '#search?term=' + term;
        }
    };

    // Initialize searchManager to draw search-box to specified page element.
    var initialize = function (searchElement) {
        var html = '<div class="input-group mb-3">';
        html += '<input type="text" class="form-control" placeholder="Search" aria-label="Username" aria-describedby="basic-addon1" id="search-input">';
        html += '<div class="input-group-prepend">';
        html += '<button class="input-group-text" id="basic-addon1" onclick="searchManager.go()">Go</button>';
        html += '</div>';
        html += '</div>';
        document.getElementById(searchElement).innerHTML = html;
    };

    return {
        initialize: initialize,
        display: display,
        go: go
    };
})();