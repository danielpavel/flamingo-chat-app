"use client";

import { Message } from '@/types/Message';
import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { limitedMessagesRef } from '../lib/converters/Message';
import { Skeleton } from './ui/skeleton';
import { useRouter } from 'next/navigation';
import UserAvatar from './UserAvatar';
import { useSession } from 'next-auth/react';

function ChatListRow({chatId}: {chatId: string}) {
  const router = useRouter();
  const [messages, loading, error] = useCollectionData<Message>(
    limitedMessagesRef(chatId)
  );
  const { data: session } = useSession();

  const preetyUUID = (n = 4) => {
    return chatId.substring(0, n);
  }

  const row = (message?: Message) => (
    <div
      key={chatId}
      onClick={() => router.push(`/chat/${chatId}`)}
      className="flex p-5 items-center cursor-pointer space-x-2 hover:bg-gray-100 dark:bg-slate-700"
    >
      <UserAvatar
        name={message?.user.name || session?.user.name}
        image={message?.user.image || session?.user.image}
      />

      <div className="flex-1">
        <p className="font-bold">
          {!message && "New Chat"}
          {message &&
            [message?.user.name || session?.user.name].toString().split(" ")[0]}
        </p>

        <p className="text-gray-400 line-clamp-1">
          {message?.translated?.["en"] || "Get the conversation started"}
        </p>
      </div>

      <div className="text-xs text-right text-gray-400">
        <p className="mb-auto">
          {message
            ? new Date(message.timestamp).toLocaleDateString()
            : "No messages yet"}
        </p>
        <p>chat #{preetyUUID()}</p>
      </div>
    </div>
  );

  return (
    <div>
      {loading && (
        <div className="flex p-5 items-center space-x-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      )}

      {messages?.length === 0 && !loading && row()}

      {messages && messages.map((message) => row(message))}
    </div>
  );
}

export default ChatListRow