# Design System Specification: The Architectural Editor

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Architectural Editor."** 

Unlike standard developer tools that rely on cluttered grids and rigid borders, this system treats code and pull-request data as high-end editorial content. We prioritize clarity, intentional whitespace, and a "production-ready" gravitas. By moving away from generic UI patterns and embracing tonal depth, we create an environment that feels as stable as a terminal but as refined as a prestige technical journal. The goal is to reduce cognitive load by using "implied structure" rather than visual noise.

## 2. Color Theory & Tonal Geometry
This system rejects the "boxed-in" look. We use a sophisticated palette of greens and grays to create hierarchy through luminance rather than lines.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for primary sectioning. Structure must be defined through background color shifts. Use `surface_container_low` to define a section against a `surface` background. The eye should follow the change in tone, not a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use a "Nested Depth" approach:
- **Base Layer:** `surface` (#f8faf9) for the primary application canvas.
- **Sectioning:** `surface_container_low` (#f0f4f3) for sidebars or secondary regions.
- **Actionable Cards:** `surface_container_lowest` (#ffffff) to provide the highest contrast for interactive content.
- **Interactive Depth:** When an element is hovered, shift it to `surface_container_high` (#e1eae9) to provide immediate, tactile feedback.

### Signature Textures & The "Glass" Exception
While we avoid "flashy" polish, we use **Functional Glassmorphism** for floating elements (modals, tooltips). Use `surface_container_lowest` at 85% opacity with a `20px` backdrop-blur. This ensures the developer never loses context of the code beneath the overlay.

## 3. Typography: Editorial Authority
We utilize **Inter** not as a default system font, but as a precision instrument. The hierarchy is designed to make "Metadata" feel as important as "Headings" through deliberate scaling.

*   **Display & Headlines:** Use `headline-sm` (1.5rem) for major page titles. Keep tracking tight (-0.02em) to maintain a dense, "serious" feel.
*   **The Technical Body:** `body-md` (0.875rem) is our workhorse. It is optimized for readability in long-form PR descriptions.
*   **The Metadata Layer:** `label-md` and `label-sm` use `on_surface_variant` (#576160). This "faded" look is intentional—it recedes until needed, allowing the primary content to breathe.

## 4. Elevation & Depth
We convey importance through **Tonal Layering** rather than traditional structural lines or heavy shadows.

*   **The Layering Principle:** To lift a card, do not reach for a shadow first. Instead, place a `surface_container_lowest` card on a `surface_container_low` background. The delta in hex value creates a "Soft Lift."
*   **Ambient Shadows:** If a floating state (like a dropdown) requires a shadow, use a "Cloud Shadow": 
    *   `X: 0, Y: 12, Blur: 32, Spread: -4`
    *   Color: `on_surface` (#2a3434) at **4% opacity**.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a border, use the `outline_variant` token at **20% opacity**. This creates a "Ghost Border"—a suggestion of a boundary that doesn't break the editorial flow.

## 5. Component Guidelines

### Buttons: The Precision Trigger
*   **Primary:** `primary` (#006e2d) background with `on_primary` text. Use `radius-md` (0.375rem). No gradients. The interaction should be a simple color shift to `primary_dim`.
*   **Secondary:** `secondary_container` background. This provides a "button-like" feel without the visual weight of the primary green.
*   **Tertiary:** Text-only using `primary`. No background or border until hover.

### Inputs & Fields
*   **Container:** Use `surface_container_lowest` with a "Ghost Border" (outline_variant @ 20%). 
*   **Focus State:** Shift the border to `primary` (#006e2d) at 100% opacity. No "glow" effects—just a sharp, 1px change in intent.

### Lists & Activity Feeds
*   **The Divider Ban:** Strictly forbid `<hr>` or border-bottom lines between list items. 
*   **Separation:** Use `8px` or `16px` of vertical whitespace (from the Spacing Scale). Use a subtle hover state (`surface_container_low`) to define the hit area of a list item.

### Chips & Tags
*   **Technical Metadata:** Use `tertiary_container` with `on_tertiary_container` text. Keep these small (`label-sm`) and squared off with `radius-sm` (0.125rem) to mimic the look of a terminal tag.

## 6. Do’s and Don’ts

### Do
*   **DO** use whitespace as a functional element. If two sections feel cluttered, increase the gap before adding a line.
*   **DO** use `primary` green sparingly. It is a "Success" and "Action" signal, not a decorative element.
*   **DO** ensure all micro-interactions are sub-150ms. Transitions should feel "snappy" and "mechanical," not "organic" or "bouncy."

### Don’t
*   **DON’T** use pure black (#000000) for text. Always use `on_surface` (#2a3434) to maintain the soft, sophisticated gray-green tone of the system.
*   **DON’T** use generic 8px or 12px blur shadows. They look "uncalculated." Follow the Ambient Shadow spec.
*   **DON’T** use synthetic polish like inner-glows or drop-shadows on buttons. We are building a tool, not a toy.