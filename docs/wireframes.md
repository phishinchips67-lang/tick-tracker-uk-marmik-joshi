# UI/UX Wireframes

## 1. Map Page
```text
┌───────────────────────────────────────────────────────────────┐
│ Logo   Map  Learn  Report                          [Skip link]│
├───────────────────────────────────────────────────────────────┤
│ Filters: [From ▾] [To ▾] [Species ▾] [City ▾]  [List|Map]    │
├───────────────────────────────────────┬───────────────────────┤
│                                       │  DETAILS              │
│          MAP (OSM tiles)              │  Southern rodent tick │
│      ● red = recent                   │  Ixodes acuminatus    │
│      ● amber = this season            │  London, 14 Aug 2025  │
│      ● grey = older                   │  [Directions][Share]  │
│                                       │  ── weekly chart ──   │
│           [legend]                    │  ▁▂▅▇▅▃▂              │
└───────────────────────────────────────┴───────────────────────┘

┌─────────────────────────────────────────────┐
│ Report a sighting                           │
│ Date *        [ 2025-08-14 ]                │
│ City *        [ London      ]  ⚠ required   │
│ Species *     [ Southern …  ▾]              │
│ Photo         [ Choose file ] max 5MB       │
│                                             │
│            [ Submit sighting ]              │
│  ✔ Thanks! Your sighting was saved.         │
└─────────────────────────────────────────────┘