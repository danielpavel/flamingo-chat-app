import { authOptions } from '@/auth'
import { getServerSession } from 'next-auth'
import React from 'react'
import { chatMembersCollectionGroupRef } from '../lib/converters/ChatMembers';
import { getDocs } from 'firebase/firestore';
import ChatListRows from './ChatListRows';

async function ChatList() {
  const session = await getServerSession(authOptions);

  const chatSnapshot = await getDocs(
    chatMembersCollectionGroupRef(session?.user?.id)
  );

  const initialChatList = chatSnapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: null,
  }));

  return <ChatListRows initialChats={initialChatList} />
}

export default ChatList