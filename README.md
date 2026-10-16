# SRIKAR SANTOSH — The Digital Lab

A responsive, static portfolio with a cinematic hero, scroll-driven effects, interactive project previews, and Srikar's large profile portrait prominently displayed in the opening section.

## Run locally

Open `index.html` in a modern browser. For a local web server, run one of these commands from this directory:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Update your details before publishing

1. The large hero portrait is stored at `assets/srikar-santosh.jpg`. Replace it with another image at the same path if you want to update the photo.
2. Open `script.js` and add real contact details in the `PROFILE` object near the top:

```js
const PROFILE = {
  email: "you@example.com",
  github: "https://github.com/your-username",
  linkedin: "https://www.linkedin.com/in/your-profile/",
};
```

The contact buttons remain inactive until you configure real destinations.

## Publish

This is a static site and does not require a build step. Upload the contents of this folder (make sure `index.html` is at the root) to a static hosting service such as Netlify Drop or import the files into your preferred hosting service. Keep the `assets` folder alongside `index.html` so the portrait loads correctly.

## Features

- Oversized `SRIKAR SANTOSH` identity headline
- Large personal portrait with a framed, animated presentation
- Animated headline and computational hero visuals
- Canvas particle network that responds to pointer movement on desktop
- Scroll progress indicator and reveal transitions
- Sticky horizontal project gallery on desktop; responsive vertical project cards on mobile
- Working category filters that recalculate the horizontal scroll range
- Magnetic buttons, subtle pointer spotlight/tilt, and animated project mockups
- Scroll-animated journey timeline
- Mobile navigation and reduced-motion support
- Honest project statuses and illustrative mockup labels
- SEO and social-sharing metadata

The portfolio uses Google Fonts as an optional external resource; system font fallbacks are included.
