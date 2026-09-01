type OrDividerProps = {
  label: string;
};

export default function OrDivider({ label }: OrDividerProps) {
  return (
    <div className="my-5 flex items-center gap-2 sm:gap-3">
      <span className="h-px flex-1 bg-gray-200" />
      <span className="shrink-0 text-xs text-gray-400 sm:text-sm">{label}</span>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
