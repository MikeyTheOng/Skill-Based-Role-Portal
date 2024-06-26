from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

import sys  # to allow checking of OS and to print errors
#try
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class Staff(db.Model):
    __tablename__ = 'Staff'
    Staff_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Staff_FName = db.Column(db.String(255), nullable=False)
    Staff_LName = db.Column(db.String(255), nullable=False)
    Dept = db.Column(db.String(255), nullable=False)
    Country = db.Column(db.String(255), nullable=False)
    Email = db.Column(db.String(255), nullable=False)
    Access_Rights = db.Column(db.Integer)

    def __init__(self, staff_id, staff_FName, staff_LName, dept, country, email, access_rights):
        self.Staff_ID = staff_id
        self.Staff_FName = staff_FName
        self.Staff_LName = staff_LName
        self.Dept = dept
        self.Country = country
        self.Email = email
        self.Access_Rights = access_rights

    def json(self):
        return {
            "staff_id": self.Staff_ID,
            "staff_FName": self.Staff_FName,
            "staff_LName": self.Staff_LName,
            "dept": self.Dept,
            "country": self.Country,
            "email": self.Email,
            "access_rights": self.Access_Rights
        }

@app.route("/")
def is_online():
    return jsonify({
        "status": "user-app is online"
    }), 200
    
@app.route("/get-user", methods=["POST"])
def getUser():
    '''
        Status Code | Description
        200         | User found
        201         | User not found
    '''
    data = request.json
    email = data["email"]
    user_data = Staff.query.filter_by(Email=email).first()
    
    if user_data:
        # User found, return user data as JSON
        return jsonify(user_data.json()), 200
    else:
        # User not found
        return jsonify({
            "message": "User not found"
        }), 201

@app.route("/staff", methods=["GET"])
def getAllStaff():
    staff = Staff.query.all()

    try:
        if len(staff):
            return jsonify(
                {
                    "code": 200,
                    "data": {
                        "staff": [s.json() for s in staff]
                    }
                }
            )
        return jsonify(
            {
                "code": 404,
                "message": "There are no staff."
            }
        ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": f"An error occurred while retrieving staff. {str(e)}"
            }
        ), 500

@app.route("/staff/<int:staff_id>", methods=["GET"])
def getStaff(staff_id):
    staff = Staff.query.filter_by(Staff_ID=staff_id).first()

    try:
        if staff:
            return jsonify(
                {
                    "code": 200,
                    "data": staff.json()
                }
            )
        return jsonify(
            {
                "code": 404,
                "data": {
                    "staff_id": staff_id
                },
                "message": "Staff not found."
            }
        ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": f"An error occurred while retrieving staff. {str(e)}"
            }
        ), 500
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100, debug=True)