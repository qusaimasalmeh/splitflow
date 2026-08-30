export type Language = 'en' | 'ar' | 'he';

export interface Translations {
  appName: string;
  tagline: string;
  groups: string;
  expenses: string;
  settle: string;
  auditLogs: string;
  settings: string;
  quickAdd: string;
  globalNetting: string;
  isolatedNetting: string;
  nettingExplanation: string;
  addExpense: string;
  editExpense: string;
  deleteExpense: string;
  payer: string;
  amount: string;
  description: string;
  splitEqually: string;
  splitAmongAll: string;
  settlementSummary: string;
  payDirectly: string;
  payTo: string;
  viewFullApp: string;
  createNewGroup: string;
  expensesList: string;
  summaryShareLink: string;
  splitAmongCount: string;
  splitWithCount: string;
  splitWith: string;
  splitEquallyBetween: string;
  selectAll: string;
  deselectAll: string;
  customSplit: string;
  selectGroup: string;
  createGroup: string;
  groupName: string;
  members: string;
  addMember: string;
  userName: string;
  phoneOptional: string;
  payPalOptional: string;
  noExpensesYet: string;
  noExpensesSub: string;
  allSettledUp: string;
  totalExpenses: string;
  whoOwesWhom: string;
  owes: string;
  markAsPaid: string;
  settlementRecorded: string;
  paid: string;
  payWithPayPal: string;
  payWithBit: string;
  payWithPayBox: string;
  shareWhatsApp: string;
  copySummary: string;
  copiedToClipboard: string;
  phoneNumberCopied: string;
  stateLoadedFromUrl: string;
  crossGroupNettingBadge: string;
  blacklistManager: string;
  blacklistDescription: string;
  addExclusion: string;
  userCannotPay: string;
  reasonOptional: string;
  noExclusions: string;
  removeExclusion: string;
  currency: string;
  language: string;
  theme: string;
  clearAllData: string;
  confirmClear: string;
  cancel: string;
  save: string;
  add: string;
  done: string;
  allGroups: string;
  activeGroup: string;
  yourBalance: string;
  youAreOwed: string;
  youOwe: string;
  netZero: string;
  reconciliationAudit: string;
  auditTrail: string;
  emptyAudit: string;
  pendingInvites: string;
  inviteMember: string;
  leaveGroup: string;
  inviteByPhone: string;
  inviteSent: string;
  userNotFound: string;
  enterPhoneNumber: string;
  accept: string;
  decline: string;
  myProfile: string;
  nameLabel: string;
  phoneNumberLabel: string;
  paypalUsernameLabel: string;
  expensesCSV: string;
  downloadExpenses: string;
  settlementsCSV: string;
  downloadSettlements: string;
  exportBackup: string;
  saveFullState: string;
  importBackup: string;
  restoreFromJson: string;
  mutualPreferenceExample: string;
  usernamePlaceholder: string;
  total: string;
  tapToSwitch: string;
  groupIcon: string;
  fromYourContacts: string;
  or: string;
  inviteNewUserPhone: string;
  send: string;
  offlineGhost: string;
  registeredAccount: string;
  noContactsAvailable: string;
  selectAllThatApply: string;
  manageGroupsSubtitle: string;
  egSummerVacation: string;
  egSarah: string;
  egSarah123: string;
  splitMode: string;
  egDinner: string;
  transfersLabel: string;
  socialDebtGraph: string;
  runLocal: string;
  runDemo: string;
  tryPopulatedDemo: string;
  demoDescription: string;
  tryInstantly: string;
  signIn: string;
  accessSharedGroups: string;
  selectAccount: string;
  chooseTestAccount: string;
  smartExpenseSplitting: string;
  signOut: string;
  searchExpenses: string;
  addInviteMember: string;
  preferencesSubtitle: string;
  dataExportBackup: string;
  totalEntries: string;
  catCoffee: string;
  catDinner: string;
  catGroceries: string;
  catUberTaxi: string;
  catRentBills: string;
  splitEqual: string;
  splitExact: string;
  splitPct: string;
  splitParts: string;
  splitInfoEqual: string;
  splitInfoExact: string;
  splitInfoPct: string;
  splitInfoParts: string;
  summaryTitle: string;
  summaryAllSettled: string;
  summaryWhoOwesWhom: string;
  summaryCrossGroup: string;
  summarySomeone: string;
  summaryGroupsInvolved: string;
  summaryOpenEdit: string;
  helpModalTitle: string;
  helpTabBasics: string;
  helpTabSplitting: string;
  helpTabNetting: string;
  helpBasicsTitle: string;
  helpBasicsDesc1: string;
  helpBasicsDesc2: string;
  helpSplitTitle: string;
  helpSplitEqual: string;
  helpSplitExact: string;
  helpSplitPct: string;
  helpSplitParts: string;
  helpNettingTitle: string;
  helpNettingDesc1: string;
  helpNettingDesc2: string;
  helpNettingDesc3: string;
  gotIt: string;
  uiScaleLabel: string;
  uiScaleNormal: string;
  uiScaleLarge: string;
  uiScaleXLarge: string;
}




export const translations: Record<Language, Translations> = {
  en: {
    preferencesSubtitle: "Preferences, exports & profile.",
    dataExportBackup: "Data Export & Backup",
    totalEntries: "total entries",
    catCoffee: "Coffee",
    catDinner: "Dinner",
    catGroceries: "Groceries",
    catUberTaxi: "Uber/Taxi",
    catRentBills: "Rent/Bills",
    splitEqual: "Equal",
    splitExact: "$ Exact",
    splitPct: "% Pct",
    splitParts: "Parts",
    splitInfoEqual: "Share equally",
    splitInfoExact: "Exact amounts",
    splitInfoPct: "Percentages",
    splitInfoParts: "Ratio parts",
    summaryTitle: "*SplitFlow - Expense Settlement Summary*",
    summaryAllSettled: "All balances are settled up! No one owes anything.",
    summaryWhoOwesWhom: "*Who Owes Whom:*",
    summaryCrossGroup: "[Cross-Group]",
    summarySomeone: "Someone",
    summaryGroupsInvolved: "*Groups Involved:*",
    summaryOpenEdit: "*Open & Edit in SplitFlow:*",
    helpModalTitle: 'How SplitFlow Works',
    helpTabBasics: 'The Basics',
    helpTabSplitting: 'Splitting',
    helpTabNetting: 'Smart Netting',
    helpBasicsTitle: 'Groups & Expenses',
    helpBasicsDesc1: 'SplitFlow lets you organize your expenses into Groups. You can add your friends to groups, or invite them directly using their phone number.',
    helpBasicsDesc2: 'When you add an expense, you can choose who paid and how it should be split among the group members.',
    helpSplitTitle: 'Flexible Splitting',
    helpSplitEqual: 'Equal: Splits the total evenly among everyone.',
    helpSplitExact: 'Exact: Enter the exact amount each person owes.',
    helpSplitPct: 'Percentage: Split by percentages (must equal 100%).',
    helpSplitParts: 'Ratio Parts: Great for families (e.g., 2 shares for you, 1 share for your partner).',
    helpNettingTitle: 'Smart Cross-Group Netting',
    helpNettingDesc1: 'Our algorithm automatically simplifies your debts to minimize the number of transfers you have to make.',
    helpNettingDesc2: 'If you owe Alice $10 in the Dinner group, and she owes you $15 in the Trip group, SplitFlow will automatically net this so she just owes you $5 overall!',
    helpNettingDesc3: 'Strangers (people you don\'t share any groups with) will never be asked to pay each other directly unless safely routed through a mutual friend.',
    gotIt: 'Got it!',
    uiScaleLabel: 'App Text & UI Size',
    uiScaleNormal: 'Normal',
    uiScaleLarge: 'Large',
    uiScaleXLarge: 'Extra Large',
    myProfile: "My Profile",
    nameLabel: "Name",
    phoneNumberLabel: "Phone Number",
    paypalUsernameLabel: "PayPal Username",
    expensesCSV: "Expenses CSV",
    downloadExpenses: "Download tabular spreadsheet",
    settlementsCSV: "Settlements CSV",
    downloadSettlements: "Download who owes whom",
    exportBackup: "Export Backup",
    saveFullState: "Save full JSON state",
    importBackup: "Import Backup",
    restoreFromJson: "Restore from JSON file",
    mutualPreferenceExample: "e.g. Mutual preference",
    usernamePlaceholder: "username",
    total: "Total",
    tapToSwitch: "Tap to switch",
    groupIcon: "Group Icon",
    fromYourContacts: "From Your Contacts",
    or: "OR",
    inviteNewUserPhone: "Invite New User via Phone",
    send: "Send",
    offlineGhost: "Offline Ghost (Instantly Add)",
    registeredAccount: "Registered Account (Send Invite)",
    noContactsAvailable: "No available contacts to add.",
    selectAllThatApply: "Select all that apply",
    manageGroupsSubtitle: "Manage groups & team members",
    egSummerVacation: "e.g. Summer Vacation",
    egSarah: "e.g. Sarah",
    egSarah123: "sarah123",
    splitMode: "Split Mode",
    egDinner: "e.g. Dinner with friends",
    transfersLabel: "transfers",
    socialDebtGraph: "Social Debt Graph Visualization",
    runLocal: 'Run Local',
    runDemo: 'Live Demo',
    tryPopulatedDemo: 'Try Populated Demo',
    demoDescription: 'See how cross-group netting works with dummy data',
    tryInstantly: "Try it instantly without an account",
    signIn: "Sign In",
    accessSharedGroups: "Access your shared groups",
    selectAccount: "Select Account",
    chooseTestAccount: "Choose a test account to log in with.",
    smartExpenseSplitting: "Smart Expense Splitting",
    signOut: "Sign Out",
    searchExpenses: "Search expenses...",
    addInviteMember: "Add / Invite Member",
    appName: 'SplitFlow',
    tagline: 'Smart Multi-Group Expense Splitter',
    groups: 'Groups',
    expenses: 'Expenses',
    settle: 'Settlement',
    auditLogs: 'Audit Trail',
    settings: 'Settings',
    quickAdd: 'Quick Add',
    globalNetting: 'Settle Across All Groups',
    isolatedNetting: 'Settle This Group Only',
    nettingExplanation: 'When settling across all groups, we calculate your total balance with each person you share groups with. You can only pay people directly if you share at least one group with them.',
    addExpense: 'Add Expense',
    editExpense: 'Edit Expense',
    deleteExpense: 'Delete Expense',
    payer: 'Who paid?',
    amount: 'How much?',
    description: 'For what?',
    splitEqually: 'Split equally among members',
    splitAmongAll: 'Split among all ({count})',
    settlementSummary: 'Settlement & Payment Summary',
    payDirectly: 'Pay Directly',
    payTo: 'Pay to',
    viewFullApp: 'Open in SplitFlow Editor',
    createNewGroup: 'Create Your Own Group',
    expensesList: 'Expenses Breakdown',
    summaryShareLink: '*View & Pay on SplitFlow:*',
    splitAmongCount: 'Split among {count} of {total}',
    splitWithCount: 'Split with ({count})',
    splitWith: 'Split with:',
    splitEquallyBetween: 'Split equally between',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    customSplit: 'Custom Split',
    selectGroup: 'Select Group',
    createGroup: 'Create New Group',
    groupName: 'Group Name',
    members: 'Members',
    addMember: 'Add Member',
    userName: 'Name',
    phoneOptional: 'Phone number (for Bit/PayBox/WhatsApp)',
    payPalOptional: 'PayPal.Me username (optional)',
    noExpensesYet: 'No expenses added yet',
    noExpensesSub: 'Tap the Quick Add button below to add your first expense!',
    allSettledUp: 'All settled up! Everyone is even.',
    totalExpenses: 'Total Expenses',
    whoOwesWhom: 'Who Owes Whom',
    owes: 'owes',
    markAsPaid: 'Mark as Paid',
    settlementRecorded: 'Settlement payment recorded successfully!',
    paid: 'Paid',
    payWithPayPal: 'PayPal',
    payWithBit: 'Bit',
    payWithPayBox: 'PayBox',
    shareWhatsApp: 'Share on WhatsApp',
    copySummary: 'Copy Summary',
    copiedToClipboard: 'Summary copied to clipboard!',
    phoneNumberCopied: 'Phone number copied to clipboard!',
    stateLoadedFromUrl: 'Loaded shared state from URL link!',
    crossGroupNettingBadge: 'Cross-Group Optimized',
    blacklistManager: 'Payment Exclusions (Blacklists)',
    blacklistDescription: 'Specify who should never pay whom directly. SplitFlow will route balances through mutual friends or keep them isolated.',
    addExclusion: 'Add Exclusion Rule',
    userCannotPay: 'cannot pay directly to',
    reasonOptional: 'Reason (optional)',
    noExclusions: 'No payment exclusions defined.',
    removeExclusion: 'Remove',
    currency: 'Currency',
    language: 'Language',
    theme: 'Theme',
    clearAllData: 'Reset All Data',
    confirmClear: 'Are you sure you want to reset all data? This cannot be undone.',
    cancel: 'Cancel',
    save: 'Save',
    add: 'Add',
    done: 'Done',
    allGroups: 'All Groups (Global)',
    activeGroup: 'Active Group',
    yourBalance: 'Your Balance',
    youAreOwed: 'is owed',
    youOwe: 'owes',
    netZero: 'Settled',
    reconciliationAudit: 'Reconciliation Log',
    auditTrail: 'Audit History',
    emptyAudit: 'No audit records yet.',
    pendingInvites: 'Pending Group Invites',
    inviteMember: 'Invite Member',
    leaveGroup: 'Leave Group',
    inviteByPhone: 'Invite by Phone Number',
    inviteSent: 'Invite sent successfully!',
    userNotFound: 'User not found. Check the phone number.',
    enterPhoneNumber: 'Enter phone number (e.g. +123...)',
    accept: 'Accept',
    decline: 'Decline',
  },
  ar: {
    preferencesSubtitle: "التفضيلات، التصدير، والملف الشخصي.",
    dataExportBackup: "تصدير البيانات والنسخ الاحتياطي",
    totalEntries: "سجلات إجمالية",
    catCoffee: "قهوة",
    catDinner: "عشاء",
    catGroceries: "بقالة",
    catUberTaxi: "أوبر/تاكسي",
    catRentBills: "إيجار/فواتير",
    splitEqual: "بالتساوي",
    splitExact: "$ محدد",
    splitPct: "% نسبة",
    splitParts: "حصص",
    splitInfoEqual: "مشاركة بالتساوي",
    splitInfoExact: "مبالغ محددة",
    splitInfoPct: "نسب مئوية",
    splitInfoParts: "حصص نسبية",
    summaryTitle: "*سبليت فلو - ملخص تسوية المصاريف*",
    summaryAllSettled: "تم تسوية جميع الأرصدة! لا أحد مدين بشيء.",
    summaryWhoOwesWhom: "*من يدين لمن:*",
    summaryCrossGroup: "[بين المجموعات]",
    summarySomeone: "شخص ما",
    summaryGroupsInvolved: "*المجموعات المعنية:*",
    summaryOpenEdit: "*افتح وعدل في سبليت فلو:*",
    helpModalTitle: 'كيف يعمل سبليت فلو',
    helpTabBasics: 'الأساسيات',
    helpTabSplitting: 'طرق التقسيم',
    helpTabNetting: 'المقاصة الذكية',
    helpBasicsTitle: 'المجموعات والمصاريف',
    helpBasicsDesc1: 'يتيح لك سبليت فلو تنظيم مصاريفك في مجموعات. يمكنك إضافة أصدقائك إلى المجموعات، أو دعوتهم مباشرة باستخدام أرقام هواتفهم.',
    helpBasicsDesc2: 'عند إضافة مصروف، يمكنك اختيار من دفع وكيفية تقسيم المبلغ بين أعضاء المجموعة.',
    helpSplitTitle: 'خيارات تقسيم مرنة',
    helpSplitEqual: 'بالتساوي: يقسم المجموع بالتساوي بين الجميع.',
    helpSplitExact: 'محدد: أدخل المبلغ الدقيق الذي يدين به كل شخص.',
    helpSplitPct: 'النسبة المئوية: التقسيم بنسب مئوية (يجب أن يساوي 100%).',
    helpSplitParts: 'حصص: رائع للعائلات (مثلاً حصتين لك، حصة لشريكك).',
    helpNettingTitle: 'المقاصة الشاملة الذكية',
    helpNettingDesc1: 'تقوم خوارزميتنا بتبسيط ديونك تلقائياً لتقليل عدد التحويلات المالية التي يتعين عليك القيام بها.',
    helpNettingDesc2: 'إذا كنت مديناً لأليس بـ 10 دولارات في مجموعة العشاء، وهي تدين لك بـ 15 دولاراً في مجموعة الرحلة، سيقوم التطبيق بخصم ذلك بحيث تدين لك بـ 5 دولارات فقط في المجموع!',
    helpNettingDesc3: 'الغرباء (الأشخاص الذين لا تشاركهم أي مجموعات) لن يُطلب منهم الدفع لبعضهم البعض مباشرة أبداً إلا إذا تم توجيه الدفع بأمان عبر صديق مشترك.',
    gotIt: 'مفهوم!',
    uiScaleLabel: 'حجم التطبيق والنصوص',
    uiScaleNormal: 'عادي',
    uiScaleLarge: 'كبير',
    uiScaleXLarge: 'كبير جداً',
    myProfile: "ملفي الشخصي",
    nameLabel: "الاسم",
    phoneNumberLabel: "رقم الهاتف",
    paypalUsernameLabel: "اسم مستخدم PayPal",
    expensesCSV: "تصدير المصاريف CSV",
    downloadExpenses: "تحميل جدول المصاريف",
    settlementsCSV: "تصدير التسويات CSV",
    downloadSettlements: "تحميل من يدين لمن",
    exportBackup: "تصدير نسخة احتياطية",
    saveFullState: "حفظ حالة التطبيق كاملة JSON",
    importBackup: "استيراد نسخة احتياطية",
    restoreFromJson: "استعادة من ملف JSON",
    mutualPreferenceExample: "مثال: تفضيل مشترك",
    usernamePlaceholder: "اسم المستخدم",
    total: "الإجمالي",
    tapToSwitch: "اضغط للتبديل",
    groupIcon: "أيقونة المجموعة",
    fromYourContacts: "من جهات الاتصال الخاصة بك",
    or: "أو",
    inviteNewUserPhone: "دعوة مستخدم جديد عبر الهاتف",
    send: "إرسال",
    offlineGhost: "حساب محلي (إضافة فورية)",
    registeredAccount: "حساب مسجل (إرسال دعوة)",
    noContactsAvailable: "لا توجد جهات اتصال متاحة للإضافة.",
    selectAllThatApply: "اختر كل ما ينطبق",
    manageGroupsSubtitle: "إدارة المجموعات وأعضاء الفريق",
    egSummerVacation: "مثال: الإجازة الصيفية",
    egSarah: "مثال: سارة",
    egSarah123: "sarah123",
    splitMode: "طريقة التقسيم",
    egDinner: "مثال: عشاء مع الأصدقاء",
    transfersLabel: "تحويلات",
    socialDebtGraph: "تصور بياني للديون الاجتماعية",
    runLocal: 'تشغيل محلي',
    runDemo: 'عرض تجريبي',
    tryPopulatedDemo: 'تجربة نسخة مليئة بالبيانات',
    demoDescription: 'تعرف على كيفية عمل تسوية الحسابات باستخدام بيانات تجريبية',
    tryInstantly: "جربه فوراً بدون حساب",
    signIn: "تسجيل الدخول",
    accessSharedGroups: "الوصول إلى مجموعاتك المشتركة",
    selectAccount: "اختر الحساب",
    chooseTestAccount: "اختر حساب تجريبي لتسجيل الدخول.",
    smartExpenseSplitting: "تقسيم المصاريف الذكي",
    signOut: "تسجيل الخروج",
    searchExpenses: "البحث في المصاريف...",
    addInviteMember: "إضافة / دعوة عضو",
    appName: 'سبليت فلو',
    tagline: 'حاسبة قطيّة ذكية ومصفي الحسابات',
    groups: 'المجموعات',
    expenses: 'المصاريف',
    settle: 'التسوية',
    auditLogs: 'سجل العمليات',
    settings: 'الإعدادات',
    quickAdd: 'إضافة سريعة',
    globalNetting: 'التسوية عبر جميع المجموعات',
    isolatedNetting: 'تسوية هذه المجموعة فقط',
    nettingExplanation: 'عند التسوية عبر جميع المجموعات، نحسب إجمالي رصيدك مع كل شخص تتشارك معه في المجموعات. لا يمكنك الدفع للأشخاص مباشرة إلا إذا كنت تتشارك معهم في مجموعة واحدة على الأقل.',
    addExpense: 'إضافة مصروف',
    editExpense: 'تعديل المصروف',
    deleteExpense: 'حذف المصروف',
    payer: 'مين دفع؟',
    amount: 'كم المبلغ؟',
    description: 'حق إيش؟',
    splitEqually: 'تقسيم بالتساوي بين الجميع',
    splitAmongAll: 'مقسم بين الجميع ({count})',
    settlementSummary: 'ملخص التسوية والدفع',
    payDirectly: 'الدفع مباشرة',
    payTo: 'الدفع إلى',
    viewFullApp: 'فتح في محرر SplitFlow',
    createNewGroup: 'إنشاء مجموعة خاصة بك',
    expensesList: 'تفاصيل المصاريف',
    summaryShareLink: '*للدفع وعرض الملخص:*',
    splitAmongCount: 'مقسم بين {count} من أصل {total}',
    splitWithCount: 'التقسيم مع ({count})',
    splitWith: 'التقسيم مع:',
    splitEquallyBetween: 'مقسم بالتساوي بين',
    selectAll: 'تحديد الكل',
    deselectAll: 'إلغاء تحديد الكل',
    customSplit: 'تقسيم مخصص',
    selectGroup: 'اختر المجموعة',
    createGroup: 'إنشاء مجموعة جديدة',
    groupName: 'اسم المجموعة',
    members: 'الأعضاء',
    addMember: 'إضافة عضو',
    userName: 'الاسم',
    phoneOptional: 'رقم الهاتف (لـ Bit / PayBox / واتساب)',
    payPalOptional: 'اسم حساب PayPal.Me (اختياري)',
    noExpensesYet: 'لا توجد مصاريف مضافة بعد',
    noExpensesSub: 'اضغط على زر الإضافة السريعة بالأسفل لتسجيل أول مصروف!',
    allSettledUp: 'الحساب خالص! الكل مصفّي حسابه.',
    totalExpenses: 'إجمالي المصاريف',
    whoOwesWhom: 'مين يدفع لمين؟',
    owes: 'مطلوب منه لـ',
    markAsPaid: 'تم السداد',
    settlementRecorded: 'تم تسجيل السداد وتحديث الأرصدة بنجاح!',
    paid: 'مسدد',
    payWithPayPal: 'PayPal',
    payWithBit: 'Bit',
    payWithPayBox: 'PayBox',
    shareWhatsApp: 'مشاركة عبر واتساب',
    copySummary: 'نسخ ملخص التسوية',
    copiedToClipboard: 'تم نسخ ملخص التسوية إلى الحافظة!',
    phoneNumberCopied: 'تم نسخ رقم الهاتف للحافظة!',
    stateLoadedFromUrl: 'تم تحميل الحسابات المشتركة من الرابط بنجاح!',
    crossGroupNettingBadge: 'مقاصة مشتركة بين المجموعات',
    blacklistManager: 'استثناءات التحويل المباشر',
    blacklistDescription: 'حدد الأشخاص الذين لا يصح تحويل الأموال بينهم مباشرة. سيقوم النظام بتوجيه الحساب عبر صديق مشترك أو إبقائه منفصلاً.',
    addExclusion: 'إضافة قاعدة استثناء',
    userCannotPay: 'لا يحول مباشرة إلى',
    reasonOptional: 'السبب (اختياري)',
    noExclusions: 'لا توجد قواعد استثناء محددة.',
    removeExclusion: 'إزالة',
    currency: 'العملة',
    language: 'اللغة',
    theme: 'المظهر',
    clearAllData: 'إعادة ضبط كل البيانات',
    confirmClear: 'هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذا.',
    cancel: 'إلغاء',
    save: 'حفظ',
    add: 'إضافة',
    done: 'تم',
    allGroups: 'جميع المجموعات (شامل)',
    activeGroup: 'المجموعة الحالية',
    yourBalance: 'الرصيد',
    youAreOwed: 'له',
    youOwe: 'عليه',
    netZero: 'مصفى',
    reconciliationAudit: 'سجل التسويات والمطابقة',
    auditTrail: 'تاريخ العمليات',
    emptyAudit: 'لا توجد سجلات بعد.',
    pendingInvites: 'دعوات المجموعات المعلقة',
    inviteMember: 'دعوة عضو',
    leaveGroup: 'مغادرة المجموعة',
    inviteByPhone: 'دعوة عبر رقم الهاتف',
    inviteSent: 'تم إرسال الدعوة بنجاح!',
    userNotFound: 'لم يتم العثور على المستخدم. تحقق من رقم الهاتف.',
    enterPhoneNumber: 'أدخل رقم الهاتف (مثال: +123...)',
    accept: 'قبول',
    decline: 'رفض',
  },
  he: {
    preferencesSubtitle: "העדפות, ייצוא ופרופיל.",
    dataExportBackup: "ייצוא נתונים וגיבוי",
    totalEntries: "רשומות בסך הכל",
    catCoffee: "קפה",
    catDinner: "ארוחת ערב",
    catGroceries: "מצרכים",
    catUberTaxi: "מונית/אובר",
    catRentBills: "שכירות/חשבונות",
    splitEqual: "שווה",
    splitExact: "$ מדויק",
    splitPct: "% אחוזים",
    splitParts: "חלקים",
    splitInfoEqual: "שתף באופן שווה",
    splitInfoExact: "סכומים מדויקים",
    splitInfoPct: "אחוזים",
    splitInfoParts: "חלקים יחסיים",
    summaryTitle: "*SplitFlow - סיכום התחשבנות הוצאות*",
    summaryAllSettled: "כל היתרות מאוזנות! אף אחד לא חייב כלום.",
    summaryWhoOwesWhom: "*מי חייב למי:*",
    summaryCrossGroup: "[בין-קבוצתי]",
    summarySomeone: "מישהו",
    summaryGroupsInvolved: "*קבוצות מעורבות:*",
    summaryOpenEdit: "*פתח וערוך ב-SplitFlow:*",
    helpModalTitle: 'איך SplitFlow עובד',
    helpTabBasics: 'הבסיס',
    helpTabSplitting: 'פיצול הוצאות',
    helpTabNetting: 'קיזוז חכם',
    helpBasicsTitle: 'קבוצות והוצאות',
    helpBasicsDesc1: 'SplitFlow מאפשר לך לארגן את ההוצאות שלך בקבוצות. תוכל להוסיף חברים, או להזמין אותם ישירות דרך מספר הטלפון.',
    helpBasicsDesc2: 'כאשר אתה מוסיף הוצאה, תוכל לבחור מי שילם ואיך לפצל את הסכום בין חברי הקבוצה.',
    helpSplitTitle: 'אפשרויות פיצול גמישות',
    helpSplitEqual: 'שווה בשווה: מחלק את הסכום באופן שווה בין כולם.',
    helpSplitExact: 'מדויק: הזן את הסכום המדויק שכל אחד חייב.',
    helpSplitPct: 'אחוזים: פיצול לפי אחוזים (חייב להסתכם ב-100%).',
    helpSplitParts: 'חלקים (יחס): מעולה למשפחות (למשל, 2 מנות לך, מנה אחת לבן הזוג).',
    helpNettingTitle: 'קיזוז חוצה-קבוצות חכם',
    helpNettingDesc1: 'האלגוריתם שלנו מפשט אוטומטית את החובות כדי למזער את מספר ההעברות הבנקאיות.',
    helpNettingDesc2: 'אם אתה חייב לאליס 10$ בקבוצת ארוחת ערב, והיא חייבת לך 15$ בקבוצת טיול, האפליקציה תקזז את זה כך שהיא תהיה חייבת לך רק 5$ בסך הכל!',
    helpNettingDesc3: 'אנשים זרים (ללא קבוצות משותפות) לעולם לא יתבקשו לשלם אחד לשני ישירות אלא אם התשלום מנותב בבטחה דרך חבר משותף.',
    gotIt: 'הבנתי!',
    uiScaleLabel: 'גודל טקסט וממשק',
    uiScaleNormal: 'רגיל',
    uiScaleLarge: 'גדול',
    uiScaleXLarge: 'גדול מאוד',
    myProfile: "הפרופיל שלי",
    nameLabel: "שם",
    phoneNumberLabel: "מספר טלפון",
    paypalUsernameLabel: "שם משתמש PayPal",
    expensesCSV: "קובץ הוצאות CSV",
    downloadExpenses: "הורד גיליון נתונים",
    settlementsCSV: "קובץ התחשבנויות CSV",
    downloadSettlements: "הורד מי חייב למי",
    exportBackup: "ייצוא גיבוי",
    saveFullState: "שמור נתונים מלאים כקובץ JSON",
    importBackup: "ייבוא גיבוי",
    restoreFromJson: "שחזר מקובץ JSON",
    mutualPreferenceExample: "לדוגמה: העדפה הדדית",
    usernamePlaceholder: "שם משתמש",
    total: "סך הכל",
    tapToSwitch: "לחץ להחלפה",
    groupIcon: "סמל הקבוצה",
    fromYourContacts: "מאנשי הקשר שלך",
    or: "או",
    inviteNewUserPhone: "הזמן משתמש חדש דרך מספר טלפון",
    send: "שלח",
    offlineGhost: "משתמש מקומי (הוספה מיידית)",
    registeredAccount: "משתמש רשום (שלח הזמנה)",
    noContactsAvailable: "אין אנשי קשר זמינים להוספה.",
    selectAllThatApply: "בחר את כל האפשרויות הרלוונטיות",
    manageGroupsSubtitle: "ניהול קבוצות וחברי צוות",
    egSummerVacation: "לדוגמה: חופשת קיץ",
    egSarah: "לדוגמה: שרה",
    egSarah123: "sarah123",
    splitMode: "מצב פיצול",
    egDinner: "לדוגמה: ארוחת ערב עם חברים",
    transfersLabel: "העברות",
    socialDebtGraph: "תרשים חובות חברתיים",
    runLocal: 'הפעלה מקומית',
    runDemo: 'הדגמה חיה',
    tryPopulatedDemo: 'נסה הדגמה מלאה',
    demoDescription: 'ראה כיצד קיזוז קבוצות עובד עם נתוני דמה',
    tryInstantly: "נסה עכשיו ללא חשבון",
    signIn: "התחברות",
    accessSharedGroups: "גש לקבוצות המשותפות שלך",
    selectAccount: "בחר חשבון",
    chooseTestAccount: "בחר חשבון לבדיקה.",
    smartExpenseSplitting: "פיצול הוצאות חכם",
    signOut: "התנתקות",
    searchExpenses: "חפש הוצאות...",
    addInviteMember: "הוסף / הזמן חבר",
    appName: 'SplitFlow',
    tagline: 'מחשבון חלוקת הוצאות וקיזוז חכם',
    groups: 'קבוצות',
    expenses: 'הוצאות',
    settle: 'התחשבנות',
    auditLogs: 'יומן פעולות',
    settings: 'הגדרות',
    quickAdd: 'הוספה מהירה',
    globalNetting: 'התחשבנות בכל הקבוצות',
    isolatedNetting: 'התחשבנות לקבוצה זו בלבד',
    nettingExplanation: 'בעת התחשבנות בכל הקבוצות, אנו מחשבים את המאזן הכולל שלך מול כל אדם שיש לך איתו קבוצות משותפות. אפשר לשלם לאנשים ישירות רק אם יש לכם לפחות קבוצה אחת משותפת.',
    addExpense: 'הוספת הוצאה',
    editExpense: 'עריכת הוצאה',
    deleteExpense: 'מחיקת הוצאה',
    payer: 'מי שילם/ה?',
    amount: 'כמה שולם?',
    description: 'עבור מה?',
    splitEqually: 'חלוקה שווה בין החברים',
    splitAmongAll: 'מחולק בין כולם ({count})',
    settlementSummary: 'סיכום התחשבנות ותשלום',
    payDirectly: 'תשלום ישיר',
    payTo: 'תשלום ל',
    viewFullApp: 'פתח ב-SplitFlow המלא',
    createNewGroup: 'צור קבוצה משלך',
    expensesList: 'פירוט ההוצאות',
    summaryShareLink: '*לתשלום וצפייה בסיכום:*',
    splitAmongCount: 'מחולק בין {count} מתוך {total}',
    splitWithCount: 'חלוקה עם ({count})',
    splitWith: 'חלוקה עם:',
    splitEquallyBetween: 'מחולק שווה בין',
    selectAll: 'בחר הכל',
    deselectAll: 'בטל בחירה',
    customSplit: 'חלוקה מותאמת אישית',
    selectGroup: 'בחירת קבוצה',
    createGroup: 'יצירת קבוצה חדשה',
    groupName: 'שם הקבוצה',
    members: 'חברים',
    addMember: 'הוספת חבר/ה',
    userName: 'שם',
    phoneOptional: 'מספר טלפון (ל-Bit / PayBox / וואטסאפ)',
    payPalOptional: 'שם משתמש PayPal.Me (אופציונלי)',
    noExpensesYet: 'טרם נוספו הוצאות',
    noExpensesSub: 'לחצו על כפתור ההוספה המהירה למטה כדי להוסיף הוצאה ראשונה!',
    allSettledUp: 'הכל מסולק! כולם שווים.',
    totalExpenses: 'סך כל ההוצאות',
    whoOwesWhom: 'מי מעביר למי',
    owes: 'חייב/ת ל',
    markAsPaid: 'סמן כשולם',
    settlementRecorded: 'ההעברה נרשמה והיתרות עודכנו בהצלחה!',
    paid: 'שולם',
    payWithPayPal: 'PayPal',
    payWithBit: 'Bit',
    payWithPayBox: 'PayBox',
    shareWhatsApp: 'שיתוף בוואטסאפ',
    copySummary: 'העתקת סיכום',
    copiedToClipboard: 'הסיכום הועתק ללוח!',
    phoneNumberCopied: 'מספר הטלפון הועתק ללוח!',
    stateLoadedFromUrl: 'הנתונים המשותפים נטענו בהצלחה מהקישור!',
    crossGroupNettingBadge: 'קיזוז רב-קבוצתי',
    blacklistManager: 'חריגות והגבלות העברה',
    blacklistDescription: 'הגדירו מי לא יעביר כספים ישירות למי. המערכת תנתב דרך חבר משותף או תשאיר את החוב מבודד.',
    addExclusion: 'הוספת הגבלה חדשה',
    userCannotPay: 'לא יעביר/תעביר ישירות ל',
    reasonOptional: 'סיבה (אופציונלי)',
    noExclusions: 'אין הגבלות העברה מוגדרות.',
    removeExclusion: 'הסרה',
    currency: 'מטבע',
    language: 'שפה',
    theme: 'ערכת נושא',
    clearAllData: 'איפוס כל הנתונים',
    confirmClear: 'האם לאפס את כל הנתונים? פעולה זו אינה ניתנת לביטול.',
    cancel: 'ביטול',
    save: 'שמירה',
    add: 'הוספה',
    done: 'סיום',
    allGroups: 'כל הקבוצות (גלובלי)',
    activeGroup: 'קבוצה פעילה',
    yourBalance: 'מאזן',
    youAreOwed: 'בזכות',
    youOwe: 'בחובה',
    netZero: 'מאוזן',
    reconciliationAudit: 'יומן התאמות וקיזוז',
    auditTrail: 'היסטוריית פעולות',
    emptyAudit: 'טרם נרשמו פעולות.',
    pendingInvites: 'הזמנות קבוצה ממתינות',
    inviteMember: 'הזמן חבר',
    leaveGroup: 'עזוב קבוצה',
    inviteByPhone: 'הזמנה לפי מספר טלפון',
    inviteSent: 'ההזמנה נשלחה בהצלחה!',
    userNotFound: 'המשתמש לא נמצא. בדוק את מספר הטלפון.',
    enterPhoneNumber: 'הכנס מספר טלפון (לדוגמה: +123...)',
    accept: 'קבל',
    decline: 'דחה',
  },
};
