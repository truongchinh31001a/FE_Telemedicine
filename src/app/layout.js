import '../styles/globals.css';
import RootClientProviders from '@/components/providers/RootClientProviders';

export const metadata = {
  title: 'My App',
  description: 'Next.js + Tailwind + Ant Design App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootClientProviders>
          {children}
        </RootClientProviders>
      </body>
    </html>
  );
}
