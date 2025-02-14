# Overview
This project consists of two main parts: **Test-Backend** (built with Django) and **Test-Frontend** (built with React). The backend provides API endpoints, while the frontend offers an interface to interact with those endpoints.

---

## Test-Backend (Django)

### Directory Structure
```
backtest/
  settings.py        # Configuration of the Django application (e.g., database, installed apps, etc.)
  urls.py            # URL routing for the backend
  wsgi.py/asgi.py    # Entry points for the web server (WSGI for synchronous, ASGI for asynchronous)
  user_management/   # Handles user-related functionality
    models/          # Data models (e.g., Batch, Organization, User, etc.)
    serializers/     # Convert model instances to JSON format and vice versa
    views/           # Request handling views for API responses
    services/        # Business logic for handling models (e.g., creating batches, managing users)
```

### Running the Backend
1. Navigate to the backend folder:
```cd test-backend```

2. Create a virtual environment:
```python -m venv venv```

3. Activate the virtual environment:  On Windows: ```.\venv\Scripts\activate``` On macOS/Linux: ```source venv/bin/activate```

4. Install the dependencies: ```pip install -r requirements.txt```

5. Make migrations for the database:
```
py manage.py makemigrations
py manage.py migrate
```

6. Run the Django development server:
```py manage.py runserver```

The server will be available at http://localhost:8000 by default.

## Test-Backend (Django)

### Directory Structure
```
public/               # Contains static assets like index.html, the main entry point for the React app
src/                  # Contains all the source code for the React app
  pages/              # React components representing individual pages/screens of the app
  services/           # Services to interact with the backend API
  styles/             # Global CSS files used throughout the application
index.js              # The entry point for the React application
```

### Running the Frontend
1. Navigate to the frontend folder:
``` cd test-frontend ```

2. Install the dependencies:
``` npm install ```

3. Start the development server:
``` npm start ```

This starts the React development server, which will run your application and serve it at http://localhost:3000.