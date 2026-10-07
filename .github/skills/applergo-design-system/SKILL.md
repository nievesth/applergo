# Applergo Design System

## Purpose

This skill defines the approved visual and UX direction for the Applergo 2026 product modernization. It exists to guide future frontend implementation work so the product remains consistent, calm, trustworthy, and functionality-first.

Use this as a design reference for UI implementation decisions. It is intentionally a product guidance file, not an architectural specification.

## Product character

Applergo is a modern application for people who are conscious about what they eat and need clear information about allergens, intolerances, products and safe places to eat.

The product should feel:

- minimal
- natural
- warm
- clean
- calm
- contemporary
- trustworthy
- adult
- friendly without being playful
- strongly functionality-first

## Core UX principle

Users primarily open Applergo to make a decision:

- Can I eat this?
- Where can I eat?
- Is this compatible with my profile?

Reduce the number of interactions required to answer those questions.

Information comes before decoration.

The UI should help users answer these questions as quickly and clearly as possible, with the least friction.

## Visual direction

### Overall aesthetic

Use:

- warm off-white / cream backgrounds
- deep natural greens
- soft greens
- restrained earth tones
- charcoal text
- generous whitespace
- subtle borders
- restrained shadows
- medium corner radii
- simple line iconography
- strong information hierarchy
- large accessible touch targets

Avoid:

- decorative animations
- excessive illustration
- childish allergy-app aesthetics
- excessive gradients
- glassmorphism
- visual clutter
- unnecessary UI decoration
- oversized rounded cards everywhere
- turning every section into a card

### Initial color tokens

These are the initial design tokens and may evolve as the design system matures.

```css
--color-primary: #2E7D32;
--color-primary-dark: #1F4D36;
--color-green-soft: #A7C957;
--color-earth: #D9C9A9;
--color-background: #FAF8F3;
--color-surface: #FFFFFF;
--color-text: #2B2B2B;
```

### Semantic usage guidance

- Use `--color-primary` for primary actions, emphasis, and key decision states
- Use `--color-primary-dark` for deeper contrast and stronger text/density relationships
- Use `--color-green-soft` for supportive highlights, tags, and mild positive states
- Use `--color-earth` for warmth, neutral surfaces, and quiet background separation
- Use `--color-background` as the base app background
- Use `--color-surface` for elevated panels, cards, and form surfaces when needed
- Use `--color-text` for readable body text and core labels

### Typography direction

- modern sans-serif
- Inter or equivalent
- excellent readability
- clear hierarchy
- avoid decorative fonts

Type should support quick scanning and decision-making. UI text must remain clear, calm, and unambiguous.

## Brand

Product name:

- applergo

Prefer lowercase visual presentation.

The legacy Applergic academy logo must NOT be reused.

New brand direction:

- abstract
- minimal
- organic
- recognizable at small sizes
- suitable for an app icon
- inspired by nature, conscious eating and safe choices

Avoid:

- medical crosses
- generic plate/fork logos
- copying existing leaf logos
- decorative branding that competes with functionality

Until the final logo exists, temporary brand marks must remain isolated and easily replaceable.

Any temporary mark used during implementation should be treated as a placeholder, not a final brand statement.

## Accessibility and safety

Never communicate allergen or food-safety information using color alone.

Future compatibility states should support:

- Compatible
- Caution
- Not compatible
- Unknown / insufficient information

Use text + iconography + color reinforcement.

This is critical for trust, safety, and accessibility.

## Design anti-patterns

Avoid:

- decorative animations
- excessive illustration
- childish allergy-app aesthetics
- excessive gradients
- glassmorphism
- visual clutter
- unnecessary UI decoration
- oversized rounded cards everywhere
- turning every section into a card

The product should read as calm, useful, and credible, not decorative or gimmicky.

## Layout

### Mobile-first

Design for mobile first. The interface must remain easy to read and act on on small screens.

### Desktop balance

The interface must also remain visually balanced on desktop because Applergo is a portfolio project.

Use spacing, layout rhythm, and clear hierarchy to keep balance without over-designing the experience.

## Future product areas

The design system should be able to support:

- food/product/place search
- barcode scanning
- nearby places and maps
- allergen/intolerance profiles
- compatibility results
- restaurant/place details
- product details
- favorites

Do not implement these features as part of creating this Skill.

This skill should guide implementation without defining unnecessary architecture.

## Implementation guidance for future agents

When building screens, prioritize:

1. Clarity of the user decision
2. Minimal interaction count
3. Strong hierarchy
4. Trustworthy information presentation
5. Calm, natural visual tone
6. Mobile-first usability with desktop balance

Favor simple surfaces, clear labels, readable copy, and strong information grouping over decorative styling.

## Usage notes

This skill should be invoked when:

- creating or revising a UI screen
- defining a reusable component or pattern
- choosing colors, spacing, typography, or icon treatment
- designing product flows for search, scan, profile, compatibility, or place detail experiences
- verifying that a screen aligns with the Applergo design direction

Use it as a product-consistency reference, not as a replacement for acceptance criteria or user needs.

## Success criteria for future screen design

A screen should feel aligned with Applergo when it is:

- easy to scan quickly
- visually quiet and calm
- trust-building and adult in tone
- focused on decision support
- readable at small sizes
- compatible with mobile interaction patterns
- not visually overloaded or playful in a way that undermines safety

## Non-goals

This skill does not define:

- backend structure
- app architecture
- state management patterns
- router architecture
- feature implementation details
- API contracts

Those should be handled separately when a UX implementation requires them.
