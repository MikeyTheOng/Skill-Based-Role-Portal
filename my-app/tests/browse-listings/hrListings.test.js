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
        "id": 2,
        "name": "Bruce Lee",
        "role": 2,
        "user": {
            "email": "hrone.eams@gmail.com",
            "name": "Bruce Lee"
        }
    }}
    >
      <ViewListings />
    </SessionProvider>
  </ErrorBoundary>
);

jest.mock('next/router', () => ({
  useRouter: () => ({
    // useRouter: jest.fn(),
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

const moreHrListings = {
  code: 200,
  data: {
    listings: [
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
        "dept": "Human Resources",
        "end_date": "Sun, 31 Dec 2023 00:00:00 GMT",
        "listing_id": 3,
        "role_description": "Managing and overseeing the HR department",
        "role_name": "HR Manager",
        "salary": 70000.0,
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
        "dept": "Product",
        "end_date": "Thu, 14 Nov 2024 00:00:00 GMT",
        "listing_id": 5,
        "role_description": "Oversee product development and market strategy",
        "role_name": "Product Manager",
        "salary": 90000.0,
        "start_date": "Wed, 15 Nov 2023 00:00:00 GMT"
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
        "dept": "Operations",
        "end_date": "Mon, 04 Nov 2024 00:00:00 GMT",
        "listing_id": 8,
        "role_description": "Oversee daily operations and optimize processes",
        "role_name": "Operations Manager",
        "salary": 75000.0,
        "start_date": "Sun, 05 Nov 2023 00:00:00 GMT"
      },
      {
        "dept": "Marketing",
        "end_date": "Fri, 29 Sep 2023 00:00:00 GMT",
        "listing_id": 9,
        "role_description": "Manage marketing campaigns and promotions",
        "role_name": "Marketing Executive",
        "salary": 65000.0,
        "start_date": "Sat, 01 Jan 2022 00:00:00 GMT"
      },
      {
        "dept": "Sales",
        "end_date": "Wed, 31 May 2023 00:00:00 GMT",
        "listing_id": 10,
        "role_description": "Drive sales and engage with customers",
        "role_name": "Sales Associate",
        "salary": 55000.0,
        "start_date": "Tue, 01 Jun 2021 00:00:00 GMT"
      },
      {
        "dept": "IT",
        "end_date": "Fri, 30 Jun 2023 00:00:00 GMT",
        "listing_id": 11,
        "role_description": "Provide technical support to employees",
        "role_name": "IT Support",
        "salary": 58000.0,
        "start_date": "Thu, 01 Jul 2021 00:00:00 GMT"
      },
      {
        "dept": "Business",
        "end_date": "Wed, 14 Aug 2024 00:00:00 GMT",
        "listing_id": 12,
        "role_description": "Analyze business processes and requirements",
        "role_name": "Business Analyst",
        "salary": 77000.0,
        "start_date": "Tue, 15 Aug 2023 00:00:00 GMT"
      },
      {
        "dept": "Business",
        "end_date": "Wed, 14 Aug 2024 00:00:00 GMT",
        "listing_id": 13,
        "role_description": "Analyze business processes and requirements",
        "role_name": "Business Analyst",
        "salary": 77000.0,
        "start_date": "Tue, 15 Aug 2023 00:00:00 GMT"
      }
    ]
  },
};

describe('ViewListings', () => {

  
  it("should render >10 HR listings correctly", async () => {
    const moreListingCount = moreHrListings.data.listings.length;
    mock.onGet('http://localhost:3000/api/get-skills').reply(200, skillsList);
    mock.onGet('http://localhost:3000/api/get-departments').reply(200, departmentsList);
    mock.onGet('http://localhost:5002/listing').reply(200, moreHrListings)
    
    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      
      expect(screen.getByTestId('listingCount')).toBeInTheDocument();
      expect(screen.getByTestId('listingCount')).toHaveTextContent(`Total Listings: ${moreListingCount}`);
      
      moreHrListings.data.listings.forEach((listing, index) => {
        const start_date = formatDateWithoutTime(listing.start_date);
        const end_date = formatDateWithoutTime(listing.end_date);

        expect(screen.getByTestId(`listingId${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingId${listing.listing_id}`)).toHaveTextContent(`Listing ID ${listing.listing_id}`);

        expect(screen.getByTestId(`listingName${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingName${listing.listing_id}`)).toHaveTextContent(`${listing.role_name}`);

        expect(screen.getByTestId(`listingDept${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingDept${listing.listing_id}`)).toHaveTextContent(`${listing.dept}`);
        
        expect(screen.getByTestId(`listingSalary${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingSalary${listing.listing_id}`)).toHaveTextContent(`${listing.salary}`);
        
        expect(screen.getByTestId(`listingStartDate${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingStartDate${listing.listing_id}`)).toHaveTextContent(`Application Start Date: ${start_date}`);
        
        expect(screen.getByTestId(`listingEndDate${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingEndDate${listing.listing_id}`)).toHaveTextContent(`Application Deadline: ${end_date}`);
        
        if (index == 9){
          const nextPageButton = screen.getByRole('button', { name: 'Next page' }); 
          fireEvent.click(nextPageButton); 
        }
      });
    });
  });

  it("should render <10 HR listings correctly", async () => {

    const lessHrListings = {
      code: 200,
      data: {
        listings: [
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
            "dept": "Human Resources",
            "end_date": "Sun, 31 Dec 2023 00:00:00 GMT",
            "listing_id": 3,
            "role_description": "Managing and overseeing the HR department",
            "role_name": "HR Manager",
            "salary": 70000.0,
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
            "dept": "Product",
            "end_date": "Thu, 14 Nov 2024 00:00:00 GMT",
            "listing_id": 5,
            "role_description": "Oversee product development and market strategy",
            "role_name": "Product Manager",
            "salary": 90000.0,
            "start_date": "Wed, 15 Nov 2023 00:00:00 GMT"
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
            "dept": "Operations",
            "end_date": "Mon, 04 Nov 2024 00:00:00 GMT",
            "listing_id": 8,
            "role_description": "Oversee daily operations and optimize processes",
            "role_name": "Operations Manager",
            "salary": 75000.0,
            "start_date": "Sun, 05 Nov 2023 00:00:00 GMT"
          },
          {
            "dept": "Marketing",
            "end_date": "Fri, 29 Sep 2023 00:00:00 GMT",
            "listing_id": 9,
            "role_description": "Manage marketing campaigns and promotions",
            "role_name": "Marketing Executive",
            "salary": 65000.0,
            "start_date": "Sat, 01 Jan 2022 00:00:00 GMT"
          }
        ]
      },
    };

    const lessListingCount = lessHrListings.data.listings.length;

    mock.onGet('http://localhost:3000/api/get-skills').reply(200, skillsList);
    mock.onGet('http://localhost:3000/api/get-departments').reply(200, departmentsList);
    mock.onGet('http://localhost:5002/listing').reply(200, lessHrListings)
    
    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      
      expect(screen.getByTestId('listingCount')).toBeInTheDocument();
      expect(screen.getByTestId('listingCount')).toHaveTextContent(`Total Listings: ${lessListingCount}`);
      
      lessHrListings.data.listings.forEach((listing, index) => {
        const start_date = formatDateWithoutTime(listing.start_date);
        const end_date = formatDateWithoutTime(listing.end_date);

        expect(screen.getByTestId(`listingId${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingId${listing.listing_id}`)).toHaveTextContent(`Listing ID ${listing.listing_id}`);

        expect(screen.getByTestId(`listingName${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingName${listing.listing_id}`)).toHaveTextContent(`${listing.role_name}`);

        expect(screen.getByTestId(`listingDept${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingDept${listing.listing_id}`)).toHaveTextContent(`${listing.dept}`);

        expect(screen.getByTestId(`listingSalary${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingSalary${listing.listing_id}`)).toHaveTextContent(`${listing.salary}`);

        expect(screen.getByTestId(`listingStartDate${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingStartDate${listing.listing_id}`)).toHaveTextContent(`Application Start Date: ${start_date}`);

        expect(screen.getByTestId(`listingEndDate${listing.listing_id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`listingEndDate${listing.listing_id}`)).toHaveTextContent(`Application Deadline: ${end_date}`);

        if (index == 9){
          const nextPageButton = screen.getByRole('button', { name: 'Next page' }); 
          expect(nextPageButton).toBeNull();
        }
      });
    });
  });
  
  it("show no listing found if no listing", async () => {
    
    const zeroHrListings = {
      code: 200,
      data: {
        listings: []
      },
    };
    
    mock.onGet('http://localhost:3000/api/get-skills').reply(200, skillsList);
    mock.onGet('http://localhost:3000/api/get-departments').reply(200, departmentsList);
    mock.onGet('http://localhost:5002/listing').reply(200, zeroHrListings)
    
    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByTestId('noListing')).toBeInTheDocument();
      expect(screen.getByTestId('noListing')).toHaveTextContent(`No role listings found.`);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});