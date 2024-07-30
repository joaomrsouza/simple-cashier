interface PageHeaderProps {
  children: React.ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  return <h2 className="text-3xl font-semibold">{children}</h2>;
}
