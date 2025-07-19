# Dr.App

## Overview

Dr.App is a backend server for a doctor-patient social platform, built with Node.js, Express, and MongoDB. It supports user registration with OTP verification, authentication, blogging, and a friend request system.

---

## API Documentation

### Authentication & User

#### Register User
- **POST** `/register`
- **Body:** `{ name, email, password, contact, address, image, Dob }`
- **Response:**  
  - `201 Created` with userId and OTP message  
  - `400 Bad Request` if user exists

#### Verify OTP
- **POST** `/verify`
- **Body:** `{ otp }`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` if OTP verified  
  - `400/401/403` for errors or too many attempts

#### Login
- **POST** `/login`
- **Body:** `{ email, password }`
- **Response:**  
  - `200 OK` with userId and cookie token  
  - `400 Bad Request` for incorrect password

#### Logout
- **GET** `/logout`
- **Response:**  
  - `200 OK` and clears token cookie

---

### Dashboard

#### Get Dashboard
- **GET** `/dashboard`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` with user info, all blogs, and user list

---

### Blog

#### Create Blog
- **POST** `/blogs/:id`
- **Auth:** Cookie token required
- **Body:** `{ title, description }`
- **Response:**  
  - `201 Created` with blog info

#### Edit Blog
- **PUT** `/blogs/edit/:id/:blogId`
- **Auth:** Cookie token required
- **Body:** `{ title, description }`
- **Response:**  
  - `200 OK` with updated blog

#### Like Blog
- **PUT** `/blogs/like/:blogId`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` with updated blog

#### Dislike Blog
- **PUT** `/blogs/dislike/:blogId`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` with updated blog after removing user's like

#### Delete Blog
- **DELETE** `/blogs/delete/:id/:blogId`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` with deleted blog info

#### Add Comment to Blog
- **PUT** `/blogs/comment/:blogId`
- **Auth:** Cookie token required
- **Body:** `{ comment }`
- **Response:**  
  - `200 OK` with updated blog including new comment

#### Get Blogs by Author
- **GET** `/blogs/author/:authorId`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` with blogs written by the specified author

#### Search Blogs by Keyword
- **GET** `/blogs/search?query=keyword`
- **Response:**  
  - `200 OK` with blogs matching the keyword in title or description  
  - `400 Bad Request` if query is missing

---

## Project Structure

```
internship_dr/
│
├── Server/
│   ├── app.js                  # Main Express app, loads routes and middleware
│   ├── Database/
│   │   └── dbConnect.js        # MongoDB connection logic
│   ├── Controllers/
│   │   ├── AuthController.js   # Auth middleware and logic
│   │   └── Transporter.js      # Email transporter setup
│   ├── middlewares/
│   │   └── jwttoken.js         # JWT token generation
│   ├── models/
│   │   ├── user.js             # User schema
│   │   ├── blog.js             # Blog schema
│   │   └── payment.js          # Payment schema
│   ├── routes/
│   │   ├── userRoute.js        # User-related endpoints
│   │   └── blogsRoute.js       # Blog-related endpoints
│   └── ...
│
├── Readme.md                   # Project documentation
└── ...
```

- All API endpoints are registered in `app.js` using `userRoute` and `blogRoute`.
- Middleware for cookies, CORS, JSON, and URL encoding is configured in `app.js`.

---

## Authors

Yash, Sunita, Riya Bansal, Sahnaaz Khan, Akshat Shrivastav, Nishita Singh
