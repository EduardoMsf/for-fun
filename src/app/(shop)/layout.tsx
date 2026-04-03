import { TopMenu } from '@/src/components';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" min-h-screen">
      <TopMenu />
      {children}
    </main>
  );
}
