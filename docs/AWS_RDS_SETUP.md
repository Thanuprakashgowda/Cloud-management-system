# AWS RDS Setup Guide for Student Management System

This guide will walk you through setting up a MySQL database on AWS RDS and connecting it to your Node.js application.

## Prerequisites
-   An AWS Account (Free Tier eligible).
-   Basic familiarity with AWS Console.

## Step 1: Create an AWS RDS Instance

1.  **Log in to AWS Console** and search for **RDS**.
2.  Click **Create database**.
3.  **Choose a database creation method**: Standard create.
4.  **Engine options**: MySQL.
5.  **Templates**: Select **Free tier** (IMPORTANT to avoid charges).
6.  **Settings**:
    -   **DB instance identifier**: `student-db-instance`
    -   **Master username**: `admin`
    -   **Master password**: `password123` (or choose your own secure password).
7.  **Instance configuration**: `db.t3.micro` (or `db.t2.micro` for older accounts).
8.  **Storage**: Leave as default (20 GB is minimum).
9.  **Connectivity**:
    -   **Public access**: **Yes** (This allows our local Node.js app to connect).
    -   **VPC security group**: Create new. Name it `rds-public-access`.
10. **Additional configuration**:
    -   **Initial database name**: `student_management_system`
11. Click **Create database**.

*It will take 5-10 minutes for the database to become available.*

## Step 2: Configure Security Group (Firewall)

1.  Go to the **RDS Dashboard** -> **Databases**.
2.  Click on your new instance (`student-db-instance`).
3.  Under **Connectivity & security**, click the link under **VPC security groups** (e.g., `rds-public-access`).
4.  This opens the EC2 Security Group page. Go to the **Inbound rules** tab.
5.  Click **Edit inbound rules**.
6.  Add rule:
    -   **Type**: MySQL/Aurora (3306)
    -   **Source**: My IP (This restricts access to only your computer).
    -   *Alternative*: Allow `0.0.0.0/0` for access from anywhere (Not recommended for production, but okay for quick demos).
7.  Click **Save rules**.

## Step 3: Connect the Application

1.  Go back to **RDS Dashboard**.
2.  Copy the **Endpoint** URL (e.g., `student-db-instance.xxxxxx.us-east-1.rds.amazonaws.com`).
3.  Open your project's `.env` file.
4.  Update the values:
    ```env
    DB_HOST=student-db-instance.xxxxxx.us-east-1.rds.amazonaws.com
    DB_USER=admin
    DB_PASSWORD=password123
    DB_NAME=student_management_system
    ```

## Step 4: Initialize the Database

1.  You can use a tool like **MySQL Workbench** or **DBeaver** to connect to the RDS endpoint using the credentials.
2.  Open the `database/schema.sql` file and execute the script to create tables.
3.  Open the `database/seed.sql` file and execute it to add dummy data.

## Step 5: Run the Application

Now your local Node.js application will communicate with the AWS cloud database!
```bash
node server.js
```
