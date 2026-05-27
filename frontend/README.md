# CRM Component Library

A standalone Next.js component library featuring shadcn-ui components, custom fields, and dashboard widgets.

## Components

### shadcn-ui Components
- **Button** - Multiple variants (default, destructive, outline, secondary, ghost, link, tertiary, green, gray)
- **Input** - Text input with border and focus styles
- **Label** - Form label with accessibility
- **Card** - Card containers with header, title, description, content, footer
- **Badge** - Status badges with variants
- **Tabs** - Tab navigation with active state styling
- **Tooltip** - Tooltip with arrow positioning
- **ScrollArea** - Scrollable area with custom scrollbar
- **Alert** - Alert messages (default, destructive)
- **Command** - Searchable command menu (combobox)
- **Checkbox** - Custom checkbox with animation
- **Calendar** - Date picker calendar (react-datepicker)
- **DatePicker** - Popover-based date picker
- **Popover** - Popover container with positioning
- **Select** - Native select dropdown (radix-ui)
- **DropdownMenu** - Dropdown menus (radix-ui)
- **Dialog** - Modal dialogs with overlay
- **Accordion** - Collapsible accordion sections
- **Skeleton** - Loading skeleton placeholder
- **Chart** - Recharts-based chart card
- **Table** - Table components (thead, tbody, tfoot, tr, th, td)
- **Switch** - Toggle switch
- **Progress** - Progress bar
- **Textarea** - Multi-line text input
- **Avatar** - Avatar with image and fallback
- **Pagination** - Pagination navigation
- **Breadcrumb** - Breadcrumb navigation
- **AlertDialog** - Alert confirmation dialog
- **Sonner** - Toast notifications
- **Drawer** - Slide-up drawer (vaul)

### Custom Fields
- **InputField** - Text input with label, validation, wrapper
- **TextAreaField** - Multi-line input with label
- **SelectField** - Custom searchable dropdown select
- **DatePickerField** - Date picker with calendar popup (ark-ui + react-datepicker)
- **TimePickerField** - Hour/minute time picker
- **SwitchField** - Toggle switch with label
- **CheckboxField** - Checkbox with label

### Dashboard
- **MetricCardsGrid** - Dashboard metric cards with gradient backgrounds

## Installation

```bash
npm install --legacy-peer-deps
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Dependencies

### Core
- `next` ^16.0.0
- `react` ^19.0.0
- `react-dom` ^19.0.0

### UI Components
- `@radix-ui/react-*` - Unstyled, accessible UI primitives
- `react-datepicker` ^7.3.0 - Date picker calendar
- `@ark-ui/react` ^5.24.1 - Popover/dropdown primitives
- `class-variance-authority` ^0.7.1 - Component variant utilities
- `clsx` ^2.1.1 - Class name utility
- `tailwind-merge` ^3.2.0 - Tailwind class merging
- `tailwindcss-animate` ^1.0.7 - Tailwind animations
- `vaul` ^1.1.2 - Drawer primitive
- `cmdk` ^1.1.1 - Command menu
- `sonner` ^2.0.3 - Toast notifications
- `lucide-react` ^0.563.0 - Icons
- `react-icons` ^5.5.0 - Additional icons
- `recharts` ^2.15.3 - Charts

### Utilities
- `date-fns` ^3.6.0 - Date formatting

### Styling
- `tailwindcss` ^3.4.17
- `autoprefixer` ^10.4.21
- `postcss` ^8.5.3

## Path Aliases

Configured in `tsconfig.json`:
- `@/*` → `./src/*`
- `@/components` → `./src/components`
- `@/utils` → `./src/utils`
- `@/hooks` → `./src/hooks`
- `@/types` → `./src/types`

## CSS Variables

The library uses CSS variables for theming. Define them in `src/styles/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}
```

## Usage Example

```tsx
import { Button } from '@/components/shadcn-ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn-ui/card';
import { InputField } from '@/components/custom-fields/text-field/input-field';
import { DatePickerField } from '@/components/custom-fields/date-picker-field';
import { MetricCardsGrid } from '@/components/dashboard/metric-cards-grid';

export default function Page() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>
          <InputField label="Name" name="name" placeholder="Enter name" />
          <DatePickerField label="Date" onSelect={(date) => console.log(date)} />
        </CardContent>
      </Card>

      <MetricCardsGrid 
        metricCardsItems={[
          { label: 'Revenue', value: '$12,345', color: 'blue' },
          { label: 'Users', value: '1,234', color: 'green' },
        ]} 
      />
    </div>
  );
}
```
