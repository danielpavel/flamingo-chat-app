"use client";

import { LanguageSupportedMap, SupportedLanguages, useLanguageStore, useSubscriptionStore } from '@/store/store';
import { usePathname } from 'next/navigation';
import React from 'react'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from './ui/select';
import LoadingSpinner from './LoadingSpinner';
import Link from 'next/link';

function LanguageSelect() {
  const [language, setLanguage, getLanguages, getNoTLanguagesSupported] =
    useLanguageStore((state) => [
      state.language,
      state.setLanguage,
      state.getLanguages,
      state.getNoTLanguagesSupported,
    ]);

  const [subscription] = useSubscriptionStore((state) => [state.subscription]);
  const isPro = subscription?.role === 'pro' && subscription?.status === 'active';

  const pathName = usePathname()
  const isChatPage = pathName.includes('/chat')

  return (
    isChatPage && (
      <div>
        <Select onValueChange={(e: SupportedLanguages) => setLanguage(e)}>
          <SelectTrigger className="w-[150px] text-black dark:text-white">
            <SelectValue placeholder={LanguageSupportedMap[language]} className=''/>
          </SelectTrigger>

          <SelectContent>
            {subscription === undefined ? (
              <LoadingSpinner />
            ) : (
              <>
                {getLanguages(isPro).map((language) => (
                  <SelectItem key={language} value={language}>
                    {LanguageSupportedMap[language]}
                  </SelectItem>
                ))}

                {getNoTLanguagesSupported(isPro).map((language) => (
                  <Link href="/register" key={language} prefetch={false}>
                    <SelectItem
                      key={language}
                      value={language}
                      disabled
                      className="bg-gray-300/50 text-gray-500 dark:text-white py-2 m-1"
                    >
                      {LanguageSupportedMap[language]} (PRO)
                    </SelectItem>
                  </Link>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    )
  );
}

export default LanguageSelect