import { createClient } from '@/app/utils/supabase/server'
import localFont from 'next/font/local';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
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

export default async function RootLayout({ children }) {

    const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={mainFont.className}>
        <header>
          <NavBar user={user} />
        </header>
        <div className="page-container">
        <main className="content-wrap">
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
        </div>
        <div id="modal-root"></div> 
      </body>
    </html>
  );
}