import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import NavBar from './components/NavBar';
import "./globals.css";

export const metadata = {
  title: "EggPal",
  description: "Palword Breeding Companion",
};

const mainFont = localFont({
  src: './fonts/slkscr.ttf',
  display: 'swap',
});

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={mainFont.className}>
      {children}
      </body>
    </html>
  );
}
