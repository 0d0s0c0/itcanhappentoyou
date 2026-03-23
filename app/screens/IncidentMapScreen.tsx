import { FC, useMemo, useContext, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, StyleSheet, Image } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import MapView, {Circle, Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT} from "react-native-maps"
import type { Incident } from "@/services/api/types"
import { LocationContext } from "@/context/LocationContext"
import Dropdown from "react-native-input-select"
import { useIncidents } from "@/context/IncidentContext"

export const IncidentMapScreen: FC = function IncidentMapScreen() {
  const { themed, theme } = useAppTheme()
  const [isLoading, setIsLoading] = useState(false)
  const { location, setLocation } = useContext(LocationContext)
  const {
      incidentsForList,
      fetchIncidents,
    } = useIncidents()

    /*
  const incidents = useMemo(
    () => [
      {
        id: "1",
        title: "Pothole",
        description: "Large pothole reported",
        coordinate: { latitude: 37.78825, longitude: -122.4324 },
      },
      {
        id: "2",
        title: "Broken Streetlight",
        description: "Streetlight flickering after sunset",
        coordinate: { latitude: 37.78925, longitude: -122.4314 },
      },
      {
        id: "3",
        title: "Blocked Driveway",
        description: "Delivery truck blocking driveway",
        coordinate: { latitude: 37.78725, longitude: -122.4334 },
      }
    ],
    [],
  )
*/

  const RADIUS_KM = 0.2 // ~2 city blocks

  function haversineDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number,
  ): number {
    const R = 6371
    const dLat = degreesToRadians(lat2 - lat1)
    const dLon = degreesToRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const hotspots = useMemo(() => {
    const assigned = new Set<number>()
    const clusters: { latitude: number; longitude: number }[] = []

    for (let i = 0; i < incidentsForList.length; i++) {
      if (assigned.has(i)) continue
      const group = [incidentsForList[i]]
      assigned.add(i)

      for (let j = i + 1; j < incidentsForList.length; j++) {
        if (assigned.has(j)) continue
        const dist = haversineDistance(
          incidentsForList[i].latitude, incidentsForList[i].longitude,
          incidentsForList[j].latitude, incidentsForList[j].longitude,
        )
        if (dist <= RADIUS_KM) {
          group.push(incidentsForList[j])
          assigned.add(j)
        }
      }

      if (group.length >= 3) {
        const avgLat = group.reduce((s, inc) => s + inc.latitude, 0) / group.length
        const avgLng = group.reduce((s, inc) => s + inc.longitude, 0) / group.length
        clusters.push({ latitude: avgLat, longitude: avgLng })
      }
    }

    return clusters
  }, [incidentsForList])

  function degreesToRadians(angle:number) {
    return angle * (Math.PI / 180);
  }

  function kMToLongitudes(km:number, atLatitude:number) {
    return km * 0.0089831 / Math.cos(degreesToRadians(atLatitude));
  }

  const goToNewLocation = (value: string) => {
    const [lat, lng] = value?.toString()?.split(",")?.map(Number) || [0, 0];
    console.log(`Going to new location: ${lat}, ${lng}`);
    setLocation({
      ...location,
      coords: {
        ...location.coords,
        latitude: lat,
        longitude: lng
      }
    });
  }

  useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await fetchIncidents(location.coords.latitude, location.coords.longitude)
        setIsLoading(false)
      })()
    }, [fetchIncidents, location.coords.latitude, location.coords.longitude])
    
  return (
    <Screen preset="fixed" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
      <Text preset="heading" text="Incident Map" style={themed($title)} />

      <View style={themed($mapWrapper)}>
          <MapView
            provider={PROVIDER_DEFAULT}
            style={themed($map)}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0000001,
              longitudeDelta: kMToLongitudes(1.0, location.coords.latitude),
            }}
          >
            {hotspots.map((spot, idx) => (
              <Circle
                key={`hotspot-${idx}`}
                center={spot}
                radius={RADIUS_KM * 1000}
                fillColor="rgba(255, 0, 0, 0.15)"
                strokeColor="rgba(255, 0, 0, 0.3)"
                strokeWidth={1}
              />
            ))}
            {incidentsForList.map(it => (
              <Marker key={it.id} coordinate={{latitude: it.latitude, longitude: it.longitude}}
                title={it.title} description={it.description}>
                <Image style={{width: 25, height: 25}} source={it.icon} resizeMode="contain" />
                <View style={themed($marker)}>
                  <View style={themed($markerInner)} />
                </View>
              </Marker>
            ))}
          </MapView>

          
        </View>
      <Dropdown
        label="Attractions"
        placeholder="Select location..."
        options={[
  {"name": "Golden Gate Bridge", "lat": 37.8199, "lon": -122.4783},
  {"name": "Alcatraz Island", "lat": 37.8270, "lon": -122.4230},
  {"name": "Fisherman's Wharf", "lat": 37.8080, "lon": -122.4177},
  {"name": "Pier 39", "lat": 37.8087, "lon": -122.4098},
  {"name": "Lombard Street", "lat": 37.8021, "lon": -122.4187},
  {"name": "Golden Gate Park", "lat": 37.7694, "lon": -122.4862},
  {"name": "Cable Car System", "lat": 37.7944, "lon": -122.4116},
  {"name": "Painted Ladies (Alamo Square)", "lat": 37.7762, "lon": -122.4328},
  {"name": "Chinatown", "lat": 37.7943, "lon": -122.4062},
  {"name": "Coit Tower", "lat": 37.8024, "lon": -122.4058},
  {"name": "Palace of Fine Arts", "lat": 37.8031, "lon": -122.4485},
  {"name": "The Presidio", "lat": 37.7989, "lon": -122.4663},
  {"name": "Ferry Building Marketplace", "lat": 37.7954, "lon": -122.3938},
  {"name": "Union Square", "lat": 37.7881, "lon": -122.4075},
  {"name": "SFMOMA", "lat": 37.7857, "lon": -122.4011},
  {"name": "Mission Dolores Park", "lat": 37.7596, "lon": -122.4268},
  {"name": "California Academy of Sciences", "lat": 37.7700, "lon": -122.4665},
  {"name": "Japanese Tea Garden", "lat": 37.7705, "lon": -122.4714},
  {"name": "Lands End/Sutro Baths", "lat": 37.7794, "lon": -122.5085},
  {"name": "Exploratorium", "lat": 37.8016, "lon": -122.3975}
]
          .map((it) => ({ label: it.name, value: `${it.lat},${it.lon}` }))}
        onValueChange={(value) => goToNewLocation(value as string)}
        selectedValue={""}
        primaryColor={'green'}
      />
    </Screen>
  )
}

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $mapWrapper: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
  height: "80%",
  overflow: "hidden",
})

const $map: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  width: "100%",
  height: "100%"
}

const $marker: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
  padding: 6,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 3,
})

const $markerInner: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: colors.background,
})

const $noMap: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  color: "#888",
})

export default IncidentMapScreen
