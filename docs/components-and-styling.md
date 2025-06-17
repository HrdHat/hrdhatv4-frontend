# Components And Styling

## Components Best Practices

#### Colocate things as close as possible to where it's being used

Keep components, functions, styles, state, etc. as close as possible to where they are being used. This will not only make your codebase more readable and easier to understand but it will also improve your application performance since it will reduce redundant re-renders on state updates.

#### Avoid large components with nested rendering functions

Do not add multiple rendering functions inside your application, this gets out of control pretty quickly. What you should do instead is if there is a piece of UI that can be considered as a unit, is to extract it in a separate component.

```javascript
// this is very difficult to maintain as soon as the component starts growing
function Component() {
  function renderItems() {
    return <ul>...</ul>;
  }
  return <div>{renderItems()}</div>;
}

// extract it in a separate component
function Items() {
  return <ul>...</ul>;
}

function Component() {
  return (
    <div>
      <Items />
    </div>
  );
}
```

#### Stay consistent

Keep your code style consistent. For example, if you name your components using pascal case, do it everywhere. Most of code consistency is achieved by using linters and code formatters, so make sure you have them set up in your project.

#### Limit the number of props a component is accepting as input

If your component is accepting too many props you might consider splitting it into multiple components or use the composition technique via children or slots.

#### Pluggable Component CSS

Every visual component **MUST** own its styles:

- Create a folder `src/components/ComponentName/` containing both `ComponentName.tsx` and `component-name.css`.
- Import the CSS **inside the component file** (e.g., `import './button.css';`).
- Never list the file in a global `index.css`. Vite will tree-shake the CSS when the component is not used.
- Deleting the component (and any references to it) must remove its CSS from the production bundle automatically.
- The file belongs to the ITCSS **components** layer: keep only visual rules, no layout utilities.

Example directory:

```
src/components/Button/
├── Button.tsx   // import './button.css'
└── button.css   // .btn styles only
```

## ITCSS Styling Architecture

This project follows **ITCSS (Inverted Triangle CSS)** methodology for scalable and maintainable styling. ITCSS organizes CSS in layers from generic to specific:

### 📐 ITCSS Layers (in order)

1. **Settings** (`src/styles/settings/`)

   - Only `:root` and `:where()` selectors
   - CSS variables only (`--color-primary`, etc.)
   - No classes, no IDs, no properties other than `--vars`

2. **Tools** (`src/styles/tools/`)

   - Mixins, helper classes, font stacks
   - No output selectors (used by preprocessor logic)

3. **Generic** (`src/styles/generic/`)

   - Normalize.css, box-sizing, reset
   - Only use tag selectors (`html`, `body`, `*`)
   - No class or ID selectors

4. **Base** (`src/styles/base/`)

   - Styling for `h1`, `p`, `a`, `ul`, etc.
   - No classes or IDs
   - No CSS variables (use raw CSS only)

5. **Objects** (`src/styles/objects/`)

   - Structural layout (e.g., `.o-container`, `.o-grid`)
   - Classes only — never use IDs or tags
   - Cannot use visual properties like `color`, `background`

6. **Components** (`src/styles/components/`)

   - Visual building blocks (`.btn`, `.card`, `.modal`)
   - Class selectors only
   - No `#id`, no tag selectors (e.g., `button {}` is wrong)
   - Can use CSS variables

7. **Utilities** (`src/styles/utilities/`)
   - One-property classes (`.text-left`, `.m-1`)
   - Use `!important` if necessary
   - Must not contain compound rules or nesting

### 🚫 ITCSS Forbidden Rules

- **No raw hex codes** — only `var(--colors)`
- **No `!important`** except in `utilities/`
- **No type-qualified selectors** (e.g. `input[type=checkbox]`)
- **No duplicate selectors** across layers
- **No overrides in `components/`** — use `utilities/` or new class

### 🔧 ITCSS Practical Tips

The guidelines below summarise lessons from Harry Roberts' ITCSS material and the Xfive field-study article (2016-2021):

- **One folder, one file per component.** Keep `ComponentName.tsx` and `component-name.css` together; never mix multiple components in one stylesheet.
- **Namespace prefixes.** Use BEM-IT prefixes to signal layer intent: `.c-` (component), `.o-` (object), `.u-` (utility).
- **Limit nesting to two levels.** Deep Sass nesting creates over-qualified selectors and specificity headaches.
- **Objects vs. Components.** When in doubt, treat a pattern as a Component; over-using Objects leads to class soup.
- **Spacing is separate.** Margins/padding live in utilities or layout objects, not inside component CSS.
- **Accept small repetition.** Minor duplication is preferable to tangled abstractions.

> For an in-depth walkthrough see Harry Roberts' Skillshare class and the original Xfive ITCSS article.

### Example ITCSS Structure

```
src/styles/
├── settings/
│   ├── _colors.css
│   └── _typography.css
├── tools/
│   └── _mixins.css
├── generic/
│   └── _normalize.css
├── base/
│   ├── _typography.css
│   └── _forms.css
├── objects/
│   ├── _container.css
│   └── _grid.css
├── components/
│   ├── _button.css
│   ├── _card.css
│   └── _form.css
└── utilities/
    ├── _spacing.css
    └── _text.css
```

## Storybook Integration

We use **Storybook** for component development and documentation:

### Benefits of Storybook

- **Isolated Development**: Build components in isolation
- **Visual Testing**: See all component states and variations
- **Documentation**: Auto-generated component docs
- **Design System**: Maintain consistent UI patterns

### Storybook Commands

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

### Writing Stories

Create `.stories.tsx` files alongside your components:

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};
```

### Component Development Workflow

1. **Create Component**: Build the React component with TypeScript
2. **Add ITCSS Styles**: Follow the layer hierarchy for styling
3. **Write Stories**: Document all component variants in Storybook
4. **Test Visually**: Use Storybook to verify all states work
5. **Document**: Ensure component props are well-documented

### ITCSS + Storybook Best Practices

- **Use CSS Variables**: Define colors/spacing in `settings/` layer
- **Component Stories**: Show all ITCSS component variations
- **Utility Combinations**: Demonstrate how utilities modify components
- **Responsive Testing**: Use Storybook viewport addon for mobile/desktop testing

This approach ensures our styling is maintainable, scalable, and well-documented through Storybook's visual interface.

## Grid Spacing Tokens

**Status:** Active  
**Last updated:** 2025-06-16  
**Cross-references:** [ITCSS settings layer], [objects/grid-background.css]

The following design tokens are used for grid backgrounds and spacing:

| Token Name                | Value  | Usage Context                             |
| ------------------------- | ------ | ----------------------------------------- |
| --spacing-grid-cell       | 40px   | Size of each grid cell                    |
| --spacing-grid-line-thin  | 1px    | Thickness of thin grid lines              |
| --spacing-grid-line-thick | 4px    | Thickness of thick grid lines             |
| --spacing-sidebar-width   | 320px  | Width of the sidebar component            |
| --font-size-h1            | 80px   | Base font size for H1 headings            |
| --font-size-h2            | 50px   | Base font size for H2 headings            |
| --font-size-h3            | 31px   | Base font size for H3 headings            |
| --spacing-page-side       | 360px  | Side padding for page content on desktop  |
| --breakpoint-desktop      | 1024px | Minimum viewport width considered desktop |

These tokens are defined in `src/styles/settings/_spacing.css` and used in `objects/grid-background.css` to ensure a consistent, token-driven 4x4 grid background with thick outer borders.
