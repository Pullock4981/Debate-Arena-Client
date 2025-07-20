// layout.js (server component)
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/providers/SessionWrapper";

export const metadata = {
  title: "Debate Arena",
  description: "Join the battle of opinions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <SessionWrapper>
          <header className="bg-white shadow p-4">
            <Navbar />
          </header>
          <main>{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
