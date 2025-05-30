# Application Overview

HrdHat lets users sign up, create, and manage daily safety forms — chiefly the FLRA (Field-Level Risk Assessment).

We have a form structure and every form is built of form modules(sections).

There are Two primary ways to fill out an FLRA in HrdHat:

    Guided Mode

        One question per screen

        Smooth “click-in” transitions between fields

        Ideal for step-by-step focus

    Quick View

        Multiple rows/questions on a single scrollable page

        No columns—just a vertical list

        Faster “all-at-once” fill experience

## Data model

The application contains the following models:

- User - can have one of these roles:

  - `USER` - can:
    - edit own profile
    - create/fill out/access/stave/submit Forms:
      - Create
      - Fill out
      - Access Active and Archived form
      - Modify Active Forms
      - Generate Pdf
      - Modify what modules a user wants in there forms.
    - edit what modules are part of what form. (This is a phase 2)

## Get Started

To get started with the HrdHat application:

1. **Prerequisites**: Ensure you have Node.js and npm installed
2. **Installation**: Clone the repository and install dependencies
3. **Configuration**: Set up your environment variables (see Configuration section in README)
4. **Development**: Run the development server

For detailed setup instructions, check the [README.md](../../README.md) file in the frontend directory.

