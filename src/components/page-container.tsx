interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return <div className="flex h-full w-full flex-col gap-2">{children}</div>;
}
