# U-Reg Forex Rates Application

A full-stack web application for displaying latest and historical exchange rates.

## Prerequisites

- Docker (for containerized deployment)
- Node.js v18 or later (for manual installation)

## Installation

### Docker Installation (Recommended)

1. Clone the repository
2. Run `docker-compose -f postgres-docker-compose.yml down` and `docker-compose -f postgres-docker-compose.yml up --build` to build and start all containers
3. Access the application at `http://localhost:4173`
4. Access the management dashboard at `http://localhost:4173/management`

## Features

- Display latest exchange rates on initial load
- Historical rate lookup via date picker
- Base currency selection
- Lazy loading (12 currencies per scroll)
- Responsive design
- Management dashboard for currencies and rates
- Bar chart visualization of exchange rates
- Unit tests included

## API Endpoints

### Rates
- `GET /api/rates/latest` - Get the latest exchange rates
- `GET /api/rates/historical?date=YYYY-MM-DD` - Get historical rates for a specific date
- `GET /api/rates/paginated?date=YYYY-MM-DD&baseCurrency=USD&offset=0&limit=12` - Get paginated rates

### Currencies
- `GET /api/currencies` - Get all currencies
- `POST /api/currencies` - Create a new currency
- `PUT /api/currencies/:id` - Update an existing currency
- `DELETE /api/currencies/:id` - Delete a currency

## Database Schema

The application uses PostgreSQL with the following tables:

- `currencies`: Contains currency codes and names
- `rates`: Contains exchange rates between currencies with effective dates

## Architecture

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: PostgreSQL
- Containerization: Docker with Docker Compose

## Source

-  https://gist.github.com/ureg-tech/622212f4870e1972dae4691ed6318d04

## Screenshots

![Exchange Rates Dashboard](./Forex-test/Screenshot%202025-11-16%20105229.png "Exchange Rates Dashboard")
![Management Dashboard(Currencies)](./Forex-test/Screenshot%202025-11-16%20105330.png "Management Dashboard")
![Management Dashboard(Rates)](./Forex-test/Screenshot%202025-11-16%20105348.png "Management Dashboard")
