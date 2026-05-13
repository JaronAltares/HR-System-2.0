# HR System 2.0 - Authentication & Rights Plan (M4)

## [cite_start]User Roles [cite: 201, 202]
- [cite_start]**SUPERADMIN**: Full control with 17 rights and soft delete capability. [cite: 203, 204, 205]
- [cite_start]**ADMIN**: Can add and edit records but cannot delete. [cite: 206, 207, 208]
- [cite_start]**USER**: Read-only/View-only access. [cite: 209, 210]

## [cite_start]Login Guard Rules [cite: 249]
- [cite_start]New registrations default to **USER** role and **INACTIVE** status. [cite: 244, 245]
- [cite_start]**INACTIVE** users are automatically logged out. [cite: 250]
- [cite_start]Requires Admin activation before login is allowed. [cite: 251]

## [cite_start]Data Visibility [cite: 190]
- [cite_start]**USER**: Can only see ACTIVE records. [cite: 191]
- [cite_start]**ADMIN/SUPERADMIN**: Can see both ACTIVE and INACTIVE records. [cite: 192]