/**
 * Shared design tokens for the internal admin workspace.
 *
 * Public pages keep using the existing global Tailwind theme. These tokens are
 * intentionally scoped to Admin so an admin redesign never changes the
 * school-facing website by accident.
 */
export const adminTheme = {
  colors: {
    primary: "#07528c",
    primaryDark: "#063b68",
    sidebar: "#07528c",
  },
  typography: {
    label: "text-sm font-medium text-slate-700",
    sectionTitle: "text-base font-semibold tracking-tight text-slate-900",
    helper: "text-sm text-slate-500",
  },
  spacing: {
    page: "p-4 sm:p-7",
    section: "p-5 sm:p-6",
    form: "space-y-5",
  },
  radius: {
    surface: "rounded-2xl",
    control: "rounded-xl",
  },
  shadow: {
    surface: "shadow-xs",
    elevated: "shadow-sm",
  },
  classNames: {
    shell: "min-h-dvh bg-slate-50/70 text-slate-800 lg:pl-56",
    desktopSidebar:
      "fixed inset-y-0 left-0 z-30 hidden w-56 overflow-y-auto rounded-tr-[3.5rem] lg:block",
    mobileSidebar:
      "fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-64 max-w-[85vw] rounded-r-[2.5rem] border-0 p-0 backdrop:bg-slate-950/60",
    pageContent: "flex-1 space-y-6 p-4 sm:p-7",
    primaryButton:
      "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark",
    surface: "rounded-2xl border border-slate-200/80 bg-white shadow-xs",
    field:
      "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15",
  },
} as const;
