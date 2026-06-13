export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja';

export interface TranslationDictionary {
  brandLogo: string;
  sandboxMode: string;
  launchConsole: string;
  backToLanding: string;
  themeToggleLight: string;
  themeToggleDark: string;
  activeCore: string;
  syncChecked: string;
  
  // Navigation links
  navDashboard: string;
  navRetainFlow: string;
  navCostGuard: string;
  navStockSense: string;
  navAria: string;
  navPricing: string;
  navSettings: string;
  
  // Welcomes (Pop up top notifications)
  welcomePopTitle: string;
  welcomePopDesc: Record<string, string>;
  
  // Settings Panel Details
  settingsTitle: string;
  settingsSubtitle: string;
  storeIdentityTitle: string;
  storeIdentityDesc: string;
  bizNameLabel: string;
  adminNameLabel: string;
  adminEmailLabel: string;
  smsAlertLabel: string;
  updateBtn: string;
  opsNodeStatus: string;
  opsNodeDesc: string;
  relaunchWizard: string;
  
  // Language selectors
  langLabel: string;
  langDesc: string;
  
  // Contact sync feature text
  contactSyncTitle: string;
  contactSyncDesc: string;
  contactNamePlaceholder: string;
  contactPhonePlaceholder: string;
  contactEmailPlaceholder: string;
  contactTagLabel: string;
  addContactBtn: string;
  syncAriaEngineBtn: string;
  syncedContactsLabel: string;
  noContacts: string;
  pastedContactsLabel: string;
  pastedContactsPlaceholder: string;
  bulkSyncBtn: string;

  // Landing Page Header/Hero
  heroBadge: string;
  heroHeaderPart1: string;
  heroHeaderPart2: string;
  heroDesc: string;
  heroCTA1: string;
  heroCTA2: string;
  capEngines: string;
  meetAria: string;
  enterpriseSpecs: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandLogo: "Omni AI",
    sandboxMode: "Sandbox System",
    launchConsole: "LAUNCH COMPASS SYSTEM",
    backToLanding: "← Back to Landing",
    themeToggleLight: "Sandstone Light",
    themeToggleDark: "Slate Noir",
    activeCore: "ACTIVE COGNITIVE CORE",
    syncChecked: "Aria Sync Checked",
    
    navDashboard: "Operational Hub",
    navRetainFlow: "Predictive Loyalty",
    navCostGuard: "Profit Protector",
    navStockSense: "Supply Genius",
    navAria: "Aria Co-Pilot",
    navPricing: "Premium Plans",
    navSettings: "System Settings",
    
    welcomePopTitle: "✨ Welcome Command Line Activated",
    welcomePopDesc: {
      dashboard: "Access real-time summaries of store integrity, total revenue, active churn alerts, and leak indicators.",
      retainflow: "Identify and restore high-risk accounts using AI-generated winback campaigns.",
      costguard: "Prevent cash leaks and identify silent billing duplicates before they impact monthly margins.",
      stocksense: "Automate supply threshold alarms and run cache frequency stress tests.",
      aria: "Engage with your autonomous voice and cognitive learning intelligence agent.",
      pricing: "Compare premium license limits and scale operational capabilities.",
      settings: "Update enterprise details, sync contact lists, and switch primary translation nodes."
    },
    
    settingsTitle: "System Settings",
    settingsSubtitle: "Manage store attributes, access keys, notification alert lines, and operational metrics synchronization.",
    storeIdentityTitle: "Store Identity",
    storeIdentityDesc: "Properties propagate onto Aria smart agent chat modules and reports immediately.",
    bizNameLabel: "Business / Store Name",
    adminNameLabel: "Administrator Name",
    adminEmailLabel: "Administrative Email",
    smsAlertLabel: "SMS Alert Target",
    updateBtn: "Update System Identity",
    opsNodeStatus: "Operations Node Status",
    opsNodeDesc: "The cognitive model weighting stays synced locally in background buffers.",
    relaunchWizard: "Relaunch Onboarding Setup Wizard",
    
    langLabel: "Select System Language",
    langDesc: "Choose default vocabulary layout for sidebar channels, headers, and top notification welcome alerts.",
    
    contactSyncTitle: "Contact List Synchronization Node",
    contactSyncDesc: "Securely aggregate and upload external client phone files into Aria's automated communication memory.",
    contactNamePlaceholder: "Full Name (e.g., Arthur Dent)",
    contactPhonePlaceholder: "Phone (e.g., +1 555-0192)",
    contactEmailPlaceholder: "Email address",
    contactTagLabel: "Client Segment Tag",
    addContactBtn: "+ Add Singular Customer",
    syncAriaEngineBtn: "☁️ Synchronize Active Contacts with Aria Engine",
    syncedContactsLabel: "Synced Contact Database",
    noContacts: "No synced contacts active in this sandbox session.",
    pastedContactsLabel: "Bulk Import CSV / Raw Text",
    pastedContactsPlaceholder: "Paste comma-separated name & phone list (e.g.\nJane Doe, +15550212\nJohn Smith, +15550482)",
    bulkSyncBtn: "Batch Parse & Lock Contacts",

    heroBadge: "Autonomous Small Merchant Intelligence Suite",
    heroHeaderPart1: "Every problem.",
    heroHeaderPart2: "One interface.",
    heroDesc: "Unlock standard retail intelligence. Omni AI combines customer churn tracking, CFO margin optimization, and automated inventory systems together under one intelligent breathing avatar.",
    heroCTA1: "ENTER WORKSPACE DASHBOARD",
    heroCTA2: "MEET ARIA AVATAR",
    capEngines: "Capability Engines",
    meetAria: "Meet Aria",
    enterpriseSpecs: "Enterprise Specs"
  },
  es: {
    brandLogo: "Omni IA",
    sandboxMode: "Sistema de Pruebas",
    launchConsole: "INICIAR SISTEMA COMPASS",
    backToLanding: "← Volver al Inicio",
    themeToggleLight: "Luz de Arenisca",
    themeToggleDark: "Pizarra Negra",
    activeCore: "NÚCLEO COGNITIVO ACTIVO",
    syncChecked: "Sincronización Aria OK",
    
    navDashboard: "Panel Operativo",
    navRetainFlow: "Lealtad Predictiva",
    navCostGuard: "Protector de Ganancias",
    navStockSense: "Genio de Suministros",
    navAria: "Aria Co-Piloto",
    navPricing: "Planes Premium",
    navSettings: "Ajustes del Sistema",
    
    welcomePopTitle: "✨ Consola de Bienvenida Activada",
    welcomePopDesc: {
      dashboard: "Acceda a resúmenes en tiempo real de la integridad de la tienda, ingresos y alertas de fuga de capital.",
      retainflow: "Identifique y restaure cuentas de alto riesgo con campañas de recuperación automática.",
      costguard: "Evite fugas de efectivo y detecte duplicados de facturas antes de que afecten sus márgenes.",
      stocksense: "Automatice alarmas de suministro de inventario y ejecute pruebas de estrés.",
      aria: "Interactúe con su agente de aprendizaje cognitivo y síntesis de voz.",
      pricing: "Compare los límites de licencias premium y amplíe las capacidades de su suite.",
      settings: "Actualice detalles de la empresa, sincronice listas de contactos y cambie el idioma."
    },
    
    settingsTitle: "Configuraciones del Sistema",
    settingsSubtitle: "Gestione atributos de tienda, claves de acceso, alertas de notificación y sincronizaciones de métricas.",
    storeIdentityTitle: "Identidad de la Tienda",
    storeIdentityDesc: "Las propiedades se propagan a los módulos de chat inteligente de Aria de inmediato.",
    bizNameLabel: "Nombre de la Empresa / Tienda",
    adminNameLabel: "Nombre del Administrador",
    adminEmailLabel: "Correo Administrativo",
    smsAlertLabel: "Destino de Alerta SMS",
    updateBtn: "Actualizar Identidad del Sistema",
    opsNodeStatus: "Estado del Nodo de Operaciones",
    opsNodeDesc: "El peso del modelo cognitivo se mantiene sincronizado localmente en búferes.",
    relaunchWizard: "Relanzar Asistente de Configuración",
    
    langLabel: "Seleccionar Idioma del Sistema",
    langDesc: "Seleccione el vocabulario predeterminado para canales laterales, encabezados y alertas de bienvenida.",
    
    contactSyncTitle: "Nodo de Sincronización de Contactos",
    contactSyncDesc: "Agregue y cargue de forma segura archivos telefónicos externos en la memoria de comunicación de Aria.",
    contactNamePlaceholder: "Nombre completo (ej. Arturo Dent)",
    contactPhonePlaceholder: "Teléfono (ej. +1 555-0192)",
    contactEmailPlaceholder: "Dirección de correo",
    contactTagLabel: "Etiqueta de Segmento de Cliente",
    addContactBtn: "+ Agregar Cliente Singular",
    syncAriaEngineBtn: "☁️ Sincronizar Contactos Activos con Motor Aria",
    syncedContactsLabel: "Base de Datos de Contactos Sincronizados",
    noContacts: "No hay contactos sincronizados activos en esta sesión de pruebas.",
    pastedContactsLabel: "Importar por Lotes CSV o Texto Plano",
    pastedContactsPlaceholder: "Pegue una lista separada por comas de nombre y teléfono (ej.\nJane Doe, +15550212\nJohn Smith, +15550482)",
    bulkSyncBtn: "Analizar y Bloquear Contactos",

    heroBadge: "Suite de Inteligencia Autónoma para Pequeños Comercios",
    heroHeaderPart1: "Cada problema.",
    heroHeaderPart2: "Una sola interfaz.",
    heroDesc: "Desbloquee inteligencia empresarial avanzada. Omni IA combina retención de clientes, optimización de presupuesto de CFO y gestión de stock autónoma.",
    heroCTA1: "ENTRAR AL PANEL DE TRABAJO",
    heroCTA2: "CONOCER A ARIA AVATAR",
    capEngines: "Motores de Capacidad",
    meetAria: "Conocer a Aria",
    enterpriseSpecs: "Especificaciones"
  },
  fr: {
    brandLogo: "Omni IA",
    sandboxMode: "Système d'Essai",
    launchConsole: "LANCER SYSTÈME COMPASS",
    backToLanding: "← Retour à l'accueil",
    themeToggleLight: "Lumière de Grès",
    themeToggleDark: "Ardoise Noire",
    activeCore: "NOYAU COGNITIF ACTIF",
    syncChecked: "Synchronisation Aria Réussie",
    
    navDashboard: "Pilote Opérationnel",
    navRetainFlow: "Fidélité Prédictive",
    navCostGuard: "Protecteur des Marges",
    navStockSense: "Génie des Stocks",
    navAria: "Aria Co-Pilote",
    navPricing: "Forfaits Premium",
    navSettings: "Paramètres Système",
    
    welcomePopTitle: "✨ Console de Bienvenue Activée",
    welcomePopDesc: {
      dashboard: "Consultez les informations en temps réel sur l'intégrité du magasin, le chiffre d'affaires et la santé du marché.",
      retainflow: "Identifiez les profils à risque et réactivez-les via des campagnes personnalisées.",
      costguard: "Bloquez les fuites financières et identifiez les abonnements en double avant vos marges.",
      stocksense: "Configurez les alarmes automatiques d'inventaire et exécutez des tests de stress.",
      aria: "Échangez avec votre assistant autonome vocal et cognitif.",
      pricing: "Comparez les options premium pour passer à la vitesse supérieure.",
      settings: "Gérez les coordonnées d'entreprise, synchronisez vos clients et modifiez la langue globale."
    },
    
    settingsTitle: "Paramètres Système",
    settingsSubtitle: "Ajustez les paramètres de votre enseigne, la liste des contacts de secours et la langue de la console.",
    storeIdentityTitle: "Fiche d'Établissement",
    storeIdentityDesc: "Ces informations sont directement transmises à Aria pour enrichir sa logique conversationnelle.",
    bizNameLabel: "Nom commercial",
    adminNameLabel: "Administrateur principal",
    adminEmailLabel: "Adresse e-mail administrative",
    smsAlertLabel: "Numéro d'alerte SMS",
    updateBtn: "Enregistrer l'Identité",
    opsNodeStatus: "Index du Serveur Cognitif",
    opsNodeDesc: "Les modèles sémantiques sont hébergés localement pour optimiser la latence de réponse.",
    relaunchWizard: "Relancer l'Assistant de Configuration",
    
    langLabel: "Langue de l'Interface",
    langDesc: "Configurez la langue par défaut utilisée pour les alertes d'accueil, l'assistant Aria et les menus.",
    
    contactSyncTitle: "Synchronisation du Répertoire",
    contactSyncDesc: "Associez vos listes de clients tierces pour déclencher les relances automatiques par SMS.",
    contactNamePlaceholder: "Nom complet (ex. Arthur Dent)",
    contactPhonePlaceholder: "Téléphone (ex. +1 555-0192)",
    contactEmailPlaceholder: "Adresse e-mail",
    contactTagLabel: "Tag du Client",
    addContactBtn: "+ Ajouter une fiche",
    syncAriaEngineBtn: "☁️ Lancer la Sincro avec Aria Engine",
    syncedContactsLabel: "Répertoire Actuel Synchronisé",
    noContacts: "Aucun numéro de téléphone enregistré dans cette session de test.",
    pastedContactsLabel: "Import groupé de fichiers CSV",
    pastedContactsPlaceholder: "Collez vos données (Nom, Téléphone) à la ligne (ex.\nJane Doe, +15550212\nJohn Smith, +15550482)",
    bulkSyncBtn: "Valider l'importation de masse",

    heroBadge: "Suite Autonome de Veille Commerciale",
    heroHeaderPart1: "Chaque problème.",
    heroHeaderPart2: "Une seule interface.",
    heroDesc: "Découvrez notre IA combinée qui analyse les risques de fuites financières de votre entreprise, l'état de vos stocks et la rétention de vos clients.",
    heroCTA1: "ACCÉDER AU TABLEAU DE BORD",
    heroCTA2: "RENCONTRER ARIA AVATAR",
    capEngines: "Moteurs Spécialisés",
    meetAria: "Rencontrer Aria",
    enterpriseSpecs: "Spécifications"
  },
  de: {
    brandLogo: "Omni KI",
    sandboxMode: "Sandbox System",
    launchConsole: "COMPASS SYSTEM STARTEN",
    backToLanding: "← Zurück zur Startseite",
    themeToggleLight: "Sandstein-Helligkeit",
    themeToggleDark: "Schwarzer Schiefer",
    activeCore: "AKTIVER KOGNITIVER CORE",
    syncChecked: "Aria-Synchronisierung OK",
    
    navDashboard: "Betriebszentrum",
    navRetainFlow: "Prädiktive Loyalität",
    navCostGuard: "Gewinn-Schutz",
    navStockSense: "Nachschub-Genie",
    navAria: "Aria Co-Pilot",
    navPricing: "Premium Tarife",
    navSettings: "Systemsteuerung",
    
    welcomePopTitle: "✨ Willkommens-Konsole Aktiviert",
    welcomePopDesc: {
      dashboard: "Sehen Sie Live-Zusammenfassungen der Shop-Integrität, Gesamtumsätze und Leckage-Warnungen.",
      retainflow: "Identifizieren und reaktivieren Sie Kunden mit hohem Abwanderungsrisiko durch smarte Kampagnen.",
      costguard: "Verhindern Sie unnötige Ausgaben und blockieren Sie Lizenz-Duplikate rechtzeitig.",
      stocksense: "Automatisieren Sie Warnschwellen und simulieren Sie Nachfragekurven.",
      aria: "Kommunizieren Sie direkt mit Ihrem autonomen kognitiven Sprach-Avatar.",
      pricing: "Vergleichen Sie Premium-Pläne und erweitern Sie Ihre Betriebslimits.",
      settings: "Passen Sie Store-Daten an, synchronisieren Sie Ihre CRM-Kontaktliste und konfigurieren Sie Übersetzungen."
    },
    
    settingsTitle: "Systemeinstellungen",
    settingsSubtitle: "Verwalten Sie Store-Profile, Kontakte, API-Grenzwerte und Sprachkonfigurationen direkt in diesem Modul.",
    storeIdentityTitle: "Geschäftsprofil",
    storeIdentityDesc: "Änderungen werden sofort in Arias Wissensdatenbank und Live-Protokolle übertragen.",
    bizNameLabel: "Name der Firma / Store",
    adminNameLabel: "Name des Verwalters",
    adminEmailLabel: "Administrative E-Mail",
    smsAlertLabel: "SMS Empfängernummer",
    updateBtn: "Systemidentität Aktualisieren",
    opsNodeStatus: "Schnittstellenstatus",
    opsNodeDesc: "Die Gewichtung des Sprachmodells verbleibt sicher in den lokalen Zwischenregistern.",
    relaunchWizard: "Einführungsassistenten Neu Starten",
    
    langLabel: "Systemsprache Auswählen",
    langDesc: "Definiert die Standardsprache für alle Kacheln, Kopfzeilen und die automatische Begrüßung.",
    
    contactSyncTitle: "Kunden-Kontakte Synchronisieren",
    contactSyncDesc: "Laden Sie Kundendaten sicher hoch, damit Aria automatische Erinnerungsmails und SMS zustellen kann.",
    contactNamePlaceholder: "Vollständiger Name (z. B. Arthur Dent)",
    contactPhonePlaceholder: "Telefonnummer.",
    contactEmailPlaceholder: "E-Mail-Adresse",
    contactTagLabel: "Kundenkategorie",
    addContactBtn: "+ Einzelnen Kunden Hinzufügen",
    syncAriaEngineBtn: "☁️ Jetzt CRM-Daten mit Aria abgleichen",
    syncedContactsLabel: "Datenbank Synchronisierter Kontakte",
    noContacts: "Aktuell sind in dieser Sandbox-Sitzung keine Kontakte aktiv.",
    pastedContactsLabel: "Kontakte als CSV/Klartext einfügen",
    pastedContactsPlaceholder: "Format: Name, Telefon (z. B.\nJane Doe, +15550212\nJohn Smith, +15550482)",
    bulkSyncBtn: "Massenimport Bestätigen",

    heroBadge: "Autonome Merchant-Intelligence Suite",
    heroHeaderPart1: "Jedes Problem.",
    heroHeaderPart2: "Eine Oberfläche.",
    heroDesc: "Gewinnen Sie die volle Kontrolle über Ihre Händlermargen. Omni KI bündelt Churn-Analysen, Einsparungspotenziale und intelligente Bestandswarnungen an einem zentralen Ort.",
    heroCTA1: "DASHBOARD ÖFFNEN",
    heroCTA2: "ARIA AVATAR TREFFEN",
    capEngines: "Spezialmodule",
    meetAria: "Aria Kennenlernen",
    enterpriseSpecs: "Enterprise Datenblatt"
  },
  ja: {
    brandLogo: "Omni AI",
    sandboxMode: "サンドボックス",
    launchConsole: "COMPASSシステムを起動",
    backToLanding: "← ランディングページへ戻る",
    themeToggleLight: "サンドストーン ライト",
    themeToggleDark: "スレート ノワール",
    activeCore: "認識コア稼働中",
    syncChecked: "Ariaシステム同期完了",
    
    navDashboard: "統合管制ハブ",
    navRetainFlow: "顧客継続マイニング",
    navCostGuard: "コスト漏洩シールド",
    navStockSense: "在庫管理オートメーション",
    navAria: "AriaスマートAI",
    navPricing: "プレミアムプラン",
    navSettings: "システム環境設定",
    
    welcomePopTitle: "✨ 歓迎コマンドラインがアクティブになりました",
    welcomePopDesc: {
      dashboard: "店舗健全性、総収益、解約リスク、キャッシュフローの状況をリアルタイムで俯瞰できます。",
      retainflow: "解約予測モデルに基づき、優良顧客を引き戻すための優待施策を即座に構成します。",
      costguard: "見落とされがちなソフトウェア二重契約やサプライヤーコスト高騰を即座に特定します。",
      stocksense: "製品ごとの適正在庫目安を自動算出し、欠品損失を未然に排除します。",
      aria: "音声合成を搭載した次世代の自律型コパイロットと対話できます。",
      pricing: "オペレーション規模に応じた最適な定額ライセンスプランを簡単に選択できます。",
      settings: "管理プロファイル更新、顧客名簿同期、言語切替モジュールの操作が可能です。"
    },
    
    settingsTitle: "システム環境設定",
    settingsSubtitle: "店舗属性、アクセスキー、アラート配信先、稼働指標の同調条件を総合的に設定します。",
    storeIdentityTitle: "店舗・事業主アイデンティティ",
    storeIdentityDesc: "ここでの更新内容は、Ariaスマートアドバイザーの会話ロジックに即座に反映されます。",
    bizNameLabel: "ビジネス・店舗名",
    adminNameLabel: "管理者名",
    adminEmailLabel: "管理用メールアドレス",
    smsAlertLabel: "緊急SMSアラート先",
    updateBtn: "システム識別情報を保存",
    opsNodeStatus: "認識モデル連携ステータス",
    opsNodeDesc: "最新の学習ネットワーク重みは、バックグラウンドのローカルバッファに常時複製されます。",
    relaunchWizard: "初期セットアップウィザードを再起動",
    
    langLabel: "システム表示言語の選択",
    langDesc: "サイドバー、各種ヘッダー、およびページ遷移時の歓迎ポップアップ表示に使用する既定言語を切り替えます。",
    
    contactSyncTitle: "顧客連絡先同期・インポートノード",
    contactSyncDesc: "外部の顧客電話帳リストを安全にアップロードし、Ariaの自動SMS追跡メモリに登録します。",
    contactNamePlaceholder: "氏名 (例: アーサー・デント)",
    contactPhonePlaceholder: "電話番号 (例: +81 90-1234-5678)",
    contactEmailPlaceholder: "メールアドレス",
    contactTagLabel: "顧客セグメント・タグ",
    addContactBtn: "+ 顧客を個別に登録",
    syncAriaEngineBtn: "☁️ CRM連絡先をAria分析エンジンと完全同調",
    syncedContactsLabel: "同期済み顧客データベース一覧",
    noContacts: "現在、アクティブな同期済み顧客データは登録されていません。",
    pastedContactsLabel: "CSV / テキスト一括インポート",
    pastedContactsPlaceholder: "「名前, 電話番号」の順で改行区切りで入力してください (例:\n佐藤恵, +819001923344\n鈴木一郎, +818099887766)",
    bulkSyncBtn: "バッチインポートをコミット",

    heroBadge: "中小規模事業者向け自律型ビジネス意思決定スイート",
    heroHeaderPart1: "すべての店舗課題を、",
    heroHeaderPart2: "ひとつの画面で解決。",
    heroDesc: "一般的な分析ツールの煩雑さにうんざりしていませんか？ Omni AIは、顧客解約予兆、コスト漏洩シールド、在庫自動補充計画を単一の直感的なアバターに統合します。",
    heroCTA1: "管理ワークスペースへ入る",
    heroCTA2: "ARIAスマートAIと対話する",
    capEngines: "基幹管制システム群",
    meetAria: "Ariaと対話する",
    enterpriseSpecs: "エンタープライズ仕様シート"
  }
};
