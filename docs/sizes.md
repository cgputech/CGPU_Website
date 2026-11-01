# sizes.md — Sizing & Spacing Rules

Single source of truth for all sizes. Use tokens only. Never hard-code values. MUST / MUST NOT are strict.

---

## 1. Global Rules

1. Base unit is 4px. Every spacing, size, and radius value is a multiple of 4px.
2. Use `rem` for sizes and spacing (1rem = 16px). Never use `px` for font-size.
3. Line-height is always unitless.
4. Use `min-height`, never fixed `height`, on anything containing text.
5. Space inside a group MUST be smaller than space between groups.
6. Hover, focus, active, and error states MUST NOT change an element's outer size.
7. No horizontal scroll at 320px width.
8. If a needed value is missing, use the nearest token and mention it in your reply.

---

## 2. Tokens

```css
:root {
  /* Spacing (token number = px / 4) */
  --space-1: 0.25rem;  /*  4 */
  --space-2: 0.5rem;   /*  8 */
  --space-3: 0.75rem;  /* 12 */
  --space-4: 1rem;     /* 16 */
  --space-5: 1.25rem;  /* 20 */
  --space-6: 1.5rem;   /* 24 */
  --space-8: 2rem;     /* 32 */
  --space-10: 2.5rem;  /* 40 */
  --space-12: 3rem;    /* 48 */
  --space-16: 4rem;    /* 64 */
  --space-24: 6rem;    /* 96 */

  /* Control heights */
  --control-sm: 2rem;      /* 32 */
  --control-md: 2.5rem;    /* 40 default */
  --control-lg: 3rem;      /* 48 */
  --target-min: 1.5rem;    /* 24 absolute floor */
  --target-touch: 2.75rem; /* 44 touch default */

  /* Borders */
  --border-1: 1px;  /* default */
  --border-2: 2px;  /* state / emphasis */
  --border-4: 4px;  /* decorative accent only */

  /* Focus ring */
  --focus-width: 2px;
  --focus-offset: 2px;

  /* Radius */
  --radius-xs: 0.25rem;  /*  4 */
  --radius-sm: 0.375rem; /*  6 */
  --radius-md: 0.5rem;   /*  8 default */
  --radius-lg: 0.75rem;  /* 12 cards */
  --radius-xl: 1rem;     /* 16 modals */
  --radius-full: 9999px;

  /* Icons */
  --icon-sm: 1rem;     /* 16 */
  --icon-md: 1.25rem;  /* 20 */
  --icon-lg: 1.5rem;   /* 24 default */

  /* Type */
  --text-xs: 0.75rem;   /* 12 minimum */
  --text-sm: 0.875rem;  /* 14 */
  --text-base: 1rem;    /* 16 */
  --text-lg: 1.125rem;  /* 18 */
  --text-xl: 1.25rem;   /* 20 */
  --text-2xl: 1.5rem;   /* 24 */
  --text-3xl: 1.875rem; /* 30 */
  --text-4xl: 2.25rem;  /* 36 */
  --text-5xl: 3rem;     /* 48 */
  --leading-tight: 1.2;
  --leading-snug: 1.35;
  --leading-normal: 1.5;

  /* Layout */
  --page-margin: var(--space-4);
  --container-max: 75rem; /* 1200 */
  --measure: 65ch;
}

@media (min-width: 600px) { :root { --page-margin: var(--space-6); } }
@media (min-width: 840px) { :root { --page-margin: var(--space-8); } }

@media (pointer: coarse) {
  :root {
    --control-sm: var(--target-touch);
    --control-md: var(--target-touch);
  }
}
```

---

## 3. Spacing Usage

| Token | px | Use for |
|---|---|---|
| space-1 | 4 | label↔hint, tight icon text, badge padding |
| space-2 | 8 | icon↔label gap, label↔input, minimum gap between adjacent targets |
| space-3 | 12 | button group gap, compact card padding, small button padding-x |
| space-4 | 16 | default control padding-x, default stack gap, default card padding, mobile page margin |
| space-6 | 24 | gap between form fields, large card padding, tablet page margin |
| space-8 | 32 | gap between content groups, desktop page margin |
| space-12 | 48 | gap between sub-sections |
| space-16 | 64 | section gap (mobile) |
| space-24 | 96 | section gap (desktop), hero padding |

Rules:
- MUST NOT use off-scale values (5, 10, 14, 18px, etc.).
- Prefer `gap` on flex/grid parents over sibling margins.
- MUST NOT remove paragraph margins.

---

## 4. Buttons

| Property | sm | md (default) | lg |
|---|---|---|---|
| min-height | 32px | 40px | 48px |
| padding-x | 12px | 16px | 24px |
| padding-y | 4px | 8px | 12px |
| font-size | 14px | 16px | 16px |
| font-weight | 500 | 500 | 500 |
| icon size | 16px | 20px | 24px |
| icon↔label gap | 8px | 8px | 8px |
| radius | 8px | 8px | 8px |
| border (outline style) | 1px | 1px | 1px |

Rules:
- Touch hit area MUST be ≥ 44×44px. Never below 24×24px on any device.
- Icon-only buttons: square, icon 20–24px, hit area ≥ 44×44px (add padding, do not enlarge the icon).
- Text buttons: `min-width: 4rem` (64px).
- Gap between adjacent buttons: 12px (never below 8px).
- Primary submit buttons are `width: 100%` below 600px.
- Use `lg` only for hero CTAs and mobile primary actions. Use `sm` only in dense tables and toolbars.
- One primary button per view region.

```css
.btn {
  min-height: var(--control-md);
  padding: var(--space-2) var(--space-4);
  gap: var(--space-2);
  border: var(--border-1) solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 500;
  line-height: var(--leading-snug);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn--sm { min-height: var(--control-sm); padding-inline: var(--space-3); font-size: var(--text-sm); }
.btn--lg { min-height: var(--control-lg); padding-inline: var(--space-6); }
.btn--icon { width: var(--control-md); padding: 0; }
```

---

## 5. Form Controls

### Input / Select

| Property | sm | md (default) | lg |
|---|---|---|---|
| min-height | 32px | 40px | 48px |
| padding-x | 8px | 12px | 16px |
| padding-y | 4px | 8px | 12px |
| font-size | 14px | 16px | 16px |
| border | 1px | 1px | 1px |
| radius | 6px | 8px | 8px |

Rules:
- Input font-size MUST be ≥ 16px on mobile.
- Input and button in the same row MUST use the same size step.
- Input border contrast against background MUST be ≥ 3:1.
- Error state: border becomes 2px (via `box-shadow`, not `border-width`) AND an error message is shown. Color alone is not enough.

### Textarea

| Property | Value |
|---|---|
| min-height | 96px |
| padding | 12px |
| font-size / line-height | 16px / 1.5 |
| border / radius | 1px / 8px |
| resize | vertical only |

### Label, Hint, Error

| Element | Size | Spacing |
|---|---|---|
| Label | 14px, weight 500 | 8px above input |
| Hint | 14px, secondary color | 4px below label |
| Error message | 14px, weight 500, with 16px icon | 4–8px below input |
| Field-to-field gap | | 24px |
| Fieldset / group gap | | 32–48px |

Rules:
- Every input MUST have a visible `<label>` above it. Placeholder is NOT a label.
- Mark the minority case only ("Optional").

### Checkbox / Radio / Switch

| Property | Value |
|---|---|
| Box size | 20px |
| Border | 2px |
| Row min-height | 44px touch / 32px pointer |
| Gap box↔label | 12px |
| Gap between options | 8px |
| Switch | 44×24px track, 20px thumb |
| Hit area | entire row including label |

### Field widths

Match width to content: short code 10–12ch, phone/date 20ch, name/email full column. Do not stretch short inputs.

```css
.form  { display: grid; gap: var(--space-6); }
.field { display: grid; gap: var(--space-2); }
.label { font-size: var(--text-sm); font-weight: 500; line-height: 1.25; }
.input, .select {
  min-height: var(--control-md);
  padding: var(--space-2) var(--space-3);
  border: var(--border-1) solid var(--color-border-input);
  border-radius: var(--radius-md);
  font-size: max(1rem, var(--text-base));
  line-height: var(--leading-normal);
}
.textarea { min-height: 6rem; padding: var(--space-3); resize: vertical; }
.input[aria-invalid="true"] { border-color: var(--color-error); box-shadow: 0 0 0 1px var(--color-error) inset; }
```

---

## 6. Typography

| Role | Size | Line-height | Weight |
|---|---|---|---|
| Body | 16px | 1.5 | 400 |
| Body small | 14px | 1.5 | 400 |
| Caption | 12px (minimum) | 1.4 | 400 |
| UI label | 14px | 1.25–1.4 | 500 |
| H4 | 20px | 1.3 | 600 |
| H3 | 24px | 1.3 | 600 |
| H2 | 30–36px | 1.2 | 600–700 |
| H1 | 36–48px (`clamp()` on mobile) | 1.15–1.2 | 700 |

Rules:
- Body line-height MUST be ≥ 1.5.
- Line length: 45–75ch, hard cap 80ch. Body uses `max-width: var(--measure)`.
- Paragraph spacing: `margin-block-end: 1em`.
- Do not hard-code letter-spacing or word-spacing.
- Text under 12px is forbidden.

---

## 7. Borders, Focus, Radius

### Border thickness

| Use | Thickness |
|---|---|
| Dividers, card edges, table rows, default input / outline button | 1px |
| Selected state, checkbox/radio, error input, emphasis | 2px |
| Decorative left-rule / callout | 4px (maximum) |

### Focus ring

- Every focusable element MUST show a visible focus indicator. Never `outline: none` without a replacement.
- Ring: 2px thick, 2px offset, ≥ 3:1 contrast.
- Use `:focus-visible`, not `:focus`.
- Sticky headers MUST NOT cover focused elements: set `scroll-padding-top` to header height + 16px.

```css
:focus-visible { outline: var(--focus-width) solid var(--color-focus); outline-offset: var(--focus-offset); }
html { scroll-padding-top: calc(var(--header-height, 4rem) + var(--space-4)); }
```

### Radius

| Element | Radius |
|---|---|
| Tags, dense inputs | 4px |
| Buttons, inputs (default) | 8px |
| Cards | 12px |
| Modals | 16px |
| Pills, avatars | full |

- Nested radius = outer radius − padding.
- Do not mix sharp and rounded corners on one screen.

---

## 8. Cards, Panels, Overlays

| Element | Padding | Inner gap | Radius |
|---|---|---|---|
| Compact card / list row | 12px | 8px | 8px |
| Default card | 16px | 12–16px | 12px |
| Large card | 24px | 16–24px | 12–16px |
| Modal | 24px (16px mobile) | 16px | 16px |
| Popover / menu | 8px (item: 8×12px, min-height 40px; 44px touch) | 0–4px | 8px |
| Toast | 12×16px | 8px | 8px |
| Tooltip | 4×8px | | 4–6px |

- Modal max-width: 480px (forms), 640px (content). Full-screen below 600px.
- Gap between cards: 16px mobile / 24px desktop.

---

## 9. Navigation, Lists, Tables

| Element | Size |
|---|---|
| App bar | 56px mobile / 64px desktop |
| Nav link | min-height 44px touch / 40px pointer; padding-x 12–16px; gap 8px minimum |
| Tabs | min-height 48px; padding-x 16px |
| Sidebar | 240–280px (collapsed 64–72px) |
| List item | min-height 48px (one line) / 64–72px (two lines) |
| Table row | 40px dense / 48px default / 56px comfortable |
| Table cell padding | 8–12px vertical, 12–16px horizontal |
| Avatar | 24 / 32 / 40 / 48 / 64px |
| Badge | height 24px, padding-x 8px |
| Chip | height 32px, padding-x 12px |
| Footer / breadcrumb links | min hit area 24px, prefer 32px+ |

---

## 10. Layout

| Window | Width | Columns | Page margin | Gutter |
|---|---|---|---|---|
| Compact | < 600px | 4 | 16px | 16px |
| Medium | 600–839px | 8 | 24px | 16–24px |
| Expanded | 840–1199px | 12 | 32px | 24px |
| Large | ≥ 1200px | 12 | auto, centered | 24–32px |

- Container max-width: 1200px, centered.
- Reading column: `max-width: 65ch`.
- Section vertical spacing: 64px mobile / 96px desktop.
- Header → first content: 32–48px.

```css
.container { width: min(100% - 2 * var(--page-margin), var(--container-max)); margin-inline: auto; }
.prose     { max-width: var(--measure); }
.section   { padding-block: clamp(var(--space-16), 3rem + 4vw, var(--space-24)); }
```

---

## 11. Icons & Images

- Icon sizes: 16 / 20 / 24px (default 24px).
- Icon-only controls: hit area ≥ 44×44px, plus `aria-label`.
- Icon + text gap: 8px. Icon size matches text line-height.
- Images: `max-width: 100%; height: auto;` and always set `width`/`height` attributes.
- Image radius matches nearest container (8–12px).

---

## 12. Decision Procedure

1. Identify the element type.
2. Choose the size step: default `md`; `lg` for hero/mobile primary; `sm` for dense UI.
3. Take all values from tokens in §2.
4. Verify hit area ≥ 44×44px on touch, never < 24×24px.
5. Verify inner spacing < outer spacing.
6. Verify text containers use `min-height` and can grow.
7. Verify no state changes outer size.
8. Verify layout at 320, 600, 840, and 1200px.

Priority when rules conflict:
1. Accessibility minimums (24px target floor, 1.5 line-height, 3:1 contrast, focus ring).
2. 44px touch targets.
3. This file's tokens.
4. Framework defaults (lowest).

---

## 13. Pre-Merge Checklist

- [ ] All spacing uses scale tokens.
- [ ] Buttons, inputs, selects match heights per size step.
- [ ] Touch targets ≥ 44×44px; nothing < 24×24px.
- [ ] Adjacent targets ≥ 8px apart.
- [ ] Input and body text ≥ 16px; nothing < 12px.
- [ ] Body line-height ≥ 1.5; line length ≤ 80ch.
- [ ] Every input has a visible label; errors include text.
- [ ] Borders 1px default, 2px for state; input border contrast ≥ 3:1.
- [ ] Focus ring visible: 2px, 2px offset, ≥ 3:1 contrast.
- [ ] No fixed `height` on text elements.
- [ ] No layout shift on hover, focus, or error.
- [ ] No horizontal scroll at 320px.