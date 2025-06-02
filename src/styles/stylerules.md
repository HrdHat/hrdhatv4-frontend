# Style Directory Rules (ITCSS)

This directory implements the ITCSS (Inverted Triangle CSS) methodology for scalable, maintainable styling in the HrdHat project.

## Directory Structure

```
frontend/src/styles/
├── settings/    # CSS variables only (e.g., _colors.css, _typography.css)
├── tools/       # Mixins, helpers, font stacks (no output selectors)
├── generic/     # Normalize, resets, box-sizing (tag selectors only)
├── base/        # Element styling (h1, p, a, ul, etc.)
├── objects/     # Layout patterns (e.g., .o-container, .o-grid)
├── components/  # Visual UI building blocks (e.g., .btn, .card)
└── utilities/   # Single-purpose utility classes (e.g., .text-left)
```

## ITCSS Layer Rules

1. **settings/**: Only `:root` and `:where()` selectors, CSS variables, no classes/IDs.
2. **tools/**: Mixins, helpers, font stacks, no output selectors.
3. **generic/**: Normalize.css, resets, only tag selectors, no classes/IDs.
4. **base/**: Element styling, no classes/IDs, no CSS variables.
5. **objects/**: Layout classes only, never IDs or tags, no visual properties.
6. **components/**: UI building blocks, class selectors only, can use CSS variables.
7. **utilities/**: One-property classes, use `!important` if needed, no compound rules.

## Forbidden Practices

- No raw hex codes—use CSS variables from `settings/`.
- No `!important` except in `utilities/`.
- No type-qualified selectors (e.g., `input[type=checkbox]`).
- No duplicate selectors across layers.
- No overrides in `components/`—use `utilities/` or new class.

## References

- See `frontend/docs/components-and-styling.md` for detailed ITCSS guidance and examples.
- See `frontend/docs/project-standards.md` for project-wide styling and naming standards.

> **Note:** All new styles must follow ITCSS and be placed in the correct layer. This structure is required for maintainability and scalability.
