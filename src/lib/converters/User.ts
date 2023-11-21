import { db } from "@/firebase";
import { User } from "next-auth";
import { DocumentData } from "firebase-admin/firestore";
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, collection, collectionGroup, doc, query, where } from "firebase/firestore";

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: function (user: User): DocumentData {
    return {
      email: user.email,
      name: user.name,
      image: user.image,
    };
  },

  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options)!;

    const user: User = {
      id: snapshot.id,
      email: data.email,
      name: data.name,
      image: data.image,
    };

    return user;
  },
};

export const getUserByEmailRef = (email: string) =>
  query(collection(db, "users"), where("email", "==", email)).withConverter(
    userConverter
  );