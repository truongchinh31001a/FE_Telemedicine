'use client';

import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import I18nProvider from './I18nProvider';
import { store } from '@/store';
import 'react-toastify/dist/ReactToastify.css';
import i18n from '@/i18n';

export default function RootClientProviders({ children }) {
  return (
    <Provider store={store}>
      <I18nProvider i18n={i18n}>
        {children}
        <ToastContainer />
      </I18nProvider>
    </Provider>
  );
}
