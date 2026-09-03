import Link from 'next/link'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const BUILT_IN_MODELS = [
  'histoire', 'bilibili-22', 'bilibili-33', 'cat-black', 'cat-white',
  'chino', 'date', 'ganyu', 'hallo', 'haruto', 'hibiki', 'HK416-1-normal',
  'HK416-2-destroy', 'HK416-2-normal', 'Kar98k-normal', 'kobayaxi', 'koharu',
  'kp31', 'live_uu', 'mai', 'murakumo', 'Pio', 'platelet', 'platelet_2',
  'potion-Maker-Pio', 'rem', 'rem_2', 'senko', 'shizuku', 'shizuku_48',
  'shizuku_pajama', 'terisa', 'tia', 'umaru', 'uni', 'wed_16', 'xisitina', 'z16',
]

const PROPS = [
  { name: 'modelName', type: 'string', defaultValue: "'histoire'", desc: 'Tên model dựng sẵn (xem danh sách bên dưới) hoặc tên thư mục model tự host.' },
  { name: 'baseUrl', type: 'string', defaultValue: 'GitHub raw của next-live2d', desc: 'Đường dẫn gốc để tải model.json, dùng khi tự host model riêng.' },
  { name: 'width / height', type: 'number', defaultValue: '180 / 300', desc: 'Kích thước khung hiển thị widget (px), trước khi áp dụng scale.' },
  { name: 'scale', type: 'number', defaultValue: '1', desc: 'Tỉ lệ phóng to/thu nhỏ widget quanh góc neo (bottom-left/right).' },
  { name: 'bottomOffset', type: 'number', defaultValue: '0', desc: 'Khoảng lệch so với đáy màn hình (px), có thể âm để đẩy widget xuống thấp hơn.' },
  { name: 'position', type: "'left' | 'right'", defaultValue: "'right'", desc: 'Vị trí neo widget theo cạnh màn hình.' },
  { name: 'opacity / hoverOpacity', type: 'number', defaultValue: '0.8 / 0.2', desc: 'Độ trong suốt mặc định và khi hover chuột qua widget.' },
  { name: 'showOnMobile', type: 'boolean', defaultValue: 'true', desc: 'Có hiển thị widget trên thiết bị di động hay không.' },
  { name: 'random', type: 'boolean', defaultValue: 'false', desc: 'Chọn ngẫu nhiên 1 model trong danh sách dựng sẵn, giữ nguyên cho tới khi component unmount.' },
  { name: 'onLoad / onError / onClick', type: 'function', defaultValue: '—', desc: 'Callback khi widget load xong, gặp lỗi, hoặc được click.' },
  { name: 'fallback', type: 'ReactNode', defaultValue: '—', desc: 'UI hiển thị trong lúc widget đang load.' },
  { name: 'className / style', type: 'string / CSSProperties', defaultValue: '—', desc: 'Áp dụng cho iframe bọc ngoài widget.' },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 px-6 pb-24 pt-20 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Docs</h1>
          <div className="flex gap-2">
            <Link
              href="/changelog"
              className="rounded-md border border-gray-600 px-3 py-1.5 text-xs text-gray-200 transition hover:border-emerald-400 hover:text-emerald-200"
            >
              Changelog
            </Link>
            <Link
              href="/"
              className="rounded-md border border-gray-600 px-3 py-1.5 text-xs text-gray-200 transition hover:border-emerald-400 hover:text-emerald-200"
            >
              Home
            </Link>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">1. Cài đặt</h2>
          <div className="rounded-xl border border-[#222] bg-[#0e0e0e] p-4">
            <div className="font-mono text-sm text-green-400">
              <span className="select-none">$</span> npm install next-live2d
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">2. Import và dùng cơ bản</h2>
          <p className="mb-3 text-sm text-gray-300">
            Component là client component, cần chạy phía client (App Router: đặt trong file có{' '}
            <code className="text-emerald-300">&apos;use client&apos;</code> hoặc gọi trực tiếp trong layout/page đã là client).
          </p>
          <div className="overflow-hidden rounded-xl border border-[#222]">
            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
              {`'use client'
import { Live2DWidget } from 'next-live2d'

export default function Page() {
  return <Live2DWidget modelName="Kar98k-normal" />
}`}
            </SyntaxHighlighter>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">3. Chỉnh kích thước / vị trí</h2>
          <p className="mb-3 text-sm text-gray-300">
            Widget render trong 1 iframe cách ly, dùng <code className="text-emerald-300">width</code>/
            <code className="text-emerald-300">height</code> để đặt khung gốc, <code className="text-emerald-300">scale</code> để
            phóng to/thu nhỏ, và <code className="text-emerald-300">bottomOffset</code> để đẩy widget lên/xuống.
          </p>
          <div className="overflow-hidden rounded-xl border border-[#222]">
            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
              {`<Live2DWidget
  modelName="Kar98k-normal"
  width={200}
  height={400}
  scale={0.9}
  bottomOffset={-20}
  position="right"
/>`}
            </SyntaxHighlighter>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">4. Chọn model</h2>
          <p className="mb-3 text-sm text-gray-300">
            Truyền tên model dựng sẵn vào <code className="text-emerald-300">modelName</code>, hoặc dùng{' '}
            <code className="text-emerald-300">random</code> để chọn ngẫu nhiên:
          </p>
          <div className="mb-4 overflow-hidden rounded-xl border border-[#222]">
            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
              {`<Live2DWidget random />`}
            </SyntaxHighlighter>
          </div>
          <p className="mb-2 text-sm text-gray-300">Danh sách model dựng sẵn ({BUILT_IN_MODELS.length}):</p>
          <div className="flex flex-wrap gap-2">
            {BUILT_IN_MODELS.map((name) => (
              <code
                key={name}
                className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-200"
              >
                {name}
              </code>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">5. Props</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950/80 text-gray-400">
                <tr>
                  <th className="px-4 py-2 font-medium">Prop</th>
                  <th className="px-4 py-2 font-medium">Kiểu</th>
                  <th className="px-4 py-2 font-medium">Mặc định</th>
                  <th className="px-4 py-2 font-medium">Mô tả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {PROPS.map((prop) => (
                  <tr key={prop.name} className="bg-gray-950/40 align-top">
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-emerald-300">{prop.name}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-400">{prop.type}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-400">{prop.defaultValue}</td>
                    <td className="px-4 py-2 text-gray-200">{prop.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">6. Custom model host</h2>
          <p className="mb-3 text-sm text-gray-300">
            Muốn tự host model riêng (không dùng model dựng sẵn), trỏ <code className="text-emerald-300">baseUrl</code> tới thư mục
            chứa các model, mỗi model nằm trong 1 thư mục con có <code className="text-emerald-300">model.json</code>:
          </p>
          <div className="overflow-hidden rounded-xl border border-[#222]">
            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
              {`<Live2DWidget
  baseUrl="https://example.com/models"
  modelName="my-custom-model"
/>`}
            </SyntaxHighlighter>
          </div>
        </section>
      </div>
    </div>
  )
}
