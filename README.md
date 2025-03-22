# MyAdmin

A web application for managing user information and patient data, featuring user authentication, revenue tracking, new visitor monitoring, profile editing, patient management, and light/dark theme switching.

## Description

This project is Admin built with React, Tailwind CSS, and Vite. It allows Admin to log in, view and edit their profiles, manage patient data (e.g., add, edit, delete patients), track revenue and new visitors (daily, monthly, yearly), and switch between light and dark themes. The application includes a responsive sidebar for navigation, a dashboard with various widgets, and a modern, clean UI.

## Features

- User authentication (login/logout).
- Dashboard:
  - Revenue tracking.
  - Monitoring new visitors (daily, monthly, yearly).
  - Displaying widgets such as NewUser, Revenue, etc.
- View and edit user profiles (name, email, avatar, etc.).
- Responsive sidebar with collapse/expand functionality.
- Light/dark theme switching.
- Patient management (add, edit, delete patients) with two view modes: table and grid.
- Toast notifications for user feedback.
- 404 error page for incorrect navigation.
- Support for loading states and fallback UI for slow loading.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher).
- [npm](https://www.npmjs.com/) (version 8 or higher) or [yarn](https://yarnpkg.com/).
- A running backend server (e.g., JSON Server at `http://localhost:3001`) for API calls.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ThanhTai141/ASI-React.git
   cd ASI-React
## Install dependencies:

bash

npm install


bash

yarn install
## Set up the backend (optional):

If using JSON Server for mock data:
bash

npm install -g json-server
json-server --watch src/db.json --port 3001

## Run the application:

bash

npm run dev
or

bash

yarn dev
The app will be available at http://localhost:5173 (default Vite port).

## Usage
Login:
- Navigate to `http://localhost:5173/login` to access the login page.
   - Enter your credentials (e.g., username and password) to log in.
   - Currently, admin and user roles are not yet implemented, so you can log in with any existing account or any account where `delete != true`.
   - If you don’t have an account, register first (if the backend supports registration).
Dashboard:
View revenue and new visitor statistics (daily, monthly, yearly).
Explore widgets like NewUser, Revenue, etc.
Profile Management:
Go to the Profile page to view your information.
Click the "Edit" button to update your name, email, or avatar.
Sidebar Navigation:
Use the sidebar to navigate between pages (e.g., Dashboard, Profile, Patients).
Click the collapse button (> or <) to toggle the sidebar.
Use the "Switch Theme" button to toggle between light and dark modes.
Click "Logout" to sign out.
Patient Management:
View the list of patients in table or grid format.
Add, edit, or delete patients using forms and confirmation modals.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API
- **Notifications**: react-toastify
- **Routing**: React Router
- **HTTP Client**: Fetch API, Axios
- **Icons**: Lucide React, React Icons (Font Awesome)
- **Backend (Mock)**: JSON Server
- **Styling**: Tailwind CSS, Custom CSS
## Contributing
Contributions are welcome! To contribute:

-Fork the repository.
-Create a new branch (git checkout -b feature/your-feature).
-Make your changes and commit (git commit -m "Add your feature").
-Push to your branch (git push origin feature/your-feature).
-Open a Pull Request.
## Author
-Lê Thành Tài - tailt.144010123017@vtc.edu.vn
**GitHub**: ThanhTai141

## Acknowledgements
**React**
**Vite**
**Tailwind CSS**
**react-toastify**
**Axios**
**JSON Server**
