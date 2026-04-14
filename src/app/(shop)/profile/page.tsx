import { auth } from '@/src/auth.config';
import { Title } from '@/src/components';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/');

  return (
    <div>
      <Title title={session.user.name} />
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <div>{session.user.role}</div>
    </div>
  );
}
