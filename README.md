# EggPal: A Web-Based Palworld Breeding Database

EggPal is a comprehensive web application designed to support players of the multiplayer game Palworld by providing an extensive database of breeding combinations. This tool enables players to strategically plan and optimise their breeding strategies to achieve desired outcomes efficiently.

## Project Architecture

### Overview

The application is organised using a modern web application architecture with a focus on scalability, maintainability, and responsiveness. Here is a detailed outline of the key components:

#### Frontend

- **React**: Utilises the React library for building the user interface with components that manage their own state and compose to form complex UIs.
- **Next.js**: Enhances React by enabling server-side rendering, static site generation, and handling routing with the App Router, improving SEO and load times.
- **Zustand**: A state management library used to handle the global state across the React components efficiently.
- **CSS Modules**: Ensures that all CSS styles are locally scoped to components and pages, preventing style leakage.

#### Backend

- **Node.js**: Provides the runtime environment for the backend logic, leveraging JavaScript for server-side scripting.
- **Next.js API Routes**: Used to create RESTful API endpoints that the frontend consumes. These are structured within the `src/app/api` directory with specific routes for different data needs (e.g., `/api/[palName]` and `/api/palCards`).

#### Database

- **Supabase (PostgreSQL)**: Manages all application data, including users and breeding data.

### Directory Structure

Here is the structure of the project directories, explaining the purpose of each:

- **`src/app/components`**: Contains all React components and their corresponding test files
  - **`src/app/components/styles`**: CSS Modules for component-specific styling.
- **`src/app/`**: Contains folders for each page, each folder includes a `page.js` file.
  - **Page-specific CSS modules reside within the respective page folder.**
- **`src/app/stores`**: Contains Zustand stores for managing application state.
- **`src/app/utils`**: Utility functions and helper scripts, including the database client.
- **`src/app/services`**: Functions that interact with the database, encapsulating business logic.
- **`src/app/api`**: API routes for handling backend requests.
  - **`[palName].js`**: API route for fetching data based on `palName`.
  - **`palCards.js`**: API route for handling requests related to Pal cards.

### Data Flow

- **Data Retrieval**: Frontend components make API calls to the backend via defined Next.js routes, retrieving data as needed.
- **Data Management**: State management is handled by Zustand, facilitating efficient updates and re-rendering of components when state changes.
- **Real-Time Features**: Supabase's real-time capabilities are leveraged to ensure that any updates to the database are promptly reflected in the user interface.

## Setup Process

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Git (for version control)

### Installation Steps

1. **Clone the Repository**
   ```
   git clone https://github.com/Mortiton/EggPal
   cd eggpal
   ```
2. **Install Dependencies**
    ```
    npm install
    ```

3. **Environment Configuration**
- Create an `env.local` file in the root directory
- Add database credentails

  >  NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
  >  NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

4. **Run the development Server**
    ```
    npm run dev
    ```

5. **Building the project**
    ```
    npm run build
    ```

6. **Execute tests**
    ```
    npm run test
    ```
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
