# next-live2d demo app

This Next.js app is the public showcase for the package and acts as a visual release note page.

## What this demo includes

- Interactive model selector.
- Install and usage snippet for quick copy.
- Stability highlights from latest release.
- Release timeline section that mirrors library changelog.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Release-note consistency

When changelog is updated in the root project, update these locations together:

1. `../CHANGELOG.md`
2. `../CHANGELOG-vi.md`
3. `app/page.tsx` release timeline data

This keeps npm users, GitHub readers, and demo viewers aligned.
