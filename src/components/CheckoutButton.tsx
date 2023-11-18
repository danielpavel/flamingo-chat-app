"use client";

import { db } from '@/firebase';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React from 'react'
import LoadingSpinner from './LoadingSpinner';
import { useSubscriptionStore } from '@/store/store';
import ManageAccountButton from './ManageAccountButton';

function CheckoutButton() {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);
  const subscription = useSubscriptionStore((state) => state.subscription);

  const isSubscriptionLoading = subscription === undefined;

  const isSubscribed = subscription?.role === 'pro' && subscription?.status === "active";

  const createCheckoutSession = async () => {
    if (!session?.user.id) return;
    // push a document into firestore db

    setLoading(true);
    // ... stripe extension on firebase will create a checkout session
    const docRef = await addDoc(
      collection(db, "customers", session.user.id, "checkout_sessions"),
      {
        price: "price_1ODTZ3AWnOroQHI26w43mLUw",
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    return onSnapshot(docRef, (snap) => {
      const data = snap.data();
      const url = data?.url;
      const error = data?.error;

      if (error) {
        // Show an error to your customer
        // inspect Clout Functions in your Firebase store
        alert(`An error occured: ${error.message}`);
        setLoading(false);
      }

      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
        setLoading(false);
      }
    });

    // redirect user to checkout page
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:opacity-80">
        {isSubscribed ? (
          <ManageAccountButton />
        ) : isSubscriptionLoading || loading ? (
          <LoadingSpinner />
        ) : (
          <button onClick={() => createCheckoutSession()}>Sign Up</button>
        )}
      </div>
    </div>
  );
}

export default CheckoutButton