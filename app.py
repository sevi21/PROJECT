from flask import Flask, render_template, jsonify, session, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import qrcode
from io import BytesIO
import base64
import os


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
def qrcode_page():

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


@app.route('/makeQR', methods=['POST'])
def make_qr():

    data = request.json

    content = data.get('content', '')

    
    filepath = os.path.join(app.root_path, 'qrcodes', content + '.png')

    qr = qrcode.QRCode(

        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,

    )

    qr.add_data(content)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    img.save(filepath)

    




    return jsonify({
        'success': True,
        'message': 'QR code created successfully!',
                })
if __name__ == '__main__':
    app.run(debug=True)