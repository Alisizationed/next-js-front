'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ProtectedRoute({
  children,
  allowedUserId = '0',
}: {
  children: React.ReactNode;
  allowedUserId?: string;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !(allowedUserId == session.user.keycloakId)) {
      router.replace('/');
    }
  }, [session, status, router]);

  if (status === 'loading') return <div>Loading...</div>;

  return <>{children}</>;
}
