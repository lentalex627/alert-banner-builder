# Alert Banner Builder

A Sitecore XM Cloud Marketplace App that provides an interactive custom field integration for content editors to craft alert messages with visual configuration. The output is saved as JSON to a custom field.

## Features

### Core Functionality
- **Custom Field Integration**: Seamlessly integrates with Sitecore XM Cloud as a custom field component
- **Visual Builder**: Intuitive split-pane interface with configuration on the left and live preview on the right
- **Real-time Preview**: See changes instantly as you configure the alert banner
- **JSON Output**: Configuration is saved as structured JSON for easy consumption by frontend applications

### Alert Configuration Options

| Option | Description |
|--------|-------------|
| **Message** | Alert text content (required) |
| **Type/Severity** | Info, Warning, Error, Success - with automatic color presets |
| **Display Options** | Dismissible, Persistent, or Timed auto-dismiss |
| **Icon Selection** | 12 built-in icons from Material Design Icons |
| **Colors** | Custom background and text colors with preset palette |
| **CTA Button** | Optional call-to-action with text, URL, and style options |
| **Position** | Top, Bottom, Fixed (sticky), or Inline |
| **Animation** | Slide down, Slide up, Fade in, Bounce, Shake, or None |

### JSON Output Structure

```json
{
  "message": "Your alert text here",
  "type": "warning",
  "displayOption": "dismissible",
  "dismissible": true,
  "icon": "alert-outline",
  "backgroundColor": "#FFF6E7",
  "textColor": "#7A2F00",
  "cta": {
    "text": "Learn More",
    "url": "/more-info",
    "style": "primary"
  },
  "position": "top",
  "animation": "slide-down"
}
```

## Getting Started

### Prerequisites
- Node.js 16 or later
- npm 10 or later
- Access to Sitecore Cloud Portal
- XM Cloud subscription

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Development

The app runs on `http://localhost:3000` by default. For local development with Sitecore XM Cloud, you'll need to:

1. Register your app in the Sitecore Cloud Portal
2. Configure the custom field extension point (`xmc:pages:customfield`)
3. Set up the appropriate field type in your content templates

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: Sitecore Blok Design System (shadcn/ui + Tailwind CSS)
- **SDK**: Sitecore Marketplace SDK
  - `@sitecore-marketplace-sdk/client` - Core client SDK
  - `@sitecore-marketplace-sdk/xmc` - XM Cloud module
- **Icons**: Material Design Icons (@mdi/js)
- **Styling**: Tailwind CSS v4

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with MarketplaceProvider
│   └── page.tsx             # Main page rendering AlertBannerBuilder
├── components/
│   ├── alert-banner/        # Alert Banner Builder components
│   │   ├── alert-banner-builder.tsx  # Main component
│   │   ├── alert-preview.tsx         # Live preview panel
│   │   ├── configuration-panel.tsx   # Configuration form
│   │   ├── color-picker.tsx          # Color selection component
│   │   └── icon-picker.tsx           # Icon selection component
│   ├── providers/
│   │   └── marketplace.tsx  # SDK initialization provider
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── icon.tsx             # MDI icon component
│   └── utils.ts             # Utility functions
└── types/
    └── alert-banner.ts      # TypeScript types and constants
```

## Marketplace Integration

This app uses the Sitecore Marketplace SDK for:

- **Field Value Management**: `getValue()` and `setValue()` for reading/writing JSON
- **Application Context**: Accessing app metadata and extension points
- **Secure Communication**: PostMessage API with origin validation

### Extension Point

The app is designed for the `xmc:pages:customfield` extension point, allowing it to be used as a custom field type in XM Cloud Pages.

## Customization

### Adding New Icons

Edit `components/alert-banner/icon-picker.tsx` to add new icons:

```typescript
import { mdiNewIcon } from "@mdi/js"

const iconMap: Record<string, string> = {
  // ... existing icons
  "new-icon": mdiNewIcon,
}
```

### Adding Color Presets

Edit `types/alert-banner.ts` to modify the color palette:

```typescript
export const colorPresets = [
  // Add your custom colors
  '#YOUR_COLOR',
  // ...
]
```

## License

This project is part of the Sitecore XM Cloud Marketplace ecosystem.
