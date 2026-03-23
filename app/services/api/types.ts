import { ImageSourcePropType } from "react-native"

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}


export interface Incident {
  icon: ImageSourcePropType;
  id: number;
  date: string;
  latitude: number;
  longitude: number;
  description: string;
  title: string;
  official: boolean;
  category: string;
}