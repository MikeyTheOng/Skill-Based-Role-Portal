from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import func
from datetime import date
from sqlalchemy import or_

from os import environ

import sys  # to allow checking of OS and to print errors

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)


class RoleListing(db.Model):
    __tablename__ = 'Role_Listing'
    Listing_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Role_Name = db.Column(db.String(20), nullable=False)
    Role_Description = db.Column(db.String(255), nullable=False)
    Start_Date = db.Column(db.Date, nullable=False)
    End_Date = db.Column(db.Date, nullable=False)
    Dept = db.Column(db.String(50), nullable=False)
    Salary = db.Column(db.Float(2), nullable=False)

    def __init__(self, role_name, role_description, start_date, end_date, dept, salary):
        self.Role_Name = role_name
        self.Role_Description = role_description
        self.Start_Date = start_date
        self.End_Date = end_date
        self.Dept = dept
        self.Salary = salary

    def json(self):
        return {
            "listing_id": self.Listing_ID,
            "role_name": self.Role_Name,
            "role_description": self.Role_Description,
            "start_date": self.Start_Date,
            "end_date": self.End_Date,
            "dept": self.Dept,
            "salary": self.Salary
            }
        
@app.route("/")
def is_online():
    return jsonify({
        "status": "role_listing is online"
    }), 200      
    
# TODO: Add documentation
'''
    port: 5002

    route: /listing
    method: GET
    params: None
    returns: all role listings in role_listing table

    route: /listing/<int:listing_id>
    method: GET
    params: listing_id
    returns: role listing specified listing_id

    route: /listing
    method: POST
    params: role_name, role_description, start_date, end_date, dept, salary
    returns: listing_id, success message
    
'''

# class RoleSkill(db.Model):
#     __tablename__ = 'Role_Skill'
#     Role_Name = db.Column(db.String(20), db.ForeignKey('Role_Listing.Role_Name'), primary_key=True)
#     Skill_Name = db.Column(db.String(50), primary_key=True)

#     def __init__(self, role_name, skill_name):
#         self.Role_Name = role_name
#         self.Skill_Name = skill_name

#     def json(self):
#         return {
#             "role_name": self.Role_Name,
#             "skill_name": self.Skill_Name
#         }

# New class
class RoleSkill(db.Model):
    __tablename__ = 'Role_Skill'
    
    Listing_ID = db.Column(db.Integer, db.ForeignKey('Role_Listing.Listing_ID'), primary_key=True)
    Skill_Name = db.Column(db.String(50), primary_key=True)

    def __init__(self, listing_id, skill_name):
        self.Listing_ID = listing_id
        self.Skill_Name = skill_name

    def json(self):
        return {
            "listing_id": self.Listing_ID,
            "skill_name": self.Skill_Name
        }

@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Flask app is running!"}), 200


@app.route("/listing", methods=["GET"])
def getAllListings():
    '''
        Status Code | Description
        200         | All Listings retrieved
        404        | Listing not found
    '''
    listings = RoleListing.query.all()
    if len(listings):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "listings": [listing.json() for listing in listings]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no role listings."
        }
    ), 404

@app.route("/listing/active", methods=["GET"])
def getActiveListings():
    '''
        Status Code | Description
        200         | All Listings retrieved
        404         | Listing not found
    '''
    # today = date.today()
    # print("Date:", date)
    # print("Today:", today)
    listings = RoleListing.query.filter(RoleListing.Start_Date <= date.today(), RoleListing.End_Date >= date.today()).all()
    if len(listings):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "listings": [listing.json() for listing in listings]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no active role listings."
        }
    ), 404

@app.route("/listing/<int:listing_id>")
def getListing(listing_id):
    '''
        Status Code | Description
        200         | Listing found
        204         | Listing not found
        500         | Error
    '''
    try:
        listing = RoleListing.query.filter_by(Listing_ID=listing_id).first()
        if listing:
            return jsonify(
                {
                    "code": 200,
                    "data": listing.json()
                }
            )
        else:
            return jsonify(
                {
                    "code": 204,
                    "service": "role_listing",
                    "data": {
                        "listing_id": listing_id
                    },
                    "message": "Listing not found"
                }
            ), 204
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "service": "role_listing",
                "data": {
                    "listing_id": listing_id
                },
                "message": f"An error occurred retrieving the listing. \n{e}"
            }
        ), 500

@app.route("/listing", methods=['POST'])
def create_listing():
    data = request.get_json()
    listing = RoleListing(data.get('role_name'), data.get('role_description'), data.get('start_date'), data.get('end_date'), data.get('dept'), data.get('salary'))

    try:
        db.session.add(listing)
        db.session.commit()
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": f"An error occurred creating the listing. \n{e}"
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": listing.json()
        }
    ), 201

@app.route("/listing/<int:listing_id>", methods=['PUT'])
def update_listing(listing_id):
    try:
        listing = RoleListing.query.filter_by(Listing_ID=listing_id).first()
        if not listing:
            return jsonify(
                {
                    "code": 404,
                    "data": {
                        "listing_id": listing_id
                    },
                    "message": "Listing not found."
                }
            ), 404

        data = request.get_json()

        if 'role_name' in data:
            listing.Role_Name = data['role_name']
        if 'role_description' in data:
            listing.Role_Description = data['role_description']
        if 'start_date' in data:
            listing.Start_Date = data['start_date']
        if 'end_date' in data:
            listing.End_Date = data['end_date']
        if 'dept' in data:
            listing.Dept = data['dept']
        if 'salary' in data:
            listing.Salary = data['salary']

        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "data": listing.json()
            }
        ), 200
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "listing_id": listing_id
                },
                "message": "An error occurred while updating the listing. " + str(e)
            }
        ), 500



# Filtering Roles by Skills
@app.route("/api/filter-roles", methods=["GET"])
def filter_roles_by_skill():
    skill_names = request.args.get("skill_names")
    
    if not skill_names:
        all_roles = RoleListing.query.all()
        return jsonify({"roles": [role.json() for role in all_roles]}), 200

    # Assuming skill_names is a comma-separated string, split it into a list
    skill_names_list = skill_names.split(',')

    roles = get_roles_by_skills(skill_names_list)

    if roles:
        return jsonify({"roles": [role.json() for role in roles]}), 200
    else:
        return jsonify({"message": f"No roles found for selected skills"}), 404

def get_roles_by_skills(skill_names_list):
    # Query the RoleSkill table to get roles that have any of the provided skills
    subquery = db.session.query(RoleSkill.Listing_ID)\
        .filter(RoleSkill.Skill_Name.in_(skill_names_list))\
        .group_by(RoleSkill.Listing_ID)\
        .having(func.count(RoleSkill.Skill_Name) == len(skill_names_list)).subquery()

    # Join the subquery with RoleListing to get the details of the roles
    roles = db.session.query(RoleListing).join(subquery, RoleListing.Listing_ID == subquery.c.Listing_ID).all()

    return roles




# Filter Department 

@app.route("/filter-by-department", methods=["GET"])
def filter_roles_by_department():
    departments = request.args.get("departments")
    
    if not departments:
        all_roles = RoleListing.query.all()
        return jsonify({"roles": [role.json() for role in all_roles]}), 200

    # Split the comma-separated string into a list of departments
    department_list = departments.split(',')

    roles_by_department = RoleListing.query.filter(RoleListing.Dept.in_(department_list)).all()

    if roles_by_department:
        return jsonify({"roles": [role.json() for role in roles_by_department]}), 200
    else:
        return jsonify({"message": f"No roles found for departments: {departments}"}), 404


@app.route("/search-roles", methods=["GET"])
def search_roles():
    query = request.args.get("query")
    role = request.args.get("role")

    if not query:
        return jsonify({"message": "Please provide a search query."}), 400

    # Get the current date
    current_date = date.today()
    if (role == "0"):
        # print("role:", role)
        # print("current_date:", current_date)
        # Search for non-expired roles based on the query in Role_Name & Role_Description
        roles = RoleListing.query.filter(
            or_(
                RoleListing.Role_Name.contains(query),
                RoleListing.Role_Description.contains(query)
            ),
            RoleListing.End_Date >= current_date  # Filter out expired roles
        ).all()
    else:
        print("role:", role)
        # Search for all roles based on the query in Role_Name & Role_Description
        roles = RoleListing.query.filter(
            or_(
                RoleListing.Role_Name.contains(query),
                RoleListing.Role_Description.contains(query)
            )
        ).all()

    if roles:
        return jsonify({"roles": [role.json() for role in roles]}), 200
    else:
        return jsonify({"message": "No roles found matching the search query or all roles are expired."}), 404



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)