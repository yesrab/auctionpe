import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
// import SessionContextProvider from "./context/SessionContextProvider";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "AutionPe",
  description: "AutionPe",
};
import dynamic from "next/dynamic";
const SessionContextProvider = dynamic(() => import("./context/SessionContextProvider"), {
  ssr: false,
});
export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <SessionContextProvider>{children}</SessionContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
