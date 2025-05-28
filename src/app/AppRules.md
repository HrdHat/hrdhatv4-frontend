# App Directory Rules

## Purpose

The application layer containing the main application structure and configuration.

## Guidelines

- This folder contains the core application setup
- May differ based on the meta framework used (Next.js, Remix, etc.)
- Keep application-level concerns separate from feature-specific logic
- Maintain clean separation between routing, providers, and main app component

## Structure

- `routes/` - Application routes (can also be pages)
- `app.tsx` - Main application component
- `provider.tsx` - Application provider wrapping the entire app with global providers
- `router.tsx` - Application router configuration

## Best Practices

- Keep the main app component minimal and focused on layout
- Use providers for global state and context
- Configure routing in a centralized location
- Follow the meta framework's conventions when applicable
