# Jacques' Artisan Bread — website concept

A responsive, static website concept for Jacques' Artisan Bread in Makhanda. It uses photographs published on the business's public Facebook Page, with a continuous scrolling sequence about the bakery's craft, bread and café.

## Preview

Open `index.html` directly, or run `python -m http.server 8311 --bind 127.0.0.1` from this directory and visit `http://127.0.0.1:8311`.

All asset references are relative. There is no build step, framework, remote font, analytics, cookie storage or back-end service. The folder can be served under a GitHub Pages repository path.

## Status and factual limits

- Independent website concept, awaiting the business's approval. The footer says so, and the page requests no search-engine indexing.
- No contact with the business, repository publication or deployment has been performed by this build.
- Public Page checked on 14 September 2026. Contact: 084 454 2351, mayabrits@gmail.com, 36 New Street, Makhanda. Public sources linked in `SOURCES.md`.
- Uses real photographs with CSS scroll-linked motion. It contains no generated footage or photographs of invented products.
- No opening hours, menu prices, order promises, certifications or testimonials are invented. Current hours and product availability should be confirmed with the business.
- Public posting does not independently establish a licence to republish photographs. The business should approve image use before its official site is launched.
- Reduced-motion preference disables scroll effects; content and navigation remain usable without JavaScript.

## Files

`index.html` contains the copy, photo journey and native gallery dialog. `styles.css` defines the responsive design. `script.js` manages the original navigation and hero (plus the Cake Junkie enquiry composer). `story.js` manages progressive connectors, once-only reveals and the photo viewer. `assets/` contains the original local photographs and favicon. `JOURNEY-DESIGN.md` records the concept, implementation decisions and validation.

## Connected photo journey

Three large photographs form a staggered narrative linked by a fine curve. The page uses native document scrolling with no pinned hold or extra runway. A coalesced animation frame measures active scenes before writing progress and gentle opposing drift. Completed drawing and revealed content are remembered during reverse scrolling and live preference changes.

Phone layouts use staggered images with separate short connector windows. Photo drift is disabled on small screens; reduced-motion visitors see complete curves and static photographs. Content and original-photo links remain available without JavaScript. The enhanced viewer supports previous/next, arrow keys, Escape, keyboard containment and return focus.

This local revision has not been published by the site-building subtask.
