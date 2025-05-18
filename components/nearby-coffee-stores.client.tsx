'use client';

import React, { useEffect, useState } from 'react';
import Banner from './banner.client';
import useTrackLocation from '@/hooks/use-track-location';
import Card from './card.server';
import { CoffeeStoreStart as CoffeeStoreType } from '@/types';
// import { fetchCoffeeStores } from '@/lib/coffee-stores';
// import { CoffeeStoreType } from '@/types';
// import { fetchCoffeeStores } from '@/lib/coffee-stores';

export default function NearbyCoffeeStores() {
  const { handleTrackLocation, isFindingLocation, longLat, locationErrorMsg } =
    useTrackLocation();

  const [coffeeStores, setCoffeeStores] = useState([]);

  const handleOnClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    async function coffeeStoresByLocation() {
      if (longLat) {
        const [lng, lat] = longLat.split(',').map(Number);
        console.log('longitude:', lng, 'latitude:', lat);
        const delta = 0.10; // ~1km, adjust as needed

        const south = lat - delta;
        const north = lat + delta;
        const west = lng - delta;
        const east = lng + delta;

        const bbox = `${south},${west},${north},${east}`;
        try {
          const limit = 10;
          const response = await fetch(
            `/api/getCoffeeStoreByLocation?longLat=${bbox}&limit=${limit}`
          );
          const coffeeStores = await response.json();
          console.log('coffeeStores', coffeeStores);
          setCoffeeStores(coffeeStores);
        } catch (error) {
          console.error(error);
        }
      }
    }

    coffeeStoresByLocation();
  }, [longLat]);

  return (
    <div>
      <Banner
        handleOnClick={handleOnClick}
        ButtonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
      />
      {locationErrorMsg && <p>Error: {locationErrorMsg}</p>}

      {coffeeStores.length > 0 && (
        <div className="mt-20">
          <h2 className="mt-8 pb-8 text-4xl font-bold text-white">
            Stores near me
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-6">
            {coffeeStores.map((coffeeStore: CoffeeStoreType, idx: number) => (
              <Card
                key={`${coffeeStore.name}-${coffeeStore.id}`}
                name={coffeeStore.name}
                imgUrl={coffeeStore.imgUrl}
                href={`/coffee-store/${coffeeStore.id}?idx=${idx}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}