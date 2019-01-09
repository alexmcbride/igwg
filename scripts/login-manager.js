// Module to manage logging in and out of the site. As with other similar modules it uses a simple state 
// pattern, where current state function is stored in currentState.
var loginManager = (function () {    
    var currentState = null;
    var savedLoginEl = null;

    // Super-secure list of users :)
    var users = [];
    users['Admin'] = { username: 'Admin', password: 'password1' };
    users['Alex'] = { username: 'Alex', password: 'password1' };
    users['Jim'] = { username: 'Jim', password: 'password1' };

    // Gets login form HTML.
    var loginState = function () {
        var html = '';
        html += '<h2>Login</h2>';
        html += '<form>';
        html += '<p>Please enter your username and password to login to the site.</p>';
        html += '<p class="alert alert-danger" id="error" style="display: none;">';
        html += '</p>';
        html += '<div class="form-group">';
        html += '<label for="username">Username</label><br>';
        html += '<input type="text" id="username" class="form-control">';
        html += '</div>';
        html += '<div class="form-group">';
        html += '<label for="password">Password</label><br>';
        html += '<input type="password" id="password" class="form-control">';
        html += '</div>';
        html += '<input type="button" value="Login" onclick="loginManager.login()" class="btn btn-primary">';
        html += '</form>';
        return html;
    };

    // Gets the logout form HTML.
    var logoutState = function () {
        var html = '<h2>Logout</h2>';
        html += '<form>';
        html += '<p>Are you sure you want to logout?</p>';
        html += '<input type="button" value="Yes" onclick="loginManager.logout()" class="btn btn-primary">';
        html += '</form>';
        return html;
    };

    // Hides the main error element.
    var hideError = function () {
        var el = document.getElementById('error');
        el.style.display = 'none';
    };

    // Shows the main error element.
    var showError = function (error) {
        var el = document.getElementById('error');
        el.innerHTML = error;
        el.style.display = 'block';
    };

    // Checks that the specified username and password are authentic.
    var authenticate = function (username, password) {
        if (users[username] !== undefined) {
            if (users[username].password === password) {
                return users[username];
            }
        }
        return null;
    };

    // Called when the user clicks the login button.
    var login = function () {
        hideError();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var user = authenticate(username, password);
        if (user !== null) {
            performLogin(user);
        } else {
            showError('Username and password incorrect');
        }
    };

    // Set login stuff
    var performLogin = function(user) {
        window.localStorage.setItem('loggedIn', JSON.stringify({ username: user.username }));
        currentState = logoutState; // Change status.
        app.render('<h2>Logged In</h2><p>Welcome, ' + user.username + '! You can now <a href="#admin">manage pages</a>.</p>');
        redisplayLogin();
    };
    
    // Called when the user clicks the logout button.
    var logout = function () {
        window.localStorage.removeItem('loggedIn');
        currentState = loginState; // Change state
        update();
        redisplayLogin();
        showError('You are now logged out');
    };

    // Gets HTML for the current state and draws it on the main content element.
    var update = function (error) {
        var html = currentState(error);
        app.render(html);
    };

    // Displays the current loginManager state.
    var display = function () {
        if (currentState == null) {
            currentState = isLoggedIn() ? logoutState : loginState;
        }

        update();
    };

    // Gets if the user is logged in.
    var isLoggedIn = function () {
        return getCurrentUser() !== null;
    };

    // Gets the current user object from storage, or null if not logged in.
    var getCurrentUser = function () {
        var user = window.localStorage.getItem('loggedIn');
        if (user) {
            return JSON.parse(user);
        }
        return null;
    };

    // Gets HTML for the login element.
    var getLoginElHtml = function () {
        var user = getCurrentUser();
        if (user == null) {
            return '<a href="#login">Login</a>';
        } else {
            return 'Welcome, ' + user.username + '! | <a href="#admin">Manage Pages</a> | <a href="#logout">Logout</a>';
        }
    };

    // Refreshes the login element e.g. if login state changes
    var redisplayLogin = function() {
        initialize(savedLoginEl);
    };

    // Initialize the loginManager are draw the login options to the element specified.
    var initialize = function (loginEl) {
        savedLoginEl = loginEl;
        document.getElementById(loginEl).innerHTML = getLoginElHtml();
    };

    return {
        display: display,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        initialize: initialize
    };
})();
