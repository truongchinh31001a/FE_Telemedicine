// src/app/auth/layout.js
export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-6">{children}</div>
    </div>
  );
}
