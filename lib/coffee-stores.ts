import { OpenStreetMapResponse, CoffeeStoreBasic, CoffeeStore } from '@/types';
// import { createCoffeeStore } from '@/lib/airtable';

export async function fetchCoffeeStores(longLat: string, limit: number) {
    try {
        const query = `
      [out:json];
      node["amenity"="cafe"](${longLat});
      out body ${limit};
    `;
        console.log(query);
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
    
        if (!response.ok) {
          console.error("API error:", response.status);
          return [];
        }
    
        const data: OpenStreetMapResponse = await response.json();

        // Get Unsplash photos
        const photos = await getListOfCoffeeStorePhotos();
        const defaultImgUrl = "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2215&q=80";
    
        // Get stores with basic info first
        const storesWithBasicInfo: CoffeeStoreBasic[] = data.elements.slice(0, limit).map((element, idx) => ({
          id: element.id,
          name: element.tags.name || element.tags["name:en"] || "Unnamed Cafe",
          imgUrl: photos && photos[idx] ? photos[idx] : defaultImgUrl,
          brand: element.tags.brand || "",
          hours: element.tags.opening_hours || "",
          location: {
            lat: element.lat,
            lng: element.lon
          }
        }));
        console.log('storesWithBasicInfo', storesWithBasicInfo);
    
        // Add address information using getAddress()
        const storesWithAddresses: CoffeeStore[] = await Promise.all(
          storesWithBasicInfo.map(async (store): Promise<CoffeeStore> => {
            const address = await getAddress(store.location.lat, store.location.lng);
            return {
              ...store,
              address,
              neighbourhood: "Toronto", // You can enhance this with more info if needed
              href: `/coffee-store/${store.id}`
            };
          })
        );
        console.log('storesWithAddresses', storesWithAddresses);
        // const airtableRecords = await Promise.all(storesWithAddresses.map(async (store: CoffeeStore) => {
        //   const { id, name, imgUrl, address } = store;
        //   const airtableRecord = await createCoffeeStore({ name, imgUrl, address } as CoffeeStoreType, id.toString());
        //   console.log('airtableRecord', airtableRecord);
        //   return airtableRecord;
        // }));
        // console.log('airtableRecords', airtableRecords);
        return storesWithAddresses;
    } catch (error) {
        console.error("Failed to fetch coffee stores:", error);
        return [];
    }
}

export async function fetchCoffeeStore(id: string) {
  try {
    // First try to find the store in our local cache
    const coffeeStores = await fetchCoffeeStores('43.65,-79.4,43.7,-79.35', 10);
    const store = coffeeStores.find((store: CoffeeStore) => store.id.toString() === id);
    
    if (store) {
      console.log("store found in local cache");
      return store; // Return the found store in the expected format
    }
    
    // If store not found in our cache, fetch from OpenStreetMap directly
    const query = `
      [out:json];
      node(${id});
      out body;
    `;
    
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch coffee store with id ${id}`);
    }
    
    const data = await response.json();
    
    if (!data.elements || data.elements.length === 0) {
      throw new Error(`No coffee store found with id ${id}`);
    }
    
    const element = data.elements[0];
    
    // Format the response to match your required structure
    const coffeeStore = {
      id: element.id,
      name: element.tags.name || element.tags["name:en"] || "Unnamed Cafe",
      imgUrl: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2215&q=80",
      brand: element.tags.brand || "",
      hours: element.tags.opening_hours || "",
      location: {
        lat: element.lat,
        lng: element.lon
      },
      address: await getAddress(element.lat, element.lon),
      neighbourhood: "Toronto",
      href: `/coffee-store/${element.id}`
    };
    console.log('store not found in local cache');
    return coffeeStore;
  } catch (error) {
    console.error("Error fetching coffee store:", error);
    return null;
  }
}

// Helper function to get address from coordinates
async function getAddress(lat: number, lng: number): Promise<string> {
  try {
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const response = await fetch(geocodeUrl, {
      headers: { 'User-Agent': 'CoffeeFinder/1.0' }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.display_name || "Address unavailable";
    }
    return "Address unavailable";
  } catch (error) {
    console.error("Error getting address:", error);
    return "Address unavailable";
  }
}

export const getListOfCoffeeStorePhotos = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query="coffee shop"&page=1&perPage=10`
      );
      const photos = await response.json();
      const results = photos?.results || [];
      console.log(results?.map((result: { urls: { small: string } }) => result.urls['small']));
      return results?.map((result: { urls: { small: string } }) => result.urls['small']);
    } catch (error) {
      console.error('Error retrieving a photo', error);
    }
  };