# Cloning This Node.js Project

Follow these steps to clone and set up the project:

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure environment variables:**
    - Copy `.env.example` to `.env` and update values as needed.

4. **Set up the database schema:**
    ```bash
    npx prisma migrate deploy
    ```
    If migrate deploy fails and you're working in development only:

    ```bash
    npx prisma db push
    ```

5. **Run the project:**
    ```bash
    npm run dev
    ```

For more details, refer to the project documentation.