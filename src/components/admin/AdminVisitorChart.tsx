"use client";

import React, { useState } from "react";
import AdminIcon from "./AdminIcon";

type ChartPeriod = "7hari" | "halaman" | "bulanan";

type DataPoint = {
  label: string;
  subLabel?: string;
  value: number; // Jumlah pengunjung
  pageviews: number;
};

const DATA_7_HARI: DataPoint[] = [
  { label: "Senin", subLabel: "14 Okt", value: 380, pageviews: 920 },
  { label: "Selasa", subLabel: "15 Okt", value: 520, pageviews: 1240 },
  { label: "Rabu", subLabel: "16 Okt", value: 690, pageviews: 1580 },
  { label: "Kamis", subLabel: "17 Okt", value: 460, pageviews: 1110 },
  { label: "Jumat", subLabel: "18 Okt", value: 610, pageviews: 1470 },
  { label: "Sabtu", subLabel: "19 Okt", value: 740, pageviews: 1820 },
  { label: "Minggu", subLabel: "20 Okt", value: 430, pageviews: 1050 },
];

const DATA_HALAMAN: DataPoint[] = [
  { label: "Beranda", subLabel: "/", value: 720, pageviews: 1890 },
  { label: "Profil Guru", subLabel: "/guru", value: 650, pageviews: 1620 },
  { label: "Info SPMB", subLabel: "/spmb", value: 580, pageviews: 1390 },
  { label: "Galeri Foto", subLabel: "/galeri", value: 440, pageviews: 1150 },
  { label: "Profil Sekolah", subLabel: "/profil", value: 310, pageviews: 740 },
  { label: "Kontak", subLabel: "/kontak", value: 210, pageviews: 480 },
];

const DATA_BULANAN: DataPoint[] = [
  { label: "Mei", subLabel: "2026", value: 480, pageviews: 1200 },
  { label: "Juni", subLabel: "2026", value: 540, pageviews: 1380 },
  { label: "Juli", subLabel: "2026", value: 710, pageviews: 1950 },
  { label: "Agustus", subLabel: "2026", value: 600, pageviews: 1520 },
  { label: "September", subLabel: "2026", value: 660, pageviews: 1690 },
  { label: "Oktober", subLabel: "2026", value: 750, pageviews: 1980 },
];

export default function AdminVisitorChart() {
  const [period, setPeriod] = useState<ChartPeriod>("7hari");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentData =
    period === "7hari"
      ? DATA_7_HARI
      : period === "halaman"
      ? DATA_HALAMAN
      : DATA_BULANAN;

  const maxValue = 800; // Skala atas sumbu Y (0, 200, 400, 600, 700, 800)
  const yTicks = [800, 700, 600, 400, 200, 0];

  const totalVisitors = currentData.reduce((acc, curr) => acc + curr.value, 0);
  const totalPageviews = currentData.reduce((acc, curr) => acc + curr.pageviews, 0);
  const peakItem = currentData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    currentData[0]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Top Header Bar (Format sesuai screenshot referensi user) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-100/70 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 rounded-full bg-slate-800" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
            Grafik Kunjungan Pengunjung Website Sekolah
          </h3>
          <span className="hidden sm:inline-block rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
            Trafik Real-time
          </span>
        </div>

        {/* Period Switcher Tabs */}
        <div className="flex items-center rounded-xl bg-white p-1 border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setPeriod("7hari");
              setHoveredIndex(null);
            }}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              period === "7hari"
                ? "bg-[#142c58] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            type="button"
            onClick={() => {
              setPeriod("halaman");
              setHoveredIndex(null);
            }}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              period === "halaman"
                ? "bg-[#142c58] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Per Halaman
          </button>
          <button
            type="button"
            onClick={() => {
              setPeriod("bulanan");
              setHoveredIndex(null);
            }}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              period === "bulanan"
                ? "bg-[#142c58] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bulanan
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="p-5 sm:p-7">
        <div className="relative pt-6 pb-2">
          {/* Grid Lines & Y-Axis Labels */}
          <div className="relative h-64 sm:h-72 w-full">
            {/* Horizontal Gridlines */}
            {yTicks.map((tick) => {
              const bottomPercent = (tick / maxValue) * 100;
              return (
                <div
                  key={tick}
                  className="absolute inset-x-0 flex items-center pointer-events-none"
                  style={{ bottom: `${bottomPercent}%` }}
                >
                  <span className="w-10 text-right pr-3 font-mono text-[11px] text-slate-400 select-none">
                    {tick}
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
              );
            })}

            {/* Bars Container */}
            <div className="absolute inset-y-0 left-12 right-2 flex items-end justify-around gap-2 sm:gap-6 border-l border-b border-slate-300/80">
              {currentData.map((item, idx) => {
                const heightPercent = Math.min(
                  100,
                  Math.max(4, (item.value / maxValue) * 100)
                );
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={item.label}
                    className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute -top-14 z-20 flex flex-col items-center rounded-xl bg-slate-900 px-3 py-1.5 text-center text-white shadow-lg pointer-events-none transition animate-in fade-in zoom-in-95 duration-150">
                        <span className="text-[10px] font-medium text-slate-300">
                          {item.label} {item.subLabel ? `(${item.subLabel})` : ""}
                        </span>
                        <span className="text-xs font-bold text-amber-300">
                          {item.value} Pengunjung
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {item.pageviews} Tayangan
                        </span>
                        {/* Tooltip Arrow */}
                        <div className="absolute -bottom-1 h-2 w-2 rotate-45 bg-slate-900" />
                      </div>
                    )}

                    {/* Value Badge above Bar */}
                    <span
                      className={`text-[10px] font-semibold text-slate-500 mb-1.5 transition ${
                        isHovered ? "text-[#142c58] font-bold scale-110" : ""
                      }`}
                    >
                      {item.value}
                    </span>

                    {/* The Blue Bar (Format warna biru solid seperti di screenshot referensi) */}
                    <div
                      className="w-full max-w-[64px] rounded-t-md transition-all duration-300"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: isHovered ? "#142c58" : "#1e5bb8",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="mt-3 flex items-center justify-around pl-12 pr-2 text-center">
            {currentData.map((item, idx) => (
              <div key={item.label} className="flex-1 truncate px-1">
                <p
                  className={`text-xs font-semibold transition ${
                    hoveredIndex === idx
                      ? "text-[#142c58] font-bold"
                      : "text-slate-700"
                  }`}
                >
                  {item.label}
                </p>
                {item.subLabel && (
                  <p className="text-[10px] text-slate-400 truncate">
                    {item.subLabel}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Clean, Non-crowded Analytics Metrics Footer */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-5">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Pengunjung
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                {totalVisitors.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-emerald-600">↑ 18.2%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Periode terpilih</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Tayangan Halaman
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                {totalPageviews.toLocaleString()}
              </span>
              <span className="text-[10px] font-medium text-slate-500">views</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Rata-rata 2.4 hal/sesi</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Puncak Kunjungan
            </span>
            <div className="mt-1">
              <span className="text-sm font-bold text-slate-900">
                {peakItem.label}
              </span>
              <span className="ml-1.5 text-xs font-semibold text-[#142c58]">
                ({peakItem.value} user)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Trafik tertinggi</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Akses Perangkat
            </span>
            <div className="mt-1 flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Mobile 68%</span>
              <span className="text-slate-400 font-normal">|</span>
              <span>Desktop 32%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Perangkat pengguna</p>
          </div>
        </div>
      </div>
    </div>
  );
}
