import Link from 'next/link'

export default function RouteTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 px-6 pb-[340px] pt-20 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-black/40 p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Route Test</h1>
          <Link
            href="/"
            className="rounded-md border border-gray-600 px-3 py-1.5 text-xs text-gray-200 transition hover:border-emerald-400 hover:text-emerald-200"
          >
            Back Home
          </Link>
        </div>

        <p className="mb-5 text-sm text-gray-300">
          Dung trang nay de test navigation trong app router khi Live2D dang chay.
        </p>

        <div className="flex flex-wrap gap-2">
          <Link className="rounded-full bg-sky-700 px-4 py-2 text-sm hover:bg-sky-600" href="/route-test/a">
            Route A
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
