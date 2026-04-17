import { Title } from '@/src/components';
import { AddressForm } from './ui/AddressForm';
import { getCountries, getUserAddress } from '@/src/actions';
import { auth } from '@/src/auth.config';

export default async function CheckoutAddressPage() {
  const countries = await getCountries();

  const session = await auth();

  const userAddress = (await getUserAddress(session!.user.id)) ?? undefined;
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-250 flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm countries={countries} userStoreAddress={userAddress} />
      </div>
    </div>
  );
}
