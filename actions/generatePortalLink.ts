"use server";

import { authOptions } from "@/auth";
import { adminDb } from "@/firebase-admin";

import { getServerSession } from "next-auth";
import { headers } from "next/headers"
import { redirect } from "next/navigation";

import String from "stripe"

const stripe = new String(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

/* TODO: currently broken - fix */
export async function generatePortalLink() {

  const session = await getServerSession(authOptions);
  const host = headers().get("host");

  if (!session || !session?.user.id) {
    return console.error("No User ID found");
  }

  const {
    user: { id },
  } = session!;

  const returnUrl =
    process.env.NODE_ENV === "development"
      ? `http://${host}/account`
      : `https://${host}/account`;

  const doc = await adminDb.collection("customers").doc(id).get();

  if (!doc.data) {
    return console.error("No customer found with ID: ", id);
  }

  const stripeId = doc.data()!.stripeId;

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: stripeId,
    return_url: returnUrl,
  });

  redirect(stripeSession.url);
}