# Parlour Management System

A comprehensive beauty parlour management system built with Next.js, MongoDB, and real-time attendance tracking. This system provides separate portals for administrators and employees with role-based access control.

## Features

### Admin Portal

- **Employee Management**: Add, edit, and delete employee profiles
- **Task Assignment**: Create and assign tasks to employees
- **Real-time Attendance Monitoring**: View live attendance records and reports
- **Role-based Access**: Super Admin and Admin roles with different permissions
- **Dashboard Analytics**: Overview of employees, tasks, and attendance statistics


### Employee Portal

- **Self Registration**: Employees can create their own accounts
- **Automatic Attendance**: Attendance is marked automatically upon login
- **Personal Dashboard**: View assigned tasks and attendance status
- **Task Management**: See pending, in-progress, and completed tasks
- **Punch In/Out**: Manual punch out functionality


## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager


### Installation

1. **Clone the repository**

```shellscript
git clone <repository-url>
cd parlour-management-system
```


2. **Install dependencies**

```shellscript
npm install
```


3. **Environment Setup**
Create a `.env.local` file in the root directory:

```plaintext
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```


4. **Start the development server**

```shellscript
npm run dev
```


5. **Initialize the database**

1. Visit `http://localhost:3000/login`
2. Click "Initialize Database" to create default admin accounts and sample data





## Usage

### Admin Access

1. Navigate to the login page
2. Select "Admin/Staff" tab
3. Use default credentials:

1. **Super Admin**: `superadmin@parlour.com` / `admin123`
2. **Admin**: `admin@parlour.com` / `admin123`





### Employee Access

1. **New Employee Registration**:

1. Go to `/employee/signup` or click "Create Employee Account" on login page
2. Fill in personal details and create password
3. Account is automatically activated



2. **Employee Login**:

1. Select "Employee" tab on login page
2. Use registered email and password
3. Attendance is automatically marked upon login





## ️ System Architecture

### Authentication Flow

```plaintext
Login Page → User Type Selection → Authentication → Dashboard Redirect
     ↓              ↓                    ↓              ↓
Admin/Staff    Employee           JWT Token      Role-specific
   Login        Login            Generation        Dashboard
```

### Database Collections

- **users**: Admin and staff accounts
- **employees**: Employee profiles and authentication
- **tasks**: Task assignments and status
- **attendance**: Real-time attendance records


## Screenshots

<!-- Add screenshot here: Login page showing admin/employee toggle -->
*Login Page with User Type Selection*

<!-- Add screenshot here: Employee signup form -->
*Employee Registration Form*

<!-- Add screenshot here: Admin dashboard overview -->
*Admin Dashboard - Overview*

<!-- Add screenshot here: Employee dashboard showing tasks and attendance -->
*Employee Dashboard - Personal View*

<!-- Add screenshot here: Attendance tracking interface -->
*Real-time Attendance Monitoring*

<!-- Add screenshot here: Task management interface -->
*Task Assignment and Management*

## Technical Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with native driver
- **Authentication**: JWT tokens with bcrypt password hashing
- **UI Components**: shadcn/ui, Tailwind CSS
- **Real-time Updates**: WebSocket context for live attendance
- **Icons**: Lucide React


## Project Structure

```plaintext
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Admin authentication
│   │   ├── employees/         # Employee management & auth
│   │   ├── tasks/             # Task management
│   │   └── attendance/        # Attendance tracking
│   ├── dashboard/             # Admin dashboard pages
│   ├── employee/              # Employee portal pages
│   └── login/                 # Main login page
├── lib/
│   ├── models/                # TypeScript interfaces
│   ├── services/              # Business logic
│   └── mongodb.ts             # Database connection
├── contexts/                  # React contexts for state
└── components/ui/             # Reusable UI components
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Different permissions for admin/employee
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Sensitive data stored securely


## Deployment

### Vercel Deployment

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically


### Environment Variables for Production

```plaintext
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
```

## Testing

Run the comprehensive test suite:

```shellscript
# Visit /test page in browser for interactive testing
# Or run the Node.js test script
node scripts/test-functionality.js
```

## Features Roadmap

- Employee scheduling system
- Performance analytics
- Mobile app companion
- Advanced reporting
- Integration with payment systems
- Customer appointment booking (future enhancement)


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the `/test` page for system diagnostics
- Review the attendance flow demo at `/attendance-flow`


---
  

---

