---
name: High-Key Clarity
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#434750'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#737781'
  outline-variant: '#c3c6d1'
  surface-tint: '#355f97'
  primary: '#335d94'
  on-primary: '#ffffff'
  primary-container: '#4d76af'
  on-primary-container: '#fefcff'
  inverse-primary: '#a6c8ff'
  secondary: '#516072'
  on-secondary: '#ffffff'
  secondary-container: '#d2e1f7'
  on-secondary-container: '#556477'
  tertiary: '#565d63'
  on-tertiary: '#ffffff'
  tertiary-container: '#6f757c'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a6c8ff'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#18477e'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#dde3eb'
  tertiary-fixed-dim: '#c1c7cf'
  on-tertiary-fixed: '#161c22'
  on-tertiary-fixed-variant: '#41474e'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  ad-clearance: 48px
---

## Brand & Style
The design system is built on the principles of **Stewardship & Growth**, executed through a **High-Key Minimalist** lens. The primary objective is to create a "gallery-like" environment: a pristine, professional canvas where editorial content and financial guidance are delivered with absolute clarity. 

By utilizing an expansive white-space strategy, the UI recedes to the background, ensuring that high-value information and integrated AdSense units become the natural focal points. The aesthetic is breathable, trustworthy, and intentionally "airy," avoiding heavy visual weights that might compete with third-party advertisements or complex data.

## Colors
The palette is shifted toward the top of the value scale to maximize brightness and "breathability." 

- **Primary (Airy Blue):** A desaturated, lighter evolution of traditional navy. It maintains professional authority without the visual "heaviness" of darker tones.
- **Surface & Background:** Backgrounds are strictly pure white (`#FFFFFF`) to ensure maximum contrast for AdSense blocks. Surface containers use an extremely light grey (`#F8FAFC`) to provide just enough distinction for content grouping.
- **Contrast Strategy:** Text uses a deep charcoal rather than pure black to maintain a sophisticated, editorial feel while ensuring AAA accessibility against the high-key background.

## Typography
This design system employs a classic serif-and-sans pairing to evoke the feeling of a high-end financial broadsheet. 

**Source Serif 4** is reserved for headlines and editorial titles, providing a sense of established wisdom and academic rigor. **Source Sans 3** is used for all functional UI elements and body copy, ensuring high legibility and a modern, systematic feel. 

Typography is set with generous line heights to enhance the "airy" feel and prevent text-heavy pages from feeling claustrophobic.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid Grid**. On desktop, content is centered within a 1200px max-width container to prevent line lengths from becoming unreadable.

**Advertisement Readiness:** 
Large vertical gaps (`ad-clearance`) are intentionally placed between major content sections. This "islands of content" approach ensures that AdSense units are surrounded by enough white space to prevent the UI from feeling cluttered, making the ads the most visually dense (and therefore eye-catching) elements on the page.

Margins are wide, and gutters are generous (24px) to maintain the minimalist, high-key aesthetic across all device breakpoints.

## Elevation & Depth
In keeping with the minimalist goal, depth is communicated through **Low-Contrast Outlines** rather than heavy shadows. 

- **Level 0 (Base):** Pure white background.
- **Level 1 (Cards/Containers):** A 1px border using `tertiary_color` (`#E2E8F0`) with no shadow. 
- **Interactive States:** On hover, a very subtle, highly diffused shadow (0px 4px 20px rgba(0,0,0,0.04)) may be used to indicate lift without breaking the flat, airy aesthetic.

This lack of artificial depth ensures that the visual "pop" is reserved for the content and the advertisements.

## Shapes
The design system uses **Soft** geometry. A standard radius of `0.25rem` (4px) is applied to buttons, input fields, and containers. This slight rounding takes the "edge" off the professional aesthetic, making the platform feel approachable and modern, while remaining structured and serious enough for financial content.

## Components
- **Buttons:** Primary buttons use the Airy Blue background with white text. Ghost buttons use a 1px border of the same blue. Padding is generous to increase the "breathable" footprint.
- **Input Fields:** Minimalist styling with a 1px `tertiary` border. The label sits above the field in a bold `label-md` style for clear scanning.
- **Cards:** Used sparingly. Cards feature a white background, a subtle grey border, and ample internal padding (32px) to ensure content within the card feels prestigious.
- **Ad Placeholders:** Explicitly defined containers with "Advertisement" labels in small, light-grey `label-sm` text, ensuring the layout remains structured even before the ad script loads.
- **Lists:** Clean, borderless rows with subtle dividers (`#F1F5F9`) to separate items without creating visual noise.