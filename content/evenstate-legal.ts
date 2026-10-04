export const evenstateContact = "app@behelit.dev";
export const evenstateOrigin = "https://evenstate.behelit.dev";
export const evenstateLegalDate = "October 4, 2026";

export type EvenstateDocumentContent = {
  slug: "privacy" | "terms" | "support";
  title: string;
  description: string;
  introduction: string;
  sections: { id: string; title: string; paragraphs: string[] }[];
};

export const privacy: EvenstateDocumentContent = {
  slug: "privacy",
  title: "Privacy Policy",
  description: "How Evenstate handles local practice data, device backups, reminders, website visits, and support requests.",
  introduction: "Evenstate is a wellbeing app from Behelit. This policy explains information handling in the iOS and Android app, on evenstate.behelit.dev, and when you contact us. Local app records and information sent to our website or support inbox are different, as explained below.",
  sections: [
    { id: "operator", title: "1. Who is responsible", paragraphs: [
      "Behelit operates Evenstate and is responsible for personal information it receives through the website and support. Contact app@behelit.dev with privacy questions or requests. The app does not require an account, and Behelit does not operate a server that synchronizes your practice records."
    ] },
    { id: "local-data", title: "2. Information stored in the app", paragraphs: [
      "The app saves the optional name you enter, onboarding status, your routine and selected practice days, reminder choices, completed and ended sessions, practice dates, local calendar dates when you use the app after onboarding, progress and streak records, paused sessions, written reflections, and coloring patterns. Relief sessions may include an optional check-in. Settings such as audio, haptics, reduced motion, breathing pace, and a manually selected support region are also stored locally.",
      "These records let the app show your routine, resume a practice, display history and progress, calculate your daily visit streak, and remember your preferences. They are stored in the app’s local storage. The current app does not upload these records to Behelit, use them to train AI, or share them with advertisers. Reflections are optional; you can reflect privately without writing in the app.",
      "Evenstate uses device date, time, time zone, language settings, and accessibility preferences to present the app and schedule your routine. Selecting a support region is manual and does not use GPS. System backups and device transfers may include local records; see section 5."
    ] },
    { id: "permissions", title: "3. Reminders and device access", paragraphs: [
      "Notifications are optional. If you enable reminders, the app asks the operating system for notification permission and schedules local notifications on your device. The current app does not register a remote push token with a Behelit notification server. You can change reminder choices in your routine or revoke notification permission in device settings.",
      "The current practice features do not read your contacts, camera, microphone, photo library, GPS location, or HealthKit/Health Connect records. Guided audio uses bundled playback files; it does not record you. Calls to support services open your phone app. Evenstate does not listen to or record those calls."
    ] },
    { id: "external-services", title: "4. Websites, support, and other services", paragraphs: [
      "Opening a reference, this policy, or another website sends a normal browser request to that site. The destination and its hosting providers may receive your IP address, browser information, requested URL, request time, and referrer information. Evenstate does not attach your reflections, routine, or session history to these links. External sites, helplines, phone providers, and app stores apply their own policies.",
      "The Evenstate website is hosted on Vercel. Hosting and security infrastructure processes request information to serve pages, prevent abuse, and maintain reliability. The current Evenstate website does not add advertising or analytics scripts, a sign-in system, or a mailing-list form. It does not receive the mobile app’s local practice records. This is not a claim that hosting or security services generate no technical logs.",
      "If you email app@behelit.dev, Behelit and its email service providers receive your email address, message, and any attachments you choose to send. We use these to respond and investigate your request. Avoid sending private reflections or health information unless necessary. We do not automatically attach app records to a support email.",
      "The current app has no advertising or app-usage analytics service configured. Apple and Google may separately process download, store, or diagnostic information according to your platform settings and their policies. We do not sell personal information or share it for targeted advertising.",
      "Website and email providers process the information needed to deliver their services. We may disclose information we hold when required by law or necessary to protect rights and safety. These providers may process information in countries other than yours; applicable data-protection safeguards are required where relevant. Behelit cannot disclose local app records it does not hold."
    ] },
    { id: "deletion", title: "5. Retention, deletion, and backups", paragraphs: [
      "Local records remain until you edit or delete them, or remove the app’s local data. In Practice history, open an entry with saved reflections or coloring and choose the option to delete its saved notes. This removes saved notes and coloring for that practice; completion history remains. Editing your name or preferences replaces the current local value.",
      "In app versions that include it, open Your space → Delete all local data and confirm to clear local records and preferences, cancel scheduled reminders, and return to Welcome. This does not delete existing system backups or change device permission settings. You can also remove all current local data on Android: open Settings → Apps → Evenstate → Storage (or Storage & cache) → Clear storage / Clear data. On iOS, open Settings → General → iPhone Storage → Evenstate → Delete App. Offload App preserves documents and data and is not the same as Delete App. Device labels vary. You can disable Evenstate notifications in device settings.",
      "Depending on your operating system and settings, local records may be included in cloud or computer backups and transfers to another device. These are platform services, not an Evenstate cloud account or synchronization service. Manage backups through Apple, Google, your device manufacturer, or your computer. Removing current app data does not necessarily delete older backups, and restoring a backup may restore records.",
      "We retain support correspondence only for as long as needed to handle the request and related legal obligations. Technical website records are retained for hosting, security, and operational needs under the applicable provider’s arrangements. Contact us to request deletion of information Behelit holds. We cannot remotely read, export, restore, or erase records stored only in your app or your personal device backups."
    ] },
    { id: "security", title: "6. Security", paragraphs: [
      "Local app data relies on the operating system’s app sandbox and device protections. Evenstate does not offer a separate app lock or promise additional database encryption. Protect access to your device and backups and keep your operating system updated. No storage or transmission method provides an absolute security guarantee."
    ] },
    { id: "rights", title: "7. Your choices and rights", paragraphs: [
      "You can use the app without an account, leave your name and reflections blank, disable reminders, change preferences, and remove local data as described above. Depending on your location, you may have rights to access, correct, erase, restrict, object to processing, or receive a portable copy of personal information Behelit holds, and to complain to a data-protection authority. Send requests to app@behelit.dev. We may need information to verify your request.",
      "Where EEA or UK data-protection law applies, responding to support requests and securing the website relies on our legitimate interests in providing support and operating a reliable service, and on legal obligations where applicable. Where consent is required, you may withdraw it. Optional device permission choices can be changed in your operating-system settings."
    ] },
    { id: "children", title: "8. Children", paragraphs: [
      "Evenstate is a general wellbeing product, not a service designed specifically for children. We do not knowingly collect children’s personal information through support. A parent or guardian who believes a child has sent us personal information can contact us to request its removal. Follow the app store’s age rating and applicable local requirements."
    ] },
    { id: "changes", title: "9. Changes and contact", paragraphs: [
      "We will update this page and its date when our information practices change. Material changes will be explained in the app where appropriate, and we will request consent when required. For questions about this policy or information Behelit holds, email app@behelit.dev."
    ] },
  ],
};

export const terms: EvenstateDocumentContent = {
  slug: "terms",
  title: "Terms of Use",
  description: "Terms for using Evenstate’s wellbeing practices, local records, and support resources.",
  introduction: "These Terms explain the basis on which Behelit provides the Evenstate mobile app and its product website. Please read them before using Evenstate. Applicable app-store terms and mandatory consumer rights also apply.",
  sections: [
    { id: "purpose", title: "1. Everyday wellbeing", paragraphs: [
      "Evenstate offers general wellbeing activities, reflection prompts, routines, and practice tracking. It is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. Consult a qualified healthcare professional for medical advice, diagnosis, or treatment. Do not delay or replace professional care because of app content.",
      "Brain and Body artwork and completion percentages reflect your recorded practices. Daily streaks reflect consecutive local calendar days when you use the app after onboarding. Optional check-ins reflect your own responses. They are not measurements of organ function, cortisol, mental health, physical fitness, or treatment effectiveness. References explain the background of activities; they do not establish clinical validation of Evenstate. Results and experiences vary."
    ] },
    { id: "safe-use", title: "2. Practice safely", paragraphs: [
      "Choose activities suitable for your abilities, health, and surroundings. Adapt, skip, pause, or stop whenever needed. Stop if an activity causes pain, dizziness, breathlessness, or distress. Seek appropriate professional advice when you are unsure whether an activity is suitable for you.",
      "Some activities are self-led and require safe surroundings, equipment, a partner, or suitable instruction. The app does not provide supervision, technique assessment, swimming instruction, or emergency monitoring. Do not interact with the app while driving or during an activity that requires your full attention. Suggested durations and routines are optional guides, not medical prescriptions."
    ] },
    { id: "urgent-help", title: "3. Urgent help", paragraphs: [
      "Evenstate and its support inbox are not emergency or crisis services. If you or someone else is in immediate danger, contact your local emergency services. For urgent emotional support, use a suitable local helpline or healthcare service. The app’s Care and support resources depend on your selected region; availability, eligibility, and any telephone charges are determined by the service provider."
    ] },
    { id: "use", title: "4. Using the app and its content", paragraphs: [
      "Behelit grants you a limited, non-exclusive right to use Evenstate for personal, lawful purposes, subject to these Terms and applicable app-store conditions. Use it only where you are legally permitted to do so. If you cannot agree to terms independently under local law, involve a parent or guardian as required.",
      "Do not interfere with the app or website, attempt unauthorized access, distribute malicious code, or copy and redistribute protected app content without permission, except where applicable law permits. Behelit and its licensors retain rights in the software, branding, artwork, and instructional content. You retain rights in reflections and other original content you create."
    ] },
    { id: "records", title: "5. Local records and availability", paragraphs: [
      "The current app requires no account or subscription and has no in-app purchase flow. Your practice records are stored locally. Behelit does not maintain a synchronized copy and cannot recover records lost when app data or backups are removed. Device backup and transfer behavior depends on your operating system and settings. Read the Privacy Policy for details.",
      "We aim to keep Evenstate useful and reliable, but cannot promise uninterrupted availability, error-free operation, or particular wellbeing outcomes. Reminder delivery depends on device settings and operating-system scheduling. Features and supported operating systems may change through updates. Any future paid offering would disclose its own price and applicable terms before purchase."
    ] },
    { id: "third-parties", title: "6. External resources", paragraphs: [
      "Links to reference material, helplines, and other websites are provided for convenience and context. Those services are operated independently and may change. Their own terms and privacy policies apply. A reference does not imply that its publisher endorses Evenstate."
    ] },
    { id: "rights", title: "7. Your legal rights", paragraphs: [
      "Nothing in these Terms excludes or limits rights, remedies, warranties, or liability that cannot lawfully be excluded or limited, including applicable consumer protections. Any limitations on availability or outcomes described here apply only to the extent permitted by law. These Terms do not require arbitration or remove your right to seek help from a competent court or authority."
    ] },
    { id: "changes", title: "8. Changes, stopping use, and contact", paragraphs: [
      "You can stop using Evenstate at any time and remove local data using the instructions in the Privacy Policy. We may update these Terms to reflect changes to the product or applicable requirements. We will publish the revised date and provide notice of material changes where appropriate. For product support or questions about these Terms, email app@behelit.dev."
    ] },
  ],
};

export const support: EvenstateDocumentContent = {
  slug: "support",
  title: "Help with Evenstate",
  description: "Contact Behelit for Evenstate support, learn how to manage local data, and find answers about practices and reminders.",
  introduction: "For app questions, technical problems, or privacy requests, email app@behelit.dev. Include whether you use iOS or Android, your app version if available, and what happened. Please leave private reflections and sensitive health information out of screenshots and messages unless needed for your request.",
  sections: [
    { id: "urgent", title: "Need help with an urgent situation?", paragraphs: [
      "This is technical product support, not a medical or crisis service. The inbox is not continuously monitored. If you are in immediate danger, contact local emergency services. For emotional support, open Care and support in the app and choose your current region, or visit Find A Helpline using the link below."
    ] },
    { id: "records", title: "Where are my practices saved?", paragraphs: [
      "Your routine, preferences, reflections, and practice history are saved in the app on your device. No Evenstate account is needed. There is no Behelit cloud sync or server copy to restore. Your operating system may include app data in backups or device transfers."
    ] },
    { id: "remove-data", title: "How can I delete my data?", paragraphs: [
      "To delete saved reflections or coloring for a practice, open its entry in Practice history and use the delete-notes action. Completion history remains.",
      "In app versions that include it, use Your space → Delete all local data to clear your records and preferences and cancel reminders. Alternatively, use Android Settings → Apps → Evenstate → Storage → Clear storage / Clear data, or iOS Settings → General → iPhone Storage → Evenstate → Delete App. Offloading an iOS app does not delete its documents. Manage existing backups separately; a restored backup may bring records back. For information sent to our support inbox, email us with a deletion request."
    ] },
    { id: "reminders", title: "Why did a reminder stop?", paragraphs: [
      "Check notification permission in device settings and the reminder choice in your routine. Reminders are scheduled locally for upcoming occurrences and refreshed when the app opens. Open Evenstate again to refresh the schedule. Focus modes, battery settings, and operating-system delivery rules can affect notifications."
    ] },
    { id: "progress", title: "How do completion and streaks work?", paragraphs: [
      "Open Evenstate each day to keep your daily streak. After onboarding, using the app counts once per local calendar day, whichever screen you visit. You do not need to complete a practice to keep the streak. Visit days run from midnight to midnight on your device. Missing a calendar day breaks your current streak; your longest streak remains saved.",
      "Practice completion is tracked separately. You confirm completion after doing a practice; a timer alone never completes it. Brain and Body progress reflects completed required practices. The practice routine day runs from 06:00 to the following 06:00, so night practices belong to the preceding evening.",
      "Optional practices can appear in history without being required for a full-routine day. Relief sessions do not count toward Daily routine completion, but opening the app to use Relief counts as a visit for your daily streak."
    ] },
    { id: "wellbeing", title: "Is Evenstate medical care?", paragraphs: [
      "No. Evenstate is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. It offers general wellbeing activities. Consult a qualified healthcare professional for medical advice, diagnosis, or treatment. You can adapt, skip, or stop any practice."
    ] },
  ],
};
