import { TextStyle, ViewStyle } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/Icon"
import { translate } from "@/i18n/translate"
import { DemoDebugScreen } from "@/screens/DemoDebugScreen"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import type { DemoTabParamList } from "./navigationTypes"
import IncidentMapScreen from "@/screens/IncidentMapScreen"
import { ReportIncidentScreen } from "@/screens/ReportIncidentScreen"
import { UserLocationProvider } from "@/context/LocationContext"
import { IncidentProvider } from "@/context/IncidentContext"

const Tab = createBottomTabNavigator<DemoTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <UserLocationProvider>
      <IncidentProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.text,
          tabBarLabelStyle: themed($tabBarLabel),
          tabBarItemStyle: themed($tabBarItem),
        }}
      >
        <Tab.Screen
          name="IncidentMap"
          component={IncidentMapScreen}
          options={{
            tabBarLabel: translate("demoNavigator:incidentTab"),
            tabBarIcon: ({ focused }) => (
              <Icon
                icon="view"
                color={focused ? colors.tint : colors.tintInactive}
                size={30}
              />
            ),
          }}
        />

        <Tab.Screen
          name="ReportIncident"
          component={ReportIncidentScreen}
          options={{
            tabBarLabel: translate("demoNavigator:reportTab"),
            tabBarIcon: ({ focused }) => (
              <Icon
                icon="ladybug"
                color={focused ? colors.tint : colors.tintInactive}
                size={30}
              />
            ),
          }}
        />

        <Tab.Screen
          name="DemoDebug"
          component={DemoDebugScreen}
          options={{
            tabBarLabel: translate("demoNavigator:debugTab"),
            tabBarIcon: ({ focused }) => (
              <Icon icon="debug" color={focused ? colors.tint : colors.tintInactive} size={30} />
            ),
          }}
        />
      </Tab.Navigator>
    </IncidentProvider>
    </UserLocationProvider>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
})
