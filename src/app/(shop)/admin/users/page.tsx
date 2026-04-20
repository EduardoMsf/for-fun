export const revalidate = 0;
import { getPaginatedUsers } from '@/src/actions';
import { Pagination, Title } from '@/src/components';
import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';

export default async function UsersAdminPage() {
  const { users, ok } = await getPaginatedUsers();

  if (!ok || !users) {
    redirect('/auth/login?navigateTo=/orders');
  }
  return (
    <>
      <Title title="Client's dashboard" />

      <div className="mb-10">
        <UsersTable users={users} />

        <Pagination totalPages={1} />
      </div>
    </>
  );
}
