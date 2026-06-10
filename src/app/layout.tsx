import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import LeadModal from "@/components/lead-modal";
import AuriChatbot from "@/components/auri-chatbot";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Aurenza Academy - Premium Global IT & AI Career Certifications",
  description: "Transform your career with industry-recognized certifications. Enroll in elite live cohorts for Java Full Stack, Next.js UI Engineering, Data Science, and Machine Learning with direct placement referrals.",
  icons: {
    icon: "/logo.png",
  },
  keywords: ["Aurenza Academy", "PMP Certification", "CAPM prep", "Java Full Stack Development", "Next.js certification", "Machine Learning Bootcamp", "AI career training", "Hiring Partners", "Visakhapatnam EdTech"],
  metadataBase: new URL("https://www.aurenzaacademy.com"),
  openGraph: {
    title: "Aurenza Academy | Advance Your Career With Elite Certifications",
    description: "Equipping graduates and professionals with high-income tech skills. Learn from ex-Amazon/Google specialists.",
    url: "https://www.aurenzaacademy.com",
    siteName: "Aurenza Academy",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
        alt: "Aurenza Academy Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurenza Academy | Advance Your Career With Elite Certifications",
    description: "Equipping graduates and professionals with high-income tech skills.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col justify-between relative bg-enterpriseBg">
        {/* Floating particles background overlay */}
        <div className="floating-particles pointer-events-none">
          <div className="floating-particle" style={{ left: "15%", animationDelay: "2s" }}></div>
          <div className="floating-particle" style={{ left: "35%", animationDelay: "5s" }}></div>
          <div className="floating-particle" style={{ left: "55%", animationDelay: "1s" }}></div>
          <div className="floating-particle" style={{ left: "75%", animationDelay: "8s" }}></div>
          <div className="floating-particle" style={{ left: "85%", animationDelay: "3s" }}></div>
        </div>

        {/* Global Notifications system */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0E061A',
              color: '#ffffff',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '13px',
              fontFamily: 'sans-serif'
            }
          }}
        />

        <NavBar />
        
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>
        
        <Footer />
        <AuriChatbot />
        <LeadModal />
      </body>
    </html>
  );
}
