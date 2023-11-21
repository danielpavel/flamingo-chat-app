import { authOptions } from "@/auth";
import AdminControls from "@/src/components/AdminControls";
import ChatInput from "@/src/components/ChatInput";
import ChatMembersBadges from "@/src/components/ChatMembersBadges";
import ChatMessages from "@/src/components/ChatMessages";
import { messagesRef } from "@/src/lib/converters/Message";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";
import React from "react";

type Props = {
  params: { chatId: string };
};

async function page({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions);

  const initialMessages = (await getDocs(messagesRef(chatId))).docs.map((doc) =>
    doc.data()
  );

  return (
    <>
      <AdminControls chatId={chatId}/>

      <ChatMembersBadges chatId={chatId} />

      <div className="flex-1">
        <ChatMessages
          chatId={chatId}
          session={session}
          initialMessages={initialMessages}
        />
      </div>

      <ChatInput chatId={chatId} />
    </>
  );
}

export default page;