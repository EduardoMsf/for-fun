import { Size } from '@/src/interfaces';
import clsx from 'clsx';

interface Props {
  selectedSize: Size;
  availableSizes?: Size[];
}

export const SizeSelector = ({ selectedSize, availableSizes }: Props) => {
  const sizes = availableSizes;

  return (
    <div className="my-5">
      <h3 className="font-bold mb-2">Select Size</h3>
      <div className="flex gap-2">
        {availableSizes?.map((size) => (
          <button
            key={size}
            className={clsx(`mx-2 text-lg cursor-pointer`, {
              underline: size === selectedSize,
            })}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
