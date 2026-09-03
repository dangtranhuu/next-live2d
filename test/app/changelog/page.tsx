import Link from 'next/link'

type ChangeSection = {
  heading: string
  items: string[]
}

type Release = {
  version: string
  date: string
  sections: ChangeSection[]
}

const RELEASES: Release[] = [
  {
    version: '2.1.0',
    date: '2026-09-03',
    sections: [
      {
        heading: '✨ Added',
        items: [
          "Live2DWidget now renders inside a self-contained iframe, so consumers no longer need to hand-roll their own isolated widget wrapper.",
          'Added scale and bottomOffset props to control widget sizing/position without extra CSS.',
        ],
      },
      {
        heading: '🐛 Fixed',
        items: [
          "Eliminated \"Cannot read properties of null (reading 'removeChild')\" crashes by no longer mutating the host document's DOM; all widget DOM lives inside the iframe document.",
        ],
      },
    ],
  },
  {
    version: '2.0.5',
    date: '2026-07-31',
    sections: [
      {
        heading: '🐛 Fixed',
        items: ['Hardened DOM cleanup during widget lifecycle transitions to reduce removeChild race crashes.'],
      },
      {
        heading: '🧪 Test App',
        items: [
          'Reworked the demo runtime to isolate Live2D execution from App Router UI updates.',
          'Restored demo interactions for model switch and mouse tracking in the isolated widget.',
          'Increased isolated widget viewport sizing so taller models are less likely to be clipped.',
        ],
      },
    ],
  },
  {
    version: '2.0.4',
    date: '2026-07-27',
    sections: [
      {
        heading: '🐛 Fixed',
        items: [
          'Fixed model switching where only the first model persisted after selection changes.',
          'Reset Live2D widget runtime config before each re-initialization so jsonPath updates correctly.',
          'Updated script loading flow to include both L2Dwidget.min.js and L2Dwidget.0.min.js, preventing partial runtime initialization.',
        ],
      },
    ],
  },
  {
    version: '2.0.3',
    date: '2026-07-27',
    sections: [
      {
        heading: '🐛 Fixed',
        items: [
          "Fixed Live2D initialization context binding (this) to prevent runtime failures such as \"Cannot read properties of undefined (reading 'emit')\".",
          'Added preflight model JSON validation before widget initialization to fail fast with actionable errors.',
        ],
      },
      {
        heading: '⚙️ Dev Experience',
        items: ['Added dev:test:clean and test app dev:clean scripts to clear stale .next artifacts.'],
      },
    ],
  },
  {
    version: '2.0.2',
    date: '2026-07-27',
    sections: [
      {
        heading: '🔧 Changed',
        items: [
          'Updated default model host URL to use the new GitHub username 2hjaito.',
          'Updated package metadata links (repository, bugs) to the new GitHub profile.',
        ],
      },
    ],
  },
  {
    version: '2.0.1',
    date: '2026-07-27',
    sections: [
      {
        heading: '🐛 Fixed',
        items: [
          'Hardened Live2D script loading to avoid duplicate injection during React StrictMode remounts.',
          'Improved initialization flow to reduce async race conditions in Next.js App Router projects.',
          'Added timeout guard while waiting for #live2d-widget to prevent long-running render loops.',
        ],
      },
    ],
  },
  {
    version: '2.0.0',
    date: '2026-03-07',
    sections: [
      {
        heading: '🚀 Major Release',
        items: [
          'Custom baseUrl for self-hosted models.',
          "Position, size, opacity, hoverOpacity controls.",
          'Random model mode and loading fallback.',
          'React 18/19 support with stronger TypeScript exports.',
        ],
      },
    ],
  },
  {
    version: '1.4.1',
    date: '2025-06-24',
    sections: [
      {
        heading: '🐛 Fixed',
        items: ['Avoided unsafe global delete operation.', 'Improved unmount cleanup safety.'],
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2025-06-03',
    sections: [
      {
        heading: '🐣 Initial release',
        items: [
          'Simple <Live2DWidget modelName="..." /> component.',
          'Injects live2d-widget from CDN.',
          'Supports 20+ Live2D models.',
        ],
      },
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 px-6 pb-24 pt-20 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Changelog</h1>
          <div className="flex gap-2">
            <Link
              href="/docs"
              className="rounded-md border border-gray-600 px-3 py-1.5 text-xs text-gray-200 transition hover:border-emerald-400 hover:text-emerald-200"
            >
              Docs
            </Link>
            <Link
              href="/"
              className="rounded-md border border-gray-600 px-3 py-1.5 text-xs text-gray-200 transition hover:border-emerald-400 hover:text-emerald-200"
            >
              Home
            </Link>
          </div>
        </div>

        <p className="mb-10 text-sm text-gray-400">
          Full release history for the <code className="text-emerald-300">next-live2d</code> package.
        </p>

        <div className="space-y-6">
          {RELEASES.map((release) => (
            <article key={release.version} className="rounded-xl border border-gray-800 bg-gray-950/60 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">v{release.version}</h2>
                <span className="text-xs text-gray-400">{release.date}</span>
              </div>

              <div className="space-y-3">
                {release.sections.map((section) => (
                  <div key={section.heading}>
                    <p className="mb-1 text-sm font-medium text-sky-300">{section.heading}</p>
                    <ul className="space-y-1 text-sm text-gray-200">
                      {section.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
