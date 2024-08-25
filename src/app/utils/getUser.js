import { headers } from 'next/headers';

export async function getUser() {
  const headersList = headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');

  if (!userId || !userEmail) {
    return null; // or redirect to login if necessary
  }

  return { id: userId, email: userEmail };
}