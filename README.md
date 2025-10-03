# Flagright Assignment

This is a full-stack application built to demonstrate fraud detection and anti-money laundering (AML) capabilities using a Neo4j graph database. The application is a dashboard that allows users to view, add, update, and visualize relationships between users and transactions.

## Features

  - **User Management**: Add, view, and update user details.
  - **Transaction Management**: Add, view, and update transactions.
  - **Graph Visualization**: Visualize relationships between users and transactions in a graph format to uncover potential fraudulent activities or shared connections.
  - **Search and Filter**: Search for users and transactions based on various properties.
  - **Theme Toggling**: Switch between light and dark modes for the user interface.

## Technology Stack

### Backend

The backend is built with Node.js and Express.js, and uses a Neo4j graph database to store and manage user and transaction data.

  - **Node.js**: JavaScript runtime environment.
  - **Express.js**: Web application framework for Node.js.
  - **Neo4j-driver**: Official Neo4j driver for Node.js to connect and interact with the database.
  - **cors**: Middleware to enable Cross-Origin Resource Sharing.
  - **dotenv**: Module to load environment variables from a `.env` file.
  - **nodemon**: Utility that monitors for changes in your source and automatically restarts your server (used for development).

### Frontend

The frontend is a single-page application built with React and Vite. It uses a component-based structure and various libraries for UI and data handling.

  - **React**: JavaScript library for building user interfaces.
  - **Vite**: Frontend build tool.
  - **React Router Dom**: For handling client-side routing.
  - **Material-UI (MUI)**: React component library for a consistent and professional design.
  - **Tailwind CSS**: Utility-first CSS framework for styling.
  - **Cytoscape.js**: A graph theory library used for visualizing the relationships between users and transactions.
  - **react-hot-toast**: A library for displaying toasts/notifications.

## Prerequisites

Before you begin, ensure you have the following installed:

  - Node.js (LTS version recommended)
  - Neo4j Desktop or Neo4j Server running locally or on a remote machine.

You will also need to configure your Neo4j database credentials in the backend's `.env` file.

## Setup and Installation

### 1\. Backend

Navigate to the `backend` directory and install the dependencies:

```sh
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your Neo4j database credentials. An example file is provided below:

```
NEO4J_URI=bolt://127.0.0.1:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=test1234
PORT=5000
```

  - The `dummyData.js` script can be used to populate the database with initial data. You can run it with `node dummyData.js`.

### 2\. Frontend

Navigate to the `frontend` directory and install the dependencies:

```sh
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory and specify the backend API URL:

```
VITE_API_URL=http://localhost:5000
```

## Running the Application

### 1\. Start the Backend Server

From the `backend` directory, run the development server:

```sh
npm run dev
```

  - This will start the backend server, which will be accessible at `http://localhost:5000`.

### 2\. Start the Frontend Application

From the `frontend` directory, run the Vite development server:

```sh
npm run dev
```

  - The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).

## API Endpoints

The backend exposes the following API endpoints:

### Users

  - `GET /users`: List all users.
  - `POST /users`: Create or update a user.

### Transactions

  - `GET /transactions`: List all transactions.
  - `POST /transactions`: Create or update a transaction.
  - `POST /transactions/update`: Update the amount of a transaction.

### Relationships

  - `GET /relationships/user/:id`: Get all relationships for a specific user.
  - `GET /relationships/transaction/:id`: Get all relationships for a specific transaction.

## Data Model

The application uses a graph database to model the relationships between users and transactions. The main nodes and relationships are as follows:

### Nodes

  - **User**: Represents a user with properties such as `id`, `name`, `email`, `phone`, and `address`.
  - **Transaction**: Represents a transaction with properties including `id`, `amount`, `ip`, and `deviceId`.

### Relationships

  - **DEBIT**: A `User` node is connected to a `Transaction` node via a `DEBIT` relationship if they are the sender of the transaction.
  - **CREDIT**: A `Transaction` node is connected to a `User` node via a `CREDIT` relationship if they are the receiver.
  - **SHARED\_ATTRIBUTE**: `User` nodes are connected with a `SHARED_ATTRIBUTE` relationship if they share a common attribute like `email`, `phone`, `address`, or `payment_methods`.
  - **RELATED\_TO**: `Transaction` nodes are connected if they share the same `ip` address or `deviceId`.

## Scripts

  - `npm run dev`: Starts the application in development mode with live-reloading.
  - `npm run build`: Builds the application for production.
  - `npm run lint`: Lints the code using ESLint.
  - `npm run preview`: Previews the production build locally.
