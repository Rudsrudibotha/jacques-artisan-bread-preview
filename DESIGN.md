# Design specification

The three built-in Image Gen references are layout studies, not shipped business photographs. They are under `C:/Users/USER-PC/.codex/generated_images/01a09fa4-6c62-74c1-ad4a-df6f7a40a3f3/`: hero `exec-4f91d5d3-2b1c-42e9-86bc-ee62ad9c0ad4.png`, craft `exec-0fabdb19-fd5a-4e52-98a5-7373514d6d0d.png`, visit `exec-a5985498-ba65-4fa9-aa08-6382d2f78ec1.png`.

Tokens: near-black #191715, cream #f5f0e7, warm ivory #eee7db, muted beige #beb6a9. Display typography Georgia, regular weight, tight -0.045em tracking; body Arial 17–19px with 1.6 line height. Square image frames, open bands, 4–6vw gutters, simple underlined links with 1.5px vector arrows. No cards or raster UI.

Allowed hero copy: Jacques’ / ARTISAN BREAD; The craft / The café / Visit us; Good bread. / Made by hand.; A family-run wood-fired bakery & café in Makhanda.; Step inside; 36 New Street, Makhanda; 01 / 03.

Sections: portrait opening → pastry craft → bread detail → café/visit ending. Pinned scene frames have slow image scale and pan that respond to scrolling. Mobile becomes sequential image-and-copy scenes. Reduced motion is static.

Intentional corrections to generated studies: navigation consistently follows the hero specification, rather than model-invented navigation on downstream concepts. Actual source photographs are used without generative alterations. Café fireplace is not described as a bread oven. No always-on fireplace or exact operating-hour claim is made. Bread detail is a supporting gallery scene required to show the business's actual bread. Contact image follows actual aspect/crop. System Georgia and Arial avoid third-party font requests.


## Final design and functional verification

Browser plugin screenshots were saved from the rendered Chrome page and inspected with `view_image` beside the generated hero concept. Checked 1505×1045 (concept native size), 1280×720 laptop, and 390×844 mobile. All hero copy matches the allowed list; mobile adds only the Menu control.

| Comparison | Result / intentional adaptation |
|---|---|
| Overall opening | Dark full-viewport portrait composition, cream type, open left column preserved. |
| Typography | Georgia display and serif navigation preserve hierarchy; responsive scale fits a short laptop viewport. |
| Photography | Actual 765×765 Page portrait replaces the generated study image. Crop and fade adapt to each screen. |
| Header / actions | Wordmark, three navigation links and underlined arrow action retain the specified order and treatment. |
| Chapter rhythm | Pastry image and craft copy lead into uncropped baguette artwork, then warm café/contact sections. |
| Mobile | Readable stacked chapters, no horizontal overflow; menu supports Tab wrapping, Escape and link closing. |

Fixed during QA: short-screen hero/pinned-frame spacing, anchor offset, and mobile keyboard focus containment. Browser verified chapter navigation and contact destinations; all four images loaded, no console errors/warnings. Local HTML references and image dimensions/alt text checked; JavaScript syntax check passed. Reduced-motion fallback is implemented in CSS and JavaScript (system preference emulation was not available in the browser tool).

The implementation was visually verified against the design specification, with the factual-photo and responsive adaptations above. No material unintended visual or functional mismatches remained in the inspected viewports. This is a photo-motion adaptation of the cinematic reference, not a film recreation. Exact operating hours and official image-use approval remain business-confirmation items.

## Motion revision after user feedback

The initial pinned treatment above is superseded: sections now move continuously through normal document flow. Removed the extended sticky chapter and its extra runway. Kept the composition, typography, photographs and restrained desktop image motion. Per-image progress is measured against its own frame; all layout reads happen before style writes, and offscreen images receive no scroll updates. No transform transitions, interpolation loops or wheel/touch handlers are used. Mobile and reduced-motion layouts are static.
