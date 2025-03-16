import { auth } from '@clerk/nextjs/server'
import React from 'react'
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/actions/user/get-current-user';
import Chat from '@/components/talk/Chat';

const page = async() => {
    const User = await getCurrentUser();
  if (!User) return null;

  const user = await prisma.user.findUnique({
    where: { id: User.id },
    include: {
      bankAccounts: true,
      budgets: true,
      chats: true,
      workspace: true,
      Category: true,
      assets: true,
      investments: true,
      liabilities: true,
      savingsGoals: true,
    },
  });
 

  return (
    <Chat user={user} />
  )
}

export default page