# Cedar & Grace

Cedar & Grace is a small, responsive country-boutique storefront with a gentle, faith-rooted point of view. Browse a thoughtfully presented collection, search and filter products, manage a persistent shopping cart, and edit a sample shipping profile.

## Features

- Ten Western wardrobe and accessory products, including belts, boots, denim, hats, and modest styles
- Search, category filtering, and ascending or descending price sorting
- Persistent cart with quantity controls, item removal, clear-cart confirmation, and accurate totals
- Editable sample profile with browser validation, save, and cancel actions
- Shared navigation and cart count on all three pages
- Responsive layouts, keyboard-accessible controls, visible focus states, and helpful empty states
- Demo checkout only; no payment or authentication is collected

## Technology

The app uses semantic HTML, CSS, and vanilla JavaScript. This keeps the project easy to run and understand without a build system, framework, database, or package installation.

## Project structure

```text
.
├── index.html
├── profile.html
├── cart.html
├── css/
│   └── styles.css
└── js/
    ├── products.js
    ├── storage.js
    ├── shared.js
    ├── home.js
    ├── profile.js
    └── cart.js
```

## Run locally

Open `index.html` in a browser. If your browser restricts local storage or scripts for `file://` pages, run a static server from this folder instead, for example:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Persistence and limitations

The cart stores only product IDs and quantities; item names, images, and prices are looked up in the shared product catalog. The sample profile and cart are saved in browser `localStorage` and remain on that browser until its site data is cleared. Invalid stored values are ignored with a console warning. Storage failures are reported in the page rather than presented as successful saves.

This is a front-end demonstration, not a real store. The profile is not authenticated, and checkout does not process payments. Product photos are loaded from Pexels; if an image is unavailable, a category-themed fallback is shown. No external service, account, or secret key is needed.
