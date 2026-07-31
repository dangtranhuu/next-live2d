import Link from 'next/link'

export default function RouteATestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 px-6 pb-[340px] pt-20 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-black/40 p-6">
        <h1 className="mb-3 text-3xl font-bold">Route A</h1>
        <p className="mb-5 text-sm text-gray-300">Route test page A.</p>

        <div className="flex flex-wrap gap-2">
          <Link className="rounded-full bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600" href="/route-test">
            Test Hub
          </Link>
          <Link className="rounded-full bg-fuchsia-700 px-4 py-2 text-sm hover:bg-fuchsia-600" href="/route-test/b">
            Route B
          </Link>
          <Link className="rounded-full bg-emerald-700 px-4 py-2 text-sm hover:bg-emerald-600" href="/route-test/c">
            Route C
          </Link>
        </div>
      </div>
    </div>
  )
}
