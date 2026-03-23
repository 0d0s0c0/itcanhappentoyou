import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import { api } from "@/services/api"
import type { Incident } from "@/services/api/types"

export type IncidentContextType = {
  incidentsForList: Incident[]
  fetchIncidents: (latitude: number, longitude: number) => Promise<void>
}

export const IncidentContext = createContext<IncidentContextType | null>(null)

export interface IncidentProviderProps {}

export const IncidentProvider: FC<PropsWithChildren<IncidentProviderProps>> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>([])

  const fetchIncidents = useCallback(async (latitude: number, longitude: number) => {
    const response = await api.getIncidents(latitude, longitude)
    if (response.kind === "ok") {
      setIncidents(response.incidents)
    } else {
      console.error(`Error fetching incidents: ${JSON.stringify(response)}`)
    }
  }, [])

  const incidentsForList = useMemo(() => {
    return incidents
  }, [incidents])

  const value = {
    incidentsForList,
    fetchIncidents
  }

  return <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>
}

export const useIncidents = () => {
  const context = useContext(IncidentContext)
  if (!context) throw new Error("useIncidents must be used within an IncidentProvider")
  return context
}
