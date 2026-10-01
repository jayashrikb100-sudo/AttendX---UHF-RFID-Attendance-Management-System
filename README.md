# AttendX — UHF RFID Automatic Attendance Management System

Automated contactless attendance tracking designed for colleges, schools, corporate offices, and venues.[cite: 5] AttendX utilizes UHF RFID portal sensors for automated entry/exit logging, alongside student self-service portals and transparent administrative audit logs.[cite: 5]

## System Architecture

The AttendX platform is built on a multi-tier architecture to ensure secure and seamless attendance processing:
*   **Access Tier:** Dedicated client interfaces including a Student Portal and an Admin Console.[cite: 3]
*   **Application & Services Tier:** The core application layer handles Student Services (Viewing Attendance, Reporting Issues) and Admin Services (Admin Dashboard, User Management).[cite: 3]
*   **RFID Check-In System:** Processes automated entry/exit data from physical UHF RFID doorways.[cite: 3, 4]
*   **Data Tier:** A central database cluster storing attendance records, user profiles, and immutable audit logs.[cite: 3]

<img width="1536" height="1024" alt="Attendance System Architecture Flow" src="https://github.com/user-attachments/assets/4a70ef51-8e93-4ed5-939c-59eb22c2a252" />

## Core Features

*   **Contactless RFID Tracking:** Automatically logs student entry and exit times via UHF portal readers, capturing data like signal strength and entry duration.[cite: 11, 12]
*   **Role-Based Dashboards:** 
    *   **Student Portal:** View daily attendance status, overall attendance percentages, and submit correction requests for anomalies (e.g., tag not detected).[cite: 11, 12]
    *   **Admin Console:** Manage attendance records, approve/reject correction requests, and monitor live classroom session activity.[cite: 11, 12]
*   **Correction & Audit Workflow:** When an RFID read fails or a manual override is required, administrators must provide a reason.[cite: 1, 11] Every manual change or status revision is permanently recorded in the Audit Log.[cite: 1, 11]
*   **Hardware Monitoring:** Live diagnostics for deployed RFID devices, displaying connection status (ONLINE/OFFLINE), last sync time, antenna counts, and read volume.[cite: 11, 12]

## Technology Stack

*   **Frontend Framework:** React 19 with TypeScript.[cite: 6, 8]
*   **Build Tool:** Vite.[cite: 6, 9]
*   **Styling:** Tailwind CSS using Plus Jakarta Sans for standard typography and JetBrains Mono for tabular data.[cite: 4, 6, 10]
*   **Icons & Animation:** `lucide-react` for UI iconography and `motion` for fluid interactions.[cite: 6]
*   **Backend / Server:** Express (Node.js).[cite: 6]

## Local Development Setup

Ensure you have **Node.js** installed on your machine before beginning.[cite: 7]

1.  **Install dependencies:**
    ```bash
    npm install
    ```
    *[cite: 7]*

2.  **Environment Configuration:**
    Create a `.env.local` file in the root directory and add your required API keys (e.g., `GEMINI_API_KEY`).[cite: 7]

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    *[cite: 7]*
    The Vite server will launch and bind to `0.0.0.0` on port `3000`.[cite: 6]

## Available Commands

*   `npm run dev`: Starts the local development environment.[cite: 6]
*   `npm run build`: Compiles the React/TypeScript application for production.[cite: 6]
*   `npm run preview`: Locally previews the production build.[cite: 6]
*   `npm run lint`: Executes TypeScript type-checking without emitting compiled files.[cite: 6]
*   `npm run clean`: Cleans the workspace by removing the `dist` folder and `server.js`.[cite: 6]
