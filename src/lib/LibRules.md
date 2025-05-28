# Lib Directory Rules

## Purpose

Contains reusable libraries preconfigured for the application.

## Guidelines

- Configure third-party libraries with application-specific settings
- Provide consistent APIs for external libraries
- Abstract complex library configurations
- Create wrapper functions for commonly used library features
- Maintain version compatibility and updates

## Structure

- Each library should have its own configuration file
- Include setup, configuration, and utility functions
- Provide TypeScript definitions for library extensions
- Document library-specific patterns and usage

## Best Practices

- Create thin wrappers around external libraries
- Implement proper error handling for library operations
- Use dependency injection for library instances
- Write tests for library configurations
- Document breaking changes and migration guides
- Keep library versions up to date
- Implement proper logging for library operations
- Use environment-specific configurations
- Provide fallbacks for library failures
