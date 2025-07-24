// City data for the 3D Earth component
export interface ICity {
  name: string;
  lat: number;
  lng: number;
  population?: number;
  country?: string;
}

// Expected data format for earth.ts
interface IDataPoint {
  startArray: {
    name: string;
    E: number; // longitude
    N: number; // latitude
  };
  endArray: {
    name: string;
    E: number;
    N: number;
  }[];
}

// Major world cities with coordinates  
const majorCities = [
  // Северная Америка
  { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA', population: 8400000 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, country: 'USA', population: 3900000 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298, country: 'USA', population: 2700000 },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada', population: 2900000 },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332, country: 'Mexico', population: 9200000 },
  
  // Южная Америка
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil', population: 12200000 },
  { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, country: 'Brazil', population: 6700000 },
  { name: 'Buenos Aires', lat: -34.6118, lng: -58.3960, country: 'Argentina', population: 3000000 },
  { name: 'Lima', lat: -12.0464, lng: -77.0428, country: 'Peru', population: 10700000 },
  
  // Европа
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK', population: 9000000 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France', population: 2100000 },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany', population: 3700000 },
  { name: 'Madrid', lat: 40.4168, lng: -3.7038, country: 'Spain', population: 3200000 },
  { name: 'Rome', lat: 41.9028, lng: 12.4964, country: 'Italy', population: 2800000 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6176, country: 'Russia', population: 12500000 },
  
  // Азия
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', population: 14000000 },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, country: 'China', population: 24200000 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China', population: 21500000 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India', population: 20000000 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025, country: 'India', population: 32900000 },
  { name: 'Seoul', lat: 37.5665, lng: 126.9780, country: 'South Korea', population: 9700000 },
  { name: 'Bangkok', lat: 13.7563, lng: 100.5018, country: 'Thailand', population: 10500000 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore', population: 5900000 },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, country: 'China', population: 7500000 },
  
  // Африка
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt', population: 20900000 },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria', population: 15000000 },
  { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, country: 'South Africa', population: 4400000 },
  { name: 'Cape Town', lat: -33.9249, lng: 18.4241, country: 'South Africa', population: 4600000 },
  
  // Океания
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia', population: 5300000 },
  { name: 'Melbourne', lat: -37.8136, lng: 144.9631, country: 'Australia', population: 5100000 },
  
  // Ближний Восток
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE', population: 3400000 },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784, country: 'Turkey', population: 15500000 }
];

// Create data in the expected format with major flight routes
const Data: IDataPoint[] = [
  // Главные хабы: Нью-Йорк
  {
    startArray: { name: 'New York', E: -74.0060, N: 40.7128 },
    endArray: [
      { name: 'London', E: -0.1278, N: 51.5074 },
      { name: 'Paris', E: 2.3522, N: 48.8566 },
      { name: 'Tokyo', E: 139.6503, N: 35.6762 },
      { name: 'Los Angeles', E: -118.2437, N: 34.0522 },
      { name: 'São Paulo', E: -46.6333, N: -23.5505 },
      { name: 'Dubai', E: 55.2708, N: 25.2048 }
    ]
  },
  
  // Лондон - европейский хаб
  {
    startArray: { name: 'London', E: -0.1278, N: 51.5074 },
    endArray: [
      { name: 'Paris', E: 2.3522, N: 48.8566 },
      { name: 'Berlin', E: 13.4050, N: 52.5200 },
      { name: 'Madrid', E: -3.7038, N: 40.4168 },
      { name: 'Rome', E: 12.4964, N: 41.9028 },
      { name: 'Dubai', E: 55.2708, N: 25.2048 },
      { name: 'Hong Kong', E: 114.1694, N: 22.3193 }
    ]
  },
  
  // Токио - азиатский хаб
  {
    startArray: { name: 'Tokyo', E: 139.6503, N: 35.6762 },
    endArray: [
      { name: 'Seoul', E: 126.9780, N: 37.5665 },
      { name: 'Shanghai', E: 121.4737, N: 31.2304 },
      { name: 'Hong Kong', E: 114.1694, N: 22.3193 },
      { name: 'Singapore', E: 103.8198, N: 1.3521 },
      { name: 'Sydney', E: 151.2093, N: -33.8688 },
      { name: 'Bangkok', E: 100.5018, N: 13.7563 }
    ]
  },
  
  // Дубай - ближневосточный хаб
  {
    startArray: { name: 'Dubai', E: 55.2708, N: 25.2048 },
    endArray: [
      { name: 'Mumbai', E: 72.8777, N: 19.0760 },
      { name: 'Singapore', E: 103.8198, N: 1.3521 },
      { name: 'Cairo', E: 31.2357, N: 30.0444 },
      { name: 'Istanbul', E: 28.9784, N: 41.0082 },
      { name: 'Delhi', E: 77.1025, N: 28.7041 }
    ]
  },
  
  // Межконтинентальные связи
  {
    startArray: { name: 'Shanghai', E: 121.4737, N: 31.2304 },
    endArray: [
      { name: 'Beijing', E: 116.4074, N: 39.9042 },
      { name: 'Delhi', E: 77.1025, N: 28.7041 },
      { name: 'Bangkok', E: 100.5018, N: 13.7563 }
    ]
  },
  
  // Африканские связи
  {
    startArray: { name: 'Cairo', E: 31.2357, N: 30.0444 },
    endArray: [
      { name: 'Lagos', E: 3.3792, N: 6.5244 },
      { name: 'Johannesburg', E: 28.0473, N: -26.2041 },
      { name: 'Cape Town', E: 18.4241, N: -33.9249 }
    ]
  },
  
  // Американские связи
  {
    startArray: { name: 'Los Angeles', E: -118.2437, N: 34.0522 },
    endArray: [
      { name: 'Chicago', E: -87.6298, N: 41.8781 },
      { name: 'Mexico City', E: -99.1332, N: 19.4326 },
      { name: 'Lima', E: -77.0428, N: -12.0464 }
    ]
  }
];

// Helper functions
const helpers = {
  getAllCities: () => majorCities,
  getCityByName: (name: string) => majorCities.find(city => city.name === name),
  latLngToVector3: (lat: number, lng: number, radius: number = 50) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  }
};

export { majorCities, helpers };
export default Data;
