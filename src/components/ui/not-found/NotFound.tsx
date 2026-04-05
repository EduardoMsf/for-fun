import Image from 'next/image';
import Link from 'next/link';

export const NotFound = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-202.25 w-full justify-center items-center align-middle">
      <div className="text-center px-5 mx-5">
        <h2 className="antialiased text-9xl">404</h2>
        <p className="font-semibold text-xl">Whooops! Lo sentimos mucho.</p>
        <p className="font-light text-xl">
          <span>Puedes regresar al </span>
          <Link
            href="/"
            className=" font-normal transition-all text-blue-700  hover:underline"
          >
            inicio
          </Link>
          <span> o intentar con otra categoría.</span>
        </p>
      </div>

      <div className="px-5 mx-5">
        <Image
          loading="lazy"
          src="/imgs/starman_750x750.png"
          alt="404"
          width={550}
          height={550}
          className="p-5 sm:p-0"
        />
      </div>
    </div>
  );
};
