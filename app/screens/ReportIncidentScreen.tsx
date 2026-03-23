import { FC, useContext, useState } from "react"
import { ActivityIndicator, Alert, TextStyle, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { LocationContext } from "@/context/LocationContext"
import { api } from "@/services/api"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export const ReportIncidentScreen: FC = function ReportIncidentScreen() {
  const { themed } = useAppTheme()
  const { location } = useContext(LocationContext)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = description.trim().length > 0 && !isSubmitting

  async function handleSubmit() {
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      const result = await api.reportIncident(
        location.coords.latitude,
        location.coords.longitude,
        description.trim(),
      )

      if (result.kind === "ok") {
        Alert.alert(
          "Report Submitted",
          `Your incident was categorized as "${result.incident.category}" and saved.`,
        )
        setDescription("")
      } else {
        Alert.alert("Error", "Failed to submit report. Please try again.")
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={[$styles.container, themed($container)]}
      safeAreaEdges={["top"]}
    >
      <Text preset="heading" text="Report an Incident" style={themed($title)} />
      <Text
        style={themed($subtitle)}
        text="Describe what happened. Your current location will be used automatically."
      />

      <TextField
        value={description}
        onChangeText={setDescription}
        placeholder="e.g. Someone stole my backpack at the bus stop"
        multiline
        containerStyle={themed($textFieldContainer)}
        inputWrapperStyle={themed($textFieldWrapper)}
        style={themed($textFieldInput)}
      />

      <Text
        style={themed($locationText)}
        text={`Location: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`}
      />

      {isSubmitting ? (
        <ActivityIndicator size="large" style={themed($loader)} />
      ) : (
        <Button
          text="Submit Report"
          preset="reversed"
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={themed($button)}
        />
      )}
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $subtitle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  color: colors.textDim,
})

const $textFieldContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $textFieldWrapper: ThemedStyle<ViewStyle> = () => ({
  minHeight: 120,
  alignItems: "flex-start",
})

const $textFieldInput: ThemedStyle<TextStyle> = () => ({
  minHeight: 100,
  textAlignVertical: "top",
})

const $locationText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  color: colors.textDim,
  fontSize: 13,
})

const $loader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $button: ThemedStyle<ViewStyle> = () => ({})

export default ReportIncidentScreen
