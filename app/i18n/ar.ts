import { Translations } from "./en"

const ar: Translations = {
  common: {
    ok: "نعم",
    cancel: "حذف",
    back: "خلف",
    logOut: "تسجيل خروج",
  },
  welcomeScreen: {
    postscript:
      "ربما لا يكون هذا هو الشكل الذي يبدو عليه تطبيقك مالم يمنحك المصمم هذه الشاشات وشحنها في هذه الحالة",
    readyForLaunch: "تطبيقك تقريبا جاهز للتشغيل",
    exciting: "اوه هذا مثير",
    letsGo: "لنذهب",
  },
  errorScreen: {
    title: "هناك خطأ ما",
    friendlySubtitle:
      "هذه هي الشاشة التي سيشاهدها المستخدمون في عملية الانتاج عند حدوث خطأ. سترغب في تخصيص هذه الرسالة ( الموجودة في 'ts.en/i18n/app') وربما التخطيط ايضاً ('app/screens/ErrorScreen'). إذا كنت تريد إزالة هذا بالكامل، تحقق من 'app/app.tsp' من اجل عنصر <ErrorBoundary>.",
    reset: "اعادة تعيين التطبيق",
    traceTitle: "خطأ من مجموعة %{name}",
  },
  emptyStateComponent: {
    generic: {
      heading: "فارغة جداً....حزين",
      content: "لا توجد بيانات حتى الآن. حاول النقر فوق الزر لتحديث التطبيق او اعادة تحميله.",
      button: "لنحاول هذا مرّة أخرى",
    },
  },

  errors: {
    invalidEmail: "عنوان البريد الالكتروني غير صالح",
  },
  loginScreen: {
    logIn: "تسجيل الدخول",
    enterDetails:
      ".ادخل التفاصيل الخاصة بك ادناه لفتح معلومات سرية للغاية. لن تخمن ابداً ما الذي ننتظره. او ربما ستفعل انها انها ليست علم الصواريخ",
    emailFieldLabel: "البريد الالكتروني",
    passwordFieldLabel: "كلمة السر",
    emailFieldPlaceholder: "ادخل بريدك الالكتروني",
    passwordFieldPlaceholder: "كلمة السر هنا فائقة السر",
    tapToLogIn: "انقر لتسجيل الدخول!",
    hint: "(: تلميح: يمكنك استخدام اي عنوان بريد الكتروني وكلمة السر المفضلة لديك",
  },
  demoNavigator: {
    incidentTab: "حادث",
    reportTab: "بلاغ",
    debugTab: "تصحيح",
  },
  demoDebugScreen: {
    howTo: "كيف",
    title: "التصحيح",
    tagLine: "مبروك، لديك نموذج اصلي متقدم للغاية للتفاعل هنا. الاستفادة من هذه النمذجة",
    reactotron: "Reactotron ارسل إلى",
    reportBugs: "الابلاغ عن اخطاء",
    demoList: "قائمة تجريبية",
    androidReactotronHint:
      "اذا لم ينجح ذللك، فتأكد من تشغيل تطبيق الحاسوب الخاص Reactotron، وقم بتشغيل عكس adb tcp:9090 \ntcp:9090 من جهازك الطرفي ، واعد تحميل التطبيق",
    iosReactotronHint:
      "اذا لم ينجح ذلك، فتأكد من تشغيل تطبيق الحاسوب الخاص ب Reactotron وأعد تحميل التطبيق",
    macosReactotronHint: "اذا لم ينجح ذلك، فتأكد من تشغيل الحاسوب ب Reactotron وأعد تحميل التطبيق",
    webReactotronHint: "اذا لم ينجح ذلك، فتأكد من تشغيل الحاسوب ب Reactotron وأعد تحميل التطبيق",
    windowsReactotronHint:
      "اذا لم ينجح ذلك، فتأكد من تشغيل الحاسوب ب Reactotron وأعد تحميل التطبيق",
  },
}

export default ar
