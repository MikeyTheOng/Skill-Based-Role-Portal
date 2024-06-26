from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

import sys  # to allow checking of OS and to print errors

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class Application(db.Model):
    __tablename__ = 'Application'
    Staff_ID = db.Column(db.Integer, primary_key=True, nullable=False)
    Listing_ID = db.Column(db.Integer, primary_key=True, nullable=False)
    Application_Date = db.Column(db.Date, nullable=False)
    Application_Status = db.Column(db.String(50), nullable=False)
    Skill_Match = db.Column(db.Integer, nullable=False)

    def __init__(self, staff_id, listing_id, application_date, application_status, skill_match):
        self.Staff_ID = staff_id
        self.Listing_ID = listing_id
        self.Application_Date = application_date
        self.Application_Status = application_status
        self.Skill_Match = skill_match

    def json(self):
        return {
            "staff_id": self.Staff_ID,
            "listing_id": self.Listing_ID,
            "application_date": self.Application_Date,
            "application_status": self.Application_Status,
            "skill_match": self.Skill_Match 
        }

@app.route("/application", methods=["GET"])
def getAllApplications():
    applications = Application.query.all()
    if len(applications):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "applications": [application.json() for application in applications]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no applications."
        }
    ), 404

@app.route("/application/<int:listing_id>", methods=["GET"])
def getListingApplications(listing_id):
    applications = Application.query.filter_by(Listing_ID=listing_id).all()

    try:
        if len(applications):
            return jsonify(
                {
                    "code": 200,
                    "data": {
                        "applications": [application.json() for application in applications]
                    }
                }
            )
        return jsonify(
            {
                "code": 404,
                "message": "There are no applications."
            }
        ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": f"An error occurred while retrieving listing applications. {str(e)}"
            }
        ), 500

@app.route("/application/<int:listing_id>/<int:staff_id>", methods=["GET"])    
def getStaffListingApplication(listing_id, staff_id):
    try:
        existing_application = Application.query.filter_by(Listing_ID=listing_id, Staff_ID=staff_id).first()
        if existing_application:
            return jsonify({
                "code": 200,
                "message": f"Application with listing_id ({listing_id}) and staff_id ({staff_id}) already exists."
            }), 200
        return jsonify(
            {
                "code": 404,
                "message": f"No application found with listing_id ({listing_id}) and staff_id ({staff_id})"
            }
        ), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/application/staff/<int:staff_id>", methods=["GET"])
def getStaffApplications(staff_id):
    applications = Application.query.filter_by(Staff_ID=staff_id).all()

    try:
        if len(applications):
            return jsonify(
                {
                    "code": 200,
                    "data": {
                        "applications": [application.json() for application in applications]
                    }
                }
            )
        return jsonify(
            {
                "code": 404,
                "message": "Staff has no applications."
            }
        ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": f"An error occurred while retrieving staff applications. {str(e)}"
            }
        ), 500

@app.route("/application", methods=['POST'])
def create_application():
    data = request.get_json()
    # print("Data:", data)
    # Check if a record with the given primary keys already exists
    existing_application = Application.query.filter_by(Listing_ID=data["listing_id"], Staff_ID=data["staff_id"]).first()
    if existing_application:
        return jsonify({
            "code": 409,
            "message": f"Application with the listing_id ({data['listing_id']}) and staff_id ({data['staff_id']}) already exists."
        }), 409
    
    application = Application(data["staff_id"], data["listing_id"], data["applicationDate"], data["applicationStatus"], data["skillMatch"])

    try:
        db.session.add(application)
        db.session.commit()
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": f"An error occurred while creating application. {str(e)}"
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": application.json()
        }
    ), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006, debug=True)