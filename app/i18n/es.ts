import { Translations } from "./en"

const es: Translations = {
  common: {
    ok: "OK",
    cancel: "Cancelar",
    back: "Volver",
    logOut: "Cerrar sesión",
  },
  welcomeScreen: {
    postscript:
      "psst — Esto probablemente no es cómo se va a ver tu app. (A menos que tu diseñador te haya enviado estas pantallas, y en ese caso, ¡lánzalas en producción!)",
    readyForLaunch: "Tu app, casi lista para su lanzamiento",
    exciting: "(¡ohh, esto es emocionante!)",
    letsGo: "¡Vamos!",
  },
  errorScreen: {
    title: "¡Algo salió mal!",
    friendlySubtitle:
      "Esta es la pantalla que verán tus usuarios en producción cuando haya un error. Vas a querer personalizar este mensaje (que está ubicado en `app/i18n/es.ts`) y probablemente también su diseño (`app/screens/ErrorScreen`). Si quieres eliminarlo completamente, revisa `app/app.tsx` y el componente <ErrorBoundary>.",
    reset: "REINICIA LA APP",
    traceTitle: "Error desde %{name}",
  },
  emptyStateComponent: {
    generic: {
      heading: "Muy vacío... muy triste",
      content:
        "No se han encontrado datos por el momento. Intenta darle clic en el botón para refrescar o recargar la app.",
      button: "Intentemos de nuevo",
    },
  },

  errors: {
    invalidEmail: "Email inválido.",
  },
  loginScreen: {
    logIn: "Iniciar sesión",
    enterDetails:
      "Ingresa tus datos a continuación para desbloquear información ultra secreta. Nunca vas a adivinar lo que te espera al otro lado. O quizás si lo harás; la verdad no hay mucha ciencia alrededor.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Contraseña",
    emailFieldPlaceholder: "Ingresa tu email",
    passwordFieldPlaceholder: "Contraseña super secreta aquí",
    tapToLogIn: "¡Presiona acá para iniciar sesión!",
    hint: "Consejo: puedes usar cualquier email y tu contraseña preferida :)",
  },
  demoNavigator: {
    incidentTab: "Incidente",
    reportTab: "Reportar",
    debugTab: "Debug",
  },
  demoDebugScreen: {
    howTo: "CÓMO HACERLO",
    title: "Debug",
    tagLine:
      "Felicidades, aquí tienes una propuesta de arquitectura y base de código avanzada para una app en React Native. ¡Disfrutalos!",
    reactotron: "Enviar a Reactotron",
    reportBugs: "Reportar errores",
    demoList: "Lista demo",
    androidReactotronHint:
      "Si esto no funciona, asegúrate de que la app de escritorio de Reactotron se esté ejecutando, corre adb reverse tcp:9090 tcp:9090 desde tu terminal, y luego recarga la app.",
    iosReactotronHint:
      "Si esto no funciona, asegúrate de que la app de escritorio de Reactotron se esté ejecutando, y luego recarga la app.",
    macosReactotronHint:
      "Si esto no funciona, asegúrate de que la app de escritorio de Reactotron se esté ejecutando, y luego recarga la app.",
    webReactotronHint:
      "Si esto no funciona, asegúrate de que la app de escritorio de Reactotron se esté ejecutando, y luego recarga la app.",
    windowsReactotronHint:
      "Si esto no funciona, asegúrate de que la app de escritorio de Reactotron se esté ejecutando, y luego recarga la app.",
  },
}

export default es
