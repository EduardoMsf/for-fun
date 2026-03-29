import { titleFont } from '@/src/config/font';

export default function LoginPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center  font-sans ">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16  sm:items-start">
        <h1 className={`${titleFont.className} font-bold text-white`}>Login</h1>
      </main>
    </div>
  );
}
