import { createClient } from '@/app/utils/supabase/server'
import localFont from 'next/font/local';
import NavBar from './components/NavBar';
import "./globals.css";
import Head from 'next/head';

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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body className={mainFont.className}>
        <header>
          <NavBar user={user} />
        </header>
        <main>
          {children}
        </main>
        <div id="modal-root"></div> 
      </body>
    </html>
  );
}