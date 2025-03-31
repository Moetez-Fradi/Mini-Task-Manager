# Task Management Application

## Overview
A full-stack task management system with React frontend and NestJS backend, featuring user authentication and role-based task management.

## Features

### User Authentication
- **Login/Registration**: Secure JWT-based authentication
- **Role Management**: 
  - Admin users with full privileges
  - Regular users with restricted access

### Task Management
- **Task CRUD Operations**:
  - Create new tasks (Admin only)
  - View all tasks (filtered by user for non-admins)
  - Update task status and details
  - Delete tasks (Admin only)

- **Task Attributes**:
  - Title
  - Description
  - Status (TODO/IN_PROGRESS/DONE/BLOCKED)
  - Priority (LOW/MEDIUM/HIGH/CRITICAL)
  - Assigned user

### UI Components
- **Dashboard**:
  - Task list with filtering
  - Priority badges with color coding
  - Status dropdown with update functionality
  - Admin control panel (for admin users)

- **Responsive Design**: Works on desktop and mobile devices

## Technical Stack

### Frontend
- React.js
- Axios for API calls
- Bootstrap for styling

### Backend
- NestJS
- Prisma ORM
- JWT Authentication
- REST API

## Status Badge Colors
| Status        | Badge Color |
|---------------|-------------|
| TODO          | secondary   |
| IN_PROGRESS   | primary     |
| DONE          | success     |
| BLOCKED       | danger      |

## Priority Badge Colors
| Priority      | Badge Color |
|--------------|-------------|
| LOW          | info        |
| MEDIUM       | primary     |
| HIGH         | warning     |
| CRITICAL     | danger      |

## API Endpoints
POST /auth/login
POST /auth/register
GET /tasks
POST /tasks
PATCH /tasks/:id
DELETE /tasks/:id ... 
