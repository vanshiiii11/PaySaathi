import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const requestPermission = async () => {
    setIsLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
      setIsLoading(false);
    })();
  }, []);

  return { location, requestPermission, hasPermission, isLoading };
};
