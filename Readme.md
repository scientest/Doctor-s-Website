# Dr.App

## Overview

Dr.App is a backend server for a doctor-patient social platform, built with Node.js, Express, and MongoDB. It supports user registration with OTP verification, authentication, blogging, and a social following system.

---

## API Documentation

### Authentication & User

#### Register User
- **POST** `/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword",
    "contact": "1234567890",
    "address": "123 Main St",
    "image": "profile.jpg",
    "Dob": "1990-01-01"
  }
  ```
- **Response:**  
  - `201 Created` with userId and OTP message  
  - `400 Bad Request` if user exists

#### Verify OTP
- **POST** `/verify`
- **Body:**
  ```json
  { "otp": "123456" }
  ```
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` if OTP verified  
  - `400/401/403` for errors or too many attempts

#### Login
- **POST** `/login`
- **Body:**
  ```json
  { "email": "john@example.com", "password": "yourpassword" }
  ```
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

### User Follow/Unfollow

#### Follow a User
- **PUT** `/follow/:id`
- **Auth:** Cookie token required
- **Example:**  
  ```
  PUT /follow/60f7c2b5e1d2c8a1b8e4d123
  ```
- **Response:**  
  - `200 OK` if followed successfully  
  - `400/404` for errors

#### Unfollow a User
- **PUT** `/unfollow/:id`
- **Auth:** Cookie token required
- **Example:**  
  ```
  PUT /unfollow/60f7c2b5e1d2c8a1b8e4d123
  ```
- **Response:**  
  - `200 OK` if unfollowed successfully  
  - `400/404` for errors

---

### Blog

#### Create Blog
- **POST** `/blog/add`
- **Auth:** Cookie token required
- **Body:**
  ```json
  { "title": "My First Blog", "description": "This is my first blog post." }
  ```
- **Response:**  
  - `201 Created` with blog info

#### Edit Blog
- **PUT** `/blogs/edit/:id/:blogId`
- **Auth:** Cookie token required
- **Body:**
  ```json
  { "title": "Updated Title", "description": "Updated description." }
  ```
- **Response:**  
  - `200 OK` with updated blog

#### Like Blog
- **PUT** `/blogs/like/:blogId`
- **Auth:** Cookie token required
- **Example:**  
  ```
  PUT /blogs/like/60f7c2b5e1d2c8a1b8e4d456
  ```
- **Response:**  
  - `200 OK` with updated blog

#### Dislike Blog
- **PUT** `/blogs/dislike/:blogId`
- **Auth:** Cookie token required
- **Example:**  
  ```
  PUT /blogs/dislike/60f7c2b5e1d2c8a1b8e4d456
  ```
- **Response:**  
  - `200 OK` with updated blog after removing user's like

#### Delete Blog
- **DELETE** `/blogs/delete/:id/:blogId`
- **Auth:** Cookie token required
- **Example:**  
  ```
  DELETE /blogs/delete/60f7c2b5e1d2c8a1b8e4d123/60f7c2b5e1d2c8a1b8e4d456
  ```
- **Response:**  
  - `200 OK` with deleted blog info

#### Get Blogs by Author
- **GET** `/blogs/author/:authorId`
- **Auth:** Cookie token required
- **Example:**  
  ```
  GET /blogs/author/60f7c2b5e1d2c8a1b8e4d123
  ```
- **Response:**  
  - `200 OK` with blogs written by the specified author

#### Get All Blogs
- **GET** `/blogs`
- **Response:**  
  - `200 OK` with all blogs

#### Get Single Blog by ID
- **GET** `/blogs/:id`
- **Example:**  
  ```
  GET /blogs/60f7c2b5e1d2c8a1b8e4d456
  ```
- **Response:**  
  - `200 OK` with blog details

#### Search Blogs by Keyword
- **GET** `/blogs/search?query=keyword`
- **Example:**  
  ```
  GET /blogs/search?query=doctor
  ```
- **Response:**  
  - `200 OK` with blogs matching the keyword in title or description  
  - `400 Bad Request` if query is missing

---

### Blog Comments

#### Add Comment or Reply to a Comment
- **POST** `/comments/add/:blogId`
- **Auth:** Cookie token required
- **Body:**  
  - For direct comment:
    ```json
    { "text": "Nice blog!" }
    ```
  - For reply:
    ```json
    { "text": "Thanks!", "parentId": "<commentId>" }
    ```
- **Response:**  
  - `201 Created` if comment or reply added successfully  
  - `400/404` for errors

#### Get Comments of a Blog
- **GET** `/comments/:blogId`
- **Example:**  
  ```
  GET /comments/60f7c2b5e1d2c8a1b8e4d456
  ```
- **Response:**  
  - `200 OK` with all comments and replies for the blog

---

## Authors

Yash, Sunita, Riya Bansal, Sahnaaz Khan, Akshat Shrivastav, Nishita Singh
