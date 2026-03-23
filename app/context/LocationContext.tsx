import {
  createContext,
  FC,
  PropsWithChildren,
  useState,
  useEffect
} from "react"
import * as Location from 'expo-location';

const defaultLocation: Location.LocationObject = {
  coords: {
    latitude: 40.7128,
    longitude: 74.0060,
    altitude: 0,        
    altitudeAccuracy: -1,
    accuracy: 5,
    heading: 0,
    speed: 0,
  },
  timestamp: Date.now(),
}

export type LocationContextType = {
  location: Location.LocationObject
  setLocation: (location: Location.LocationObject) => void
}

export const LocationContext = createContext<LocationContextType>({
  location: defaultLocation,
  setLocation: () => {},
}) 

export interface UserLocationProviderProps {} 

export const UserLocationProvider: FC<PropsWithChildren<UserLocationProviderProps>> = ({ children }) => {
    const [location, setLocation] = useState<Location.LocationObject>(defaultLocation);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 5000,
                    distanceInterval: 1
                },
                (newLocation: any) => {
                    console.log('New location:', newLocation);
                    setLocation(newLocation);
                }
            );

            return () => {
                if (locationSubscription) {
                    locationSubscription.remove();
                }
            };
            })();
        }, []);

    return <LocationContext.Provider value={{ location, setLocation }}>{children}</LocationContext.Provider>
}