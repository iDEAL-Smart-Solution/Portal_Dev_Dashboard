# School Management Module

This module provides comprehensive school management functionality for the Super Admin dashboard.

## Features

### 1. School List Page (`/schools`)
- View all registered schools in a grid layout
- Search schools by name, email, or phone number
- Filter schools by subscription status (All, Active, Inactive)
- Display school statistics (Total, Active, Inactive subscriptions)
- Action buttons for each school: View Profile, Edit, Activate/Deactivate

### 2. School Profile Page (`/schools/:id`)
- Detailed view of individual school information
- Display all school details including contact information
- Edit school details functionality
- Manage subscription status
- Breadcrumb navigation

### 3. Forms
- **Add School Form**: Create new schools with all required and optional fields
- **Edit School Form**: Update existing school information
- **Subscription Form**: Toggle school subscription status

## Data Structures

### CreateSchoolRequest
```typescript
interface CreateSchoolRequest {
  schoolName: string;
  schoolLogoFilePath?: string;
  colorCode?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  userId: string;
}
```

### UpdateSchoolRequest
```typescript
interface UpdateSchoolRequest {
  id: string;
  schoolName: string;
  schoolLogoFilePath?: string;
  colorCode?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  isSubscrptionActive: boolean;
  userId: string;
}
```

### GetSchoolResponse
```typescript
interface GetSchoolResponse {
  id: string;
  schoolName: string;
  schoolLogoFilePath?: string;
  colorCode?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  isSubscrptionActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Components

### SchoolCard
Reusable card component displaying school summary information with action buttons.

### SchoolForm
Form component for creating and editing schools with validation.

### SchoolProfile
Detailed profile view component for individual schools.

### SubscriptionForm
Form component for managing school subscription status.

## State Management

The module uses Zustand for state management with the `useSchoolStore` hook:

- `fetchSchools()`: Load all schools
- `createSchool(data)`: Create a new school
- `updateSchool(data)`: Update existing school
- `updateSchoolSubscription(id, isActive)`: Toggle subscription status
- `getSchoolById(id)`: Get specific school by ID

## Mock Data

The store includes mock data for development:
- 3 sample schools with different subscription statuses
- Realistic contact information and addresses
- Various brand colors and logo paths

## Navigation

- Home page (`/`) - Dashboard overview with navigation cards
- Schools list (`/schools`) - Main school management interface
- School profile (`/schools/:id`) - Individual school details

## Future Enhancements

- Backend API integration
- File upload for school logos
- Advanced filtering and sorting
- Bulk operations
- Export functionality
- Audit logs
- User management integration

## Usage

1. Navigate to `/schools` to view all schools
2. Click "Add School" to create a new school
3. Click "View Profile" on any school card to see detailed information
4. Use "Edit" button to modify school details
5. Use "Activate/Deactivate" to manage subscription status

The module is fully functional with mock data and ready for backend integration.
