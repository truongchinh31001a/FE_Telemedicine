'use client';
import { useEffect } from 'react';
import '@/i18n';

export default function I18nProvider({ children }) {
  useEffect(() => {}, []); // Chỉ để import i18n 1 lần
  return children;
}
