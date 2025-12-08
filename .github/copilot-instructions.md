# E&M 2021 Calculator - Copilot Instructions

## Project Overview

This is an open-source **Evaluation and Management (E&M) 2021 Calculator** - an interactive web-based tool for medical coding of office visits based on the 2021 CMS guidelines under the "Patients over Paperwork" initiative.

**Live Demo:** https://mieweb.github.io/em2021/outpatient.html

## Purpose

The calculator helps healthcare providers determine the appropriate E&M level (2-5) for outpatient office visits by evaluating three key components:
1. **Number and Complexity of Problems Addressed** - Types of medical conditions (self-limited, chronic, acute, etc.)
2. **Risk** - Morbidity risk from diagnostic testing or treatment (minimal, low, moderate, high)
3. **Data** - Tests, documents, independent historians, and interpretations reviewed

The overall E&M level is determined by taking the **median** of the three component levels.

## Technology Stack

- **Frontend:** Single-page HTML with embedded JavaScript
- **CSS Framework:** Bootstrap 5.1.0 (CDN)
- **JavaScript Libraries:** jQuery 3.5.1 (CDN)
- **Dev Server:** Vite for local development
- **Hosting:** GitHub Pages

## Development

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
em2021/
├── outpatient.html      # Main calculator application
├── index.html           # Entry point (redirects to outpatient.html)
├── vite.config.js       # Vite configuration
├── package.json         # NPM dependencies and scripts
├── README.md            # Project documentation
├── LICENSE              # MIT License
├── logos/               # Organization logos
│   ├── mie.png
│   ├── webchart.png
│   └── em.png
└── legacy/              # Historical 1995/1997 E&M documentation
    └── README.md
```

## Code Patterns & Conventions

### HTML Structure
- Uses Bootstrap accordion components for collapsible sections
- Each assessment category (Problems, Risk, Data) is a separate accordion item
- Radio buttons for level selection (2-5)
- Checkboxes for individual criteria within each category

### JavaScript Functions
- `select_level(name)` - Calculates max level from checked items and updates radio buttons
- `get_level(name)` - Gets the level value from a specific checkbox group
- `one_per_row(id, name)` - Enforces mutual exclusivity within row selections
- `category_level()` - Complex logic for Data section category calculations
- `clear_section(class_name)` - Clears all inputs in a section
- `clear_form()` - Resets the entire form
- `overall_level()` - Calculates final E&M level as median of three components

### CSS Classes
- `.cat_1_text`, `.cat_2_text`, `.cat_3_text` - Color-coded category labels
- `.red_word` - Emphasis for important numbers
- `.h2-label` - Right-aligned level labels

## When Making Changes

1. **Maintain Bootstrap 5 compatibility** - The UI relies on Bootstrap's accordion and grid system
2. **Preserve the median calculation logic** - The overall level must be the middle value of the three component levels
3. **Keep CDN dependencies** - jQuery and Bootstrap are loaded from CDNs for simplicity
4. **Test all three sections** - Changes to calculation logic should be verified across Problems, Risk, and Data sections
5. **Mobile responsiveness** - The Bootstrap grid should maintain usability on various screen sizes

## Medical Coding Context

This tool implements the 2021 E&M guidelines that replaced the complex 1995/1997 documentation requirements. Key resources:
- CMS Physician Fee Schedule: https://www.cms.gov/Medicare/Medicare-Fee-for-Service-Payment/PhysicianFeeSched/Evaluation-and-Management-Visits
- AMA E&M Code Changes: https://www.ama-assn.org/practice-management/cpt/what-physicians-need-know-about-em-code-changes-coming-jan-1

## Credits

- Developed by [MIE](https://www.mieweb.com/) for [WebChart](https://webchartnow.com)
- Guidance from [E&M Consulting](https://eandmconsulting.com/)
- Licensed under MIT License
