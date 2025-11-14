// Predefined feedback templates with all translations
// Languages: EN, ES, FR, DE, PL, PT, IT, NL, CS, SV, DA, NO

export interface FeedbackTemplate {
  id: string
  name: string
  icon: string
  questions: string[]
}

export const PREDEFINED_TEMPLATES: Record<string, FeedbackTemplate[]> = {
  // ENGLISH
  en: [
    {
      id: "360",
      name: "360 Review",
      icon: "🔄",
      questions: [
        "What am I doing well?",
        "What could I improve?",
        "What's my biggest blind spot?",
        "What should I start/stop/continue?",
        "Any other thoughts?"
      ]
    },
    {
      id: "manager",
      name: "Manager Feedback",
      icon: "👔",
      questions: [
        "How effective is my communication?",
        "Do I provide clear direction?",
        "How well do I support your growth?",
        "What could I improve as a manager?"
      ]
    },
    {
      id: "peer",
      name: "Peer Review",
      icon: "🤝",
      questions: [
        "How well do we collaborate?",
        "What do I bring to the team?",
        "Where could I be more helpful?",
        "Any suggestions for improvement?"
      ]
    },
    {
      id: "project",
      name: "Project Retrospective",
      icon: "📊",
      questions: [
        "What went well?",
        "What could be improved?",
        "What did we learn?",
        "What should we do differently next time?"
      ]
    },
    {
      id: "custom",
      name: "AI Generated",
      icon: "✨",
      questions: []
    }
  ],

  // SPANISH
  es: [
    {
      id: "360",
      name: "Revisión 360",
      icon: "🔄",
      questions: [
        "¿Qué estoy haciendo bien?",
        "¿Qué podría mejorar?",
        "¿Cuál es mi mayor punto ciego?",
        "¿Qué debería empezar/dejar/continuar haciendo?",
        "¿Algún otro comentario?"
      ]
    },
    {
      id: "manager",
      name: "Feedback del Manager",
      icon: "👔",
      questions: [
        "¿Qué tan efectiva es mi comunicación?",
        "¿Proporciono una dirección clara?",
        "¿Qué tan bien apoyo tu crecimiento?",
        "¿Qué podría mejorar como manager?"
      ]
    },
    {
      id: "peer",
      name: "Revisión de Compañeros",
      icon: "🤝",
      questions: [
        "¿Qué tan bien colaboramos?",
        "¿Qué aporto al equipo?",
        "¿Dónde podría ser más útil?",
        "¿Alguna sugerencia de mejora?"
      ]
    },
    {
      id: "project",
      name: "Retrospectiva del Proyecto",
      icon: "📊",
      questions: [
        "¿Qué salió bien?",
        "¿Qué se podría mejorar?",
        "¿Qué aprendimos?",
        "¿Qué deberíamos hacer diferente la próxima vez?"
      ]
    },
    {
      id: "custom",
      name: "Generado por IA",
      icon: "✨",
      questions: []
    }
  ],

  // FRENCH
  fr: [
    {
      id: "360",
      name: "Évaluation 360",
      icon: "🔄",
      questions: [
        "Que fais-je bien ?",
        "Que pourrais-je améliorer ?",
        "Quel est mon plus grand angle mort ?",
        "Que devrais-je commencer/arrêter/continuer à faire ?",
        "D'autres commentaires ?"
      ]
    },
    {
      id: "manager",
      name: "Feedback Manager",
      icon: "👔",
      questions: [
        "Quelle est l'efficacité de ma communication ?",
        "Est-ce que je donne une direction claire ?",
        "Dans quelle mesure je soutiens votre développement ?",
        "Que pourrais-je améliorer en tant que manager ?"
      ]
    },
    {
      id: "peer",
      name: "Évaluation des Pairs",
      icon: "🤝",
      questions: [
        "Comment collaborons-nous ?",
        "Qu'est-ce que j'apporte à l'équipe ?",
        "Où pourrais-je être plus utile ?",
        "Des suggestions d'amélioration ?"
      ]
    },
    {
      id: "project",
      name: "Rétrospective de Projet",
      icon: "📊",
      questions: [
        "Qu'est-ce qui s'est bien passé ?",
        "Qu'est-ce qui pourrait être amélioré ?",
        "Qu'avons-nous appris ?",
        "Que devrions-nous faire différemment la prochaine fois ?"
      ]
    },
    {
      id: "custom",
      name: "Généré par IA",
      icon: "✨",
      questions: []
    }
  ],

  // GERMAN
  de: [
    {
      id: "360",
      name: "360-Grad-Feedback",
      icon: "🔄",
      questions: [
        "Was mache ich gut?",
        "Was könnte ich verbessern?",
        "Was ist mein größter blinder Fleck?",
        "Was sollte ich anfangen/aufhören/weitermachen?",
        "Weitere Gedanken?"
      ]
    },
    {
      id: "manager",
      name: "Manager-Feedback",
      icon: "👔",
      questions: [
        "Wie effektiv ist meine Kommunikation?",
        "Gebe ich klare Anweisungen?",
        "Wie gut unterstütze ich deine Entwicklung?",
        "Was könnte ich als Manager verbessern?"
      ]
    },
    {
      id: "peer",
      name: "Kollegenbewertung",
      icon: "🤝",
      questions: [
        "Wie gut arbeiten wir zusammen?",
        "Was bringe ich ins Team ein?",
        "Wo könnte ich hilfreicher sein?",
        "Verbesserungsvorschläge?"
      ]
    },
    {
      id: "project",
      name: "Projekt-Retrospektive",
      icon: "📊",
      questions: [
        "Was lief gut?",
        "Was könnte verbessert werden?",
        "Was haben wir gelernt?",
        "Was sollten wir beim nächsten Mal anders machen?"
      ]
    },
    {
      id: "custom",
      name: "KI-generiert",
      icon: "✨",
      questions: []
    }
  ],

  // POLISH
  pl: [
    {
      id: "360",
      name: "Ocena 360",
      icon: "🔄",
      questions: [
        "Co robię dobrze?",
        "Co mogę poprawić?",
        "Jaki jest mój największy martwy punkt?",
        "Co powinienem zacząć/przestać/kontynuować robić?",
        "Inne uwagi?"
      ]
    },
    {
      id: "manager",
      name: "Feedback dla Managera",
      icon: "👔",
      questions: [
        "Jak skuteczna jest moja komunikacja?",
        "Czy daję jasne wytyczne?",
        "Jak dobrze wspieram twój rozwój?",
        "Co mogę poprawić jako manager?"
      ]
    },
    {
      id: "peer",
      name: "Ocena Kolegów",
      icon: "🤝",
      questions: [
        "Jak dobrze współpracujemy?",
        "Co wnoszę do zespołu?",
        "W czym mógłbym być bardziej pomocny?",
        "Sugestie dotyczące ulepszeń?"
      ]
    },
    {
      id: "project",
      name: "Retrospektywa Projektu",
      icon: "📊",
      questions: [
        "Co poszło dobrze?",
        "Co można poprawić?",
        "Czego się nauczyliśmy?",
        "Co powinniśmy zrobić inaczej następnym razem?"
      ]
    },
    {
      id: "custom",
      name: "Wygenerowane przez AI",
      icon: "✨",
      questions: []
    }
  ],

  // PORTUGUESE
  pt: [
    {
      id: "360",
      name: "Avaliação 360",
      icon: "🔄",
      questions: [
        "O que estou fazendo bem?",
        "O que eu poderia melhorar?",
        "Qual é meu maior ponto cego?",
        "O que devo começar/parar/continuar fazendo?",
        "Outros comentários?"
      ]
    },
    {
      id: "manager",
      name: "Feedback do Gestor",
      icon: "👔",
      questions: [
        "Quão eficaz é minha comunicação?",
        "Forneço direção clara?",
        "Quão bem apoio seu crescimento?",
        "O que poderia melhorar como gestor?"
      ]
    },
    {
      id: "peer",
      name: "Avaliação de Pares",
      icon: "🤝",
      questions: [
        "Quão bem colaboramos?",
        "O que trago para a equipe?",
        "Onde poderia ser mais útil?",
        "Sugestões de melhoria?"
      ]
    },
    {
      id: "project",
      name: "Retrospectiva do Projeto",
      icon: "📊",
      questions: [
        "O que funcionou bem?",
        "O que poderia ser melhorado?",
        "O que aprendemos?",
        "O que devemos fazer diferente da próxima vez?"
      ]
    },
    {
      id: "custom",
      name: "Gerado por IA",
      icon: "✨",
      questions: []
    }
  ],

  // ITALIAN
  it: [
    {
      id: "360",
      name: "Valutazione 360",
      icon: "🔄",
      questions: [
        "Cosa sto facendo bene?",
        "Cosa potrei migliorare?",
        "Qual è il mio punto cieco più grande?",
        "Cosa dovrei iniziare/smettere/continuare a fare?",
        "Altri commenti?"
      ]
    },
    {
      id: "manager",
      name: "Feedback Manager",
      icon: "👔",
      questions: [
        "Quanto è efficace la mia comunicazione?",
        "Fornisco una direzione chiara?",
        "Quanto bene supporto la tua crescita?",
        "Cosa potrei migliorare come manager?"
      ]
    },
    {
      id: "peer",
      name: "Valutazione tra Pari",
      icon: "🤝",
      questions: [
        "Quanto bene collaboriamo?",
        "Cosa porto al team?",
        "Dove potrei essere più utile?",
        "Suggerimenti per migliorare?"
      ]
    },
    {
      id: "project",
      name: "Retrospettiva del Progetto",
      icon: "📊",
      questions: [
        "Cosa è andato bene?",
        "Cosa potrebbe essere migliorato?",
        "Cosa abbiamo imparato?",
        "Cosa dovremmo fare diversamente la prossima volta?"
      ]
    },
    {
      id: "custom",
      name: "Generato da IA",
      icon: "✨",
      questions: []
    }
  ],

  // DUTCH
  nl: [
    {
      id: "360",
      name: "360-graden Beoordeling",
      icon: "🔄",
      questions: [
        "Wat doe ik goed?",
        "Wat zou ik kunnen verbeteren?",
        "Wat is mijn grootste blinde vlek?",
        "Wat moet ik beginnen/stoppen/doorgaan met doen?",
        "Andere opmerkingen?"
      ]
    },
    {
      id: "manager",
      name: "Manager Feedback",
      icon: "👔",
      questions: [
        "Hoe effectief is mijn communicatie?",
        "Geef ik duidelijke sturing?",
        "Hoe goed ondersteun ik jouw groei?",
        "Wat zou ik als manager kunnen verbeteren?"
      ]
    },
    {
      id: "peer",
      name: "Peer Review",
      icon: "🤝",
      questions: [
        "Hoe goed werken we samen?",
        "Wat breng ik bij het team?",
        "Waar zou ik meer behulpzaam kunnen zijn?",
        "Suggesties voor verbetering?"
      ]
    },
    {
      id: "project",
      name: "Project Retrospectief",
      icon: "📊",
      questions: [
        "Wat ging er goed?",
        "Wat kan er verbeterd worden?",
        "Wat hebben we geleerd?",
        "Wat moeten we de volgende keer anders doen?"
      ]
    },
    {
      id: "custom",
      name: "AI Gegenereerd",
      icon: "✨",
      questions: []
    }
  ],

  // CZECH
  cs: [
    {
      id: "360",
      name: "360° Hodnocení",
      icon: "🔄",
      questions: [
        "Co dělám dobře?",
        "Co bych mohl zlepšit?",
        "Jaké je mé největší slepé místo?",
        "Co bych měl začít/přestat/pokračovat dělat?",
        "Další komentáře?"
      ]
    },
    {
      id: "manager",
      name: "Zpětná vazba pro Manažera",
      icon: "👔",
      questions: [
        "Jak efektivní je má komunikace?",
        "Poskytuju jasné vedení?",
        "Jak dobře podporuju váš růst?",
        "Co bych mohl zlepšit jako manažer?"
      ]
    },
    {
      id: "peer",
      name: "Hodnocení Kolegy",
      icon: "🤝",
      questions: [
        "Jak dobře spolupracujeme?",
        "Co přináším týmu?",
        "Kde bych mohl být více nápomocný?",
        "Návrhy na zlepšení?"
      ]
    },
    {
      id: "project",
      name: "Projektová Retrospektiva",
      icon: "📊",
      questions: [
        "Co šlo dobře?",
        "Co by se dalo zlepšit?",
        "Co jsme se naučili?",
        "Co bychom měli příště udělat jinak?"
      ]
    },
    {
      id: "custom",
      name: "Generováno AI",
      icon: "✨",
      questions: []
    }
  ],

  // SWEDISH
  sv: [
    {
      id: "360",
      name: "360-graders Utvärdering",
      icon: "🔄",
      questions: [
        "Vad gör jag bra?",
        "Vad skulle jag kunna förbättra?",
        "Vilken är min största blinda fläck?",
        "Vad ska jag börja/sluta/fortsätta göra?",
        "Övriga tankar?"
      ]
    },
    {
      id: "manager",
      name: "Chef-feedback",
      icon: "👔",
      questions: [
        "Hur effektiv är min kommunikation?",
        "Ger jag tydlig riktning?",
        "Hur väl stödjer jag din tillväxt?",
        "Vad skulle jag kunna förbättra som chef?"
      ]
    },
    {
      id: "peer",
      name: "Kollegautvärdering",
      icon: "🤝",
      questions: [
        "Hur väl samarbetar vi?",
        "Vad bidrar jag med till teamet?",
        "Var skulle jag kunna vara mer hjälpsam?",
        "Förslag på förbättringar?"
      ]
    },
    {
      id: "project",
      name: "Projektåterblick",
      icon: "📊",
      questions: [
        "Vad gick bra?",
        "Vad skulle kunna förbättras?",
        "Vad lärde vi oss?",
        "Vad ska vi göra annorlunda nästa gång?"
      ]
    },
    {
      id: "custom",
      name: "AI-genererad",
      icon: "✨",
      questions: []
    }
  ],

  // DANISH
  da: [
    {
      id: "360",
      name: "360-graders Evaluering",
      icon: "🔄",
      questions: [
        "Hvad gør jeg godt?",
        "Hvad kunne jeg forbedre?",
        "Hvad er min største blinde vinkel?",
        "Hvad skal jeg begynde/stoppe/fortsætte med at gøre?",
        "Andre tanker?"
      ]
    },
    {
      id: "manager",
      name: "Leder Feedback",
      icon: "👔",
      questions: [
        "Hvor effektiv er min kommunikation?",
        "Giver jeg klar retning?",
        "Hvor godt støtter jeg din vækst?",
        "Hvad kunne jeg forbedre som leder?"
      ]
    },
    {
      id: "peer",
      name: "Kollegavurdering",
      icon: "🤝",
      questions: [
        "Hvor godt samarbejder vi?",
        "Hvad bidrager jeg med til teamet?",
        "Hvor kunne jeg være mere hjælpsom?",
        "Forslag til forbedringer?"
      ]
    },
    {
      id: "project",
      name: "Projekt Retrospektiv",
      icon: "📊",
      questions: [
        "Hvad gik godt?",
        "Hvad kunne forbedres?",
        "Hvad lærte vi?",
        "Hvad skal vi gøre anderledes næste gang?"
      ]
    },
    {
      id: "custom",
      name: "AI-genereret",
      icon: "✨",
      questions: []
    }
  ],

  // NORWEGIAN
  no: [
    {
      id: "360",
      name: "360-graders Evaluering",
      icon: "🔄",
      questions: [
        "Hva gjør jeg bra?",
        "Hva kan jeg forbedre?",
        "Hva er min største blindsone?",
        "Hva bør jeg begynne/slutte/fortsette å gjøre?",
        "Andre tanker?"
      ]
    },
    {
      id: "manager",
      name: "Leder-tilbakemelding",
      icon: "👔",
      questions: [
        "Hvor effektiv er min kommunikasjon?",
        "Gir jeg klar retning?",
        "Hvor godt støtter jeg din utvikling?",
        "Hva kunne jeg forbedre som leder?"
      ]
    },
    {
      id: "peer",
      name: "Kollegavurdering",
      icon: "🤝",
      questions: [
        "Hvor godt samarbeider vi?",
        "Hva bidrar jeg med til teamet?",
        "Hvor kunne jeg vært mer hjelpsom?",
        "Forslag til forbedringer?"
      ]
    },
    {
      id: "project",
      name: "Prosjekt Retrospektiv",
      icon: "📊",
      questions: [
        "Hva gikk bra?",
        "Hva kunne vært forbedret?",
        "Hva lærte vi?",
        "Hva bør vi gjøre annerledes neste gang?"
      ]
    },
    {
      id: "custom",
      name: "AI-generert",
      icon: "✨",
      questions: []
    }
  ]
}

// Helper function to get templates for a language
export function getTemplatesForLanguage(language: string): FeedbackTemplate[] {
  return PREDEFINED_TEMPLATES[language] || PREDEFINED_TEMPLATES['en']
}

// Get all supported languages
export const SUPPORTED_LANGUAGES = Object.keys(PREDEFINED_TEMPLATES)

// Language display names
export const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'pl': 'Polski',
  'pt': 'Português',
  'it': 'Italiano',
  'nl': 'Nederlands',
  'cs': 'Čeština',
  'sv': 'Svenska',
  'da': 'Dansk',
  'no': 'Norsk'
}
