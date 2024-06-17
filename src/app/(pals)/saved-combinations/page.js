import { fetchSavedBreedingCombos } from './actions';
import { createClient } from '@/app/utils/supabase/server';
import styles from './page.module.css';
import BreedingCombosDisplay from './components/BreedingCombosDisplay';

export const metadata = {
  title: 'Saved breeding combinations',
  description: 'View your saved breeding combinations',
};

/**
 * SavedBreedingPage component that displays the saved breeding combinations.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default async function SavedBreedingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  const savedCombos = await fetchSavedBreedingCombos(user.id);

    /**
   * Groups the saved combinations by child name.
   *
   * @param {Object} acc - The accumulator object that will be returned.
   * @param {Object} combo - The current combination being processed.
   * @returns {Object} The accumulator object.
   */
  const groupedByChild = savedCombos.reduce((acc, combo) => {
    const childName = combo.child.name;
    if (!acc[childName]) {
      acc[childName] = [];
    }
    acc[childName].push(combo);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Saved Breeding Combinations</h2>
      <p className={styles.description}>Click the pal to reveal your saved breeding combinations.</p>
      <div className={styles.childGrid} role="list" aria-label="List of saved breeding combinations">
        <BreedingCombosDisplay combos={groupedByChild} userId={user.id} />
      </div>
    </div>
  );
}