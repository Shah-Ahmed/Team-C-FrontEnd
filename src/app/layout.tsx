import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TechProject - Team C",
  description: "AI Content and Social Automation Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0B1220', color: '#F8FAFC', minHeight: '100vh', margin: 0 }}>
        <AuthProvider>
          <Navbar />
          <main style={{ maxWidth: '1050px', margin: '0 auto', padding: '24px 20px 60px' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}


