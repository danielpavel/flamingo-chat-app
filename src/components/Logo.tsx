import LogoImage from '@logos/flamingo_logo.svg'
import Link from 'next/link'

import React from 'react'
import { AspectRatio } from './ui/aspect-ratio';
import Image from 'next/image';

function Logo() {
  return (
    <Link href="/" className="overflow-hidden" prefetch={false}>
      <div className="flex items-center w-14 h-14">
        <AspectRatio
          ratio={16 / 9}
          className="flex items-center justify-center"
        >
          <Image
            priority
            src={LogoImage}
            alt="Flamingo Logo"
            className="rounded-full dark:filter dark:invert"
          />
        </AspectRatio>
      </div>
    </Link>
  );
}

export default Logo