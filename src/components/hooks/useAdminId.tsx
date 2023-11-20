import { chatMemberAdminRef } from '@/src/lib/converters/ChatMembers';
import { getDocs } from 'firebase/firestore';
import React from 'react'

function useAdminId({ chatId }: { chatId: string }) {
  const [adminId, setAdminId] = React.useState<string>("");

  React.useEffect(() => {
    const fetchAdminStatus = async () => {
      const adminId = (await getDocs(chatMemberAdminRef(chatId))).docs.map(
        (doc) => doc.data()
      )[0];

      setAdminId(adminId.userId);
    };

    fetchAdminStatus();
  }, [chatId]);

  return adminId;
}

export default useAdminId