/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { UiLanguage } from './types';

export const translations: Record<UiLanguage, any> = {
  en: {
    appTitle: "InfoGenius",
    appSubtitle: "Vision",
    appTagline: "Visual Knowledge Engine",
    backToHome: "Back to Home",
    apiKey: "API Key",
    language: "Language",
    selectKey: "Select Paid API Key",
    paidApp: "Paid App",
    paidKeyRequired: "Paid API Key Required",
    billingRequired: "Billing Required",
    billingDesc: "This application uses premium Gemini 3 Pro models which are not available on the free tier.",
    billingShort: "Please ensure you have set up billing in Google AI Studio.",
    viewBilling: "View Billing Documentation",
    
    heroTitle: "Create",
    heroTitleSuffix: "Anything.",
    heroDesc: "Select a generative tool to begin your creation journey using the power of Gemini.",
    
    toolInfographic: "Infographic Generator",
    descInfographic: "Research topics and generate comprehensive visual infographics with grounded data.",
    toolArticle: "Article Writer",
    descArticle: "Compose professional articles, essays, and blog posts with customizable tone and structure.",
    toolLogo: "Logo Designer",
    descLogo: "Design unique, memorable brand identities and vector-style logos for your business.",
    toolMarketing: "Marketing Studio",
    descMarketing: "Generate high-end, studio-grade product photography for social media campaigns.",
    launchTool: "Launch Tool",
    
    // Intro
    introTitle: "InfoGenius",
    introSubtitle: "Vision",
    introTagline: "Knowledge. Visualized.",
    introGrounding: "Now with Google Search Grounding",
    introButton: "INITIALIZE SYSTEM",
    skipIntro: "Skip Intro",
    introHistory: "HISTORY",
    introScience: "SCIENCE",
    introFacts: "FACTS",
    introData: "DATA",

    // Tools
    initiate: "INITIATE",
    generate: "Generate",
    enhance: "Enhance",
    download: "Download",
    fullscreen: "Fullscreen View",
    prompt: "PROMPT",
    refinePrompt: "Refine the visual (e.g., 'Make the background stars')...",
    
    // Inputs
    topicPlaceholder: "What do you want to visualize?",
    articleTopicPlaceholder: "Enter article topic or title...",
    labelAudience: "Audience",
    labelAesthetic: "Aesthetic",
    labelLanguage: "Language",
    labelTone: "Tone",
    labelBrandName: "Brand Name",
    labelIndustry: "Industry & Description",
    labelStyle: "Visual Style",
    placeholderBrand: "e.g. Vertex Dynamics",
    placeholderIndustry: "e.g. A tech startup focusing on renewable energy solutions...",
    
    // Marketing Inputs
    labelProductDesc: "Product Description",
    placeholderProductDesc: "Describe the product (e.g., Luxury Oud Perfume Bottle with gold accents...)",
    labelProductImage: "Reference Image (Optional)",
    labelModel: "Model Type",
    labelBackground: "Background Setting",
    labelAspectRatio: "Aspect Ratio",
    btnUpload: "Upload Image",
    
    // Buttons
    writeArticle: "Write Article",
    copyText: "Copy Text",
    copied: "Copied!",
    generateLogo: "Generate Logo",
    generateVisual: "Generate Visual",
    
    // Loading
    loadingResearch: "Researching topic...",
    loadingDesign: "Designing Infographic...",
    loadingDraft: "Drafting content...",
    loadingLogo: "Designing Logo...",
    loadingMarketing: "Rendering Scene...",
    loadingConnect: "Establishing connection...",
    
    // Sections
    researchSources: "Research Sources",
    sessionArchives: "Session Archives",
    logoOutputPlaceholder: "Your logo will appear here",
    marketingOutputPlaceholder: "Your marketing visual will appear here",
    
    // Errors
    errorAccessDenied: "Access denied. The selected API key does not have access. Please select a project with billing enabled.",
    errorGeneric: "An error occurred. Please try again.",
    errorNoTopic: "Please enter a topic.",
    errorNoBrand: "Please enter a brand name.",
    errorModification: "Modification failed. Try a different command.",
    errorNoProduct: "Please enter a product description.",
    
    // Auth
    loginTitle: "Sign In",
    registerTitle: "Create Account",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    signIn: "Sign In",
    register: "Register",
    signingIn: "Signing In...",
    registering: "Registering...",
    logout: "Logout",
    adminBadge: "ADMIN",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    authError: "Authentication failed. Please check your credentials.",
  },
  ar: {
    appTitle: "InfoGenius",
    appSubtitle: "فيجن",
    appTagline: "محرك المعرفة البصري",
    backToHome: "الرئيسية",
    apiKey: "مفتاح API",
    language: "اللغة",
    selectKey: "اختر مفتاح API مدفوع",
    paidApp: "تطبيق مدفوع",
    paidKeyRequired: "مطلوب مفتاح API مدفوع",
    billingRequired: "مطلوب تفعيل الدفع",
    billingDesc: "يستخدم هذا التطبيق نماذج Gemini 3 Pro المتميزة والتي ليست متاحة في الفئة المجانية.",
    billingShort: "يرجى التأكد من إعداد الفوترة في Google AI Studio.",
    viewBilling: "عرض وثائق الفوترة",

    heroTitle: "اصنع",
    heroTitleSuffix: "أي شيء.",
    heroDesc: "اختر أداة توليد للبدء في رحلتك الإبداعية باستخدام قوة Gemini.",

    toolInfographic: "مولد الانفوجرافيك",
    descInfographic: "ابحث في المواضيع وأنشئ رسومًا بيانية شاملة ببيانات موثقة.",
    toolArticle: "كاتب المقالات",
    descArticle: "اكتب مقالات احترافية، ومقالات رأي، وتدوينات بنبرة وهيكل قابل للتخصيص.",
    toolLogo: "مصمم الشعارات",
    descLogo: "صمم هويات علامات تجارية فريدة وشعارات بنمط الفيكتور لعملك.",
    toolMarketing: "ستوديو التسويق",
    descMarketing: "أنشئ صوراً تسويقية بمستوى الاستوديو لحملات التواصل الاجتماعي.",
    launchTool: "تشغيل الأداة",

    // Intro
    introTitle: "InfoGenius",
    introSubtitle: "فيجن",
    introTagline: "المعرفة. مرئية.",
    introGrounding: "مدعوم الآن ببحث Google",
    introButton: "تهيئة النظام",
    skipIntro: "تخطي المقدمة",
    introHistory: "تاريخ",
    introScience: "علوم",
    introFacts: "حقائق",
    introData: "بيانات",

    // Tools
    initiate: "ابدأ التوليد",
    generate: "توليد",
    enhance: "تحسين",
    download: "تحميل",
    fullscreen: "ملء الشاشة",
    prompt: "الوصف",
    refinePrompt: "حسن الصورة (مثلاً: 'اجعل الخلفية نجوم')...",

    // Inputs
    topicPlaceholder: "ما الذي تريد تصوره؟",
    articleTopicPlaceholder: "أدخل موضوع المقال أو العنوان...",
    labelAudience: "الجمهور",
    labelAesthetic: "الجمالية",
    labelLanguage: "اللغة",
    labelTone: "النبرة",
    labelBrandName: "اسم العلامة التجارية",
    labelIndustry: "المجال والوصف",
    labelStyle: "النمط البصري",
    placeholderBrand: "مثال: فيرتكس دايناميكس",
    placeholderIndustry: "مثال: شركة تقنية ناشئة تركز على حلول الطاقة المتجددة...",

    // Marketing Inputs
    labelProductDesc: "وصف المنتج",
    placeholderProductDesc: "صف المنتج (مثلاً: زجاجة عطر عود فاخرة مع لمسات ذهبية...)",
    labelProductImage: "صورة مرجعية (اختياري)",
    labelModel: "نوع العارض",
    labelBackground: "إعداد الخلفية",
    labelAspectRatio: "الأبعاد",
    btnUpload: "رفع صورة",

    // Buttons
    writeArticle: "كتابة المقال",
    copyText: "نسخ النص",
    copied: "تم النسخ!",
    generateLogo: "تصميم الشعار",
    generateVisual: "إنشاء الصورة",

    // Loading
    loadingResearch: "جارٍ البحث في الموضوع...",
    loadingDesign: "جارٍ تصميم الانفوجرافيك...",
    loadingDraft: "جارٍ صياغة المحتوى...",
    loadingLogo: "جارٍ تصميم الشعار...",
    loadingMarketing: "جارٍ إخراج المشهد...",
    loadingConnect: "جارٍ تأسيس الاتصال...",

    // Sections
    researchSources: "مصادر البحث",
    sessionArchives: "أرشيف الجلسات",
    logoOutputPlaceholder: "سيظهر شعارك هنا",
    marketingOutputPlaceholder: "ستظهر صورتك التسويقية هنا",

    // Errors
    errorAccessDenied: "تم رفض الوصول. مفتاح API المحدد ليس لديه صلاحية. يرجى اختيار مشروع تم تفعيل الفوترة فيه.",
    errorGeneric: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    errorNoTopic: "الرجاء إدخال موضوع.",
    errorNoBrand: "الرجاء إدخال اسم العلامة التجارية.",
    errorModification: "فشل التعديل. حاول بأمر مختلف.",
    errorNoProduct: "الرجاء إدخال وصف المنتج.",
    
    // Auth
    loginTitle: "تسجيل الدخول",
    registerTitle: "إنشاء حساب",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    signIn: "دخول",
    register: "تسجيل",
    signingIn: "جارٍ الدخول...",
    registering: "جارٍ التسجيل...",
    logout: "خروج",
    adminBadge: "مسؤول",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    authError: "فشل المصادقة. يرجى التحقق من بياناتك.",
  }
};