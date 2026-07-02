import type { ReactNode } from "react";

export const metadata = {
  title: "XOpus Admin — Dashboard",
  description: "Dashboard administrateur XOpus pour gérer les comptes et modules.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}