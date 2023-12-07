from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from cs50 import SQL

app = Flask(__name__)
app.secret_key = 'ak;jsdnakwhkbwdakjwdn;lrfkjnasdg' # Random String

db = SQL("sqlite:///api-logs.db")

def get_user_info(user_id):
    #Retrieve user information based on user_id
    user = db.execute("SELECT * FROM users WHERE id = ?", user_id)
    if user:
        return user[0]  # Return the first (and should be only) user record
    else:
        return None  # No user found with the given ID

@app.route('/')
def home():
    # Check if user is logged in (you can use session or other methods based on your setup)
    if 'user_id' in session and session['user_id'] is not None and session['user_id'] != -1:
        # User is logged in, render the main content page with user details
        user = get_user_info(session['user_id']) 
        return render_template('index.html', username=user['username'])
    else:
        # User is not logged in, render the login page
        return render_template('login.html')
    
@app.route('/options')
def options():
    if 'user_id' in session and session['user_id'] != -1:
        return render_template('options.html')
    else:
        return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Check if username already exists
        existing_user = db.execute("SELECT * FROM users WHERE username = ?", username)
        if existing_user:
            error_message = "Username already exists."
            return render_template('register.html', error=error_message)

        # Hash the password and insert new user
        password_hash = generate_password_hash(password)
        db.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", username, password_hash)

        # Retrieve user ID
        user_id = db.execute("SELECT id FROM users WHERE username = ?", username)[0]['id']
        session['user_id'] = user_id
        return render_template('post_register.html', user_id=user_id)
    else:
        return render_template('register.html', error='');

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Retrieve user by username and check password
        user = db.execute("SELECT * FROM users WHERE username = ?", username)
        if user and check_password_hash(user[0]["password_hash"], password):
            user_id = user[0]["id"]
            session['user_id'] = user_id
            return render_template('post_login.html', user_id=user_id)
        else:
            error_message = "Invalid username or password"
            return render_template('login.html', error=error_message)
    else:
        return render_template('login.html')

@app.route('/logout', methods=['POST', 'GET'])
def logout():
    # Logic to handle logout
    session.pop('user_id', None);
    return render_template('post_logout.html');

if __name__ == '__main__':
    app.run(debug=True)
