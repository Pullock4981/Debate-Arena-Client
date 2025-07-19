
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: 'Debate Arena',
  description: 'Join the battle of opinions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-white shadow p-4">
          <Navbar></Navbar>
        </header>
        
        <main>{children}</main>
      </body>
    </html>
  );
}
