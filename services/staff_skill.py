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

#Staff_skill class
class staff_skill(db.Model):
    __tablename__ = 'Staff_Skill'
    Staff_ID = db.Column(db.Integer, primary_key=True)
    Skill_Name = db.Column(db.String(100), primary_key = True, nullable=False)

    def __init__(self, staff_id,skill_name):
        self.Staff_ID = staff_id
        self.Skill_Name = skill_name

    def json(self):
        return {
            "Staff_ID": self.Staff_ID,
            "Skill_Name": self.Skill_Name
            }
    

# #Get all staff_skill
# def get_all():
#     staff_skill_list = staff_skill.query.all()
#     if len(staff_skill_list):
#         return jsonify(
#             {
#                 "code": 200,
#                 "data": {
#                     "staff_skill": [staff_skill.json() for staff_skill in staff_skill_list]
#                 }
#             }
#         )
#     return jsonify(
#         {
#             "code": 404,
#             "message": "There are no staff_skills."
#         }
#     ), 404

# #Get all staff_skill
@app.route('/get_all_staff_skills', methods=['GET'])
def get_all_staff_skills():
    staff_skill_list = staff_skill.query.all()
    if len(staff_skill_list):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff_skills": [staff.json() for staff in staff_skill_list]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no staff skills."
        }
    ), 404


#Get staff_skill by staff_id
@app.route('/get_all_staff_skills/<int:staff_id>', methods=['GET'])
def find_by_staff_id(staff_id):
    skill = staff_skill.query.filter_by(Staff_ID=staff_id)
    if skill.first():
        return jsonify(
            {
                "code": 200,
                "data": [skills.json() for skills in skill]
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Staff_skill not found."
        }
    ), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)