from flask import Flask, request, jsonify, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from cs50 import SQL

app = Flask(__name__)
db = SQL("sqlite:///api-logs.db")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Login logic handled in the api_login route
        pass
    else:
        return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Registration logic handled in the api_register route
        pass
    else:
        return render_template('register.html')

@app.route('/api/register', methods=['POST'])
def api_register():
    username = request.json.get('username')
    password = request.json.get('password')

    # Check if username already exists
    existing_user = db.execute("SELECT * FROM users WHERE username = ?", username)
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    # Hash the password and insert new user
    password_hash = generate_password_hash(password)
    db.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", username, password_hash)

    # After successful registration, retrieve user ID
    user_id = db.execute("SELECT id FROM users WHERE username = ?", username)
    return jsonify({"status": "registered", "user_id": user_id[0]["id"]})

@app.route('/api/login', methods=['POST'])
def api_login():
    username = request.json.get('username')
    password = request.json.get('password')

    # Retrieve user by username
    user = db.execute("SELECT * FROM users WHERE username = ?", username)

    if user and check_password_hash(user[0]["password_hash"], password):
        return jsonify({"status": "logged in", "user_id": user[0]["id"]})
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/logout', methods=['POST'])
def api_logout():
    # Perform any necessary logout logic
    return jsonify({"status": "logged out"})

if __name__ == '__main__':
    app.run(debug=True)
