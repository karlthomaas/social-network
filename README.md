# Social Network Project

This README provides an overview of the frontend and backend components of the Social Network project. The project is designed as a modern web application that mimics the core functionalities of popular social networking platforms.

## Features

### Followers
- Follow/unfollow users
- Send follow requests
- Accept/decline follow requests

### Profile
- View user information, activity, and posts
- Manage public and private profile settings
- Display followers and following lists

### Posts
- Create and comment on posts
- Include images or GIFs in posts
- Set post privacy: public, private, or almost private

### Groups
- Create and manage groups
- Invite users and handle group requests
- Post and comment within groups
- Create and manage group events

### Notifications
- Receive notifications for follow requests, group invitations, and group events
- Differentiate between new notifications and private messages

### Chats
- Private messaging with followers
- Group messaging with members
- Real-time messaging using WebSockets

## Frontend

The frontend of the Social Network project is built using Next.js.

### Key Features:
- **User Interface**: Modern and responsive design for an engaging user experience.
- **Routing**: Utilizes Next.js routing to manage navigation within the application.
- **State Management**: Manages state using Redux.
- **API Calls**: Communicates with the backend services to fetch and display data using RTK Query.
- **Authentication**: Handles user authentication, allowing for secure access to the application.

### Development:
- **Node.js**: The frontend is developed with Node.js, ensuring a fast and scalable environment.
- **Docker**: Containerized using Docker to simplify deployment and ensure consistency across different environments.

Refer to the frontend [Dockerfile-frontend](frontend/Dockerfile-frontend) for the container setup and the [package.json](frontend/package.json) file for the list of dependencies and available scripts.

## Backend

The backend of the Social Network project is developed using Go (Golang), providing a robust and efficient server-side solution.

### Key Features:
- **RESTful API**: Offers a RESTful API for the frontend to interact with, facilitating operations like CRUD actions on posts, user profiles, and more.
- **WebSocket Support**: Implements Gorilla WebSockets for real-time communication features such as chat and notifications.
- **Database Integration**: Utilizes SQLite for data storage, with the flexibility to switch to more scalable solutions as needed.
- **Database migrations**: Utilize migrations to manage and version database schema changes efficiently, ensuring consistency and facilitating updates across different environments.
- **Authentication and Authorization**: Manages user sessions and permissions securely.
### Development:
- **Go Modules**: Leverages Go modules for dependency management, ensuring easy project setup and reproducible builds.
- **Docker**: The backend is also containerized with Docker, streamlining the development and deployment process.

For more details on the backend setup, refer to the [Dockerfile-backend](Dockerfile-backend) and the Go module file [go.mod](go.mod).

## Getting Started

### Prerequisites

Docker should be installed on your system [Get Docker](https://www.docker.com/get-started/)

**Clone project**
```bash
git clone https://github.com/karlthomaas/social-network.git
cd social-network
```

**Build project**
```bash
make docker
```


## Authors

- **Karl-Thomas**: Frontend and backend development.
- **kveber**: Backend development and database management.

This project is a collaborative effort aimed at creating a comprehensive social networking platform using modern web technologies.
