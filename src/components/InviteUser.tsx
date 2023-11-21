"use client";

import { useSession } from 'next-auth/react';
import React from 'react'
import * as z from 'zod'
import { useToast } from './ui/use-toast';
import useAdminId from './hooks/useAdminId';
import { useSubscriptionStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { PlusCircleIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { addChatRef, chatMembersRef } from '../lib/converters/ChatMembers';
import { ToastAction } from './ui/toast';
import { getUserByEmailRef } from '../lib/converters/User';

const formSchema = z.object({
  email: z.string().email("Please insert a valid email address"),
})

function InviteUser({ chatId }: { chatId: string }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const adminId = useAdminId({ chatId });
  const subscription = useSubscriptionStore((state) => state.subscription);
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [openInviteLink, setOpenInviteLink] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) return;

    toast({
      title: "Sending invite...",
      description: "Please wait while we send the invite!",
    });

    // We get the number of users in the chat to check if they're about to excee the FREE limit
    const noOfUsersInChat = (await getDocs(chatMembersRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;

    const isPro =
      subscription?.role === "pro" && subscription?.status === "active";

    console.log("[noOfUsersInChat]", noOfUsersInChat);
    console.log("[isPro]", isPro);

    // Check if the user is about to excee the FREE limit.
    if (!isPro && noOfUsersInChat >= 2) {
      toast({
        title: "You've reached the FREE limit",
        description: "Upgrade to Pro to add more users to this chat!",
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

    await getDocs(getUserByEmailRef(values.email))
      .then(async (querySnapshot) => {
        // Check if the user to be invited is registered.
        if (querySnapshot.empty) {
          toast({
            title: "User not found",
            description:
              "Please make sure the user is registered OR resend the invitation once they have signed up",
            variant: "destructive",
          });
        } else {
          const user = querySnapshot.docs[0].data();

          await setDoc(addChatRef(chatId, user.id), {
            userId: user.id!,
            email: user.email!,
            timestamp: serverTimestamp(),
            chatId: chatId,
            isAdmin: false,
            image: user.image || "",
          })
            .then(() => {
              setOpen(false);

              toast({
                title: "User added to chat",
                description: "The user has been added to chat successfully!",
                className: "bg-green-500 text-white",
                duration: 3000,
              });

              setOpenInviteLink(true);
            })
            .catch((err) => {
              toast({
                title: "Error",
                description:
                  "Oops! There was an error adding user to the chat!",
                duration: 3000,
              });

              setOpen(false);
            });
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Oops! There was an error adding user to the chat!",
          duration: 3000,
        });
        setOpen(false);
      });

    form.reset();
  }


  return (
    adminId === session?.user?.id && (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircleIcon className="mr-1" />
              Add User to Chat
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add User to Chat</DialogTitle>
              <DialogDescription>
                Simply enter another user email to add them to this chat!{" "}
                <span className="text-indigo-600 font-bold">
                  (Note: they must be registered)
                </span>
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="jon@doe.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="ml-auto sm:w-fit w-full"
                >
                  Add User
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* <ShareLink
          isOpen={openInviteLink}
          setIsOpen={setOpenInviteLink}
          chatId={chatId}
        /> */}
      </>
    )
  );
}

export default InviteUser;