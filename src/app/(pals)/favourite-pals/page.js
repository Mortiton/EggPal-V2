import { getFavoritePals } from './actions';
import PalCard from '@/app/components/PalCard';
import styles from './page.module.css'
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function FavouritePalsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login'); // Redirect to login if user is not authenticated
  }

  const favoritePals = await getFavoritePals(user.id);

  if (favoritePals.length === 0) {
    return <div>No favorite pals found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Your Favourite Pals</h1>
      <div className={styles.cardContainer}>
        {favoritePals.map(pal => (
          <PalCard
            key={pal.id}
            palName={pal.name}
            palId={pal.id}
            type1={pal.type1}
            type2={pal.type2}
            workAttributes={{
              kindling: pal.kindling,
              watering: pal.watering,
              planting: pal.planting,
              generating_electricity: pal.generating_electricity,
              handiwork: pal.handiwork,
              gathering: pal.gathering,
              lumbering: pal.lumbering,
              mining: pal.mining,
              medicine_production: pal.medicine_production,
              cooling: pal.cooling,
              transporting: pal.transporting,
              farming: pal.farming,
            }}
          />
        ))}
      </div>
    </div>
  );
}