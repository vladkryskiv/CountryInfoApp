# Country Info App

## Description
A NestJS application that provides information about countries and allows users to add national holidays to their calendar. The app integrates with external APIs to fetch country information and holiday data.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies](#technologies)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Testing with Postman](#testing-with-postman)

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd country-info-app

# Install dependencies
npm install
```

## Usage

```bash
# Development mode
npm run start:dev


Visit `http://localhost:3000` to access the application.

## Features
- Country information retrieval
- Holiday data integration
- User management system
- Calendar event creation
- SQLite database storage

## Technologies
- Node.js
- NestJS
- TypeScript
- SQLite
- TypeORM
- External APIs:
  - Date Nager API
  - Countries Now API

## Configuration

Create a `.env` file in the root directory:

```env
DATE_NAGER_API_URL=https://date.nager.at/api/v3
COUNTRIES_API_URL=https://countriesnow.space/api/v0.1/countries
DB_TYPE=sqlite
DB_DATABASE=country-info.db
```

## API Reference

### Users
```bash
# Create user
POST /users
{
  "name": "John Doe",
  "email": "john@example.com"
}

# Add holidays to calendar
POST /users/:userId/calendar/holidays
{
  "countryCode": "US",
  "year": 2025,
  "holidays": ["New Year's Day", "Independence Day"]
}
```

### Countries
```bash
# Get available countries
GET /countries

# Get country information
GET /countries/:countryCode
```

## Testing with Postman

To test the API endpoints, you can use Postman. Here's how to set it up:

1. Download and install [Postman](https://www.postman.com/downloads/) if you haven't already
2. Create a new collection in Postman
3. Add the following environment variables:
   - `baseUrl`: `http://localhost:3000`
4. Create requests for each endpoint:

### Example Postman Setup

1. **Create User**
   - Method: POST
   - URL: `{{baseUrl}}/users`
   - Headers: 
     - `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com"
     }
     ```

2. **Add Holidays**
   - Method: POST
   - URL: `{{baseUrl}}/users/1/calendar/holidays`
   - Headers:
     - `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "countryCode": "US",
       "year": 2025,
       "holidays": ["New Year's Day", "Independence Day"]
     }
     ```

3. **Get Countries**
   - Method: GET
   - URL: `{{baseUrl}}/countries`

4. **Get Country Info**
   - Method: GET
   - URL: `{{baseUrl}}/countries/US`

