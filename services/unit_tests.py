#import unittest modules
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import unittest
from unittest.mock import MagicMock, patch


#import classes to test
from application import Application
from role_skill import Role_Skill
from staff import Staff
from staff_skill import staff_skill
from role_listing import RoleListing, app, db, RoleSkill


class TestApplications(unittest.TestCase):
    def setUp(self):
        self.application1 = Application(1, 1, "2021-03-01", "Pending", 0)

    def tearDown(self):
        self.application1 = None

    def test_application(self):
        self.assertEqual(self.application1.Staff_ID, 1)
        self.assertEqual(self.application1.Listing_ID, 1)
        self.assertEqual(self.application1.Application_Date, "2021-03-01")
        self.assertEqual(self.application1.Application_Status, "Pending")
        self.assertEqual(self.application1.Skill_Match, 0)

class TestStaffInfoAndApplications(unittest.TestCase):
    def setUp(self):
        # Set up dummy data for a staff member
        self.staff = Staff(1, 'Bryan', 'Lee', 'Technology', 'Singapore', 'employeeone.eams@gmail.com', 0)
        # Set up dummy data for applications
        self.applications = [
            Application(1, 2, '2023-06-30', 'Rejected', 75),
            Application(1, 3, '2023-07-01', 'Accepted', 90)
        ]

    def tearDown(self):
        # Clean up after each test case
        self.staff = None
        self.applications = None

    def test_staff_personal_info(self):
        # Test that personal information is correctly retrieved
        self.assertEqual(self.staff.Staff_ID, 1)
        self.assertEqual(self.staff.Staff_FName, 'Bryan')
        self.assertEqual(self.staff.Staff_LName, 'Lee')
        self.assertEqual(self.staff.Dept, 'Technology')
        self.assertEqual(self.staff.Country, 'Singapore')
        self.assertEqual(self.staff.Email, 'employeeone.eams@gmail.com')
        self.assertEqual(self.staff.Access_Rights, 0)

    def test_staff_applications(self):
        # Test that applications are correctly retrieved
        # Assuming Staff class has a method get_applications that returns a list of applications
        self.staff.get_applications = lambda: self.applications
        retrieved_applications = self.staff.get_applications()
        
        self.assertEqual(len(retrieved_applications), 2)
        self.assertEqual(retrieved_applications[0].Application_Status, 'Rejected')
        self.assertEqual(retrieved_applications[1].Application_Status, 'Accepted')

class TestRoleListings(unittest.TestCase):
    def setUp(self):
        # Set up dummy data for role listings
        self.role_listing1 = RoleListing(
            'Software Engineer', 
            'Develop and maintain software applications', 
            '2023-01-01', 
            '2023-12-31', 
            'Technology', 
            80000.00
        )
        self.role_listing2 = RoleListing(
            'Data Analyst', 
            'Analyze data and provide insights', 
            '2023-02-01', 
            '2023-11-30', 
            'Data', 
            70000.00
        )

    def tearDown(self):
        self.role_listing1 = None
        self.role_listing2 = None

    def test_role_listing_attributes(self):
        # Test attributes for the first role listing
        self.assertEqual(self.role_listing1.Role_Name, 'Software Engineer')
        self.assertEqual(self.role_listing1.Role_Description, 'Develop and maintain software applications')
        self.assertEqual(self.role_listing1.Start_Date, '2023-01-01')
        self.assertEqual(self.role_listing1.End_Date, '2023-12-31')
        self.assertEqual(self.role_listing1.Dept, 'Technology')
        self.assertEqual(self.role_listing1.Salary, 80000.00)

        # Test attributes for the second role listing
        self.assertEqual(self.role_listing2.Role_Name, 'Data Analyst')
        self.assertEqual(self.role_listing2.Role_Description, 'Analyze data and provide insights')
        self.assertEqual(self.role_listing2.Start_Date, '2023-02-01')
        self.assertEqual(self.role_listing2.End_Date, '2023-11-30')
        self.assertEqual(self.role_listing2.Dept, 'Data')
        self.assertEqual(self.role_listing2.Salary, 70000.00)


if __name__ == "__main__":
    unittest.main()
