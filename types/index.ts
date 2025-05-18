export type CoffeeStoreStart = {
    id: number;
    name: string;
    imgUrl: string;
    href: string;
  };


// coffee-store.ts types
export interface OpenStreetMapElement {
    id: number;
    lat: number;
    lon: number;
    tags: {
      name?: string;
      "name:en"?: string;
      brand?: string;
      opening_hours?: string;
      amenity?: string;
      [key: string]: string | undefined;
    };
    type: string;
  }
  
  export interface OpenStreetMapResponse {
    elements: OpenStreetMapElement[];
  }
  
  export interface Location {
    lat: number;
    lng: number;
  }
  
  export interface CoffeeStoreBasic {
    id: number;
    name: string;
    imgUrl: string;
    brand: string;
    hours: string;
    location: Location;
  }
  
  export interface CoffeeStore extends CoffeeStoreBasic {
    address: string;
    neighbourhood: string;
    href: string;
  }
  
  export interface NominatimAddress {
    suburb?: string;
    neighbourhood?: string;
    [key: string]: string | undefined;
  }
  
  export interface NominatimResponse {
    display_name: string;
    address: NominatimAddress;
  }
 
  export type CoffeeStoreType = {
    id: string;
    name: string;
    imgUrl: string;
    address: string;
    voting: number;
  };

  export type AirtableRecordType = {
    id: string;
    recordId: string;
    fields: CoffeeStoreType;
  };