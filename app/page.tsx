'use client'
import { useState } from 'react'
import { Live2DWidget } from 'next-live2d'

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
  "Senko_Normals",
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

export default function Home() {
  const [model, setModel] = useState('Kar98k-normal')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8 pt-[100px]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">next-live2d</h1>
          <p className="text-lg mb-6">
            A drop-in Live2D widget for Next.js – minimal, customizable, and fun.
          </p>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2.5 w-[200px]"
          >
            {MODELS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>



          <div className="mt-8 flex gap-3 flex-wrap">
            <a
              href="https://github.com/dangtranhuu/next-live2d"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.373 0 12a12.01 12.01 0 008.207 11.385c.6.11.793-.26.793-.577v-2.045c-3.338.726-4.033-1.61-4.033-1.61a3.178 3.178 0 00-1.333-1.754c-1.09-.744.083-.729.083-.729a2.52 2.52 0 011.843 1.236 2.56 2.56 0 003.507 1.001c.06-.479.229-.91.466-1.296-2.665-.306-5.466-1.333-5.466-5.931a4.646 4.646 0 011.236-3.218 4.31 4.31 0 01.116-3.174s1.007-.322 3.3 1.23a11.29 11.29 0 016.003 0c2.291-1.552 3.297-1.23 3.297-1.23a4.31 4.31 0 01.118 3.174 4.647 4.647 0 011.234 3.218c0 4.61-2.804 5.622-5.475 5.921.236.204.447.61.447 1.23v2.031c0 .32.19.694.8.576A12.011 12.011 0 0024 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>

            <a
              href="https://www.youtube.com/@devlands"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-full text-white text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
                <path d="M549.7 124.1c-6.3-23.8-25-42.5-48.7-48.7C456.4 64 288 64 288 64s-168.4 0-213 11.4c-23.8 6.3-42.5 24.9-48.7 48.7C16.8 168.8 16.8 256 16.8 256s0 87.2 9.5 131.9c6.3 23.8 25 42.5 48.7 48.7C119.6 448 288 448 288 448s168.4 0 213-11.4c23.8-6.3 42.5-25 48.7-48.7 9.5-44.7 9.5-131.9 9.5-131.9s0-87.2-9.5-131.9zM232 336V176l142 80-142 80z" />
              </svg>
              YouTube
            </a>

            <a
              href="https://tiktok.com/@devlands"
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

          <div className="mt-16 w-full max-w-2xl bg-[#0e0e0e] border border-[#222] rounded-xl p-6 space-y-6 shadow-lg">
            <div className="text-green-400 font-mono text-sm tracking-wide">
              <span className="select-none">$</span> npm install next-live2d
            </div>

            <pre className="bg-[#1a1a1a] text-gray-100 text-sm p-5 rounded-lg font-mono leading-relaxed overflow-auto whitespace-pre-wrap">
              {`'use client'
import { Live2DWidget } from 'next-live2d'

export default function Page() {
  return <Live2DWidget modelName="histoire" />
}`}
            </pre>
          </div>



        </div>

        <div className="w-[300px] h-[600px] relative">
          <Live2DWidget modelName={model} />
        </div>
      </div>
    </div>
  )
}
