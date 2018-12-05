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

    var noResults = function() {
        var html = '<h2>Search Results</h2>';
        html += '<p>There are no results to display</p>';
        content.render(html);
    }

    var getTerm = function() {
        var index = location.hash.indexOf('?');
        if (index > -1) {
            return location.hash.substr(index);
        } 
        return '';
    }

    var search = function () {
        var term = getTerm();
        if (term.length > 0) {
            var pages = dataStore.search(term);
            if (pages.length == 0) {
                var html = '<h2>Search Results</h2>';
                html += '<p>There are no results to display</p>';
                content.render(html);
            } else {
                results(term, pages);
                document.getElementById('search-input').value = '';
            }
        } else {
            console.log('Search: nothing entered');
        }
    }

    var go = function () {
        var term = document.getElementById('search-input').value.trim();
        if (term.length > 0) {
            location.hash = '#search?term=' + term;
        }
    }

    var display = function (searchElement) {
        var html = '<div class="input-group mb-3">';
        html += '<input type="text" class="form-control" placeholder="Search" aria-label="Username" aria-describedby="basic-addon1" id="search-input">';
        html += '<div class="input-group-prepend">';
        html += '<button class="input-group-text" id="basic-addon1" onclick="searchManager.go()">Go</button>';
        html += '</div>';
        html += '</div>';
        document.getElementById(searchElement).innerHTML = html;
    }

    return {
        display: display,
        search: search,
        go: go
    };
})();