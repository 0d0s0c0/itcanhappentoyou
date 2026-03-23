/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"

import Config from "@/config"
import type { Incident } from "@/services/api/types"

import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig } from "./types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async getIncidents(
    latitude: number,
    longitude: number,
  ): Promise<{ kind: "ok"; incidents: Incident[] } | GeneralApiProblem> {
    const response: ApiResponse<{ count: number; incidents: Incident[] }> =
      await this.apisauce.get("/api/incidents", { latitude, longitude })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const iconMap: Record<string, ReturnType<typeof require>> = {
        theft: require("../../../assets/images/theft.png"),
        assault: require("../../../assets/images/assault.png"),
        "sex-related": require("../../../assets/images/exposure.png"),
        scam: require("../../../assets/images/taxiscam.png"),
        uncategorized: require("../../../assets/images/uncategorized.png"),
      }

      const incidents: Incident[] =
        response.data?.incidents.map((raw) => ({
          ...raw,
          icon: iconMap[raw.category] || iconMap.uncategorized,
        })) ?? []

      return { kind: "ok", incidents }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  async reportIncident(
    latitude: number,
    longitude: number,
    description: string,
  ): Promise<{ kind: "ok"; incident: Incident } | GeneralApiProblem> {
    const response: ApiResponse<{ incident: Incident }> = await this.apisauce.post(
      "/api/incident",
      { latitude, longitude, description },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const iconMap: Record<string, ReturnType<typeof require>> = {
        theft: require("../../../assets/images/theft.png"),
        assault: require("../../../assets/images/assault.png"),
        "sex-related": require("../../../assets/images/exposure.png"),
        scam: require("../../../assets/images/taxiscam.png"),
        uncategorized: require("../../../assets/images/uncategorized.png"),
      }

      const raw = response.data!.incident
      const incident: Incident = {
        ...raw,
        icon: iconMap[raw.category] || iconMap.uncategorized,
      }

      return { kind: "ok", incident }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
