import { getStockBySlug } from '@/src/actions';
import { titleFont } from '@/src/config/font';

interface Props {
  slug: string;
}

export const StockLabel = async ({ slug }: Props) => {
  const stock = await getStockBySlug(slug);

  return (
    <h2 className={`${titleFont.className} antialiased font-bold text-lg`}>
      Stock: {stock}
    </h2>
  );
};
