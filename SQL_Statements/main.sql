-- CREATE DATABASE 
DROP DATABASE IF EXISTS SBRP;
CREATE DATABASE SBRP;
USE SBRP;

-- INSERT TABLES
CREATE TABLE Staff (
	Staff_ID int auto_increment primary key ,
    Staff_FName varchar(50) NOT NULL, 
    Staff_LName varchar(50) NOT NULL,
    Dept varchar(50) NOT NULL,
    Country varchar(50) NOT NULL,
    Email varchar(50) NOT NULL,
    Access_Rights int 
);

CREATE TABLE Staff_Skill (
	Staff_ID int ,
    Skill_Name varchar(100) ,
    PRIMARY KEY (Staff_ID, Skill_Name)
);

CREATE TABLE Role_Listing (
	Listing_ID int auto_increment primary key ,
    Role_Name varchar(255) NOT NULL, 
    Role_Description varchar(255) NOT NULL, 
    Start_Date date NOT NULL,
    End_Date date NOT NULL,
    Dept varchar(50) NOT NULL,
    Salary float(2) NOT NULL
);

CREATE TABLE Role_Skill (
	Listing_ID int,
    Skill_Name varchar(191) ,
    PRIMARY KEY (Listing_ID, Skill_Name)
);

CREATE TABLE Application (
    Staff_ID int NOT NULL,
    Listing_ID int NOT NULL,
    Application_Date date NOT NULL,
    Application_Status varchar(50) not null,
    Skill_Match int NOT NULL,
    PRIMARY KEY (Staff_ID, Listing_ID)
);


-- INSERT TEST DATA
-- Test Data for Staff
INSERT INTO Staff (`Staff_ID`, `Staff_FName`, `Staff_LName`, `Dept`, `Country`, `Email`, `Access_Rights`) VALUES (1, 'Bryan','Lee','Technology','Singapore','employeeone.eams@gmail.com',0);
INSERT INTO Staff (`Staff_ID`, `Staff_FName`, `Staff_LName`, `Dept`, `Country`, `Email`, `Access_Rights`) VALUES (2, 'Bruce','Lee','Human Resources','Singapore','hrone.eams@gmail.com', 2);
INSERT INTO Staff (`Staff_ID`, `Staff_FName`, `Staff_LName`, `Dept`, `Country`, `Email`, `Access_Rights`) VALUES 
(3, 'Alice', 'Wong', 'Finance', 'Singapore', 'financeone.eams@gmail.com', 0),
(4, 'David', 'Tan', 'Marketing', 'Singapore', 'marketingone.eams@gmail.com', 0),
(5, 'Eva', 'Lim', 'Sales', 'Singapore', 'salesone.eams@gmail.com', 0),
(6, 'Frank', 'Chen', 'Operations', 'Singapore', 'operationsone.eams@gmail.com', 0),
(7, 'Grace', 'Koh', 'IT', 'Singapore', 'itone.eams@gmail.com', 0),
(8, 'Henry', 'Ong', 'Business', 'Singapore', 'businessone.eams@gmail.com', 0),
(9, 'Irene', 'Teo', 'Data Analytics', 'Singapore', 'dataone.eams@gmail.com', 0),
(10, 'Jack', 'Poh', 'Product', 'Singapore', 'productone.eams@gmail.com', 0);

-- Test Data for Role Listing
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) VALUES ('Software Engineer', 'Front-end development for web applications', '2023-09-20', '2023-12-31', 'Technology', 80000.00);
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) VALUES ('Data Analyst', 'Analyzing and interpreting data for business insights', '2023-10-01', '2023-12-31', 'Engineering', 60000.00);
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) VALUES ('HR Manager', 'Managing and overseeing the HR department', '2023-10-01', '2023-12-31', 'Human Resources', 70000.00);


-- Data Scientist Role
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) 
VALUES ('Data Scientist', 'Analyze large datasets and build predictive models', '2023-10-01', '2024-03-31', 'Data Analytics', 85000.00);

-- Product Manager Role
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) 
VALUES ('Product Manager', 'Oversee product development and market strategy', '2023-11-15', '2024-11-14', 'Product', 90000.00);

-- HR Specialist Role
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) 
VALUES ('HR Specialist', 'Manage recruitment and employee relations', '2023-09-25', '2024-09-24', 'Human Resources', 60000.00);

-- Finance Analyst Role
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) 
VALUES ('Finance Analyst', 'Analyze financial data and prepare reports', '2023-10-10', '2024-10-09', 'Finance', 70000.00);

-- Operations Manager Role
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) 
VALUES ('Operations Manager', 'Oversee daily operations and optimize processes', '2023-11-05', '2024-11-04', 'Operations', 75000.00);

-- Marketing Executive Role (Expired)
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) 
VALUES ('Marketing Executive', 'Manage marketing campaigns and promotions', '2022-01-01', '2023-09-29', 'Marketing', 65000.00);

-- Sales Associate Role (Expired)
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) 
VALUES ('Sales Associate', 'Drive sales and engage with customers', '2021-06-01', '2023-05-31', 'Sales', 55000.00);

-- IT Support Role (Expired)
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) 
VALUES ('IT Support', 'Provide technical support to employees', '2021-07-01', '2023-06-30', 'IT', 58000.00);

-- Business Analyst Role
INSERT INTO Role_Listing (Role_Name, Role_Description, Start_Date, End_Date, Dept, Salary) 
VALUES ('Business Analyst', 'Analyze business processes and requirements', '2023-08-15', '2024-08-14', 'Business', 77000.00);


-- Inserting data into Role_Skill table
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(1, 'Database Management'),
(1, 'React JS'),
(1, 'Vuejs'),
(1, 'Leadership'),
(1, 'HTML'),
(1, 'CSS'),
(2, 'Database Management'),
(2, 'Network Administration'),
(3, 'Customer Relationship Management (CRM)');

-- Skills for Data Scientist Role (Listing_ID: 4)
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(4, 'Database Management'),
(4, 'React JS'),
(4, 'Vuejs');

-- Skills for Product Manager Role (Listing_ID: 5)
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(5, 'Leadership'),
(5, 'HTML'),
(5, 'CSS');

-- Skills for HR Specialist Role (Listing_ID: 6)
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(6, 'Database Management'),
(6, 'Network Administration');

-- Skills for Finance Analyst Role (Listing_ID: 7)
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(7, 'Customer Relationship Management (CRM)'),
(7, 'Database Management');

-- Skills for Operations Manager Role (Listing_ID: 8)
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(8, 'React JS'),
(8, 'Vuejs');

-- Skills for Marketing Executive Role (Listing_ID: 9)
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(9, 'Leadership'),
(9, 'HTML');

-- Skills for Sales Associate Role (Listing_ID: 10)
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(10, 'CSS'),
(10, 'Database Management');

-- Skills for IT Support Role (Listing_ID: 11)
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(11, 'Network Administration'),
(11, 'Customer Relationship Management (CRM)');

-- Skills for Business Analyst Role (Listing_ID: 12)
INSERT INTO Role_Skill (Listing_ID, Skill_Name) VALUES
(12, 'React JS'),
(12, 'Vuejs');

-- Inserting Data into Staff_Skill table
INSERT INTO Staff_Skill (Staff_ID, Skill_Name) VALUES
(1, 'Database Management'),
(1, 'React JS'),
(1, 'Vuejs'),
(2, 'Database Management'),
(2, 'Network Administration'), 
(2, 'Vuejs'),
(3, 'Database Management'),
(3, 'React JS'),
(3, 'Vuejs'),
(4, 'Leadership'),
(4, 'HTML'),
(4, 'CSS'),
(5, 'Database Management'),
(5, 'Network Administration'),
(6, 'Customer Relationship Management (CRM)'),
(6, 'React JS'),
(6, 'Vuejs'),
(7, 'Database Management'),
(7, 'HTML'),
(7, 'CSS'),
(8, 'Leadership'),
(8, 'React JS'),
(8, 'Vuejs'),
(9, 'Database Management'),
(9, 'Network Administration'),
(10, 'Customer Relationship Management (CRM)'),
(10, 'React JS'),
(10, 'Vuejs');

-- Inserting Data into Application table
INSERT INTO Application (Staff_ID, Listing_ID, Application_Date, Application_Status, Skill_Match) VALUES
(1, 2, '2023-06-30', 'Rejected', 75),
(2, 2, '2023-06-30', 'Reviewing', 100),
(3, 2, '2023-06-30', 'Rejected', 100),
(4, 2, '2023-06-30', 'Reviewing', 75),
(5, 2, '2023-06-30', 'Rejected', 60),
(6, 2, '2023-06-30', 'Reviewing', 50),
(7, 2, '2023-06-30', 'Rejected', 25),
(8, 2, '2023-06-30', 'Reviewing', 30),
(9, 2, '2023-06-30', 'Rejected', 25),
(10, 2, '2023-06-30', 'Reviewing', 0);



