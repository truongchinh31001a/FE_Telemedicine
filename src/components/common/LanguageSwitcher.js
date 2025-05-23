'use client';

import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'antd';
import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import Image from 'next/image';

import viFlag from '@/assets/flags/vn.png';
import enFlag from '@/assets/flags/us.png';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState('vi');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng') || i18n.language || 'vi';
    i18n.changeLanguage(storedLang);
    setLang(storedLang);
    setMounted(true);
  }, [i18n]);

  const handleChange = (value) => {
    i18n.changeLanguage(value);
    localStorage.setItem('i18nextLng', value);
    setLang(value);
  };

  if (!mounted) return null;

  const flagMap = {
    vi: viFlag,
    en: enFlag,
  };

  const labelMap = {
    vi: 'Tiếng Việt',
    en: 'English',
  };

  const menuItems = [
    {
      key: 'vi',
      label: (
        <div className="flex items-center gap-2" onClick={() => handleChange('vi')}>
          <Image src={viFlag} alt="Vietnam" width={20} height={14} />
          Tiếng Việt
        </div>
      ),
    },
    {
      key: 'en',
      label: (
        <div className="flex items-center gap-2" onClick={() => handleChange('en')}>
          <Image src={enFlag} alt="English" width={20} height={14} />
          English
        </div>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
      <Button className="flex items-center gap-2 focus:outline-none border-none bg-transparent shadow-none">
        <Image src={flagMap[lang]} alt={lang} width={20} height={14} />
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
