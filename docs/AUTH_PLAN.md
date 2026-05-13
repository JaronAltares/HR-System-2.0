# HR System 2.0 - Authentication & Rights Plan

## 1. Overview
This plan defines the security protocols, user roles, and the Login Guard logic for the HR System.

## 2. User Roles
| Role | Permissions |
| :--- | :--- |
| **SUPERADMIN** | Full control (17 rights), Soft Delete capability |
| **ADMIN** | Add and Edit records; no Delete capability |
| **USER** | View-only (Read-only) access |

## 3. Login Guard Rules
- **Initial State**: All new registrations (Email or Google) default to `USER` role and `INACTIVE` status.
- **Access Control**: Users with `INACTIVE` status are automatically logged out by the system.
- **Activation**: Requires manual approval/activation by an Admin or Superadmin.

## 4. Soft Delete Policy
- Use `record_status = 'INACTIVE'` instead of `DELETE` statements.
- Users can only view 'ACTIVE' employees.
- Admins/Superadmins can view 'INACTIVE' records for recovery.