from flask import Flask, request, jsonify, render_template, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from cs50 import SQL

app = Flask(__name__)
db = SQL("sqlite:///api-logs.db")

@app.route('/')
def home():
    return render_template('options.html')

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
            return render_template('post_login.html', user_id=user_id)
        else:
            error_message = "Invalid username or password"
            return render_template('login.html', error=error_message)
    else:
        return render_template('login.html')

@app.route('/logout', methods=['POST'])
def logout():
    # Logic to handle logout
    return jsonify({"status": "logged out"})

if __name__ == '__main__':
    app.run(debug=True)
