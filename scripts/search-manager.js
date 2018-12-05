// Module to encapsulate searches.
var searchManager = (function () {
    var results = function (text, pages) {
        var html = '<h2>Search Results</h2>';
        html += '<p>Results for "' + text + '"...</p>';
        html += '<ul>';
        pages.forEach(page => {
            html += '<li>';
            html += '<a href="#' + contentLoader.url(page.type, page.id) + '">' + page.title + '</a>';
            html += '</li>';
        });
        html += '</ul>';
        content.render(html);
    }

    var search = function () {
        var text = document.getElementById('search-input').value.trim();
        if (text.length > 0) {
            var pages = dataStore.search(text);
            if (pages.length == 0) {
                content.render('<p>There are no results to display</p>');
            } else {
                results(text, pages);
                document.getElementById('search-input').value = '';
            }
        } else {
            console.log('Search: nothing entered');
        }
    }

    var display = function (searchElement) {
        var html = '<form>';
        html += '<input type="text" id="search-input"> ';
        html += '<input type="button" value="Go" onclick="searchManager.search()">'
        html += '</form>';
        document.getElementById(searchElement).innerHTML = html;
    }

    return {
        display: display,
        search: search
    };
})();