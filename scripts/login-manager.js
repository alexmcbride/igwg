var loginManager = (function () {
    var currentState = null;

    // Super-secure list of users :)
    var users = [];
    users['Admin'] = { username: 'Admin', password: 'password1' };
    users['Alex'] = { username: 'Alex', password: 'password1' };
    users['Jim'] = { username: 'Jim', password: 'password1' };

    var loginState = function () {
        var html = '<h2>Login</h2>';
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
    }

    var logoutState = function () {
        var html = '<h2>Logout</h2>';
        html += '<form>';
        html += '<p>Are you sure you want to logout?</p>';
        html += '<input type="button" value="Yes" onclick="loginManager.logout()" class="btn btn-primary">';
        html += '</form>';
        return html;
    }

    var hideError = function () {
        var el = document.getElementById('error');
        el.style.display = 'none';
    }

    var showError = function (error) {
        var el = document.getElementById('error');
        el.innerHTML = error;
        el.style.display = 'block';
    }

    var authenticate = function (username, password) {
        if (users[username] !== undefined) {
            if (users[username].password === password) {
                return users[username];
            }
        }
        return null;
    }

    var login = function () {
        hideError();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        var user = authenticate(username, password);
        if (user !== null) {
            window.localStorage.setItem('loggedIn', JSON.stringify({username: user.username}));
            currentState = logoutState;
            content.render('<h2>Logged In</h2><p>Welcome, ' + user.username + '!. You can now add, edit, and delete pages!</p>');
            app.refreshMenu();
        } else {
            showError('Username and password incorrect');
        }
    }

    var logout = function () {
        window.localStorage.removeItem('loggedIn');
        currentState = loginState;
        update();
        app.refreshMenu();
        showError('You are now logged out');
    }

    var update = function (error) {
        var html = currentState(error);
        content.render(html);
    }

    var display = function () {
        if (currentState == null) {
            currentState = isLoggedIn() ? logoutState : loginState;
        }

        update();
    }

    var isLoggedIn = function () {
        return currentUser() !== null;
    }

    var currentUser = function() {
        return JSON.parse(window.localStorage.getItem('loggedIn'));
    }

    return {
        display: display,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
    };
})();
