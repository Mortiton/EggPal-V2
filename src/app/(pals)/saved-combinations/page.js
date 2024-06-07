import { fetchSavedBreedingCombos } from './actions';
import { createClient } from '@/app/utils/supabase/server';
import ChildButton from './components/ChildButton';
import styles from './page.module.css';

/**
 * SavedBreedingPage component that displays the saved breeding combinations.
 *
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
      <h1>Saved Breeding Combinations</h1>
      <div className={styles.childGrid}>
        {Object.entries(groupedByChild).map(([child, combos]) => (
          <ChildButton key={child} child={child} combos={combos} userId={user.id} />
        ))}
      </div>
    </div>
  );
}
