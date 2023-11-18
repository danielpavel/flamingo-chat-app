"use client";

import { onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import { subscriptionRef } from '../lib/converters/Subscription';
import { useSubscriptionStore } from '@/store/store';

function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription
  );

  useEffect(() => {
    if (!session?.user?.id) return;

    return onSnapshot(subscriptionRef(session?.user?.id), (snapshot) => {
      if (snapshot.empty) {
        console.log("User has NO active subscription");
        setSubscription(null);
        return;
      } else {
        console.log("User has an active subscription");
        setSubscription(snapshot.docs[0].data());
      }
    });
  }, [session, setSubscription]);

  return <>{children}</>;
}

export default SubscriptionProvider;