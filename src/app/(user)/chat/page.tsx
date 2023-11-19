import ChatList from '@/src/components/ChatList'
import React from 'react'

type Props = {
  params: {};
  searchParams: {
    error: string;
  };
};

function ChatsPage({ params, searchParams }: Props) {
  console.log('ChatsPage');

  return (
    <div>
      {/* <ChatPermissionError /> */}

      Chat Page

      <ChatList />
    </div>
  );
}

export default ChatsPage