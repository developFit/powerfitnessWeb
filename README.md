# powerfitnessWeb
backoffice admin de gym power fitness

## Environment Configuration

The application uses Vite environment files to configure the API base URL.

Create `.env.local` for local development and `.env.production` for the
production build. Each file should define `VITE_API_BASE_URL`:

```
VITE_API_BASE_URL=http://localhost:8081
```

Adjust the value in `.env.production` to match the production API endpoint.
