"use client";

import { useSession } from 'next-auth/react'
import React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { User } from '@/types/Message'
import { addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { limitedMessagesRef, messagesRef } from '../lib/converters/Message'
import { useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast';
import { useSubscriptionStore } from '@/store/store';
import { ToastAction } from './ui/toast';

const FormSchema = z.object({
  input: z.string().max(1000),
  // users: z.array(z.string()),
  // messages: z.array(z.string()),
  // createdAt: z.date(),
  // updatedAt: z.date(),
})

function ChatInput({chatId}: {chatId: string}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const subscription = useSubscriptionStore((state) => state.subscription);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      input: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("[form data]", data);

    if (data.input.length === 0) return;

    if (!session?.user?.id) return;

    // TODO: check if user is pro and limit them the creation of new chat
    //
    const messages = (await getDocs(limitedMessagesRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;

    const isPro =
      subscription?.role === "pro" && subscription?.status === "active";

    if (!isPro && messages >= 20) {
      toast({
        title: "Free plan limit reached",
        description:
          "You have reached the limit of 20 messages per chat. Upgrade to PRO to continue chatting.",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Upgrade"
            onClick={() => router.push("/register")}
          >
            Upgrade to PRO
          </ToastAction>
        ),
      });

      return;
    }

    const userToStore: User = {
      id: session?.user?.id,
      name: session?.user?.name,
      email: session?.user?.email,
      image: session?.user?.image,
    };

    await addDoc(messagesRef(chatId), {
      input: data.input,
      timestamp: serverTimestamp(),
      user: userToStore,
    });

    form.reset();
  };

  return (
    <div className="sticky bottom-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex space-x-2 p-2 rounded-t-xl max-w-4xl mx-auto bg-white border dark:bg-slate-800"
        >
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="border-none bg-transparent dark:placeholder:text-white/70"
                    placeholder="Enter message in ANY language..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-violet-600 text-white">
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ChatInput