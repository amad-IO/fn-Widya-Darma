import type { DashboardStats } from "@/lib/admin-api";

interface AdminVisitorChartProps {
  stats: DashboardStats | null;
}

function number(value: number) {
  return value.toLocaleString("id-ID");
}

function TrafficShape({ hasTraffic }: { hasTraffic: boolean }) {
  const line = hasTraffic
    ? "M0 222 C65 214 106 151 167 166 S263 216 332 168 S442 88 515 128 S590 175 650 72"
    : "M0 222 C130 222 220 222 325 222 S500 222 650 222";
  const area = `${line} L650 260 L0 260 Z`;

  return (
    <svg
      viewBox="0 0 650 260"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[calc(100%-1.5rem)] w-full overflow-visible"
    >
      <defs>
        <linearGradient id="traffic-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0b639f" stopOpacity="0.25" />
          <stop offset="1" stopColor="#0b639f" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#traffic-fill)" />
      <path
        d={line}
        fill="none"
        stroke="#07528c"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <circle cx="650" cy={hasTraffic ? "72" : "222"} r="6" fill="#07528c" />
      <circle cx="650" cy={hasTraffic ? "72" : "222"} r="11" fill="#07528c" opacity="0.12" />
    </svg>
  );
}

/** Kartu pemantauan trafik berbasis total tayangan yang dikirim dashboard API. */
export default function AdminVisitorChart({ stats }: AdminVisitorChartProps) {
  const totalViews = stats?.website_traffic.total_page_views ?? 0;
  const hasTraffic = totalViews > 0;

  return (
    <section
      aria-label="Tayangan website pengunjung"
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
            Tayangan Website Pengunjung
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Pemantauan trafik website berdasarkan data yang tercatat.
          </p>
        </div>
      </header>

      <div className="bg-gradient-to-br from-blue-50/75 via-white to-[#07528c]/[0.08] p-5 sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Tayangan
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums text-slate-900">
                {number(totalViews)}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">halaman dilihat pengunjung</p>
            </div>
            <div className="mt-8 border-t border-blue-100 pt-4 text-xs leading-5 text-slate-500">
              {hasTraffic
                ? "Tayangan tercatat dari aktivitas website."
                : "Belum ada tayangan yang tercatat pada sistem."}
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-blue-100/90 bg-white/70 px-4 pb-4 pt-5 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-700">Tracking tayangan</p>
              <span className="text-[11px] font-medium text-slate-400">Terkini</span>
            </div>
            <div className="relative mt-4 h-64 overflow-hidden border-b border-l border-slate-200 sm:h-72">
              {[20, 40, 60, 80].map((position) => (
                <span
                  key={position}
                  aria-hidden="true"
                  className="absolute inset-x-0 border-t border-dashed border-blue-100/90"
                  style={{ bottom: `${position}%` }}
                />
              ))}
              <TrafficShape hasTraffic={hasTraffic} />
              <span className="absolute bottom-2 right-3 rounded-lg bg-[#07528c] px-2.5 py-1 text-xs font-bold tabular-nums text-white shadow-sm">
                {number(totalViews)} tayangan
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
