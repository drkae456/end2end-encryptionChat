# BaconChat brings you Bacon Chat's end2end-encryptionChat

Author: Bryce Daniel Bacon
You can contact me via email at toppig@baconchat.work

End to end encryption app
This is a simple encrypted chat application built with Flask, jQuery, and Redis for real-time messaging. It includes a front-end with two chat boxes for secure message exchange using private key encryption.

## Features

- Two-way encrypted chat using private keys.
- Simple front-end built with Bootstrap and jQuery.
- Back-end built with Flask.
- Real-time messaging powered by Redis.

## UI Explanation

This application is demonstration of my skills, in your web browser you can see two chats, this is so you dont have to run two instances.
Enter username1 and username 2 and follow instructions.

The command line at the bottom shows you whats happening with the encryption.

Enjoy!!

Also PLEASE HIRE ME!!! I HAVE THE SKILLS YOUR COMPANY NEEDS!!

## Prerequisites

Make sure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## How to Run the App

### Step 1: Clone the repository

Clone the repository to your local machine:

```bash
git clone https://github.com/your-repository/encrypted-chat-app.git
cd encrypted-chat-app
Step 2: Build the Docker image
Build the Docker image using the provided Dockerfile:

bash
Copy code
docker build -t encrypted-chat-app .
Step 3: Run with Docker Compose
To run the application with Docker Compose, use the following command:

bash
Copy code
docker-compose up
This will start two services:



web: The Flask application.
redis: A Redis service for real-time message management.
Step 4: Access the Application
Once the containers are up, you can access the chat application in your browser:

arduino
Copy code
http://localhost:5000
Step 5: Stopping the Application
To stop the application, use:

bash
Copy code
docker-compose down

```

### Application Structure

app.py: Flask server-side code.
index.html: Front-end of the chat application.
script.js: Contains the chat logic with encryption.
style.css: Contains the styles for the front-end.
Dockerfile: Configuration for building the Docker image.
docker-compose.yml: Docker Compose configuration to orchestrate multiple containers.
Technologies Used
Flask
jQuery
Bootstrap
Redis
Docker & Docker Compose
License
This project is licensed under the Apache License, Version 2

```
Contributing
Feel free to use this project however you like, though if you need a software engineer, or anything, cybersecurity person, please hire me!!

vbnet
Copy code

### Explanation:
- **Prerequisites**: The user is instructed to install Docker and Docker Compose.
- **Build & Run Instructions**: Clear steps on how to build the Docker image and run the application with Docker Compose are provided.
- **Accessing the App**: Explains how to access the app on `localhost`.
- **Stopping the App**: Instructions on how to stop the application.



```
