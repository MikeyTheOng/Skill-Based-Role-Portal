#imports
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class Role_Skill(db.Model):
    __tablename__ = 'Role_Skill'
    Listing_ID = db.Column(db.Integer, primary_key=True)
    Skill_Name = db.Column(db.String(50), primary_key=True)

    def __init__(self, listing_id, skill_name):
        self.Listing_ID = listing_id
        self.Skill_Name = skill_name

    def json(self):
        return {
            "listing_id": self.Listing_ID,
            "skill": self.Skill_Name
            }
        
@app.route("/role_skill", methods=["GET"])
def getAllSkills():
    skills = Role_Skill.query.all()
    if len(skills):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skills": [skill.json() for skill in skills]
                }
            }
        )
    return jsonify(
        {
            "code": 500,
            "message": "No skills found."
        }
    ), 404
    
@app.route("/role_skill/<int:listing_id>", methods=["GET"])
def getSkillsByListingID(listing_id):
    '''
        Status Code | Description
        200         | Skill(s) found
        204         | Skill(s) not found
        500         | Error
    '''
    try:
        skills = Role_Skill.query.filter_by(Listing_ID=listing_id).all()
        if len(skills):
            return jsonify(
                {
                    "code": 200,
                    "data": {
                        "skills": [skill.json() for skill in skills]
                    }
                }
            )
        return jsonify(
            {
                "code": 204,
                "message": "No skills found."
            }
        ), 204
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "service": "role_skill",
                "data": {
                    "listing_id": listing_id
                },
                "message": f"An error occurred retrieving role skill(s). \n{e}"
            }
        ), 500

@app.route("/role_skill", methods=["POST"])
def createSkill():
    data = request.get_json()
    # skill = Role_Skill(data["listing_id"], data["skill"])
    listing_id, skillsArr = data["listing_id"], data["skillsArr"]
    print(skillsArr)
    try:
        for role_skill in skillsArr:
            skill = Role_Skill(listing_id, role_skill['skill'])
            db.session.add(skill)
        db.session.commit()
    except Exception as e:
        print(f"An error occurred creating the skill(s) in role_skill. {e}")
        return jsonify(
            {
                "code": 500,
                "message": f"An error occurred creating the skill(s) in role_skill. {e}",
                "data" : {
                    "listing_id": listing_id,
                    "skillsArr" : skillsArr
                }
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "message" : "Role skills successfully created.",
            "data": skill.json()
        }
    ), 201

#get all listings with a skill
def generate_having_clause(skills):
    having_conditions = []
    for skill in skills:
        having_conditions.append(
            db.func.group_concat(Role_Skill.Skill_Name, ', ').like(f'%{skill}%')
        )
    return db.and_(*having_conditions)

# @app.route('/find_roles/<string:skills>')
# def find_roles(skills):
#     skills_to_find = skills.split('-')

#     if not skills_to_find:
#         return "Please provide a list of skills to search for.", 400

#     query = Role_Skill.query.filter(Skill_Name.in_(skills_to_find)) \
#         .group_by(Listing_ID) \
#         .having(generate_having_clause(skills_to_find))

#     listings_with_skills = query.all()

#     listing_ids = [str(listing.Listing_ID) for listing in listings_with_skills]

#     if not listing_ids:
#         return "No listings found with the specified skills."

#     return ', '.join(listing_ids)



#update role skill
@app.route("/role_skill/<int:listing_id>", methods=["PUT"])
def updateSkills(listing_id):
    data = request.get_json()
    new_skills = data.get('skills')

    try:
        Role_Skill.query.filter_by(Listing_ID=listing_id).delete()

        for skill in new_skills:
            new_listing_skill = Role_Skill(listing_id, skill)
            db.session.add(new_listing_skill)

        db.session.commit()
        return jsonify({'message': 'Listing skills updated successfully'})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)

