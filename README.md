# 🚀 StartupHire.in — Job Portal

StartupHire.in is a React-based job portal designed to connect candidates with employers through a modern, responsive, and user-friendly interface.

The frontend is organized into reusable components, dedicated pages, shared utilities, and theme management to make the application easier to maintain and extend.

## ✨ Features

### 👨‍💻 Candidate Dashboard

* Candidate profile management
* Resume creation and editing
* Job search and filtering
* Saved jobs and applications
* Application status tracking
* Notifications and messaging

### 🏢 Employer Dashboard

* Company profile management
* Job posting and management
* Candidate discovery
* Application management
* Employer team and dashboard sections

### 🛡️ Admin Dashboard

* Dedicated admin interface
* User and job management sections
* Dashboard statistics and activity views

### 🎨 User Interface

* Responsive React interface
* Reusable UI components
* Light and dark themes
* Shared theme context and hooks
* Organized CSS and theme styles

## 🛠️ Tech Stack

* React.js
* JavaScript
* CSS
* Vite
* Git and GitHub
* REST API integration

## 📂 Project Structure

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   ├── resume/
│   └── ui/
├── config/
├── constants/
├── context/
├── hooks/
├── pages/
│   ├── admin/
│   ├── auth/
│   ├── candidate/
│   ├── company/
│   ├── employer/
│   ├── home/
│   └── public/
├── routes/
├── services/
├── styles/
├── utils/
├── App.jsx
└── main.jsx
```

### Architecture

* **Components:** Shared interface elements and reusable UI.
* **Pages:** Separate public pages, authentication screens, and role-based dashboards.
* **Services:** API-related service modules.
* **Context and Hooks:** Shared theme state and reusable React logic.
* **Utils and Constants:** Common helper functions, configuration values, and static data.
* **Styles:** Base styles, theme styles, and dashboard-specific styles.
* **Routes:** Application route configuration.

## ⚙️ Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm before running the project.

### 1. Clone the Repository

```bash
git clone https://github.com/sm3497996-cmd/StartupHire-Frontend.git
```

### 2. Navigate to the Project

```bash
cd StartupHire-Frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

If the application requires environment variables, create a local `.env` file using the variable names defined in the project configuration or `.env.example`.

Do not commit passwords, private API keys, or database credentials.

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## 📦 Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🔒 Security

* Keep private credentials out of source control.
* Use environment variables for environment-specific configuration.
* Keep `node_modules` and generated build files out of Git.

## 🎯 Project Goals

* Build a maintainable React frontend.
* Organize features into reusable components and modules.
* Provide separate experiences for candidates, employers, and administrators.
* Deliver a responsive interface with theme support.
* Integrate frontend functionality with backend AP.Is.

## 👩‍💻 Author

**Shreya Mishra**

* GitHub: [sm3497996-cmd](https://github.com/sm3497996-cmd)
* LinkedIn: [Shreya Mishra](https://www.linkedin.com/in/shreya-mishra-166345339/)

---

*StartupHire.in — Connecting talent with opportunities.*
