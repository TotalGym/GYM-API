# Gym API

## Overview
The Gym API provides endpoints for managing gym-related functionalities including equipment, store products, programs, trainees, admins, authentication, staff, and payments. This documentation separates the endpoints into two main sections: Dashboard and App.

---

# Dashboard Endpoints

## Auth
| Methods | Urls                                      | Description                                    |
| ------- | ----------------------------------------- | ---------------------------------------------- |
| POST    | `/dashboard/auth/login`                    | Login a user                                   |
| PUT     | `/dashboard/auth/changePassword/:id`       | Change password by user ID                     |
| POST    | `/dashboard/auth/forgot-password`           | Request password reset                         |
| POST    | `/dashboard/auth/verify`                   | Verify reset code                              |
| PUT     | `/dashboard/auth/reset-password`           | Reset password                                 |
| GET     | `/dashboard/auth/user`                     | Get authenticated user details                 |
| GET     | `/dashboard/auth/check-auth`               | Check authentication status                    |

## Equipment
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/equipment`           | Get all equipment items                        |
| GET     | `/dashboard/equipment/:id`       | Get a specific equipment by ID                  |
| POST    | `/dashboard/equipment`           | Create a new equipment item                     |
| PUT     | `/dashboard/equipment/:id`       | Update an existing equipment item by ID         |
| DELETE  | `/dashboard/equipment/:id`       | Delete an equipment item by ID                  |

## Store
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/store`               | Get all store products                         |
| GET     | `/dashboard/store/:id`           | Get a specific product by ID                    |
| POST    | `/dashboard/store`               | Add a new product to the store                  |
| PUT     | `/dashboard/store/:id`           | Update an existing product by ID                |
| DELETE  | `/dashboard/store/:id`           | Delete a product by ID                          |

## Programs
| Methods | Urls                                      | Description                                    |
| ------- | ----------------------------------------- | ---------------------------------------------- |
| POST    | `/dashboard/programs`                     | Add a new program                              |
| GET     | `/dashboard/programs`                     | Get all programs                               |
| GET     | `/dashboard/programs/:id`                 | Get a specific program by ID                    |
| PUT     | `/dashboard/programs/:id`                 | Update a program by ID                         |
| DELETE  | `/dashboard/programs/:id`                 | Delete a program by ID                         |
| GET     | `/dashboard/programs/program/:name`       | Get a program by name                          |

## Trainee
| Methods | Urls                                                  | Description                                    |
| ------- | ----------------------------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/trainee`                                  | Get all trainees with pagination                |
| GET     | `/dashboard/trainee/:id`                              | Get a specific trainee by ID                    |
| POST    | `/dashboard/trainee`                                  | Create a new trainee                           |
| PUT     | `/dashboard/trainee/:id`                              | Update a trainee by ID                         |
| DELETE  | `/dashboard/trainee/:id`                              | Delete a trainee by ID                         |
| PUT     | `/dashboard/trainee/:id/select-program/:programId`    | Select a program for a trainee                 |
| PUT     | `/dashboard/trainee/:id/change-program/:programId`    | Change a trainee's program                     |

## Admin
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/admin`               | Get all admins                                 |
| POST    | `/dashboard/admin`               | Create a new admin                             |
| PUT     | `/dashboard/admin/:id`           | Update an admin by ID                          |
| DELETE  | `/dashboard/admin/:id`           | Delete an admin by ID                          |

## Staff
| Methods | Urls                                      | Description                                    |
| ------- | ----------------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/staff`                        | Get all staff members with pagination           |
| GET     | `/dashboard/staff/:id`                    | Get a specific staff member by ID               |
| POST    | `/dashboard/staff`                        | Add a new staff member                         |
| PUT     | `/dashboard/staff/:id`                    | Update a staff member by ID                    |
| DELETE  | `/dashboard/staff/:id`                    | Delete a staff member by ID                    |
| PUT     | `/dashboard/staff/update-payroll/:id`     | Update payroll for a staff member               |

## Payments
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| POST    | `/dashboard/payments`            | Create a new payment                           |
| GET     | `/dashboard/payments`            | Get all payments with pagination                |
| GET     | `/dashboard/payments/:id`        | Get a specific payment by ID                    |
| PUT     | `/dashboard/payments/:id`        | Update a payment by ID                         |
| DELETE  | `/dashboard/payments/:id`        | Delete a payment by ID                         |

## Reports
| Methods | Urls                                      | Description                                    |
| ------- | ----------------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/report/store-report`           | Get store report                               |
| GET     | `/dashboard/report/staff-report`           | Get staff report                               |
| GET     | `/dashboard/report/trainee-report`         | Get trainee report                             |
| GET     | `/dashboard/report/equipment-report`       | Get equipment report                           |
| GET     | `/dashboard/report/programs-report`        | Get programs report with pagination             |
| GET     | `/dashboard/report/payments-reports`       | Get payments report                            |

## Notification
| Methods | Urls                                      | Description                                    |
| ------- | ----------------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/notification`                 | Get all notifications                          |
| POST    | `/dashboard/notification`                 | Add a new notification                         |
| GET     | `/dashboard/notification/:type`            | Get notifications by type                      |

## Sales
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/sales`               | Get all sales                                  |
| POST    | `/dashboard/sales`               | Record a new sale                              |

## Home
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/home`                | Get home page data                             |

## Profile
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/dashboard/profile`             | Get user profile                               |
| PATCH     | `/dashboard/profile`             | Update user profile                            |

# App Endpoints

## Auth
| Methods | Urls                                      | Description                                    |
| ------- | ----------------------------------------- | ---------------------------------------------- |
| POST    | `/app/auth/login`                    | Login a user                                   |
| PUT     | `/app/auth/changePassword/:id`       | Change password by user ID                     |
| POST    | `/app/auth/forgot-password`           | Request password reset                         |
| POST    | `/app/auth/verify`                   | Verify reset code                              |
| PUT     | `/app/auth/reset-password`           | Reset password                                 |
| GET     | `/app/auth/user`                     | Get authenticated user details                 |
| GET     | `/app/auth/check-auth`               | Check authentication status                    |

## Home
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/app/home`                      | Get home page data for the app                  |

## Profile
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/app/profile`                   | Get user profile                               |
| PATCH     | `/app/profile`                   | Update user profile                            |

## Trainees
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/app/trainee`                   | Get all trainees                               |

## Store
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/app/store`                     | Get store products                             |

## Programs
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/app/programs`                  | Get all programs                               |

## Equipment
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/app/equipment`                 | Get all equipment items                        |

## Notifications
| Methods | Urls                           | Description                                    |
| ------- | ------------------------------- | ---------------------------------------------- |
| GET     | `/app/notifications`             | Get all notifications                          |
| GET     | `/app/notifications/trainee`     | Get trainee-specific notifications