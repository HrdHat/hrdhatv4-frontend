# Config Directory Rules

## Purpose

Contains global configurations, environment variables, and application settings.

## Guidelines

- Centralize all configuration in this directory
- Use environment variables for sensitive data
- Provide sensible defaults for all configurations
- Keep configuration files well-documented
- Separate configurations by environment (dev, staging, prod)

## Structure

- `env.ts` - Environment variable definitions and validation
- `constants.ts` - Application constants
- `api.ts` - API configuration and endpoints
- `theme.ts` - Theme and styling configuration
- `database.ts` - Database configuration (if applicable)

## Best Practices

- Never commit sensitive data to version control
- Use TypeScript for configuration validation
- Implement proper error handling for missing configs
- Use configuration schemas for validation
- Document all configuration options
- Use consistent naming conventions
- Implement configuration hot-reloading in development
