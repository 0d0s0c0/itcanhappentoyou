import { Translations } from "./en"

const hi: Translations = {
  common: {
    ok: "ठीक है!",
    cancel: "रद्द करें",
    back: "वापस",
    logOut: "लॉग आउट",
  },
  welcomeScreen: {
    postscript:
      "psst - शायद आपका ऐप ऐसा नहीं दिखता है। (जब तक कि आपके डिजाइनर ने आपको ये स्क्रीन नहीं दी हों, और उस स्थिति में, इसे लॉन्च करें!)",
    readyForLaunch: "आपका ऐप, लगभग लॉन्च के लिए तैयार है!",
    exciting: "(ओह, यह रोमांचक है!)",
    letsGo: "चलो चलते हैं!",
  },
  errorScreen: {
    title: "कुछ गलत हो गया!",
    friendlySubtitle:
      "यह वह स्क्रीन है जो आपके उपयोगकर्ता संचालन में देखेंगे जब कोई त्रुटि होगी। आप इस संदेश को बदलना चाहेंगे (जो `app/i18n/hi.ts` में स्थित है) और शायद लेआउट भी (`app/screens/ErrorScreen`)। यदि आप इसे पूरी तरह से हटाना चाहते हैं, तो `app/app.tsx` में <ErrorBoundary> कंपोनेंट की जांच करें।",
    reset: "ऐप रीसेट करें",
    traceTitle: "%{name} स्टैक से त्रुटि",
  },
  emptyStateComponent: {
    generic: {
      heading: "इतना खाली... इतना उदास",
      content: "अभी तक कोई डेटा नहीं मिला। रीफ्रेश करने या ऐप को पुनः लोड करने के लिए बटन दबाएं।",
      button: "चलो फिर से कोशिश करते हैं",
    },
  },

  errors: {
    invalidEmail: "अमान्य ईमेल पता।",
  },
  loginScreen: {
    logIn: "लॉग इन करें",
    enterDetails:
      "सर्वश्रेष्ठ रहस्य पता करने के लिए नीचे अपना विवरण दर्ज करें। आप कभी अनुमान नहीं लगा पाएंगे कि हमारे पास क्या इंतजार कर रहा है। या शायद आप कर सकते हैं; यह रॉकेट साइंस नहीं है।",
    emailFieldLabel: "ईमेल",
    passwordFieldLabel: "पासवर्ड",
    emailFieldPlaceholder: "अपना ईमेल पता दर्ज करें",
    passwordFieldPlaceholder: "सुपर सीक्रेट पासवर्ड यहाँ",
    tapToLogIn: "लॉग इन करने के लिए टैप करें!",
    hint: "संकेत: आप किसी भी ईमेल पते और अपने पसंदीदा पासवर्ड का उपयोग कर सकते हैं :)",
  },
  demoNavigator: {
    incidentTab: "घटना",
    reportTab: "रिपोर्ट",
    debugTab: "डीबग",
  },
  demoDebugScreen: {
    howTo: "कैसे करें",
    title: "डीबग",
    tagLine:
      "बधाई हो, आपके पास यहां एक बहुत उन्नत React Native ऐप टेम्पलेट है। इस बॉयलरप्लेट का लाभ उठाएं!",
    reactotron: "Reactotron को भेजें",
    reportBugs: "बग्स की रिपोर्ट करें",
    demoList: "डेमो सूची",
    androidReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है, अपने टर्मिनल से adb reverse tcp:9090 tcp:9090 चलाएं, और ऐप को पुनः लोड करें।",
    iosReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है और ऐप को पुनः लोड करें।",
    macosReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है और ऐप को पुनः लोड करें।",
    webReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है और ऐप को पुनः लोड करें।",
    windowsReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है और ऐप को पुनः लोड करें।",
  },
}

export default hi
