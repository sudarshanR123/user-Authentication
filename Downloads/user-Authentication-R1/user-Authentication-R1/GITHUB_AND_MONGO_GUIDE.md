# How to Push to GitHub

1.  **Initialize Git**:
    Open your terminal in the project folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a Repository on GitHub**:
    *   Go to [GitHub.com](https://github.com) and sign in.
    *   Click the **+** icon (top right) -> **New repository**.
    *   Name it (e.g., `auth-backend`).
    *   Click **Create repository**.

3.  **Link and Push**:
    *   Copy the 3 lines under "…or push an existing repository from the command line".
    *   Paste them into your terminal. They will look like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/auth-backend.git
    git branch -M main
    git push -u origin main
    ```

## How to Check MongoDB Data

1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Go to **Clusters**.
3.  Click **Browse Collections**.
4.  You will see a database (likely `test` or `myAuthDB`) and collections like `users` and `otps`.
5.  As you register users via Postman, you will see new documents appear here instantly.
