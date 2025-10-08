
# StrayNStray

StrayNStray is a full-stack travel planning and itinerary web application designed to simplify trip organization. Users can search for accommodations, transportation options, and build day-wise travel plans, all in one place. The platform offers intuitive filtering, user accounts, and dynamic interactive itinerary creation. StrayNStray aims to make travel planning easy, flexible, and engaging.

- **Unified trip management:** Instead of switching between hotel booking platforms, transport sites, and itinerary tools, StrayNStray lets users do everything in one place.

- **Smart filtering & search:** Users can filter stays by location, budget, ratings; search transport options (e.g. trains, buses, flights) between cities/dates.

- **User profiles & roles:** Users can register/login, view their bookings and past trips. Optionally, an admin dashboard (if implemented) can let administrators manage listings, user data, or system settings.

- **Data persistence & APIs:** The backend includes endpoints for stays, transport, user authentication, and itinerary data.

- **Responsive UI & modern tech stack:** The frontend is designed for desktop and mobile.

- **Extensible & modular architecture:** The code structure allows easy extension (new transport types, payment, reviews, maps, etc.).
## Tech Stack

**Client:** 
- HTML5, CSS3, JavaScript (ES6+)
- React.js – For building interactive UI components
- Dynamic DOM Manipulation - For itinerary and booking interfaces
- Fetch API – For API calls to the backend
- Tailwind CSS / Bootstrap – For responsive styling and layout

**Server:**
- Node.js – JavaScript runtime environment & Web framework for building the backend API
- MongoDB – NoSQL database for storing users, stays, itineraries, etc.
- JWT (JSON Web Tokens) – For authentication and authorization
- Bcrypt.js – For password hashing
- Dotenv(.env) – To manage environment variables

**Tools & Utilities:**
- Git & GitHub – Version control and collaboration
- VS Code – Primary code editor
- Vercel – Deployment
## API Reference

| Method   | Route                    | Description                  | Auth required? | Request Body                        |
| -------- | ------------------------ | ---------------------------- | -------------- | ----------------------------------- |
| **POST** | `/api/users/register`    | Register a new user          | No             | `{ name, email, password }`         |
| **POST** | `/api/users/login`       | Log in an existing user      | No             | `{ email, password }`               |
| **GET**  | `/api/users/me`          | Get logged-in user profile   | Yes (JWT)      | —                                   |
| **GET**  | `/api/stays`             | Fetch all available stays    | No             | —                                   |
| **POST** | `/api/stays`             | Add a new stay (Admin only)  | Yes (JWT)      | `{ name, location, price, rating }` |
| **POST** | `/api/transport/search`  | Search for transport options | No             | `{ from, to, date }`                |
| **GET**  | `/api/itinerary/:userId` | Fetch a user’s itinerary     | Yes (JWT)      | —                                   |
| **POST** | `/api/itinerary/add`     | Add a new itinerary item     | Yes (JWT)      | `{ userId, day, activity }`         |

## Environment Variables

To run this project, you will need to add the environment variables to your .env file


## Run Locally

**Prerequisites:**
Make sure you have the following installed:
- Node.js (v16 or above)
- npm (comes with Node)
- MongoDB (running locally or via MongoDB Atlas)
- Git

Clone the project

```bash
  git clone https://github.com/kavvyaaaa/StrayNStray-Project.git
```

Go to the project directory

```bash
  cd StrayNStray
```

**Backend Setup**

Create environment variables(.env)

```bash
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/staynstray
    JWT_SECRET=your_secret_key
```

Install dependencies

```bash
    npm install
```

Start the Server

```bash
    npm start
```

**Frontend Setup**

Install dependencies

```bash
    npm install
```

Run script

```bash
    npm run dev #host link will be provided after 
```


## Authors

- [@Krish-Korat](https://github.com/Krish-Korat)
- [@kavvyaaaa](https://github.com/kavvyaaaa)
- [@darp-lalani](https://github.com/darp-lalani)
- [@komal-k25](https://github.com/komal-k25)