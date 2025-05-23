// src/hooks/useI18nReady.js
'use client';

import { useState, useEffect } from 'react';
import i18n from '@/i18n';

export function useI18nReady() {
  const [ready, setReady] = useState(i18n.isInitialized);

  useEffect(() => {
    const onInitialized = () => setReady(true);

    if (!i18n.isInitialized) {
      i18n.on('initialized', onInitialized);
      return () => {
        i18n.off('initialized', onInitialized); // 👈 cleanup khi unmount
      };
    }
  }, []);

  return ready;
}
