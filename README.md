# Farah - Wedding Services Platform

## Overview
Farah (فرح) is a platform that simplifies the process of finding and booking wedding services. Users can search for wedding venues, view details, and contact providers directly to book appointments without the hassle of traveling. Additionally, users can explore photographers' portfolios, book beauty centers, and add their favorite services for easy access later.

## Platforms
Farah consists of two main websites:
1. **Customer Website**: Allows users to create a new account easily, including using their Google account.
2. **Dashboard for Service Providers/Admins**: Enables service providers to register their services, manage their profiles, and respond to customer messages.

## Features
### Customer Website:
- Easy account creation and Google login.
- Search and favorite wedding venues, photographers, and beauty centers.
- Direct communication with service providers.

### Dashboard for Service Providers/Admins:
- Service registration and profile management.
- Edit or delete services after admin approval.
- Track and respond to customer messages in real-time.

## Technologies Used

### Backend Technologies:
- **ASP.NET WebApi**
- **Entity Framework**
- **MSSQL**
- **SignalR**
- **MailKit**
- **Google Auth**
- **AutoMapper**
- **Fluent API**

Our backend follows clean architecture principles, incorporating the repository pattern for scalability and maintainability.

### Frontend Technologies:
- **Angular** (Dashboard with Angular 16 using Module approach, Website with Angular 17 using Standalone approach)

### Libraries:
- **NgPrime**
- **SweetAlert**
- **Toastr**
- **Typed.js**
- **Canvas-Confetti**
- **SignalR**
- **NgRx** for state management

## Installation

### Backend
1. Clone the repository:
    ```sh
    git clone https://github.com/moudy99/Farah-backend.git
    ```
2. Navigate to the project directory:
    ```sh
    cd farah-backend
    ```
3. Restore packages:
    ```sh
    dotnet restore
    ```
4. Update the database connection string in `appsettings.json`.
5. Apply database migrations:
    ```sh
    dotnet ef database update
    ```
6. Run the project:
    ```sh
    dotnet run
    ```

### Frontend
1. Clone the repository:
    ```sh
    git clone https://github.com/moudy99/farah-front.git
    ```
2. Navigate to the project directory:
    ```sh
    cd farah-frontend
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Serve the application:
    ```sh
    ng serve
    ```

### Dashboard
1. Clone the repository:
    ```sh
    git clone https://github.com/moudy99/farahDashbord.git
    ```
2. Navigate to the project directory:
    ```sh
    cd farah-dashboard
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Serve the application:
    ```sh
    ng serve
    ```

## Contributors
- Mina Medhat
- Mahmoud Salah
- Fatma Ahmed
- Aya Mohamed
- Nesma Fayez

