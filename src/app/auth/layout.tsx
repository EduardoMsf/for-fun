export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex justify-center">
      <div className="w-full sm:w-87.5 px-10">{children}</div>
    </main>
  );
}
