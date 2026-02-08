# Shivashray Typography System

Luxury editorial typography for a sacred boutique hotel platform. Two families only: **Cormorant Garamond** (headings) and **Inter** (body & UI).

## Font pairing

| Role | Family | Weights | Use |
|------|--------|--------|-----|
| Headings | Cormorant Garamond | 300, 400 | Hero, section titles, card titles |
| Body & UI | Inter | 400, 500 | Body copy, nav, buttons, forms, labels |

No decorative or third fonts. Contrast via serif vs sans, not weight.

## Hierarchy

| Level | Class / CSS | Family | Weight | Size (mobile → desktop) | Line-height | Tracking |
|-------|-------------|--------|--------|--------------------------|-------------|----------|
| Hero | `.typo-hero` | Serif | 300 | 48px → 56px → 72px | 1.1 | -0.02em |
| H1 (section) | `.typo-h1` | Serif | 400 | 32px → 36px → 40px | 1.2 | -0.01em |
| H2 (subsection) | `.typo-h2` | Sans | 500 | 20px → 22px | 1.375 | — |
| Body | default / `.typo-body-lg` | Sans | 400 | 16px / 18px | 1.75–1.85 | — |
| Nav | `.typo-nav` | Sans | 500 | 15px | — | 0.02em |
| Buttons | `.typo-btn` | Sans | 500 | 16px | — | 0.03em |
| Labels / captions | `.typo-caption` | Sans | 400 | 14px | — | 0.02em |
| Small labels | — | Sans | 400 | 12px | — | optional |

## Usage by area

- **Navbar:** `.typo-nav` or `font-sans text-[15px] font-medium` + slight letter-spacing.
- **Hero:** `.typo-hero` + `.font-serif` (or `style={{ fontFamily: 'var(--font-serif)' }}`). Serif, light.
- **Section titles:** `.typo-h1` or serif 400 at `--text-h1` scale.
- **Cards:** Title = serif 400; body = default sans. No bold.
- **Forms:** Labels = `.typo-caption`; inputs and primary button = default sans or `.typo-btn`.
- **Footer:** Same as body; links can use medium weight.

## Rules

- **Weights:** No heavy bold. Prefer serif/sans and hierarchy over Black/ExtraBold.
- **Spacing:** 8pt grid; generous vertical space (32–64px between sections).
- **Letter-spacing:** Slight negative on large serif headlines; slight positive (0.2–0.4px) on UI.
- **Colors:** Light: primary `slate-900`, secondary `slate-500`, hints `slate-400`. Dark: primary `slate-100`, secondary `slate-400`. Gold `#D4AF37` for accent only.
- **Accessibility:** Maintain contrast (WCAG AA). Avoid pure white (#FFF) in dark mode; use slate-100.

## Responsive scaling

- Hero and H1 use responsive variables: `--text-hero`, `--text-hero-md`, `--text-hero-lg` (and `--text-h1*`).
- Body, nav, and UI sizes stay consistent across breakpoints.
- Line-height and tracking are defined in `globals.css` (`--leading-*`, `--tracking-*`).

## CSS variables (globals.css)

- **Families:** `--font-serif`, `--font-sans`, `--font-playfair-display` (alias to serif for backward compat).
- **Scale:** `--text-hero`, `--text-h1`, `--text-h2`, `--text-body`, `--text-body-lg`, `--text-nav`, `--text-caption`, `--text-small`.
- **Rhythm:** `--leading-hero`, `--leading-tight`, `--leading-body`, `--leading-relaxed`; `--tracking-hero`, `--tracking-ui`.

Existing components that use `var(--font-playfair-display)` automatically use Cormorant Garamond via the alias.
