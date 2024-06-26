import unittest
from unittest.mock import MagicMock
import json

# from application import Application, app, getAllApplications, db, create_application
import application
import role_skill
import staff_skill

class TestApplicationIntegration(unittest.TestCase):
    def setUp(self):
        self.app = application.app.test_client()

    def test_create_application_success(self):
        test_data = {
            "listing_id": 99,
            "staff_id": 99,
            "applicationDate": "2023-11-07",
            "applicationStatus": "Pending",
            "skillMatch": 25
        }
        response = self.app.post('/application', data=json.dumps(test_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_getAllApplications_with_data(self):
        response = self.app.get('/application')
        self.assertEqual(response.status_code, 200)

class TestRoleSkillIntegration(unittest.TestCase):
    def setUp(self):
        self.app = role_skill.app.test_client()

    def test_getAllRoleSkills_with_data(self):
        response = self.app.get('/role_skill')
        self.assertEqual(response.status_code, 200)

    def test_getSkillByListingID(self):
        response = self.app.get('/role_skill/1')
        self.assertEqual(response.status_code, 200)

class TestStaffSkillIntegration(unittest.TestCase):
    def setUp(self):
        self.app = staff_skill.app.test_client()

    def test_getAllStaffSkills_with_data(self):
        response = self.app.get('/get_all_staff_skills')
        self.assertEqual(response.status_code, 200)

    def test_getSkillByStaffID(self):
        response = self.app.get('/get_all_staff_skills/1')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Database Management', response.data.decode())
        self.assertIn('React JS', response.data.decode())
        self.assertIn('Vuejs', response.data.decode())

if __name__ == '__main__':
    unittest.main()