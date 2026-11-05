# RE-ENTRY

**The Physics of Surviving Earth's Atmosphere** — a static, interactive secondary-school physics exhibition.

## Run and build

Node.js 22 or later. There are no package dependencies and no install step.

```sh
npm run dev     # http://127.0.0.1:4173
npm test        # physical relationships, units and document integrity
npm run build  # creates dist/
npm run preview
```

Serve the files over HTTP; ES modules do not work reliably by opening `index.html` with `file://`.

## Architecture

- `index.html`: complete semantic narrative, six chapters, inline SVG diagrams, nearby citations and bibliography. The scientific reading experience is available without JavaScript.
- `styles.css`: responsive design system, component styles, reduced-motion and print presentation.
- `js/science.js`: immutable SI constants, explicit assumptions, pure physical calculations.
- `js/app.js`: separate initialisers for energy, flow, conceptual explorers and navigation/presentation.
- `assets/fonts/`: locally hosted Google Fonts with their SIL Open Font Licenses. No font service is contacted at runtime.
- `scripts/`: dependency-free development server and static build.
- `.github/workflows/deploy.yml`: test, build and GitHub Pages deployment.

Site code, fonts and illustrations are local. The KSP chapter embeds an external YouTube player, which requires an internet connection. Visitors can also follow the reference links. Inline illustrations are original explanatory drawings; they are not photographs or reconstructed flight data.

The introduction credits Cillian Ó Ríordáin and includes a native, keyboard-accessible “About this site” disclosure. It lists the languages, GitHub Pages hosting and AI assistance with the code and draft text. Each build inserts the current non-blank line count from `index.html`, `styles.css`, `js/app.js` and `js/science.js`; comments and inline diagrams count, while bundled assets, tooling and tests do not. The unbuilt development page labels the count as available at build time.

## What works in this iteration

- Responsive narrative and persistent chapter navigation, progress line and return links.
- Mass/speed calculator, immediate results, worked SI substitution, presets, reset and a same-mass doubled-speed comparison.
- Independent altitude/speed flow sampler: exponential density, calculated drag and relative stagnation-point convective heat flux.
- Qualitative radio-blackout states, selectable heat-shield layers and shallow/moderate/steep entry comparisons.
- Presentation mode: previous/next controls, Page Up/Page Down, Escape. These are section jumps, not a timed slideshow. Range controls retain their normal keyboard behaviour.
- An embedded KSP recording with a direct YouTube link, seventeen linked references, an evidence-labelled Orion case study, reduced-motion support and printable reading content.

## Scientific boundaries

The kinetic-energy calculator uses E = ½mv² with mass in kg and speed converted from km/s to m/s. The default 5,000 kg vehicle is hypothetical. 7.8 km/s and 11 km/s are representative speeds, not exact conditions for every orbit or mission. The calculator does not equate vehicle energy with heat absorbed by its shield, and does not include gravitational-potential-energy changes during descent.

The flow sampler is **not a descent simulation**. Users prescribe independent altitude and speed. Its density approximation is ρ = 1.217 exp(−h/8500) kg/m³ (h in metres); the NASA fact-sheet surface density and representative scale height are parameters for this deliberately simple model, not a measured profile. It is not accurate enough for vehicle design or predicting entry peaks. Drag uses a chosen, constant C_D = 1.2 and reference area 10 m². Those parameters are not calibrated to Orion.

Relative convective heating is √(ρ/ρ_ref)(v/v_ref)³, using Sutton–Graves scaling for the same nose radius and gas coefficient, referenced to the sampler's 60 km and 7.8 km/s conditions. No absolute heating coefficient or surface temperature is invented. Radiation, nonequilibrium chemistry, rarefied flow, turbulence, material response and coupled motion are omitted. The drawn heat intensity is illustrative. Computed outputs are rounded for display; tests use full precision.

The radio, shield and trajectory explorers explain concepts without numerical thresholds, material-temperature predictions or safe flight-path angles. The generic shield drawing is not an Orion engineering cross-section. The conduction formula applies to a uniform, steady one-dimensional slab; Q = mcΔT requires approximately constant c without phase or chemical changes. Neither formula solves the transient ablating-shield problem.

The Orion case study distinguishes NASA's reported flight evidence from these educational models. Facts were checked on **23 October 2026**, including the NASA report published 15 October and updated 19 October 2026 on Artemis II. See the on-page references for the direct sources. Future mission schedules are intentionally omitted.

## KSP recording

The KSP chapter embeds the supplied recording, [A KSP Re-entry](https://www.youtube.com/watch?v=nxjYnuj-WCc), using YouTube's `youtube-nocookie.com` embed domain. The player loads lazily, does not autoplay, supports fullscreen and has a permanent direct-link fallback. Its title and source are shown below the player. No API key, download or local video file is required.

The surrounding text labels the recording as game footage. Game version, modifications, entry settings, narration/captions and scene-specific timestamps have not been verified. The investigation prompts remain general; no measurements or annotations have been invented from the video. Browser access was disabled during this integration, so playback and visual rendering still need to be checked in a browser.

A locally hosted version can be added later by replacing `.video-player` with a native `<video controls preload="metadata">`, a local `<source>` and a caption/transcript track where needed.
Future work: a validated coupled trajectory model, quantitative radio propagation, transient material response and annotated footage. Current conceptual controls are functional; none claims to implement these advanced models.

## GitHub Pages

Repository: [CORBlimey21/re-entry](https://github.com/CORBlimey21/re-entry).

Website: [RE-ENTRY](https://corblimey21.github.io/re-entry/).

The included workflow tests, builds and publishes the site when changes are pushed to `main`. It can also be run manually from the repository's Actions tab.

### Initial setup for another repository

1. Create a GitHub repository and push this directory to its `main` branch.
2. Under **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. The included workflow runs on pushes to `main` and can also be run manually. It tests, builds, uploads `dist/` and deploys using the official Pages actions.

Relative asset/module paths work at both `https://USER.github.io/REPOSITORY/` and a custom-domain root, with no code edits. No API keys or secrets are required. GitHub's repository-level Pages source setting is required once; it cannot be supplied by generated site code.

Local review notes and screenshots in `qa/` are excluded from Git and from the published build.
