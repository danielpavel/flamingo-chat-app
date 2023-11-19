"use client";

import { ChatMembers } from '@/types/ChatMembers'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import React from 'react'
import { useSession } from 'next-auth/react';
import { chatMembersCollectionGroupRef } from '../lib/converters/ChatMembers';
import { MessagesSquareIcon } from 'lucide-react';
import CreateChatButton from './CreateChatButton';
import ChatListRow from './ChatListRow';

function ChatListRows({ initialChats }: { initialChats: ChatMembers[]}) {
  const { data: session } = useSession();

  const [members, loading, error] = useCollectionData<ChatMembers>(
    session && chatMembersCollectionGroupRef(session?.user?.id),
    { initialValue: initialChats }
  );

  if (members?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center pt-40 space-y-2">
        <MessagesSquareIcon className="w-10 h-10" />
        <h1 className="text-5xl font-extralight">Welcome</h1>
        <h2 className="pb-10">Lets get your started by creating a new chat</h2>

        <CreateChatButton isLarge={true} />
      </div>
    );
  }

  return (
    <div>
      {members?.map((member, i) => (
        <ChatListRow key={member.chatId} chatId={member.chatId} />
      ))}
    </div>
  );
}

export default ChatListRows