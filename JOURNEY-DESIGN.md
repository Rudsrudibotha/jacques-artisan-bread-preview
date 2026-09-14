# Connected photo journey

Reference behavior: the academy's `useScrollStory.js`, `PhotoGallery.jsx` and `docs/photo-story-design.md`, read without modifying that project or using its photographs/artwork.

Concept: `C:/Users/USER-PC/.codex/generated_images/01a09fa4-6c62-74c1-ad4a-df6f7a40a3f3/exec-08f2f7e8-f1b2-4b0e-b5d3-05890ce28358.png`.

## Design specification

- Keep the current dark portrait hero, wordmark, navigation, type family and contact ending.
- Replace the central panels with a single ivory #eee7db photographic trail. Near-black #191715 Georgia headings, Arial body, fine warm ochre #a76a3b curves.
- Opening copy: “A little time. A lot of craft.” and “Stoneground flour. Natural sea salt. A family-run wood-fired bakery in Makhanda.”
- Large, staggered images in bread → pastry → café order, with a small vertical overlap between their rows. Baguette is uncropped so its existing typography/address remain visible. Source photographs remain unaltered; concept-generated details are not shipped.
- Captions: “A good loaf.” / “Wood-fired baguettes, made with stoneground flour.”; “A little something sweet.” / “Patisserie, coffee and a moment to yourself.”; “A place to pause.” / “Dine inside or enjoy the outdoor seating at 36 New Street.”
- Final action: “Find your way here”. Each photo has an outlined expand icon and opens a native dialog with previous/next/close controls.
- A functional native SVG trail draws progressively in ordinary document flow. Drawing remembers the furthest point reached; photos drift in opposing directions by a few pixels. Brief entry reveals run once, never rehide visited content, and reveal on keyboard focus.
- On phones, images remain staggered vertically with captions followed by short individually progressive connectors. No pinning, artificial scrolling runway or animation that chases input. Reduced motion shows complete curves/static photos.

The café hearth illustrates a place to pause; it is not presented as the bakery oven. The current factual contact details and approval footer remain intact.

## Final fidelity and QA record — 14 September 2026

Concept and rendered desktop/mobile screenshots were visually inspected together. Five defining details survived implementation:

1. The original hero, serif typography and brand palette remain consistent with the journey.
2. The three actual business photographs dominate the composition in the specified order.
3. Alternating positions and overlapping vertical ranges create one continuous narrative.
4. Short adjacent captions and a progressively drawn curve connect the photographs.
5. Mobile keeps the stagger, readable captions, individual connectors and accessible enlargement controls.

Intentional differences from the generated concept: original photographs retain their genuine content and proportions; no generated cake/pastry details are shipped. Expand controls use an opaque cream circle for reliable contrast. The connected sequence occupies natural document height instead of compressing all three photographs into one screen. Jacques keeps clear separation beside the branded baguette so its address and logo remain visible; the café hearth uses an editorial crop, with the full original available in the viewer.

Browser checks passed at 1280 × 720 and 390 × 844: chapter entrance/exit, ordinary/fast/reverse scrolling, visible connector progress, once-only reveals, mobile menus, original-photo loading and no horizontal overflow. 360 px scroll moved the photo frame 360 px and its inner image 355.16 px; line progress advanced from 0.1969 to 0.4615. Drawing remains complete on reverse traversal. The mobile connector below the viewport starts at 0 and reaches 1 independently; responsive hidden connectors cannot inherit a completed desktop line.

Viewer checks passed: next/previous buttons, arrow navigation, Escape, close, explicit Tab/Shift+Tab containment and return focus to the opener. Mobile dialog measured 370 × 778 inside the 390 × 844 viewport; the original image uses `object-fit: contain`. Browser error/warning logs were empty. Cake enquiry checks also passed on desktop and mobile: correct review text and destination, old draft hidden after editing. No message was sent.

Live reduced-motion preference handling was tested in an isolated Node controller harness, not through undocumented browser emulation: 13 assertions per site cover observer/listener cleanup, cancelled frames, static full paths, keyboard reveal, remembered progress, hidden zero-size connectors and no replay after re-enabling motion. Actual source syntax and local HTML asset/anchor checks passed.

Evidence: `C:/Users/USER-PC/Documents/Codex/2026-09-14/ca/outputs/food-journey-v2-evidence.json`; representative journey views in `outputs/screenshots/journey-v2/` (`jacques-middle.png`, `cake-middle.png`, `jacques-mobile.png`, `cake-mobile.png`). The checked controller harness is outside the repository in `work/verify-food-story.cjs`.

Remaining limit: live OS/browser preference switching was not exercised through CUA. The isolated controller and CSS fallback were checked. The business's approval and final publication remain separate from this local build.

## Fast-jump regression follow-up

A fresh hero-to-contact jump could skip every IntersectionObserver intersection event, leaving unseen photos pending and the line at zero. The scroll frame now audits unfinished scenes and pending reveal targets independently of the active-scene set, batching all geometry reads before writes. Skipped content becomes visible; passed paths are remembered as complete. Hidden zero-size responsive connectors remain untouched. There is no continuous animation loop and no layout or gallery change.

Regression reproduced on Cake: six above-screen pending targets and progress 0.0000. After the fix, fresh end/contact jumps on both sites leave zero pending targets; return navigation shows every photo/caption at opacity 1 and completed path progress. Four new no-IO fast-jump harness assertions pass per site, alongside the original thirteen preference/focus tests. Evidence: `C:/Users/USER-PC/Documents/Codex/2026-09-14/ca/outputs/food-fast-jump-evidence.json`.
