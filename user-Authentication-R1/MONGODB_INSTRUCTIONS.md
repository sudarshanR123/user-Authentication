# How to Connect MongoDB Atlas

Follow these exact steps to connect your backend to a real database.

## Phase 1: Get the Connection String (MongoDB Atlas)

1.  **Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)**.
2.  **Create a Cluster** (if you haven't):
    *   Click **+ Create** or **Build a Database**.
    *   Select **M0 Free** (Shared) tier.
    *   Click **Create**.
3.  **Setup Database Access (User)**:
    *   Go to **Security** -> **Database Access** (side menu).
    *   Click **+ Add New Database User**.
    *   **Username**: `admin` (or whatever you want).
    *   **Password**: *Create a strong password and COPY IT somewhere safe.*
    *   Click **Add User**.
4.  **Setup Network Access (IP Whitelist)**:
    *   Go to **Security** -> **Network Access**.
    *   Click **+ Add IP Address**.
    *   Click **Allow Access from Anywhere** (0.0.0.0/0) for easiest setup.
    *   Click **Confirm**.
5.  **Get the Connection String**:
    *   Go back to **Database** (side menu) -> **Clusters**.
    *   Click **Connect** button on your cluster card.
    *   Select **Drivers**.
    *   Ensure **Node.js** is selected.
    *   **Copy the connection string**. It looks like:
        `mongodb+srv://admin:<password>@cluster0.p8xyz.mongodb.net/?retryWrites=true&w=majority`

## Phase 2: Update Your Code

1.  Open the file named `.env` in your project folder.
2.  Look for `MONGO_URI=...`.
3.  **Paste your connection string** there.
4.  **Important**: Replace `<password>` with the password you created in Step 3.
    *   *Example bad:* `...//admin:<mypassword>@...`
    *   *Example good:* `...//admin:mypassword@...` (No brackets!)
5.  Save the file.

## Phase 3: Run the Server

1.  Open your terminal.
2.  Run this command:
    ```bash
    node index.js
    ```
3.  You should see: `Connected to MongoDB Atlas`

## Phase 4: Test in Postman

1.  **Register a User**: You must run the **Register** API first.
    *   POST `http://localhost:3000/api/auth/register`
    *   Body: `{ "email": "test@example.com", "username": "test", "password": "123" }`
2.  **Verify**: Log into MongoDB Atlas -> Click **Browse Collections**. You should see a `users` collection with your data!
