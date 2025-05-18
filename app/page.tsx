import Card from '@/components/card.server';
import { fetchCoffeeStores } from '@/lib/coffee-stores';
import { CoffeeStoreStart } from '@/types';
import NearbyCoffeeStores from '@/components/nearby-coffee-stores.client';

async function getCoffeeStores() {
  return await fetchCoffeeStores('43.65,-79.4,43.7,-79.35', 10);
}


export default async function Home() {
  const coffeeStores = await getCoffeeStores();
  console.log(coffeeStores);

  return (
    <div className="mb-56">
      <main className="mx-auto mt-10 max-w-6xl px-4">
        <NearbyCoffeeStores />
        <div className="mt-20">
          <h2 className="mt-8 pb-8 text-4xl font-bold text-white">Toronto Coffee Stores</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {coffeeStores.map((coffeeStore: CoffeeStoreStart) => (
              <Card key={`${coffeeStore.name}-${coffeeStore.id}`} name={coffeeStore.name} imgUrl={coffeeStore.imgUrl} href={`/coffee-store/${coffeeStore.id.toString()}`} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
