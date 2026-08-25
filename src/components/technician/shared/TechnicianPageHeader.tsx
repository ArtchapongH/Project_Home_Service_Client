export function TechnicianPageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={`${children ? "flex" : "hidden"} min-h-20 flex-col items-stretch gap-3 border-b border-gray-200 bg-white px-4 py-4 md:flex md:flex-row md:items-center md:justify-between md:px-8`}>
      <h1 className="hidden text-lg font-semibold text-gray-900 md:block">{title}</h1>
      {children ? <div className="min-w-0">{children}</div> : null}
    </header>
  );
}
