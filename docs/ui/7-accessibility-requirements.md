# 7. Accessibility Requirements

*   **Compliance Target:** The goal is to comply with **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA**.

## Key Requirements

### Visual

*   **Color Contrast:** All text must have a minimum contrast ratio of **4.5:1** against its background.
*   **Focus Indicators:** All interactive elements (links, buttons, input fields) must have a clear and visible focus indicator when navigated by keyboard. Shadcn-ui provides this by default.

### Interaction

*   **Keyboard Navigation:** All functionality must be accessible and operable using only a keyboard. The navigation order must be logical and intuitive.
*   **Screen Reader Support:** Use ARIA (Accessible Rich Internet Applications) attributes as needed to provide context for screen reader users, especially for dynamic components.

### Content

*   **Semantic HTML:** Use semantic HTML tags correctly (e.g., `<nav>` for navigation, `<main>` for main content, `<h1>`-`<h6>` for headings) to create a logical page structure.
*   **Form Labels:** All form input fields must be associated with a clear `<label>` tag.
*   **Alternative Text:** All meaningful images must have a descriptive `alt` attribute.

## Testing Strategy

*   Manual testing by navigating with only a keyboard.
*   Use automated tools like Lighthouse and axe DevTools to scan for common issues.
*   Test with BrowserTools MCP screen reader.
