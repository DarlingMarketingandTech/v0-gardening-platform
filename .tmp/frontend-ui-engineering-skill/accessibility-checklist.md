# Accessibility checklist (quick, practical)

## Keyboard
- Tab reaches every interactive element.
- Focus order matches visual order.
- Escape closes dialogs/menus (if applicable).
- No keyboard traps (unless intentional and correct, e.g. modal focus trap).

## Semantics
- Use real headings (h1 once per page; no skipped levels).
- Use button for actions, a for navigation.
- Lists/tables use proper semantics (ul/ol, table when truly tabular).

## Labels
- Every form control has a label (label htmlFor preferred).
- Icon-only buttons have aria-label.

## States
- Error messages are programmatically associated with inputs when possible.
- Loading states use aria-busy or meaningful status text where appropriate.
- Empty states explain what is missing and how to proceed.

## Color + contrast
- Don’t rely on color alone to indicate success/error.
- Ensure readable contrast for body text and small UI labels.

## Motion
- Avoid excessive animation; respect reduced motion if the app supports it.
