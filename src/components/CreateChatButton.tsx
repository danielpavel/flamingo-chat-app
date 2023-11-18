"use client"

import React from 'react'
import { Button } from './ui/button'
import { MessageSquarePlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useSubscriptionStore } from '@/store/store'
import { useSession } from 'next-auth/react'
import { v4 as uuidv4 } from "uuid"
import { addChatRef } from '../lib/converters/ChatMembers'
import { serverTimestamp, setDoc } from 'firebase/firestore'

function CreateChatButton({ isLarge = false }: {isLarge?: boolean}) {
  const { data: session } = useSession()
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const subscription = useSubscriptionStore((state) => state.subscription);

  const createNewChat = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    toast({
      title: "Creating new chat...",
      description: "Hold tight while we create your new chat",
      duration: 3000,
    });

    // TODO: Check if user is pro and limit to create only a 1 chat;

    const chatId = uuidv4();
    await setDoc(addChatRef(chatId, session.user.id), {
      userId: session?.user?.id,
      email: session?.user?.email,
      timestamp: serverTimestamp(),
      isAdmin: true,
      chatId: chatId,
      image: session?.user?.image || "",
    })
      .then(() => {
        toast({
          title: "Success",
          description: "You can now start chatting with your friends",
          className: "bg-green-500 text-white",
          duration: 2000,
        });

        router.push(`/chat/${chatId}`);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "There was an error creating your chat",
          variant: "destructive"
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Button variant={"ghost"} onClick={createNewChat}>
      <MessageSquarePlusIcon />
    </Button>
  );
}

export default CreateChatButton