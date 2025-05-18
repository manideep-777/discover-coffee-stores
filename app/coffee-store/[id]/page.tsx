import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCoffeeStores, fetchCoffeeStore } from '@/lib/coffee-stores';
import { CoffeeStoreStart, CoffeeStoreType } from '@/types';
import Upvote from '@/components/upvote.client';
// import { createCoffeeStore } from '@/lib/airtable';

type Params = {
  id: string;
}

async function getData(id: string) {
  // const airtableRecord = await createCoffeeStore({ name: 'Test', imgUrl: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80', address: '123 Main St, Anytown, USA' } as CoffeeStoreType, id);
  // console.log('airtableRecord', airtableRecord);
  return await fetchCoffeeStore(id);
}

export async function generateStaticParams() {
  const coffeeStores = await fetchCoffeeStores('43.65,-79.4,43.7,-79.35', 10);
  return coffeeStores.map((coffeeStore: CoffeeStoreStart) => ({
    id: coffeeStore.id.toString(),
  }));
}

// Use the official Next.js type for page components
export default async function CoffeeStorePage({ params }: { params: Promise<Params> }) {
  
  const { id } = await params;
  console.log(id);

  const coffeeStore = await getData(id);
  console.log(coffeeStore);

  const { name = '', address = '', imgUrl = '', voting = 0 } = coffeeStore as unknown as CoffeeStoreType;

  return (
    <div className="h-full pb-80">
      <div className="m-auto grid max-w-full px-12 py-12 lg:max-w-6xl lg:grid-cols-2 lg:gap-4">
        <div className="">
          <div className="mb-2 mt-24 text-lg font-bold">
            <Link href="/" prefetch={true}>← Back to home</Link>
          </div>
          <div className="my-4">
            <h1 className="text-4xl">{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={740}
            height={360}
            className="max-h-[420px] min-w-full max-w-full rounded-lg border-2 sepia lg:max-w-[470px] "
            alt={'Coffee Store Image'}
          />
        </div>

        <div className={`glass mt-12 flex-col rounded-lg p-4 lg:mt-48`}>
          {address && (
            <div className="mb-4 flex">
                <Image
                  src="/static/icons/places.svg"
                  width="24"
                  height="24"
                  alt="places icon"
                />
              <p className="pl-2">{address}</p>
            </div>
          )}
          <Upvote voting={voting} id={id} />
        </div>
      </div>
    </div>
  );
}