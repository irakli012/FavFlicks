# FavFlicks

A full-stack movie social platform where users can discover movies, rate them, leave comments, manage favorites, and engage with a community feed. Powered by [TMDB](https://www.themoviedb.org/) for rich movie data.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS, React Router v7, Axios |
| **Backend** | ASP.NET Core (.NET 10), Entity Framework Core, SQL Server |
| **Auth** | ASP.NET Identity + JWT Bearer tokens |
| **External API** | TMDB (The Movie Database) |
| **API Docs** | Scalar (OpenAPI) |

## Features

- **Movie Discovery** — Browse popular movies, search across local database & TMDB, import movies from TMDB
- **User Authentication** — Register/login with JWT-based auth, role-based access control (User & Admin)
- **Ratings** — Rate movies on a star scale; view aggregate scores and rating distributions
- **Comments** — Add, edit, and delete comments on movies with like/dislike interactions
- **Favorites** — Save movies to your personal favorites list
- **Tags** — Admin-managed tag system for categorizing movies
- **Watch Later** — Save movies to watch later *(in progress)*
- **Community Feed** — Social feed with posts about movies *(in progress)*
- **Profile** — User profile with stats, watchlist, favorites, and reviews
- **Highest Rated Slider** — Horizontal carousel of top-rated movies on the home page
- **TMDB Enrichment** — Movie details include cast, crew, trailers, genres, runtime, and external links

## Project Structure

```
FavFlicks/
├── favflicks/                  # ASP.NET Core Web API
│   ├── Controllers/            # API endpoints
│   ├── Properties/             # Launch settings
│   ├── wwwroot/                # Static files (movie images)
│   ├── Program.cs              # App configuration & middleware
│   └── appsettings.json        # Config (DB, JWT, TMDB, CORS)
│
├── favflicks.services/         # Business logic layer
│   ├── Interfaces/             # Service contracts
│   └── *.cs                    # Service implementations
│
├── favflicks_front/            # React SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level page components
│   │   ├── contexts/           # React context (AuthContext)
│   │   ├── services/           # API service helpers
│   │   └── utils/              # Utilities (API client, fetchWithAuth)
│   └── public/                 # Static assets
│
└── favflicks.sln               # Solution file
```

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [SQL Server](https://www.microsoft.com/sql-server) (LocalDB or full instance)
- A [TMDB API key](https://www.themoviedb.org/settings/api)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://gitlab.com/irakli012/FavFlicks.git
   cd FavFlicks
   ```

2. **Configure the API** — Update `favflicks/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "YOUR_SQL_SERVER_CONNECTION_STRING"
     },
     "Jwt": {
       "Key": "YOUR_32_CHAR_SECRET_KEY",
       "Issuer": "favflicks",
       "Audience": "favflicks_users"
     },
     "TMDB": {
       "ApiKey": "YOUR_TMDB_API_KEY",
       "BaseUrl": "https://api.themoviedb.org/3/",
       "ImageBaseUrl": "https://image.tmdb.org/t/p/"
     }
   }
   ```

3. **Apply database migrations & run**
   ```bash
   cd favflicks
   dotnet ef database update
   dotnet run
   ```
   The API will start at `https://localhost:7076` (or the port in `launchSettings.json`).

> An admin account is automatically seeded on first run: `admin@favflicks.com` / `Admin123`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd favflicks_front
   npm install
   ```

2. **Start the dev server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## API Endpoints

### Auth — `/api/Auth`
| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login and receive JWT |
| GET | `/test-auth` | Yes | Verify token validity |

### Movies — `/api/Movies`
| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| GET | `/` | No | List all movies |
| GET | `/popular` | No | Get popular movies from TMDB |
| GET | `/search?query=` | No | Search local DB + TMDB |
| GET | `/{id}` | No | Get movie by ID |
| GET | `/tmdb/{tmdbId}` | No | Import/get movie from TMDB |
| POST | `/` | Yes | Create a user-imported movie |
| PUT | `/{id}` | Yes | Update movie (owner/admin) |
| DELETE | `/{id}` | Yes | Delete movie (owner/admin) |

### Comments — `/api/Comments`
| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| GET | `/?movie=` | No | Get comments for a movie |
| GET | `/{id}` | No | Get a single comment |
| POST | `/` | Yes | Add a comment |
| PUT | `/{id}` | Yes | Update comment (owner/admin) |
| DELETE | `/{id}` | Yes | Delete comment (owner/admin) |

### Favorites — `/api/Favorites`
| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| GET | `/user` | Yes | Get current user's favorites |
| GET | `/{id}` | Yes | Get a single favorite |
| POST | `/` | Yes | Add a movie to favorites |
| DELETE | `/{id}` | Yes | Remove from favorites |

### Ratings — `/api/Ratings`
| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| GET | `/movie/{movieId}` | No | Get all ratings for a movie |
| GET | `/movie/{movieId}/user` | Yes | Get current user's rating |
| POST | `/` | Yes | Add or update a rating |

### Tags — `/api/Tag`
| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| GET | `/` | No | List all tags |
| GET | `/{id}` | No | Get tag by ID |
| POST | `/` | Admin | Create a tag |
| PUT | `/{id}` | Admin | Update a tag |
| DELETE | `/{id}` | Admin | Delete a tag |

## Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Search, highest-rated slider, popular movies grid |
| `/movie/:movieId` | Movie Details | Full movie info, cast, ratings, comments, trailers |
| `/feed` | Feed | Community social feed |
| `/login` | Login | User login form |
| `/register` | Register | User registration form |
| `/profile` | Profile | User profile with watchlist, favorites, reviews |

## API Documentation

When running in development mode, interactive API docs are available via Scalar at:

```
https://localhost:7076/scalar
```

## License

This project is for personal/educational use.
