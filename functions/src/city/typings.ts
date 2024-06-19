export type City = {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export type CityRequest = Partial<City>
