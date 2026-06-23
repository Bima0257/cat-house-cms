# Cat House - Project Draft

> Fullstack Web Application for Cat Boarding Management

## 1. Project Overview

Cat House adalah aplikasi manajemen penitipan kucing berbasis web yang
dibangun menggunakan arsitektur modern dengan React sebagai frontend dan
Laravel sebagai backend REST API.

### Goals

-   Mempermudah reservasi penitipan kucing.
-   Monitoring kondisi kucing.
-   Manajemen pembayaran.
-   Dashboard admin dan staff.
-   Laporan operasional.

------------------------------------------------------------------------

# 2. Tech Stack

## Frontend

-   React 19
-   Vite
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   React Router
-   TanStack Query
-   React Hook Form
-   Zod
-   Axios
-   Sonner
-   Framer Motion
-   Responsive UI (Mobile First)

## Backend

-   Laravel 12
-   REST API
-   Laravel Sanctum
-   Spatie Permission
-   MySQL
-   Service Layer
-   Form Request Validation
-   Eloquent ORM

------------------------------------------------------------------------

# 3. Backend Architecture

    Request
       │
    Controller
       │
    Service
       │
    Model
       │
    Accessor
       │
    Database

## Folder Structure

``` text
app/
 ├── Http/
 │    ├── Controllers/
 │    └── Requests/
 ├── Services/
 ├── Models/
 ├── Enums/
 ├── Traits/
 ├── Notifications/
 └── Helpers/
```

### Rules

Controller: - Validasi melalui Form Request - Memanggil Service - Return
API Response

Service: - Seluruh business logic - DB Transaction - Upload File -
Notification

Model: - fillable - casts - relationships - accessors - scopes

------------------------------------------------------------------------

# 4. User Roles

## Customer

-   Register/Login
-   Kelola profil
-   Kelola data kucing
-   Reservasi
-   Pembayaran
-   Riwayat

## Staff

-   Kelola reservasi
-   Daily report
-   Verifikasi pembayaran

## Admin

-   Kelola user
-   Kelola role & permission
-   Kelola layanan
-   Kelola kandang
-   Dashboard
-   Laporan

------------------------------------------------------------------------

# 5. Main Features

-   Authentication (Sanctum)
-   Authorization (Spatie)
-   Cat Management
-   Reservation
-   Cage Management
-   Payment
-   Daily Report
-   Notification
-   Dashboard
-   Report Export

------------------------------------------------------------------------

# 6. Frontend Structure

``` text
src/
 ├── assets/
 ├── components/
 ├── features/
 ├── hooks/
 ├── layouts/
 ├── pages/
 ├── routes/
 ├── services/
 ├── stores/
 ├── types/
 ├── utils/
 └── lib/
```

------------------------------------------------------------------------

# 7. API Modules

-   Auth
-   Users
-   Cats
-   Services
-   Cages
-   Reservations
-   Payments
-   Daily Reports
-   Notifications

------------------------------------------------------------------------

# 8. MySQL Database Design

## Tables

### users

-   id
-   uuid
-   name
-   email
-   phone
-   password
-   avatar
-   is_active
-   timestamps

### roles

(Spatie)

### permissions

(Spatie)

### cats

-   id
-   uuid
-   user_id (FK)
-   name
-   breed
-   gender
-   birth_date
-   weight
-   color
-   photo
-   vaccination_status
-   medical_note
-   timestamps

### services

-   id
-   name
-   description
-   price_per_day
-   is_active

### cages

-   id
-   code
-   category
-   capacity
-   status

### reservations

-   id
-   uuid
-   user_id (FK)
-   cat_id (FK)
-   service_id (FK)
-   cage_id (FK)
-   check_in
-   check_out
-   total_days
-   subtotal
-   status
-   note

### payments

-   id
-   reservation_id (FK)
-   payment_method
-   amount
-   proof
-   paid_at
-   status

### daily_reports

-   id
-   reservation_id (FK)
-   photo
-   food
-   drink
-   weight
-   activity
-   medicine
-   condition
-   note
-   report_date

### notifications

-   id
-   user_id (FK)
-   title
-   message
-   read_at

------------------------------------------------------------------------

# 9. Database Relationships

``` text
users
 ├──< cats
 ├──< reservations
 └──< notifications

cats
 └──< reservations

services
 └──< reservations

cages
 └──< reservations

reservations
 ├───1 payments
 └──< daily_reports
```

------------------------------------------------------------------------

# 10. Business Flow

Customer → Register → Login → Tambah Kucing → Reservasi → Upload
Pembayaran → Verifikasi Staff → Check-in → Daily Report → Check-out →
Riwayat

------------------------------------------------------------------------

# 11. UI Pages

## Public

-   Home
-   About
-   Services
-   Gallery
-   FAQ
-   Contact
-   Login
-   Register

## Customer

-   Dashboard
-   My Cats
-   Reservations
-   Payments
-   History
-   Profile

## Staff

-   Dashboard
-   Reservation
-   Daily Report
-   Payment Verification

## Admin

-   Dashboard
-   Users
-   Roles
-   Permissions
-   Services
-   Cages
-   Reports
-   Settings

------------------------------------------------------------------------

# 12. Roadmap

1.  Authentication
2.  Master Data
3.  Reservation
4.  Payment
5.  Daily Report
6.  Dashboard
7.  Reporting
8.  Testing
9.  Deployment

------------------------------------------------------------------------

# 13. Future Improvements

-   Midtrans
-   WhatsApp Notification
-   PWA
-   AI Health Analysis
-   Loyalty Program
-   Review & Rating
