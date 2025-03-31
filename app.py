from flask import Flask, render_template, jsonify, session, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'skrivnost'

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))


with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/qrcode')
def qrcode():

    if 'username' in session:
        return render_template('qrcode.html')
    
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        
        username = data['username']
        password = data['password']
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password, password):
            session['username'] = username
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Invalid username or password'})
    
    return render_template('login.html')
    

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':

        data = request.json

        username = data['username']

        password = data['password']

        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'Username already exists!'})
        
        hashed_password = generate_password_hash(password)
        
        new_user = User(username = username, password = hashed_password)

        db.session.add(new_user)

        db.session.commit()

        return jsonify({'success': True})
    
    return render_template('register.html')


@app.route('/logout')
def logout():

    session.pop('username', None)

    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)