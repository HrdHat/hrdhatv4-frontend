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
