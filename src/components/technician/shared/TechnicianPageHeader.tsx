export function TechnicianPageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      {children}
    </header>
  );
}
