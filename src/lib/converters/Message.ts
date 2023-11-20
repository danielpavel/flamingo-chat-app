import { db } from "@/firebase";
import { Message } from "@/types/Message";
import { DocumentData } from "firebase-admin/firestore";
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, collection, collectionGroup, doc, limit, orderBy, query, where } from "firebase/firestore";

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: function (message: Message): DocumentData {
    return {
      id: message.id,
      input: message.input,
      timestamp: message.timestamp,
      user: message.user,

      // translated: message.translated,
    };
  },

  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Message {
    const data = snapshot.data(options)!;

    const message: Message = {
      id: snapshot.id,
      input: data.input,
      timestamp: data.timestamp?.toDate(),
      user: data.user,
      translated: data.translated,
    };

    return message;
  },
};

export const messagesRef = (chatId: string) =>
  collection(db, "chats", chatId, "messages").withConverter(messageConverter);

export const limitedMessagesRef = (chatId: string) =>
  query(messagesRef(chatId), limit(25));

export const sortedMessagesRef = (chatId: string) =>
  query(messagesRef(chatId), orderBy("timestamp", "asc"));

export const limitedSortedMessagesRef = (chatId: string) =>
  query(limitedMessagesRef(chatId), orderBy("timestamp", "asc"));