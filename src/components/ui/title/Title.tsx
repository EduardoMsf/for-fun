import { titleFont } from '@/src/config/font';

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

export const Title = ({ title, subtitle, className }: Props) => {
  return (
    <div className={`mt-3 ${className} ${titleFont.className} `}>
      <h1 className={` antialiased text-4xl font-bold font-semibold my-7`}>
        {title}
      </h1>
      {subtitle && <h3 className="text-xl mb-15 font-light">{subtitle}</h3>}
    </div>
  );
};
