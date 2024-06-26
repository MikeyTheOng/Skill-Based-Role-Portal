import React from 'react';
import { render, screen, fireEvent, within, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewListings from '../../src/pages/roles/listings';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { cleanup } from "@testing-library/react";
import { SessionProvider } from 'next-auth/react';
import ErrorBoundary from '../errorBoundary';
import {formatDateWithoutTime} from '../../src/utils/utils'


beforeAll(() => {
  mock.reset();
});

afterEach(cleanup);

const mock = new MockAdapter(axios);

const currentDate = new Date();
currentDate.setMinutes(currentDate.getMinutes() + 10);
const expires = currentDate.toISOString();

const renderComponent = () => render(
  <ErrorBoundary>
    <SessionProvider
      session={{
        "expires": expires,
        "id": 1,
        "name": "Bryan Lee",
        "role": 0,
        "user": {
            "email": "employeeone.eams@gmail.com",
            "name": "Bryan Lee"
        }
    }}
    >
      <ViewListings />
    </SessionProvider>
  </ErrorBoundary>
);

jest.mock('next/router', () => ({
  useRouter: () => ({
    useRouter: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const skillsList = {
  response:[
    'CSS',
    'HTML',
    'Leadership',
    'Financial Analysis',
    'Budgeting and Forecasting',
    'Network Administration',
    'Database Management',
    'Customer Relationship Management (CRM)',
    'React JS',
    'Vuejs',
    'Express JS',
    'English',
    'Mandarin',
    'Spanish',
    'French',
    'German',
  ]
};

const departmentsList = {
  response:[
    { value: 'Human Resources', label:'Human Resources' },
    { value: 'faa', label:'Financial and Accounting'},
    { value: 'Operations', label: 'Operations'},
    { value: 'mkt', label: 'Marketing'},
    { value: 'Technology', label: 'Information Technology'},
    { value: 'eng', label: 'Engineering'},
    { value: 'sales', label: 'Sales'},
    { value: 'Customer Service', label: 'Customer Service'},
    { value: 'other', label: 'Other'}
  ]
};

describe('ViewListings', () => {

  it("should render the filter menu component", async () => {

    let getByTestId;
    
    await act(async () => {
      const renderResult = renderComponent();
      getByTestId = renderResult.getByTestId; 
    })
    await waitFor(() => {
      const filterMenuComponent = getByTestId('filterMenu');
      expect(filterMenuComponent).toBeInTheDocument();
      const filterButton = getByTestId('filterButton');
      expect(filterButton).toBeInTheDocument();
    });

  })

  it("should filter by department correctly", async () => {
    
    const humanResourceListings = {
      code: 200,
      data: {
        "roles": [
          {
              "dept": "Human Resources",
              "end_date": "Sun, 31 Dec 2023 00:00:00 GMT",
              "listing_id": 3,
              "role_description": "Managing and overseeing the HR department",
              "role_name": "HR Manager",
              "salary": 70000.0,
              "start_date": "Sun, 01 Oct 2023 00:00:00 GMT"
          },
          {
              "dept": "Human Resources",
              "end_date": "Tue, 24 Sep 2024 00:00:00 GMT",
              "listing_id": 6,
              "role_description": "Manage recruitment and employee relations",
              "role_name": "HR Specialist",
              "salary": 60000.0,
              "start_date": "Mon, 25 Sep 2023 00:00:00 GMT"
          }
        ]
      },
    };

    const ListingCount = humanResourceListings.data.roles.length;

    act(() => {
      mock.onGet('http://localhost:5002/filter-by-department?departments=Human Resources').reply(200, humanResourceListings);
    })

    axios.get('http://localhost:3000/api/get-departments')
    .then(response => {
      let getByTestId;
      const renderResult = renderComponent();
      getByTestId = renderResult.getByTestId; 

      fireEvent.click(getByTestId('filterButton'));
      fireEvent.click(getByTestId('Human Resources'));
      expect(getByTestId("deptSelected")).toBeInTheDocument();
      expect(getByTestId("deptSelected")).toHaveTextContent(`1 selected`);
      fireEvent.click(screen.getByTestId('applyButton'));

      expect(screen.getByTestId('listingCount')).toBeInTheDocument();
      expect(screen.getByTestId('listingCount')).toHaveTextContent(`Total Listings: ${ListingCount}`);
      
      humanResourceListings.data.listings.forEach((listing, index) => {
        const end_date = formatDateWithoutTime(listing.end_date);

        expect(screen.getByTestId(`listingId${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingId${listing.listing_id}`)).toHaveTextContent(`Listing ID ${listing.listing_id}`);

        expect(screen.getByTestId(`listingName${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingName${listing.listing_id}`)).toHaveTextContent(`${listing.role_name}`);

        expect(screen.getByTestId(`listingDept${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingDept${listing.listing_id}`)).toHaveTextContent(`${listing.dept}`);
        
        expect(screen.getByTestId(`listingSalary${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingSalary${listing.listing_id}`)).toHaveTextContent(`${listing.salary}`);
        
        expect(screen.getByTestId(`listingEndDate${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingEndDate${listing.listing_id}`)).toHaveTextContent(`Application Deadline: ${end_date}`);
      });
    })
    .catch(error => {
      console.error(error);
    });
   
  });

  it("should filter by skills correctly", async () => {
    
    const dbMgmtListings = {
      code: 200,
      data: {
        "roles": [
          {
              "dept": "Technology",
              "end_date": "Sun, 31 Dec 2023 00:00:00 GMT",
              "listing_id": 1,
              "role_description": "Front-end development for web applications",
              "role_name": "Software Engineer",
              "salary": 80000.0,
              "start_date": "Wed, 20 Sep 2023 00:00:00 GMT"
          },
          {
              "dept": "Engineering",
              "end_date": "Sun, 31 Dec 2023 00:00:00 GMT",
              "listing_id": 2,
              "role_description": "Analyzing and interpreting data for business insights",
              "role_name": "Data Analyst",
              "salary": 60000.0,
              "start_date": "Sun, 01 Oct 2023 00:00:00 GMT"
          },
          {
              "dept": "Data Analytics",
              "end_date": "Sun, 31 Mar 2024 00:00:00 GMT",
              "listing_id": 4,
              "role_description": "Analyze large datasets and build predictive models",
              "role_name": "Data Scientist",
              "salary": 85000.0,
              "start_date": "Sun, 01 Oct 2023 00:00:00 GMT"
          },
          {
              "dept": "Human Resources",
              "end_date": "Tue, 24 Sep 2024 00:00:00 GMT",
              "listing_id": 6,
              "role_description": "Manage recruitment and employee relations",
              "role_name": "HR Specialist",
              "salary": 60000.0,
              "start_date": "Mon, 25 Sep 2023 00:00:00 GMT"
          },
          {
              "dept": "Finance",
              "end_date": "Wed, 09 Oct 2024 00:00:00 GMT",
              "listing_id": 7,
              "role_description": "Analyze financial data and prepare reports",
              "role_name": "Finance Analyst",
              "salary": 70000.0,
              "start_date": "Tue, 10 Oct 2023 00:00:00 GMT"
          },
          {
              "dept": "Sales",
              "end_date": "Wed, 31 May 2023 00:00:00 GMT",
              "listing_id": 10,
              "role_description": "Drive sales and engage with customers",
              "role_name": "Sales Associate",
              "salary": 55000.0,
              "start_date": "Tue, 01 Jun 2021 00:00:00 GMT"
          }
        ]
      },
    };

    const ListingCount = dbMgmtListings.data.roles.length;

    act(() => {
      mock.onGet('http://localhost:5002/api/filter-roles?skill_names=Database Management').reply(200, dbMgmtListings)
    })

    axios.get('http://localhost:3000/api/get-skills')
    .then(response => {
      let getByTestId;
      const renderResult = renderComponent();
      getByTestId = renderResult.getByTestId; 

      fireEvent.click(screen.getByText('Filter ▾'));
      fireEvent.click(screen.getByLabelText('Database Management'));
      expect(screen.getByTestId("skillsSelected")).toBeInTheDocument();
      expect(screen.getByTestId("skillsSelected")).toHaveTextContent(`1 selected`);
      fireEvent.click(screen.getByTestId('applyButton'));

      expect(screen.getByTestId('listingCount')).toBeInTheDocument();
      expect(screen.getByTestId('listingCount')).toHaveTextContent(`Total Listings: ${ListingCount}`);
      
      humanResourceListings.data.listings.forEach((listing, index) => {
        const end_date = formatDateWithoutTime(listing.end_date);

        expect(screen.getByTestId(`listingId${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingId${listing.listing_id}`)).toHaveTextContent(`Listing ID ${listing.listing_id}`);

        expect(screen.getByTestId(`listingName${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingName${listing.listing_id}`)).toHaveTextContent(`${listing.role_name}`);

        expect(screen.getByTestId(`listingDept${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingDept${listing.listing_id}`)).toHaveTextContent(`${listing.dept}`);
        
        expect(screen.getByTestId(`listingSalary${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingSalary${listing.listing_id}`)).toHaveTextContent(`${listing.salary}`);
        
        expect(screen.getByTestId(`listingEndDate${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingEndDate${listing.listing_id}`)).toHaveTextContent(`Application Deadline: ${end_date}`);
      });
    })
    .catch(error => {
      console.error(error);
    });
  });

  it("should reset when reset button is clicked", async () => {

    axios.get('http://localhost:3000/api/get-departments')
    .then(response => {
      axios.get('http://localhost:3000/api/get-skills')
      .then(response => {
        let getByTestId
        const renderResult = renderComponent();
        getByTestId = renderResult.getByTestId; 

        fireEvent.click(screen.getByText('Filter ▾'));
        fireEvent.click(screen.getByLabelText('Database Management'));
        expect(screen.getByTestId("skillsSelected")).toBeInTheDocument();
        expect(screen.getByTestId("skillsSelected")).toHaveTextContent(`1 selected`);

        fireEvent.click(getByTestId('Human Resources'));
        expect(getByTestId("deptSelected")).toBeInTheDocument();
        expect(getByTestId("deptSelected")).toHaveTextContent(`1 selected`);

        fireEvent.click(screen.getByTestId('resetButton'));
        expect(screen.getByTestId("skillsSelected")).toHaveTextContent(`0 selected`);
        expect(getByTestId("deptSelected")).toHaveTextContent(`0 selected`);
      })
      .catch(error => {
        console.error(error);
      });
    })
    .catch(error => {
      console.error(error);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});