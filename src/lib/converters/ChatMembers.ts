import { db } from "@/firebase";
import { ChatMembers } from "@/types/ChatMembers";
import { DocumentData } from "firebase-admin/firestore";
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, collection, collectionGroup, doc, query, where } from "firebase/firestore";

const chatMembersConverter: FirestoreDataConverter<ChatMembers> = {
  toFirestore: function (chatMember: ChatMembers): DocumentData {
    return {
      userId: chatMember.userId,
      email: chatMember.email,
      timestamp: chatMember.timestamp,
      isAdmin: !!chatMember.isAdmin,
      chatId: chatMember.chatId,
      image: chatMember.chatId,
    };
  },

  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ChatMembers {
    const data = snapshot.data(options)!;

    const member: ChatMembers = {
      userId: snapshot.id,
      email: data.email,
      timestamp: data.timestamp,
      isAdmin: data.isAdmin,
      chatId: data.chatId,
      image: data.image,
    };

    return member;
  },
};

export const addChatRef = (chatId: string, userId: string) =>
  doc(db, "chats", chatId, "members", userId).withConverter(
    chatMembersConverter
  );

export const chatMembersRef = (chatId: string) =>
  collection(db, "chats", chatId, "members").withConverter(
    chatMembersConverter
  );

export const chatMemberAdminRef = (chatId: string, userId: string) =>
  query(
    collection(db, "chats", chatId, "members"),
    where("isAdmin", "==", true)
  ).withConverter(chatMembersConverter);

export const chatMembersCollectionGroupRef = (userId: string) =>
  query(
    collectionGroup(db, "members"),
    where("userId", "==", userId)
  ).withConverter(chatMembersConverter);