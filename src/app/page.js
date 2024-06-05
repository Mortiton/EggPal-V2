import { getPals } from './actions';
import PalList from './components/PalList';
import styles from './page.module.css';

export default async function HomePage() {
  const pals = await getPals();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Pal List</h1>
      <PalList pals={pals} />
    </div>
  );
}