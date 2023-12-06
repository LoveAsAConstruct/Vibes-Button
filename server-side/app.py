from flask import Flask, request, jsonify, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from cs50 import SQL
from flask_cors import CORS


app = Flask(__name__)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///api-logs.db")

CORS(app, origins=["https://example.com", "http://localhost:5000"])

@app.after_request
def add_csp(response):
    response.headers['Content-Security-Policy'] = "script-src 'self' 'unsafe-inline' 'unsafe-eval';"
    return response

@app.route('/')
def home():
    return render_template('options.html')

@app.route('/options')
def options():
    return render_template('options.html')  # Ensure 'options.html' is in the 'templates' folder

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Check if username already exists
        existing_user = db.execute("SELECT * FROM users WHERE username = ?", username)
        if existing_user:
            return jsonify({"error": "Username already exists"}), 400

        # Hash the password and insert new user
        password_hash = generate_password_hash(password)
        db.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", username, password_hash)

        # After successful registration, retrieve user ID
        user_id = db.execute("SELECT id FROM users WHERE username = ?", username)[0]['id']
        return jsonify({"action": "setUserId", "userId": user_id})
    else:  # GET request
        return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Retrieve user by username
        user = db.execute("SELECT * FROM users WHERE username = ?", username)
        if user and check_password_hash(user[0]["password_hash"], password):
            # Send a message to set user ID
            return jsonify({"action": "setUserId", "userId": user[0]["id"]})
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    else:  # GET request
        return render_template('login.html')

@app.route('/logout', methods=['POST'])
def logout():
    # For logout, return a special user_id indicating logged out status
    return jsonify({"action": "setUserId", "userId": None})

if __name__ == '__main__':
    app.run(debug=True)
