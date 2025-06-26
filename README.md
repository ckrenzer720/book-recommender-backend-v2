# Book Recommender Backend v2

A Node.js/Express backend API for a book recommendation system.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration values.

### Running the Application

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

**Running tests:**

```bash
npm test
```

## 📁 Project Structure

```
src/
├── api/                    # API route handlers
│   ├── auth/              # Authentication routes
│   ├── books/             # Book management routes
│   ├── collections/       # User collections routes
│   ├── recommendations/   # Book recommendations routes
│   └── reviews/           # Book reviews routes
├── controllers/           # Business logic controllers
├── db/                   # Database configuration and migrations
├── middleware/           # Custom middleware
├── models/               # Data models
├── services/             # Business services
├── utils/                # Utility functions
├── app.js               # Express app configuration
└── server.js            # Server entry point
```

## 🔧 Configuration

The application uses environment variables for configuration. See `env.example` for available options.

## 🛣️ API Endpoints

### Health Check

- `GET /health` - Server health status

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Collections

- `GET /api/collections` - Get user collections
- `GET /api/collections/:id` - Get collection by ID
- `POST /api/collections` - Create collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `POST /api/collections/:id/books` - Add book to collection
- `DELETE /api/collections/:id/books/:bookId` - Remove book from collection

### Recommendations

- `GET /api/recommendations` - Get recommendations
- `GET /api/recommendations/user/:userId` - Get user recommendations
- `GET /api/recommendations/book/:bookId` - Get similar books
- `POST /api/recommendations/generate` - Generate recommendations

### Reviews

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/book/:bookId` - Get reviews for book
- `GET /api/reviews/user/:userId` - Get user reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Session management
- Request logging (Morgan)
- Global error handling

## 📝 Next Steps

1. Set up database schema and migrations
2. Implement authentication controllers
3. Create data models
4. Add input validation middleware
5. Implement business logic in controllers
6. Add comprehensive error handling
7. Set up testing framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
