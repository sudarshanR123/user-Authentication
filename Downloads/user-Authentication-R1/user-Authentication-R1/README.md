# Backend API for Auth UI

This backend provides API endpoints for the login, registration, and password reset flows.

## Base URL
`http://localhost:3000`

## APIs for Postman

### 1. Login
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/auth/login`
*   **Body (JSON):**
    ```json
    {
      "emailOrUsername": "test@example.com",
      "password": "password123"
    }
    ```

### 2. Register
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/auth/register`
*   **Body (JSON):**
    ```json
    {
      "email": "newuser@example.com",
      "username": "newuser",
      "password": "password123"
    }
    ```

### 3. Google Sign In (Mock)
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/auth/google`
*   **Body (JSON):**
    ```json
    {}
    ```

### 4. Forgot Password (Initiate)
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/auth/forgot-password`
*   **Body (JSON):**
    ```json
    {
      "email": "test@example.com"
    }
    ```
    *Note: The response will contain a `debug_code` which you can use in the next step.*

### 5. Verify Code
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/auth/verify-code`
*   **Body (JSON):**
    ```json
    {
      "email": "test@example.com",
      "code": "123456" 
    }
    ```
    *(Replace "123456" with the code received in the previous step)*

### 6. Reset Password
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/auth/reset-password`
*   **Body (JSON):**
    ```json
    {
      "email": "test@example.com",
      "newPassword": "newpassword123",
      "confirmPassword": "newpassword123"
    }
    ```

## Pre-existing User Data
*   **Email:** `test@example.com`
*   **Password:** `password123`
