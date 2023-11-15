import React from 'react'
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';

function UserAvatar({
  name,
  image,
  className,
}: {
  name: string;
  image: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("bg-white text-white", className)}>
      {image && (
        <Image
          src={image}
          alt={name || ""}
          width={40}
          height={40}
          priority={true}
          className="rounded-full"
        />
      )}
      <AvatarFallback className='dark:bg-white dark:text-black text-lg'>
        {name?.split(" ").map((n) => n[0]).join("")}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar