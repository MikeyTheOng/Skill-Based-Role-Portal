# All-In-One Internal Job Portal

This is G6-T2's SPM Project.

## Table of Contents
- Installation
- Launch
- Frontend Tests


## Installation 

Clone the project 

```bash
  git clone https://github.com/jteoo/IS212-SPM-Project.git
```

#### 1. Install Dependencies

Navigate to the project directory:

```bash
  cd my-app
```

Install dependencies

```bash
  npm install
```

#### 2. Initialize the Databae

Start the WAMP server on your machine, and execute the `main.sql` script located in the `/SQL_Statements` directory to set up the database

#### 3. Launch Microservices with Docker Compose

Ensure you are in the `services` directory, then start the microservices using Docker Compose:

```bash
  docker-compose build
  docker-compose up
```

## Launch

### Run Locally

#### 1a. Create and start the production build

Go to the project directory:

```bash
    cd ../my-app
```

Create a production build:
```bash
  npm run build
```

Start the production server:

```bash
  npm run start
```

#### 1b. Run in development mode

If you encounter issues with the production build, you can run the application in development mode:

Ensure you are in the project directory:

```bash
  cd my-app
```

Start the development server:

```bash
  npm run dev
```


### How to use the Web App


Go to `http://localhost:3000/`

Log in using the following credentials:

| Email | Access Rights     
| :-------- | :------- |
| hrone.eams@gmail.com | HR |
| employeeone.eams@gmail.com | Staff |
| dataone.eams@gmail.com | Staff |

Enjoy exploring our app and have a blast!

## Frontend Tests

Frontend Testing is done using with Jest and React Testing Library, a popular combination of a JavaScript testing framework and a React utility for testing components.

Test cases done on 2 core functionalities of the project:
- Browsing of Role Listings by Staff and HR users
- Filtering of Role Listing based on Departments and Skills by Staff and HR users

#### 1. Run the Web App in Production / Development Build

Refer to the steps mentioned in Launch section.

#### 2. Execute the Tests

Go to the project directory:

```bash
    cd ../my-app
```

Launch the tests:

```bash
  npm test
```


