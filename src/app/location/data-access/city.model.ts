import {Entity} from "../../shared/data-access/fire-store.model";

export type City = {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export type CityServer = City & Entity;

export type CityState = CityServer;
