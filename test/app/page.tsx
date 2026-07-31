'use client'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MODEL_STORAGE_KEY = 'next-live2d-model'
const MODEL_CHANGE_EVENT = 'next-live2d:model-change'

const MODELS = [
  "Kar98k-normal",
  "histoire",
  "bilibili-22",
  "bilibili-33",
  "cat-black",
  "cat-white",
  "chino",
  "date",
  "hallo",
  "haruto",
  "hibiki",
  "HK416-1-normal",
  "HK416-2-destroy",
  "HK416-2-normal",
  "kobayaxi",
  "koharu",
  "kp31",
  "live_uu",
  "mai",
  "murakumo",
  "Pio",
  "platelet",
  "platelet_2",
  "potion-Maker-Pio",
  "rem",
  "rem_2",
  "senko",
  "shizuku",
  "shizuku_48",
  "shizuku_pajama",
  "terisa",
  "tia",
  "umaru",
  "uni",
  "wed_16",
  "xisitina",
  "z16"
]

const RELEASES = [
  {
    version: '2.0.3',
    date: '2026-07-27',
    title: 'Runtime Initialization Fixes',
    notes: [
      'Fixed Live2D init context binding to prevent undefined emit runtime crash',
      'Added model.json preflight validation before widget init',
      'Added clean dev scripts to avoid stale .next chunk mismatch during local package testing'
    ]
  },
  {
    version: '2.0.2',
    date: '2026-07-27',
    title: 'GitHub Username Migration',
    notes: [
      'Default model host now points to github.com/2hjaito',
      'Repository and issue links updated in package metadata',
      'README and demo links aligned with the new username'
    ]
  },
  {
    version: '2.0.1',
    date: '2026-07-27',
    title: 'Stability & Next.js Hardening',
    notes: [
      'Prevent duplicate script injection under React StrictMode',
      'Safer async initialization flow to reduce race conditions',
      'Timeout protection while waiting for widget container',
      'Cleanup improvements to reduce freezes on remount/route changes'
    ]
  },
  {
    version: '2.0.0',
    date: '2026-03-07',
    title: 'Major Feature Release',
    notes: [
      'Custom baseUrl for self-hosted models',
      'Position, size, opacity, hoverOpacity controls',
      'Random model mode and loading fallback',
      'React 18/19 support with stronger TypeScript exports'
    ]
  },
  {
    version: '1.4.1',
    date: '2025-06-24',
    title: 'Strict Mode Crash Fix',
    notes: [
      'Avoided unsafe global delete operation',
      'Improved unmount cleanup safety'
    ]
  }
]

export default function Home() {
  const [model, setModel] = useState(() => {
    if (typeof window === 'undefined') {
      return 'Kar98k-normal'
    }

    return window.localStorage.getItem(MODEL_STORAGE_KEY) || 'Kar98k-normal'
  })

  const handleModelChange = (nextModel: string) => {
    setModel(nextModel)
    window.localStorage.setItem(MODEL_STORAGE_KEY, nextModel)
    window.dispatchEvent(new CustomEvent(MODEL_CHANGE_EVENT, { detail: nextModel }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8 pt-[80px] pb-[340px]">
      <div className="max-w-5xl mx-auto space-y-14">
        <section className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div>
            <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs tracking-[0.12em] uppercase mb-4 border border-emerald-400/30">
              Stable for Next.js App Router
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">next-live2d</h1>
            <p className="text-lg text-gray-200 mb-6 max-w-2xl">
              A drop-in Live2D widget for Next.js with better runtime stability,
              safer cleanup, and practical controls for real-world products.
            </p>
            <div className="mb-6 text-sm text-gray-300">
              Latest: <span className="font-semibold text-white">v2.0.3</span> • Runtime initialization fixes
            </div>
            <p className="mb-6">
              <a
                href="https://www.npmjs.com/package/next-live2d"
                target="_blank"
                className="text-base text-sky-400 font-bold hover:underline transition duration-150"
              >
                npmjs.com/package/next-live2d
              </a>
            </p>

            <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-4 mb-8">
              <label className="block text-sm text-gray-300 mb-2">Choose built-in model</label>
              <select
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2.5 w-[220px]"
              >
                {MODELS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 flex-wrap">
              <a
                href="https://github.com/2hjaito/next-live2d"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.373 0 12a12.01 12.01 0 008.207 11.385c.6.11.793-.26.793-.577v-2.045c-3.338.726-4.033-1.61-4.033-1.61a3.178 3.178 0 00-1.333-1.754c-1.09-.744.083-.729.083-.729a2.52 2.52 0 011.843 1.236 2.56 2.56 0 003.507 1.001c.06-.479.229-.91.466-1.296-2.665-.306-5.466-1.333-5.466-5.931a4.646 4.646 0 011.236-3.218 4.31 4.31 0 01.116-3.174s1.007-.322 3.3 1.23a11.29 11.29 0 016.003 0c2.291-1.552 3.297-1.23 3.297-1.23a4.31 4.31 0 01.118 3.174 4.647 4.647 0 011.234 3.218c0 4.61-2.804 5.622-5.475 5.921.236.204.447.61.447 1.23v2.031c0 .32.19.694.8.576A12.011 12.011 0 0024 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>

              <a
                href="https://www.youtube.com/@2hjaito"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-full text-white text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M549.7 124.1c-6.3-23.8-25-42.5-48.7-48.7C456.4 64 288 64 288 64s-168.4 0-213 11.4c-23.8 6.3-42.5 24.9-48.7 48.7C16.8 168.8 16.8 256 16.8 256s0 87.2 9.5 131.9c6.3 23.8 25 42.5 48.7 48.7C119.6 448 288 448 288 448s168.4 0 213-11.4c23.8-6.3 42.5-25 48.7-48.7 9.5-44.7 9.5-131.9 9.5-131.9s0-87.2-9.5-131.9zM232 336V176l142 80-142 80z" />
                </svg>
                YouTube
              </a>

              <a
                href="https://tiktok.com/@2hjaito"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 rounded-full text-white text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M448,209.3V153.5c-26.3,0-52.3-7.7-74.4-22.1V330c0,50.7-41.1,91.9-91.9,91.9s-91.9-41.1-91.9-91.9s41.1-91.9,91.9-91.9
      c7.3,0,14.4,0.9,21.3,2.7V181c-7-1-14.1-1.5-21.3-1.5c-76.7,0-139,62.3-139,139s62.3,139,139,139s139-62.3,139-139V209.3H448z"/>
                </svg>
                TikTok
              </a>
            </div>

            <div className="mt-12 w-full max-w-2xl bg-[#0e0e0e] border border-[#222] rounded-xl p-[10px] space-y-6 shadow-lg">
              <div className="text-green-400 font-mono text-sm tracking-wide">
                <span className="select-none">$</span> npm install next-live2d
              </div>

              <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
                {`'use client'
import { Live2DWidget } from 'next-live2d'

export default function Page() {
  return <Live2DWidget modelName="${model}" />
}`}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-6">
            <h2 className="text-xl font-semibold mb-4">v2.0.1 highlights</h2>
            <ul className="space-y-3 text-sm text-gray-200">
              <li>Safe script loading to avoid duplicate Live2D initialization.</li>
              <li>Better handling for strict mode and route transitions.</li>
              <li>Timeout guard to prevent endless waiting loops.</li>
              <li>More stable behavior when imported into external Next.js projects.</li>
            </ul>
            <div className="mt-6 border-t border-gray-800 pt-4 text-xs text-gray-400">
              Tip: Keep a single widget instance per layout/page for best stability.
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-5">Release timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RELEASES.map((release) => (
              <article
                key={release.version}
                className="rounded-xl border border-gray-800 bg-gray-950/60 p-5"
              >
                <div className="flex items-center justify-between mb-2 gap-3">
                  <h3 className="text-lg font-semibold">v{release.version}</h3>
                  <span className="text-xs text-gray-400">{release.date}</span>
                </div>
                <p className="text-sm text-sky-300 mb-3">{release.title}</p>
                <ul className="space-y-2 text-sm text-gray-200">
                  {release.notes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-800 bg-black/50 p-5 text-sm text-gray-200">
          <h2 className="text-xl font-semibold mb-3">Documentation</h2>
          <p>
            Full changelog and release notes are maintained in the library repository.
            Keep the demo page aligned with those notes to make package updates easier for users.
          </p>
        </section>

      </div>
    </div>
  )
}
