# Deployment Guide

This guide covers two methods to deploy your Student Management System:
1.  **AWS EC2 (Recommended for Placement)**: Demonstrates cloud infrastructure skills.
2.  **Render (Alternative)**: Quick and easy Platform-as-a-Service deployment.

---

## Option 1: AWS EC2 Deployment (Professional)

Using an EC2 instance (Virtual Server) puts you in full control. This is impressive for interviews.

### Prerequisites
-   An AWS Account.
-   Your AWS RDS database is running and **publicly accessible**.
-   Git installed on your local machine.

### Step 1: Launch an EC2 Instance
1.  Go to **AWS Console** -> **EC2**.
2.  Click **Launch Instance**.
3.  **Name**: `student-system-server`.
4.  **OS Image**: Ubuntu Server 22.04 LTS (Free tier eligible).
5.  **Instance Type**: `t2.micro` or `t3.micro` (Free tier).
6.  **Key Pair**: Create a new key pair (e.g., `my-key`), download the `.pem` file.
7.  **Network Settings**:
    -   Allow SSH traffic from Anywhere (0.0.0.0/0).
    -   Allow HTTP traffic from Anywhere.
    -   Allow HTTPS traffic from Anywhere.
8.  Click **Launch Instance**.

### Step 2: Connect to EC2
1.  Open your terminal where the `.pem` key is downloaded.
2.  Change permissions (Linux/Mac only): `chmod 400 my-key.pem`.
3.  Connect via SSH:
    ```bash
    ssh -i "my-key.pem" ubuntu@<your-ec2-public-ip>
    ```
    *(Replace `<your-ec2-public-ip>` with the Public IPv4 address from EC2 dashboard)*

### Step 3: Install Dependencies on EC2
Run these commands inside the EC2 terminal:
```bash
# Update package list
sudo apt update

# Install Node.js & npm
sudo apt install nodejs npm -y

# Verify installation
node -v
npm -v

# Install Git
sudo apt install git -y
```

### Step 4: Clone Your Code
1.  **Push your code to GitHub first**.
2.  Clone it on EC2:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

### Step 5: Install Project Dependencies
```bash
npm install
```

### Step 6: Configure Environment Variables
1.  Create the `.env` file:
    ```bash
    nano .env
    ```
2.  Paste your environment variables (Use your RDS Endpoint):
    ```env
    DB_HOST=student-db-instance.xxxx.rds.amazonaws.com
    DB_USER=admin
    DB_PASSWORD=your-password
    DB_NAME=student_management_system
    PORT=8080
    ```
3.  Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

### Step 7: Start the Application with PM2
We use PM2 to keep the app running in the background.
```bash
# Install PM2 globally
sudo npm install pm2 -g

# Start the app
pm2 start server.js --name "student-app"

# Save the process list to restart on reboot
pm2 save
pm2 startup
```

### Step 8: Open Firewall Port
1.  Go back to **AWS EC2 Dashboard** -> **Security Groups**.
2.  Select the security group attached to your instance.
3.  **Edit inbound rules**.
4.  Add Rule:
    -   **Type**: Custom TCP
    -   **Port Range**: 8080
    -   **Source**: Anywhere-IPv4 (0.0.0.0/0)
5.  Save rules.

### Success!
Visit `http://<your-ec2-public-ip>:8080` in your browser.

---

## Option 2: Render (Quick & Easy)

### Step 1: Push to GitHub
Make sure your project is on a GitHub repository.

### Step 2: Create Web Service on Render
1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    -   **Name**: `student-system`
    -   **Environment**: Node
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js`
5.  **Environment Variables**:
    -   Add `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` from your AWS RDS details.
    -   Render manages the `PORT` automatically, but you can set `PORT` to `10000` just in case.

### Step 3: Deploy
Click **Create Web Service**. Render will build and deploy your app.
