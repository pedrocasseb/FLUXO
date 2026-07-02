export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-[#E8B8AE] bg-[#FBEEE9] px-4 py-3 text-[13px] leading-relaxed text-[#A5402F]"
    >
      {message}
    </div>
  );
}
