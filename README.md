# EggPal: A Web-Based Palworld Breeding Database

EggPal is a comprehensive web application designed to support players of the multiplayer game Palworld by providing an extensive database of breeding combinations. This tool enables players to strategically plan and optimise their breeding strategies to achieve desired outcomes efficiently.

## Project Architecture

### Overview

The application is organised using a modern web application architecture with a focus on scalability, maintainability, and responsiveness. Here is a detailed outline of the key components:

#### Frontend

- **React**: Utilises the React library for building the user interface with components that manage their own state and compose to form complex UIs.
- **Next.js**: Enhances React by enabling server-side rendering, static site generation, and handling routing with the App Router, improving SEO and load times.
- **CSS Modules**: Ensures that all CSS styles are locally scoped to components and pages, preventing style leakage.

#### Backend

- **Node.js**: Provides the runtime environment for the backend logic, leveraging JavaScript for server-side scripting.
- **Next.js API Routes**: Used to create API endpoints that the frontend uses.

#### Database

- **Supabase (PostgreSQL)**: Manages all application data, including users, authentication, sessions, and breeding data.

### Directory Structure

Here is the structure of the project directories, explaining the purpose of each:

- **`src/app/components`**: Contains all React components and their corresponding test files
  - **`src/app/components/styles`**: CSS Modules for component-specific styling.
- **`src/app/`**: Contains folders for each page, each folder includes a `page.js` file and an `action.js` file if applicable.
  - **Page-specific CSS modules reside within the respective page folder.**
- **`src/app/utils`**: Utility functions and helper scripts, including the database client.
- **`src/app/lib`**: Contains the database interactions for fetching data.
- **`src/app/api`**: Contains API routes

### Data Flow

- **Data Retrieval**: Frontend components use supabase's REST API for fetching data. Next.js server actions are used for user-specific actions.

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
