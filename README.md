# Manifest v2

**One star. One user. Real data from Sober Sidekick.**

A clean rebuild of Manifest — a 3D visualization of the Sober Sidekick recovery community.

## What It Shows

- **Star** = a real user from the community
- **Planets** = their posts, sized by comment engagement (logarithmic)
- **Orbit rings** = visual connection between user and their content
- **Background** = 2000 twinkling stars for atmosphere

## Stack

- React 19 + Vite 7
- Three.js via @react-three/fiber + drei
- Back4App (Parse) for live data

## Quick Start

```bash
git clone git@github.com:never-alone-sidekick/manifest-v2.git
cd manifest-v2
npm install
```

Create `.env`:
```env
VITE_PARSE_APP_ID=your_app_id
VITE_PARSE_REST_KEY=your_rest_key
VITE_PARSE_SERVER_URL=https://parseapi.back4app.com
```

```bash
npm run dev
```

Without API keys, a demo universe with sample data loads automatically.

## Project Structure

```
src/
├── App.jsx              # Root: loading, data fetch, UI overlays
├── main.jsx             # React mount
├── index.css            # SS brand colors, glassmorphism, HUD
├── components/
│   ├── Scene.jsx        # R3F Canvas + camera + controls
│   ├── Star.jsx         # Glowing star with pulsing animation
│   ├── Planet.jsx       # Orbiting sphere with hover events
│   └── Starfield.jsx    # Background point cloud
└── utils/
    └── api.js           # Back4App REST API client
```

## Next Steps

- [ ] Multiple users (multi-star solar system)
- [ ] Light beams (comments connecting stars)
- [ ] Time scrubber (4th dimension)
- [ ] Detail panel (click to expand post/user info)
- [ ] Profile pictures from proPic field
- [ ] Search & navigation

---

*"You're Never Alone"*
