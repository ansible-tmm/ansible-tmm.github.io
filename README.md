# Ansible TMM Project Hub

The main landing page for Ansible Technical Marketing demos, workshops, games, solution guides, and utilities.

**Live site:** [https://ansible-tmm.github.io/](https://ansible-tmm.github.io/)

## Local preview

This is a static site with no build step. Serve the repository root with any local HTTP server:

```bash
# Python 3
python3 -m http.server 8000

# Or with Node (if npx is available)
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Deployment

The site deploys automatically to GitHub Pages when changes are pushed to the `main` branch via the workflow in `.github/workflows/deploy-pages.yml`.

To enable GitHub Pages for this repository:

1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**

## Project structure

```
.
├── index.html          # Main landing page
├── 404.html            # Custom not-found page
├── css/
│   └── styles.css      # All styles
└── js/
    ├── projects.js     # Project catalog (edit this to add projects)
    └── main.js         # Rendering and UI behavior
```

## Adding a project

Edit `js/projects.js` and add an entry to the `PROJECTS` array:

```javascript
{
  name: 'My New Project',
  description: 'A short, useful description of what this project does.',
  category: 'Product Demos',          // Must match a category in CATEGORIES
  url: 'https://example.com/my-project/',
  github: 'https://github.com/ansible-tmm/my-project',  // optional
  icon: 'demo',                       // see icon IDs in index.html <symbol> elements
  featured: false,                    // set true to highlight in the featured section
},
```

If you add a new category, also add it to the `CATEGORIES` array with a unique `id` for navigation anchors.

Available icon identifiers: `slides`, `lab`, `guide`, `demo`, `orchestrator`, `stage`, `security`, `racing`, `quest`.

To add a new icon, define a `<symbol>` in the SVG defs block at the bottom of `index.html` and reference it by ID in your project entry.

## License

Community and technical marketing resources. See individual project repositories for licensing details.
