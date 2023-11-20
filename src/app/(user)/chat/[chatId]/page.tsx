import { authOptions } from '@/auth'
import ChatInput from '@/src/components/ChatInput';
import { getServerSession } from 'next-auth'
import React from 'react'

type Props = {
  params: { chatId: string };
};

async function page({params: { chatId }}: Props) {
  const session = await getServerSession(authOptions);

  return (
    <>
      { /* <AdminControls /> */ }

      { /* <ChatMembersBadge /> */ }

      { /* <ChatMessages /> */ }

      <ChatInput chatId={chatId}/>
    </>
  )
}

export default page