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
- **PUT** `/blogs/like/:id/:blogId`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` with updated blog

#### Delete Blog
- **DELETE** `/blogs/delete/:id/:blogId`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` with deleted blog info

---

### Friends

#### Send Friend Request
- **POST** `/friends/request/:id`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` if sent  
  - `400/404` for errors

#### Get Friend Requests
- **GET** `/friends/requests`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` with list of friend requests

#### Delete Friend Request
- **DELETE** `/friends/request/:id`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` if deleted

#### Accept Friend Request
- **PUT** `/friends/accept/:id`
- **Auth:** Cookie token required
- **Response:**  
  - `200 OK` if accepted

---

## Project Structure

See [Server/routes/userRoute.js](Server/routes/userRoute.js) for route implementations.

---

## Authors

Yash, Sunita, Riya Bansal, Sahnaaz Khan, Akshat Shrivastav, Nishita Singh

---

## License
