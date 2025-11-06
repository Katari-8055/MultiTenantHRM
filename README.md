# HRFlow - HR & Task Management SaaS Architecture

## Overview

HRFlow is a modern, role-based multi-tenant HR & Task Management SaaS application built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Sitemap & Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION LAYER                     │
├─────────────────────────────────────────────────────────────┤
│  ├─ Login Page                                              │
│  ├─ Signup Page (with Tenant Creation)                      │
│  └─ Forgot Password Page                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    ROLE-BASED DASHBOARDS                     │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ TENANT ADMIN ROLE                                                  │
├────────────────────────────────────────────────────────────────────┤
│  ├─ Dashboard                                                      │
│  │   ├─ Employee Count                                            │
│  │   ├─ Manager Count                                             │
│  │   ├─ HR Count                                                  │
│  │   ├─ Pending Leaves                                            │
│  │   ├─ Subscription Info                                         │
│  │   ├─ Line Chart: Leaves Over Time                             │
│  │   └─ Pie Chart: Employee Distribution                         │
│  │                                                                 │
│  ├─ Manage Users                                                   │
│  │   ├─ User Table (Name, Email, Role, Department, Status)       │
│  │   ├─ Add User Dialog                                           │
│  │   └─ Search & Filter                                           │
│  │                                                                 │
│  ├─ Reports                                                        │
│  │   ├─ Leave Analytics                                           │
│  │   ├─ Employee Distribution Charts                             │
│  │   ├─ Department Breakdown                                      │
│  │   └─ Export Functionality                                      │
│  │                                                                 │
│  ├─ Tenant Settings                                               │
│  │   ├─ Company Profile                                           │
│  │   ├─ Billing & Subscription                                    │
│  │   └─ Billing History                                           │
│  │                                                                 │
│  └─ Profile                                                        │
│      ├─ Personal Information                                      │
│      ├─ Change Password                                           │
│      └─ Notification Preferences                                  │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ HR ROLE                                                            │
├────────────────────────────────────────────────────────────────────┤
│  ├─ Dashboard                                                      │
│  │   ├─ Total Employees                                           │
│  │   ├─ Pending Leave Approvals (for HR review)                  │
│  │   ├─ New Joiners                                               │
│  │   ├─ Compliance Alerts                                         │
│  │   └─ Quick Actions                                             │
│  │                                                                 │
│  ├─ Employee Management                                            │
│  │   ├─ Employee Table (with tabs: All/Active/Inactive)          │
│  │   ├─ View Profile                                              │
│  │   ├─ Edit Profile                                              │
│  │   ├─ Upload Documents                                          │
│  │   └─ Department Summary                                        │
│  │                                                                 │
│  ├─ Leave Management                                               │
│  │   ├─ All Leave Requests                                        │
│  │   ├─ Pending HR Approvals                                      │
│  │   ├─ Approve/Reject with Comments                             │
│  │   └─ Filter by Status                                          │
│  │                                                                 │
│  └─ Profile                                                        │
│      ├─ Personal Information                                      │
│      └─ Notification Preferences                                  │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ MANAGER ROLE                                                       │
├────────────────────────────────────────────────────────────────────┤
│  ├─ Dashboard                                                      │
│  │   ├─ Team Size                                                 │
│  │   ├─ Pending Leave Approvals                                   │
│  │   ├─ Pending Tasks                                             │
│  │   ├─ Performance Summary                                       │
│  │   └─ Quick Actions                                             │
│  │                                                                 │
│  ├─ Team                                                           │
│  │   ├─ Team Members Table                                        │
│  │   ├─ Team Member Cards                                         │
│  │   ├─ View Employee Details                                     │
│  │   └─ Team Performance Stats                                    │
│  │                                                                 │
│  ├─ Task Management                                                │
│  │   ├─ Create Task Dialog                                        │
│  │   ├─ Assign to Team Members                                    │
│  │   ├─ Task Status (To Do/In Progress/Completed)                │
│  │   ├─ Priority Levels (Low/Medium/High)                        │
│  │   └─ Deadline Tracking                                         │
│  │                                                                 │
│  ├─ Leave Approval                                                 │
│  │   ├─ Team Member Leave Requests                                │
│  │   ├─ Approve/Reject Functionality                             │
│  │   └─ Leave Timeline Workflow                                   │
│  │                                                                 │
│  └─ Profile                                                        │
│      ├─ Personal Information                                      │
│      └─ Notification Preferences                                  │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ EMPLOYEE ROLE                                                      │
├────────────────────────────────────────────────────────────────────┤
│  ├─ Dashboard                                                      │
│  │   ├─ Leave Balance                                             │
│  │   ├─ Pending Leaves                                            │
│  │   ├─ Active Tasks                                              │
│  │   ├─ Performance Score                                         │
│  │   ├─ Announcements                                             │
│  │   └─ Quick Actions                                             │
│  │                                                                 │
│  ├─ Leave Management                                               │
│  │   ├─ Apply for Leave                                           │
│  │   ├─ Leave Type Selection                                      │
│  │   ├─ Start/End Date Picker                                     │
│  │   ├─ Reason Input                                              │
│  │   ├─ View Leave History                                        │
│  │   ├─ Leave Status Timeline (Employee → Manager → HR)          │
│  │   └─ Cancel Pending Leave                                      │
│  │                                                                 │
│  ├─ Tasks                                                          │
│  │   ├─ Assigned Tasks List                                       │
│  │   ├─ Update Task Status                                        │
│  │   ├─ View Task Details                                         │
│  │   └─ Task Priority & Deadlines                                 │
│  │                                                                 │
│  └─ Profile                                                        │
│      ├─ Personal Information                                      │
│      ├─ Documents                                                  │
│      └─ Notification Preferences                                  │
└────────────────────────────────────────────────────────────────────┘
```

## Leave Approval Workflow

```
┌──────────┐      ┌─────────┐      ┌────────┐      ┌──────────┐
│ Employee │ ───> │ Manager │ ───> │   HR   │ ───> │ Approved │
│  Apply   │      │ Review  │      │ Review │      │          │
└──────────┘      └─────────┘      └────────┘      └──────────┘
                       │                 │
                       ↓                 ↓
                  ┌─────────┐      ┌─────────┐
                  │Rejected │      │Rejected │
                  │         │      │         │
                  └─────────┘      └─────────┘

Statuses:
- pending_manager: Waiting for manager approval
- pending_hr: Manager approved, waiting for HR
- approved: Final approval from HR
- rejected_manager: Rejected by manager
- rejected_hr: Rejected by HR
```

## Task Workflow

```
┌─────────┐                                    ┌──────────┐
│ Manager │ ──── Assign Task ───────────────> │ Employee │
└─────────┘                                    └──────────┘
     │                                              │
     │                                              │
     ↓                                              ↓
┌─────────────────────────────────────────────────────────┐
│  Task Status:                                           │
│  ├─ To Do         (Initial state)                       │
│  ├─ In Progress   (Employee updates)                    │
│  └─ Completed     (Final state)                         │
│                                                          │
│  Priority Levels:                                       │
│  ├─ Low                                                  │
│  ├─ Medium                                               │
│  └─ High                                                 │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Core Layout Components
```
/components/layout/
  ├─ sidebar.tsx          # Role-based navigation sidebar
  └─ topbar.tsx           # Top navigation with search, notifications, profile
```

### Authentication Components
```
/components/auth/
  ├─ login-page.tsx       # Email/password login with demo roles
  ├─ signup-page.tsx      # Tenant creation and signup
  └─ forgot-password-page.tsx
```

### Dashboard Components
```
/components/dashboards/
  ├─ tenant-admin-dashboard.tsx    # Admin overview with charts
  ├─ hr-dashboard.tsx              # HR overview with pending approvals
  ├─ manager-dashboard.tsx         # Manager team overview
  └─ employee-dashboard.tsx        # Employee personal dashboard
```

### Feature Pages
```
/components/pages/
  ├─ user-management.tsx           # Tenant Admin: Add/manage users
  ├─ employee-management.tsx       # HR: Employee records
  ├─ leave-management.tsx          # All roles: Leave requests
  ├─ task-management.tsx           # Manager/Employee: Tasks
  ├─ team.tsx                      # Manager: Team view
  ├─ reports.tsx                   # Tenant Admin: Analytics
  └─ settings.tsx                  # All roles: Profile & settings
```

### Shared Components
```
/components/shared/
  ├─ stats-card.tsx       # Reusable metric cards
  └─ data-table.tsx       # Generic table with columns
```

### UI Components (shadcn/ui)
```
/components/ui/
  ├─ button.tsx, input.tsx, card.tsx
  ├─ dialog.tsx, sheet.tsx, dropdown-menu.tsx
  ├─ table.tsx, tabs.tsx, badge.tsx
  ├─ select.tsx, calendar.tsx, avatar.tsx
  └─ ... (40+ components available)
```

## State Management

### Auth Context
```typescript
/lib/auth-context.tsx
- User authentication state
- Role-based access control
- Login/Logout/Signup functionality
- Role switching (for demo)
```

### Mock Data
```typescript
/lib/mock-data.ts
- Sample employees, leaves, tasks
- Used to demonstrate functionality
- Replace with real API calls in production
```

## Data Models

### User / Employee
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'tenant_admin' | 'hr' | 'manager' | 'employee';
  department: string;
  managerId?: string;
  status: 'active' | 'inactive';
  createdDate: string;
}
```

### Leave Request
```typescript
{
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending_manager' | 'pending_hr' | 'approved' | 'rejected_*';
  managerDecision?: 'approved' | 'rejected';
  hrDecision?: 'approved' | 'rejected';
  comments?: string;
}
```

### Task
```typescript
{
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assignedBy: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
}
```

## Styling System

### Colors
- Primary: Blue (#3b82f6)
- Secondary: Indigo, Purple, Pink
- Success: Green
- Destructive: Red
- Neutral: Gray scale

### Typography
- Font: System font stack (Inter-like)
- No custom font-size/weight classes (using globals.css defaults)

### Layout
- Sidebar: 256px (16rem) fixed width
- Topbar: 64px (4rem) height
- Content padding: 16px (mobile) / 24px (desktop)
- Card-based design with consistent spacing

## Responsive Design

### Mobile (< 1024px)
- Collapsible sidebar with overlay
- Stacked layouts
- Full-width cards
- Hamburger menu

### Desktop (≥ 1024px)
- Fixed sidebar
- Grid layouts (2-4 columns)
- Side-by-side content
- Always-visible navigation

## Features Summary

### Multi-Tenancy
- Tenant creation on signup
- Isolated data per tenant
- Tenant admin manages all users

### Role-Based Access
- 4 distinct roles with different permissions
- Dynamic navigation based on role
- Role-specific dashboards

### Leave Management
- Multi-step approval workflow
- Manager → HR approval chain
- Status tracking with timeline
- Leave type categorization

### Task Management
- Manager assigns to employees
- Status tracking
- Priority levels
- Deadline management

### Analytics & Reporting
- Charts (Line, Bar, Pie)
- Department breakdowns
- Leave analytics
- Performance metrics

### User Management
- Invite new users
- Role assignment
- Department organization
- Active/inactive status

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Notifications**: Sonner

## Demo Features

### Quick Login
Login page includes quick demo buttons:
- Admin Demo
- HR Demo
- Manager Demo
- Employee Demo

### Role Switcher
In the user profile dropdown, you can switch between roles to test different views without logging out.

## Future Enhancements (Supabase Integration)

When connected to Supabase, you can add:
- Real authentication
- Database persistence
- Real-time updates
- File uploads for documents
- Email notifications
- Audit logs
- Advanced analytics
