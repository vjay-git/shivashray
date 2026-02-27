export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-grow pt-[72px]">
      {children}
    </main>
  );
}
