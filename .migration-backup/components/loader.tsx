export default function LoaderK() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="status"
      aria-live="polite"
      aria-label="جاري التحميل"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-2xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-[#d62598]" />
        <span className="text-sm font-semibold text-gray-700">جاري التحميل...</span>
      </div>
    </div>
  );
}
