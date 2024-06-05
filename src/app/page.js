import { createClient } from '@/app/utils/supabase/server'
import NavBar from "./components/NavBar";
import styles from "./page.module.css";

export default async function Home() {

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className={styles.main}>
    <NavBar user={user} />
    </main>
  );
}
