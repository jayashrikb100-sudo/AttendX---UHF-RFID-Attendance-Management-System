# AttendX — UHF RFID Automatic Attendance Management System

Automated contactless attendance tracking designed for colleges, schools, corporate offices, and venues. AttendX utilizes UHF RFID portal sensors for automated entry/exit logging, alongside student self-service portals and transparent administrative audit logs.

## System Architecture

The AttendX platform is built on a multi-tier architecture to ensure secure and seamless attendance processing:
*   **Access Tier:** Dedicated client interfaces including a Student Portal and an Admin Console.
*   **Application & Services Tier:** The core application layer handles Student Services (Viewing Attendance, Reporting Issues) and Admin Services (Admin Dashboard, User Management).
*   **RFID Check-In System:** Processes automated entry/exit data from physical UHF RFID doorways.
*   **Data Tier:** A central database cluster storing attendance records, user profiles, and immutable audit logs.

<img width="1536" height="1024" alt="Student Attendance System Architecture" src="https://github.com/user-attachments/assets/8c9510a9-cfed-438d-8b92-0593d67b7003" />

## Core Features

*   **Contactless RFID Tracking:** Automatically logs student entry and exit times via UHF portal readers, capturing data like signal strength and entry duration.
*   **Role-Based Dashboards:** 
    *   **Student Portal:** View daily attendance status, overall attendance percentages, and submit correction requests for anomalies (e.g., tag not detected).
    *   **Admin Console:** Manage attendance records, approve/reject correction requests, and monitor live classroom session activity.
*   **Correction & Audit Workflow:** When an RFID read fails or a manual override is required, administrators must provide a reason. Every manual change or status revision is permanently recorded in the Audit Log.
*   **Hardware Monitoring:** Live diagnostics for deployed RFID devices, displaying connection status (ONLINE/OFFLINE), last sync time, antenna counts, and read volume.

## Technology Stack

*   **Frontend Framework:** React 19 with TypeScript.
*   **Build Tool:** Vite.
*   **Styling:** Tailwind CSS using Plus Jakarta Sans for standard typography and JetBrains Mono for tabular data.
*   **Icons & Animation:** `lucide-react` for UI iconography and `motion` for fluid interactions.
*   **Backend / Server:** Express (Node.js).

<img width="2172" height="724" alt="ATTENDX Technology Stack Flowchart" src="https://github.com/user-attachments/assets/7b6bba85-6bb4-4b58-af6b-4afad001318f" />


## Local Development Setup

Ensure you have **Node.js** installed on your machine before beginning.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Configuration:**
    Create a `.env.local` file in the root directory and add your required API keys (e.g., `GEMINI_API_KEY`).

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The Vite server will launch and bind to `0.0.0.0` on port `3000`.

## Available Commands

*   `npm run dev`: Starts the local development environment.
*   `npm run build`: Compiles the React/TypeScript application for production.
*   `npm run preview`: Locally previews the production build.
*   `npm run lint`: Executes TypeScript type-checking without emitting compiled files.
*   `npm run clean`: Cleans the workspace by removing the `dist` folder and `server.js`.
