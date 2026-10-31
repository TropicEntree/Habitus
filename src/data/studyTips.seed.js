// 50 distinct daily tips for the "studio" (study) library category — a mix of
// ADHD-friendly study techniques and short movement/exercise breaks tied to
// studying. Each tip is translated into it/en/ko and expanded into one
// LibraryContent-shaped record per language by buildLibraryRecords() below,
// ready for base44.entities.LibraryContent.bulkCreate(...).

export const STUDY_TIPS = [
  // ── Study techniques ──────────────────────────────────────────────
  {
    emoji: "🍅",
    duration_minutes: 4,
    translations: {
      it: {
        title: "La tecnica del pomodoro",
        summary: "25 minuti di focus, 5 di pausa vera.",
        body: "Imposta un timer per 25 minuti e lavora su una sola cosa. Quando suona, fermati davvero per 5 minuti — alzati, bevi acqua, guarda fuori. Dopo 4 pomodori, fai una pausa più lunga di 15-20 minuti. Il timer toglie il peso di dover 'decidere' quando fermarti: lo ha già deciso lui.",
      },
      en: {
        title: "The pomodoro technique",
        summary: "25 minutes of focus, 5 of a real break.",
        body: "Set a timer for 25 minutes and work on just one thing. When it rings, actually stop for 5 minutes — stand up, drink water, look outside. After 4 pomodoros, take a longer 15-20 minute break. The timer removes the burden of 'deciding' when to stop — it already decided for you.",
      },
      ko: {
        title: "뽀모도로 기법",
        summary: "25분 집중, 5분은 진짜 휴식.",
        body: "타이머를 25분으로 맞추고 한 가지 일에만 집중하세요. 알람이 울리면 정말로 5분간 멈추세요 — 일어나서 물을 마시거나 창밖을 보세요. 뽀모도로 4번마다 15~20분의 긴 휴식을 가지세요. 타이머가 '언제 멈출지' 결정하는 부담을 덜어줍니다 — 이미 정해져 있으니까요.",
      },
    },
  },
  {
    emoji: "👥",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Body doubling",
        summary: "Studiare 'insieme a qualcuno', anche in silenzio.",
        body: "Studia nella stessa stanza di qualcuno (o in videochiamata silenziosa) senza che quella persona ti aiuti attivamente. La sola presenza di un'altra persona rende più facile restare sul compito per molte menti ADHD. Cerca gruppi di 'study with me' online se non hai nessuno disponibile.",
      },
      en: {
        title: "Body doubling",
        summary: "Studying 'with someone', even in silence.",
        body: "Study in the same room as someone else (or on a silent video call) without them actively helping you. Just having another person present makes it easier to stay on task for many ADHD minds. Look for online 'study with me' sessions if no one is around.",
      },
      ko: {
        title: "바디 더블링",
        summary: "누군가와 '함께' 공부하기, 조용히라도.",
        body: "다른 사람과 같은 공간에서(또는 조용한 화상통화로) 공부해 보세요. 그 사람이 도와주지 않아도 괜찮아요. 누군가 곁에 있다는 것만으로도 ADHD 뇌는 과제에 머무르기가 쉬워져요. 주변에 사람이 없다면 온라인 '스터디 위드 미' 세션을 찾아보세요.",
      },
    },
  },
  {
    emoji: "🧩",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Chunking: a piccoli pezzi",
        summary: "Dividi il capitolo in blocchi da 10 minuti.",
        body: "Un capitolo intero è scoraggiante, 10 minuti no. Dividi il materiale in blocchi piccoli e nominali ('leggere pag. 20-25', non 'studiare storia'). Ogni blocco completato è una vittoria visibile — spunta ogni volta la lista.",
      },
      en: {
        title: "Chunking: small pieces",
        summary: "Split the chapter into 10-minute blocks.",
        body: "A whole chapter is overwhelming, 10 minutes isn't. Break the material into small, concrete chunks ('read pages 20-25', not 'study history'). Every finished chunk is a visible win — check it off the list each time.",
      },
      ko: {
        title: "청킹: 작은 조각으로",
        summary: "챕터를 10분 단위로 나눠보세요.",
        body: "챕터 전체는 부담스럽지만 10분은 그렇지 않아요. 자료를 작고 구체적인 조각으로 나누세요('역사 공부하기'가 아니라 '20-25쪽 읽기'). 끝낸 조각마다 눈에 보이는 승리예요 — 매번 목록에서 체크하세요.",
      },
    },
  },
  {
    emoji: "🧠",
    duration_minutes: 4,
    translations: {
      it: {
        title: "Richiamo attivo, non rilettura",
        summary: "Chiudi il libro e prova a ripetere a mente.",
        body: "Rileggere fa sentire familiare il materiale, ma non lo fa restare in memoria. Dopo aver letto una pagina, chiudi il libro e prova a scrivere o dire tutto ciò che ricordi. Poi controlla cosa hai perso. Questo piccolo sforzo di recupero è molto più efficace della rilettura passiva.",
      },
      en: {
        title: "Active recall, not re-reading",
        summary: "Close the book and try to recall it in your head.",
        body: "Re-reading makes the material feel familiar, but it doesn't make it stick. After reading a page, close the book and try to write or say everything you remember. Then check what you missed. This small retrieval effort works far better than passive re-reading.",
      },
      ko: {
        title: "능동적 회상, 재독이 아닌",
        summary: "책을 덮고 머릿속으로 떠올려 보세요.",
        body: "다시 읽으면 익숙하게 느껴지지만 실제로 기억에 남지는 않아요. 한 페이지를 읽은 후 책을 덮고 기억나는 것을 모두 써보거나 말해보세요. 그다음 놓친 부분을 확인하세요. 이 작은 회상 노력이 수동적으로 다시 읽는 것보다 훨씬 효과적이에요.",
      },
    },
  },
  {
    emoji: "🔁",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Ripetizione dilazionata",
        summary: "Rivedi oggi, poi tra 2 giorni, poi tra una settimana.",
        body: "Invece di ripassare tutto la sera prima, rivedi lo stesso argomento a distanza crescente: oggi, poi tra 2 giorni, poi tra una settimana. Ogni ripasso 'appena prima di dimenticare' rinforza la memoria molto più di 5 ripassi consecutivi.",
      },
      en: {
        title: "Spaced repetition",
        summary: "Review today, then in 2 days, then in a week.",
        body: "Instead of cramming everything the night before, revisit the same topic at growing intervals: today, then in 2 days, then in a week. Reviewing right before you'd forget strengthens memory far more than 5 reviews back-to-back.",
      },
      ko: {
        title: "간격 반복 학습",
        summary: "오늘, 그다음 2일 후, 그다음 일주일 후.",
        body: "전날 밤에 몰아서 복습하는 대신, 같은 내용을 점점 넓어지는 간격으로 다시 보세요: 오늘, 2일 후, 일주일 후. '잊기 직전'에 복습하면 연속으로 5번 복습하는 것보다 기억이 훨씬 강해져요.",
      },
    },
  },
  {
    emoji: "🎤",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Tecnica Feynman",
        summary: "Spiega l'argomento a voce alta come se insegnassi.",
        body: "Scegli un concetto e spiegalo a voce alta, con parole semplici, come se lo stessi insegnando a qualcuno che non ne sa nulla. Ogni volta che ti blocchi o usi paroloni per aggirare un punto, hai trovato esattamente ciò che non hai ancora capito davvero.",
      },
      en: {
        title: "The Feynman technique",
        summary: "Explain the topic out loud as if teaching it.",
        body: "Pick a concept and explain it out loud, in simple words, as if teaching it to someone who knows nothing about it. Every time you get stuck or reach for jargon to dodge a point, you've found exactly what you don't truly understand yet.",
      },
      ko: {
        title: "파인만 기법",
        summary: "가르치듯 소리 내어 설명해 보세요.",
        body: "개념 하나를 골라 아무것도 모르는 사람에게 가르치듯 쉬운 말로 소리 내어 설명해 보세요. 막히거나 어려운 용어로 얼버무리게 되는 부분이 바로 아직 제대로 이해하지 못한 지점이에요.",
      },
    },
  },
  {
    emoji: "📵",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Il telefono in un'altra stanza",
        summary: "Non in modalità silenziosa: proprio fuori vista.",
        body: "La modalità silenziosa non basta: la sola presenza visibile del telefono consuma attenzione, anche spento. Prima di iniziare a studiare, portalo fisicamente in un'altra stanza. Se serve per il timer, usane uno fisico o un'app dedicata sul computer.",
      },
      en: {
        title: "Phone in another room",
        summary: "Not on silent — actually out of sight.",
        body: "Silent mode isn't enough: just seeing your phone nearby drains attention, even when it's off. Before you start studying, physically move it to another room. If you need it for a timer, use a physical clock or a dedicated app on your computer instead.",
      },
      ko: {
        title: "휴대폰은 다른 방에",
        summary: "무음이 아니라, 아예 눈에 안 보이게.",
        body: "무음 모드로는 충분하지 않아요. 휴대폰이 꺼져 있어도 눈에 보이기만 해도 주의력이 소모돼요. 공부를 시작하기 전에 휴대폰을 물리적으로 다른 방으로 옮기세요. 타이머가 필요하면 실물 시계나 컴퓨터의 별도 앱을 사용하세요.",
      },
    },
  },
  {
    emoji: "3️⃣",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Solo i prossimi 3 passi",
        summary: "Non l'intera lista: solo cosa fare adesso.",
        body: "Una lista di 20 cose spegne la motivazione prima ancora di iniziare. Scrivi solo i prossimi 3 passi concreti. Quando li finisci, scrivine altri 3. Il compito sembra sempre gestibile perché non vedi mai la montagna intera.",
      },
      en: {
        title: "Just the next 3 steps",
        summary: "Not the whole list — just what's next.",
        body: "A 20-item list kills motivation before you even start. Write down only the next 3 concrete steps. When you finish them, write 3 more. The task always feels manageable because you never see the whole mountain.",
      },
      ko: {
        title: "다음 3단계만",
        summary: "전체 목록이 아니라 지금 할 일만.",
        body: "20개짜리 목록은 시작도 하기 전에 의욕을 꺾어버려요. 다음에 할 구체적인 3단계만 적으세요. 다 끝내면 다시 3개를 적으세요. 전체 산을 보지 않으니 항상 해볼 만하게 느껴져요.",
      },
    },
  },
  {
    emoji: "⏱️",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Un timer sempre visibile",
        summary: "Contro la 'cecità del tempo' tipica dell'ADHD.",
        body: "Molte menti ADHD faticano a percepire il tempo che passa. Tieni un timer visivo (a sabbia, o un'app con countdown grande) sempre in vista mentre studi. Vedere il tempo scorrere rende concreto ciò che altrimenti sparisce dalla percezione.",
      },
      en: {
        title: "Always keep a visible timer",
        summary: "Against the ADHD 'time blindness'.",
        body: "Many ADHD minds struggle to sense time passing. Keep a visual timer (a sand timer, or an app with a big countdown) in view while you study. Watching time move makes concrete what would otherwise vanish from awareness.",
      },
      ko: {
        title: "항상 보이는 타이머 두기",
        summary: "ADHD 특유의 '시간 인지 어려움'에 맞서서.",
        body: "많은 ADHD 뇌는 시간이 흐르는 것을 느끼기 어려워해요. 공부하는 동안 눈에 보이는 타이머(모래시계나 큰 카운트다운 앱)를 두세요. 시간이 흐르는 걸 보면 그렇지 않으면 인식에서 사라져버릴 것이 구체적으로 느껴져요.",
      },
    },
  },
  {
    emoji: "🎨",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Un colore per ogni materia",
        summary: "Il cervello ADHD ama gli indizi visivi rapidi.",
        body: "Assegna un colore a ogni materia (quaderno, evidenziatore, tab digitale) e usalo sempre in modo coerente. Non serve un sistema perfetto: basta che un colpo d'occhio ti dica subito 'questa è matematica' senza dover leggere nulla.",
      },
      en: {
        title: "One color per subject",
        summary: "The ADHD brain loves fast visual cues.",
        body: "Assign a color to each subject (notebook, highlighter, digital tab) and use it consistently. It doesn't need to be a perfect system — just something that lets one glance say 'this is math' without reading a word.",
      },
      ko: {
        title: "과목마다 색깔 정하기",
        summary: "ADHD 뇌는 빠른 시각적 단서를 좋아해요.",
        body: "과목마다 색깔(노트, 형광펜, 디지털 탭)을 정해 일관되게 사용하세요. 완벽한 체계일 필요는 없어요. 한눈에 '이건 수학이구나'를 알 수 있으면 충분해요.",
      },
    },
  },
  {
    emoji: "🗺️",
    duration_minutes: 4,
    translations: {
      it: {
        title: "Mappe mentali per argomenti complessi",
        summary: "Disegna i collegamenti invece di scrivere liste.",
        body: "Quando un argomento ha troppe connessioni per una lista lineare, disegnalo: un nodo centrale, rami per i sottotemi, parole chiave sui rami. Il formato visivo e non lineare rispecchia meglio come molte menti ADHD elaborano davvero le informazioni.",
      },
      en: {
        title: "Mind maps for complex topics",
        summary: "Draw the connections instead of writing lists.",
        body: "When a topic has too many connections for a linear list, draw it instead: a central node, branches for subtopics, key words on each branch. This visual, non-linear format often matches how ADHD minds actually process information.",
      },
      ko: {
        title: "복잡한 주제엔 마인드맵",
        summary: "목록 대신 연결을 그림으로 그려보세요.",
        body: "한 주제가 일렬로 나열하기엔 연결이 너무 많다면, 그림으로 그려보세요: 중심 노드, 하위 주제로 뻗는 가지, 각 가지에 핵심 단어. 이런 시각적이고 비선형적인 형식이 많은 ADHD 뇌가 실제로 정보를 처리하는 방식에 더 가까워요.",
      },
    },
  },
  {
    emoji: "🔋",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Il difficile quando hai più energia",
        summary: "Non aspettare la 'motivazione giusta'.",
        body: "Individua il momento della giornata in cui la tua energia/concentrazione è più alta (per molti è la mattina, per altri no) e mettici davanti l'argomento più ostico. Nei momenti a bassa energia, riserva compiti meccanici come riordinare appunti.",
      },
      en: {
        title: "Do the hard thing at peak energy",
        summary: "Don't wait for the 'right' motivation.",
        body: "Notice the time of day when your energy and focus are highest (morning for many, but not everyone) and put your hardest topic right there. Save low-energy moments for mechanical tasks, like organizing your notes.",
      },
      ko: {
        title: "에너지가 가장 높을 때 어려운 것부터",
        summary: "'딱 맞는 동기'를 기다리지 마세요.",
        body: "하루 중 에너지와 집중력이 가장 높은 시간대(많은 사람에게는 아침이지만, 모두는 아니에요)를 찾아 가장 어려운 주제를 그 시간에 배치하세요. 에너지가 낮은 시간에는 노트 정리 같은 기계적인 작업을 남겨두세요.",
      },
    },
  },
  {
    emoji: "⏳",
    duration_minutes: 2,
    translations: {
      it: {
        title: "La regola dei 2 minuti",
        summary: "Se richiede meno di 2 minuti, fallo subito.",
        body: "Rispondere a un'email veloce, segnare una scadenza, mettere via un libro: se un compito richiede meno di 2 minuti, fallo sul momento invece di aggiungerlo alla lista. Le liste piene di micro-compiti sono una delle principali fonti di sovraccarico ADHD.",
      },
      en: {
        title: "The 2-minute rule",
        summary: "If it takes under 2 minutes, do it now.",
        body: "Answering a quick email, noting a deadline, putting a book away: if something takes less than 2 minutes, just do it instead of adding it to your list. Lists cluttered with micro-tasks are a major source of ADHD overwhelm.",
      },
      ko: {
        title: "2분 규칙",
        summary: "2분 안에 끝난다면 지금 바로 하세요.",
        body: "빠른 이메일 답장, 마감일 메모, 책 정리하기 — 2분 안에 끝나는 일이라면 목록에 추가하지 말고 그 자리에서 바로 하세요. 자잘한 일로 가득 찬 목록은 ADHD 과부하의 주요 원인 중 하나예요.",
      },
    },
  },
  {
    emoji: "🎧",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Rumore di sottofondo mirato",
        summary: "Non silenzio assoluto: rumore prevedibile.",
        body: "Il silenzio totale amplifica ogni piccolo rumore imprevisto e distrae. Prova rumore bianco/rosa, musica strumentale ripetitiva o suoni ambientali (pioggia, caffetteria). Cerca quello che 'copre' senza catturare l'attenzione — evita canzoni con testo se devi leggere o scrivere.",
      },
      en: {
        title: "Targeted background noise",
        summary: "Not total silence — predictable sound.",
        body: "Total silence amplifies every small unexpected noise and pulls focus. Try white/pink noise, repetitive instrumental music, or ambient sounds (rain, café chatter). Look for something that 'covers' without grabbing attention — skip lyrics if you're reading or writing.",
      },
      ko: {
        title: "목적에 맞는 배경 소음",
        summary: "완전한 정적이 아니라 예측 가능한 소리.",
        body: "완전한 정적은 작은 소음도 크게 증폭시켜 주의를 흩뜨려요. 백색소음/핑크노이즈, 반복되는 연주곡, 또는 환경음(빗소리, 카페 소음)을 시도해 보세요. 주의를 끌지 않으면서 '덮어주는' 소리를 찾으세요 — 읽거나 쓸 때는 가사 있는 노래는 피하세요.",
      },
    },
  },
  {
    emoji: "🌙",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Prepara tutto la sera prima",
        summary: "Zaino, libri e materiali già pronti.",
        body: "La mattina è spesso il momento con meno capacità decisionale. Prepara la sera prima tutto ciò che serve — libri aperti alla pagina giusta, materiali sulla scrivania, lista dei 3 prossimi passi già scritta. Meno decisioni al mattino, meno attriti per iniziare.",
      },
      en: {
        title: "Set everything up the night before",
        summary: "Bag, books and materials ready to go.",
        body: "Mornings are often when decision-making capacity is lowest. The night before, prepare everything you'll need — books open to the right page, materials on the desk, your next-3-steps list already written. Fewer decisions in the morning means less friction to get started.",
      },
      ko: {
        title: "전날 밤에 미리 준비하기",
        summary: "가방, 책, 자료를 미리 다 챙겨두세요.",
        body: "아침은 흔히 의사결정 능력이 가장 낮은 시간이에요. 전날 밤에 필요한 모든 것을 준비하세요 — 알맞은 페이지가 펼쳐진 책, 책상 위 자료, 이미 적어둔 다음 3단계 목록. 아침에 결정할 게 적을수록 시작하기가 더 수월해요.",
      },
    },
  },
  {
    emoji: "👁️",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Un solo compito visibile",
        summary: "Copri o chiudi tutto il resto.",
        body: "Se lavori su carta, copri le altre pagine con un foglio bianco. Se lavori al computer, chiudi tutte le schede tranne una. Vedere 'quanto manca' dell'intero progetto è spesso più paralizzante che utile — mostra solo il pezzo su cui stai lavorando ora.",
      },
      en: {
        title: "Only one task visible",
        summary: "Cover or close everything else.",
        body: "If working on paper, cover other pages with a blank sheet. On a computer, close every tab but one. Seeing 'how much is left' of the whole project is often more paralyzing than helpful — show only the piece you're working on right now.",
      },
      ko: {
        title: "한 가지만 보이게 하기",
        summary: "나머지는 가리거나 닫아두세요.",
        body: "종이로 작업한다면 다른 페이지는 빈 종이로 덮으세요. 컴퓨터라면 하나만 남기고 모든 탭을 닫으세요. 전체 프로젝트에서 '얼마나 남았는지' 보는 것은 도움보다 부담이 될 때가 많아요 — 지금 작업 중인 부분만 보이게 하세요.",
      },
    },
  },
  {
    emoji: "🎁",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Una ricompensa dopo ogni sessione",
        summary: "Piccola, immediata, scelta prima di iniziare.",
        body: "Il cervello ADHD risponde meglio a ricompense immediate che a obiettivi lontani. Prima di iniziare, decidi la tua piccola ricompensa post-sessione (una canzone, 5 minuti di telefono, uno snack) così hai qualcosa di concreto da aspettare, non solo 'il dovere finito'.",
      },
      en: {
        title: "A reward after every session",
        summary: "Small, immediate, chosen before you start.",
        body: "The ADHD brain responds better to immediate rewards than distant goals. Before you begin, decide your small post-session reward (a song, 5 minutes on your phone, a snack) so you have something concrete to look forward to, not just 'the chore being over'.",
      },
      ko: {
        title: "매 세션 후 보상 주기",
        summary: "작고, 즉각적이며, 시작 전에 정해두기.",
        body: "ADHD 뇌는 먼 목표보다 즉각적인 보상에 더 잘 반응해요. 시작하기 전에 세션 후 작은 보상(노래 한 곡, 휴대폰 5분, 간식)을 정해두세요. '해야 할 일이 끝났다'는 것만이 아니라 기다릴 구체적인 무언가가 생겨요.",
      },
    },
  },
  {
    emoji: "🚶",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Ripasso camminando",
        summary: "Il movimento aiuta la memoria per molte persone ADHD.",
        body: "Per il ripasso orale (formule, definizioni, vocaboli) prova a camminare avanti e indietro nella stanza mentre ripeti a voce alta. Il movimento leggero e ritmico può aiutare la concentrazione invece di distrarre, specialmente per chi fatica a stare fermo.",
      },
      en: {
        title: "Review while walking",
        summary: "Movement helps memory for many ADHD minds.",
        body: "For oral review (formulas, definitions, vocabulary), try pacing back and forth in the room while repeating out loud. Light, rhythmic movement can support focus rather than distract from it — especially for people who struggle to sit still.",
      },
      ko: {
        title: "걸으며 복습하기",
        summary: "많은 ADHD인에게 움직임은 기억에 도움이 돼요.",
        body: "구두 복습(공식, 정의, 단어)을 할 때는 방 안을 왔다 갔다 걸으며 소리 내어 반복해 보세요. 가볍고 리듬 있는 움직임은 주의를 흩뜨리기보다 오히려 집중을 도와줄 수 있어요. 특히 가만히 앉아 있기 힘든 사람에게요.",
      },
    },
  },
  {
    emoji: "🎙️",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Registra e riascolta",
        summary: "Un riassunto vocale da riascoltare dopo.",
        body: "Dopo aver studiato una sezione, registra un breve riassunto a voce (60-90 secondi) come se lo spiegassi a un amico. Riascoltalo mentre cammini, fai le faccende o viaggi — un modo passivo per rinforzare la memoria nei momenti morti della giornata.",
      },
      en: {
        title: "Record and replay",
        summary: "A voice summary to listen back to later.",
        body: "After studying a section, record a short voice summary (60-90 seconds) as if explaining it to a friend. Play it back while walking, doing chores, or commuting — a passive way to reinforce memory during the dead time of your day.",
      },
      ko: {
        title: "녹음하고 다시 듣기",
        summary: "나중에 다시 들을 음성 요약 만들기.",
        body: "한 부분을 공부한 후, 친구에게 설명하듯 짧은 음성 요약(60-90초)을 녹음하세요. 걷거나 집안일을 하거나 이동할 때 다시 들어보세요 — 하루 중 빈 시간에 기억을 강화하는 수동적인 방법이에요.",
      },
    },
  },
  {
    emoji: "🧀",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Tecnica 'Swiss cheese'",
        summary: "Fai buchi casuali nel progetto grande.",
        body: "Invece di affrontare un progetto grande in ordine, apri 'buchi' casuali: 10 minuti su una parte a caso, poi un'altra parte a caso. Ogni buco rende il progetto un po' meno intero e meno intimidatorio, e spesso l'impulso a continuare arriva da solo una volta iniziato.",
      },
      en: {
        title: "The 'Swiss cheese' technique",
        summary: "Poke random holes in the big project.",
        body: "Instead of tackling a big project in order, poke random 'holes' into it: 10 minutes on one random part, then another random part. Each hole makes the project feel a little less solid and intimidating — and the urge to keep going often shows up once you've started.",
      },
      ko: {
        title: "'스위스 치즈' 기법",
        summary: "큰 프로젝트에 무작위로 구멍을 내보세요.",
        body: "큰 프로젝트를 순서대로 진행하는 대신, 무작위로 '구멍'을 내보세요: 무작위 부분에서 10분, 그다음 또 다른 무작위 부분에서 10분. 구멍이 하나씩 생길수록 프로젝트가 덜 견고하고 덜 위협적으로 느껴지고, 일단 시작하면 계속하고 싶은 마음이 저절로 따라올 때가 많아요.",
      },
    },
  },
  {
    emoji: "🤝",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Un accountability partner",
        summary: "Di' a qualcuno cosa farai, e quando.",
        body: "Manda un messaggio a un amico o familiare: 'Sto per studiare X per 25 minuti'. Sapere che qualcuno lo sa crea un piccolo impegno esterno che per molte menti ADHD funziona meglio della sola forza di volontà. Aggiorna la persona quando finisci.",
      },
      en: {
        title: "An accountability partner",
        summary: "Tell someone what you'll do, and when.",
        body: "Text a friend or family member: 'I'm about to study X for 25 minutes'. Knowing someone else knows creates a small external commitment that works better than willpower alone for many ADHD minds. Update them when you're done.",
      },
      ko: {
        title: "책임 파트너 만들기",
        summary: "무엇을, 언제 할지 누군가에게 말하기.",
        body: "친구나 가족에게 메시지를 보내세요: '지금부터 25분간 X 공부할게'. 누군가 알고 있다는 사실만으로 작은 외부 약속이 생기고, 많은 ADHD 뇌에게는 이것이 의지력만으로 하는 것보다 더 잘 작동해요. 끝나면 그 사람에게 알려주세요.",
      },
    },
  },
  {
    emoji: "🏡",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Uno spazio solo per studiare",
        summary: "Il cervello associa i luoghi alle attività.",
        body: "Se possibile, usa sempre lo stesso posto solo per studiare (non per rilassarti o giocare). Con il tempo, il cervello associa quel luogo specifico alla modalità 'focus', rendendo l'inizio più automatico. Se non hai uno spazio dedicato, anche un piccolo rituale (una lampada accesa solo mentre studi) può funzionare.",
      },
      en: {
        title: "A space just for studying",
        summary: "Your brain links places to activities.",
        body: "If possible, always use the same spot only for studying (not for relaxing or gaming). Over time, your brain links that specific place to 'focus mode', making it easier to start. No dedicated space? Even a small ritual — like a lamp switched on only while studying — can work.",
      },
      ko: {
        title: "공부 전용 공간 만들기",
        summary: "뇌는 장소와 활동을 연결지어요.",
        body: "가능하다면 공부만을 위한 장소(휴식이나 게임용이 아닌)를 항상 같은 곳으로 정하세요. 시간이 지나면 뇌가 그 장소를 '집중 모드'와 연결지어 시작하기가 더 자연스러워져요. 전용 공간이 없다면 공부할 때만 켜는 램프 같은 작은 의식도 효과가 있을 수 있어요.",
      },
    },
  },
  {
    emoji: "🔀",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Interleaving: alterna le materie",
        summary: "Cambia argomento prima di annoiarti.",
        body: "Invece di studiare la stessa materia per ore, alterna 2-3 materie diverse nella stessa sessione. Il cambio mantiene il cervello 'sveglio' e novità percepita, riducendo il calo di attenzione che arriva con la monotonia — molto comune nell'ADHD.",
      },
      en: {
        title: "Interleaving: mix subjects",
        summary: "Switch topics before boredom sets in.",
        body: "Instead of studying the same subject for hours, alternate 2-3 different subjects within the same session. Switching keeps the brain feeling 'awake' and novel, reducing the attention drop that comes with monotony — very common with ADHD.",
      },
      ko: {
        title: "인터리빙: 과목 섞기",
        summary: "지루해지기 전에 주제를 바꾸세요.",
        body: "같은 과목을 몇 시간씩 공부하는 대신, 한 세션 안에서 2~3개의 다른 과목을 번갈아 가며 공부하세요. 전환은 뇌를 '깨어있게' 하고 새로움을 느끼게 해서, ADHD에서 흔한 지루함으로 인한 주의력 저하를 줄여줘요.",
      },
    },
  },
  {
    emoji: "✍️",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Scrivi a mano i punti chiave",
        summary: "Digitare è più veloce, scrivere ricorda di più.",
        body: "Digitare permette di trascrivere tutto senza elaborare — scrivere a mano è più lento e costringe a selezionare e riformulare ciò che è davvero importante. Prova a scrivere a mano solo i concetti chiave, non tutto: quella selezione attiva è ciò che aiuta la memoria.",
      },
      en: {
        title: "Write key points by hand",
        summary: "Typing is faster, handwriting sticks more.",
        body: "Typing lets you transcribe everything without processing it — handwriting is slower and forces you to select and rephrase what actually matters. Try handwriting only the key concepts, not everything: that active selection is what helps memory.",
      },
      ko: {
        title: "핵심은 손으로 쓰기",
        summary: "타이핑은 빠르지만 손글씨가 더 오래 남아요.",
        body: "타이핑은 생각 없이 모든 걸 그대로 옮길 수 있지만, 손글씨는 더 느려서 진짜 중요한 것을 선택하고 다시 표현하게 만들어요. 전부가 아니라 핵심 개념만 손으로 써보세요 — 그 능동적인 선택이 기억을 돕는 거예요.",
      },
    },
  },
  {
    emoji: "🔥",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Il riscaldamento prima del difficile",
        summary: "5 minuti facili prima di affrontare il resto.",
        body: "Prima di attaccare l'argomento ostico, passa 5 minuti su qualcosa di facile e familiare nella stessa materia (rileggere appunti già chiari, ripassare cose già sapute). Serve a 'entrare' nella materia con basso attrito, prima di affrontare la parte difficile con più slancio.",
      },
      en: {
        title: "Warm up before the hard part",
        summary: "5 easy minutes before tackling the rest.",
        body: "Before attacking the tough topic, spend 5 minutes on something easy and familiar in the same subject (rereading notes you already understand, reviewing what you already know). It eases you into the subject with low friction before you face the hard part with more momentum.",
      },
      ko: {
        title: "어려운 부분 전에 워밍업하기",
        summary: "본격적으로 들어가기 전 쉬운 5분.",
        body: "어려운 주제에 뛰어들기 전에, 같은 과목에서 쉽고 익숙한 것(이미 이해한 노트 다시 읽기, 이미 아는 것 복습하기)에 5분을 써보세요. 마찰 없이 과목에 '들어가서' 더 큰 추진력으로 어려운 부분을 마주할 수 있어요.",
      },
    },
  },
  {
    emoji: "📅",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Scadenze intermedie",
        summary: "Un esame lontano non motiva: una scadenza tra 3 giorni sì.",
        body: "Se un esame è tra 3 settimane, il cervello ADHD spesso non lo percepisce come reale finché non è troppo tardi. Crea scadenze intermedie tue (finire il capitolo 1 entro martedì, il 2 entro venerdì) — piccole, concrete, vicine nel tempo.",
      },
      en: {
        title: "Intermediate deadlines",
        summary: "A distant exam doesn't motivate — a deadline in 3 days does.",
        body: "If an exam is 3 weeks away, the ADHD brain often doesn't register it as real until it's too late. Create your own in-between deadlines (finish chapter 1 by Tuesday, chapter 2 by Friday) — small, concrete, and close in time.",
      },
      ko: {
        title: "중간 마감일 만들기",
        summary: "먼 시험은 동기부여가 안 되지만, 3일 후 마감은 돼요.",
        body: "시험이 3주 후라면, ADHD 뇌는 너무 늦을 때까지 그것을 현실로 느끼지 못할 때가 많아요. 나만의 중간 마감일(화요일까지 1장 끝내기, 금요일까지 2장 끝내기)을 만드세요 — 작고, 구체적이고, 시간상 가까운 것으로요.",
      },
    },
  },
  {
    emoji: "🕐",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Rivedi entro 24 ore",
        summary: "Il ripasso più efficace è il primo, e il più vicino.",
        body: "La maggior parte di ciò che impariamo in una lezione svanisce nelle prime 24 ore se non viene rivisto. Dedica anche solo 5-10 minuti, lo stesso giorno o il giorno dopo, a rileggere velocemente gli appunti — basta molto meno tempo che recuperare tutto settimane dopo.",
      },
      en: {
        title: "Review within 24 hours",
        summary: "The most effective review is the first, closest one.",
        body: "Most of what we learn in a lesson fades within the first 24 hours if it's not reviewed. Spend even just 5-10 minutes, the same day or the next, quickly rereading your notes — it takes far less time than recovering it all weeks later.",
      },
      ko: {
        title: "24시간 안에 복습하기",
        summary: "가장 효과적인 복습은 가장 가까운 첫 복습이에요.",
        body: "수업에서 배운 대부분은 복습하지 않으면 24시간 안에 사라져요. 그날이나 다음 날 단 5~10분이라도 노트를 빠르게 다시 읽어보세요 — 몇 주 후에 다시 배우는 것보다 훨씬 적은 시간이 들어요.",
      },
    },
  },
  {
    emoji: "🎉",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Festeggia i piccoli traguardi",
        summary: "Non solo il voto finale: ogni passo completato.",
        body: "Aspettare il risultato finale per sentirsi soddisfatti è troppo lontano per motivare il cervello ADHD nel presente. Nota e festeggia ad alta voce ogni piccolo traguardo — 'ho finito il capitolo', 'ho capito quella formula' — anche solo con un piccolo gesto o parola.",
      },
      en: {
        title: "Celebrate small wins",
        summary: "Not just the final grade — every completed step.",
        body: "Waiting for the final result to feel satisfied is too far away to motivate the ADHD brain in the present. Notice and celebrate out loud every small milestone — 'I finished the chapter', 'I understood that formula' — even with just a small gesture or word.",
      },
      ko: {
        title: "작은 성취 축하하기",
        summary: "최종 성적만이 아니라 완료한 모든 단계를요.",
        body: "만족감을 느끼려고 최종 결과를 기다리는 건 지금 이 순간의 ADHD 뇌에게는 너무 멀어요. '챕터를 끝냈다', '그 공식을 이해했다' 같은 작은 이정표마다 알아차리고 소리 내어 축하하세요 — 작은 몸짓이나 말 한마디로도 충분해요.",
      },
    },
  },
  {
    emoji: "🌍",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Cambia scenario ogni tanto",
        summary: "Studiare in luoghi diversi aiuta a ricordare meglio.",
        body: "Alterna 2-3 posti diversi per studiare (scrivania, biblioteca, tavolo della cucina) invece di uno solo sempre uguale. La ricerca mostra che il cambio di ambiente crea più 'agganci' mentali per lo stesso ricordo, rendendolo più facile da recuperare in contesti diversi — utile soprattutto per gli esami.",
      },
      en: {
        title: "Change your scenery sometimes",
        summary: "Studying in different places helps you remember better.",
        body: "Alternate between 2-3 different study spots (desk, library, kitchen table) instead of always the same one. Research shows that changing environments creates more mental 'hooks' for the same memory, making it easier to retrieve in different contexts — especially useful for exams.",
      },
      ko: {
        title: "가끔 환경 바꾸기",
        summary: "다른 장소에서 공부하면 더 잘 기억돼요.",
        body: "항상 같은 곳이 아니라 2~3곳(책상, 도서관, 부엌 식탁)을 번갈아 가며 공부해 보세요. 연구에 따르면 환경을 바꾸면 같은 기억에 대해 더 많은 정신적 '고리'가 생겨서, 다른 상황에서도 더 쉽게 떠올릴 수 있어요 — 특히 시험에 유용해요.",
      },
    },
  },
  // ── Movement & exercise breaks ────────────────────────────────────
  {
    emoji: "🙆",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Stretching di collo e spalle",
        summary: "2 minuti per sciogliere la tensione da scrivania.",
        body: "1) Fai scendere lentamente l'orecchio verso la spalla, tieni 10 secondi, cambia lato. 2) Ruota le spalle indietro 5 volte, poi in avanti 5 volte. 3) Intreccia le dita, allunga le braccia in avanti e arrotonda la schiena per 10 secondi. Respira lentamente per tutto il tempo.",
      },
      en: {
        title: "Neck and shoulder stretch",
        summary: "2 minutes to release desk tension.",
        body: "1) Slowly drop your ear toward your shoulder, hold 10 seconds, switch sides. 2) Roll your shoulders back 5 times, then forward 5 times. 3) Interlace your fingers, stretch your arms forward and round your back for 10 seconds. Breathe slowly throughout.",
      },
      ko: {
        title: "목과 어깨 스트레칭",
        summary: "책상 긴장을 풀어주는 2분.",
        body: "1) 귀를 천천히 어깨 쪽으로 내리고 10초간 유지한 후 반대쪽도 하세요. 2) 어깨를 뒤로 5번, 앞으로 5번 돌리세요. 3) 손깍지를 끼고 팔을 앞으로 뻗으며 등을 둥글게 말아 10초간 유지하세요. 내내 천천히 호흡하세요.",
      },
    },
  },
  {
    emoji: "🚶‍♀️",
    duration_minutes: 5,
    translations: {
      it: {
        title: "Camminata di reset",
        summary: "5 minuti fuori (o su e giù per casa) tra una sessione e l'altra.",
        body: "Alla fine di ogni sessione di studio, alzati e cammina per 5 minuti — fuori se possibile, altrimenti su e giù per il corridoio. Non serve un obiettivo: serve solo muovere il corpo e far arrivare sangue e ossigeno fresco al cervello prima della sessione successiva.",
      },
      en: {
        title: "Reset walk",
        summary: "5 minutes outside (or around the house) between sessions.",
        body: "At the end of each study session, get up and walk for 5 minutes — outside if you can, otherwise up and down a hallway. No goal needed: just move your body and get fresh blood and oxygen to your brain before the next session.",
      },
      ko: {
        title: "리셋 산책",
        summary: "세션 사이 5분간 밖에서(또는 집 안에서) 걷기.",
        body: "공부 세션이 끝날 때마다 일어나서 5분간 걸으세요 — 가능하면 밖에서, 아니면 복도를 왔다 갔다 하세요. 목표는 필요 없어요. 다음 세션 전에 몸을 움직여 신선한 혈액과 산소를 뇌로 보내주기만 하면 돼요.",
      },
    },
  },
  {
    emoji: "🌬️",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Respirazione 4-7-8",
        summary: "Calma il sistema nervoso prima di iniziare.",
        body: "1) Espira completamente dalla bocca. 2) Inspira dal naso contando fino a 4. 3) Trattieni il respiro contando fino a 7. 4) Espira dalla bocca contando fino a 8. Ripeti 4 volte. Utile prima di iniziare a studiare o prima di un esame per calmare l'ansia.",
      },
      en: {
        title: "4-7-8 breathing",
        summary: "Calm your nervous system before you start.",
        body: "1) Exhale completely through your mouth. 2) Inhale through your nose counting to 4. 3) Hold your breath counting to 7. 4) Exhale through your mouth counting to 8. Repeat 4 times. Useful before studying or before an exam to ease anxiety.",
      },
      ko: {
        title: "4-7-8 호흡법",
        summary: "시작하기 전 신경계를 진정시키세요.",
        body: "1) 입으로 완전히 숨을 내쉬세요. 2) 코로 숨을 들이쉬며 4까지 세세요. 3) 숨을 참고 7까지 세세요. 4) 입으로 숨을 내쉬며 8까지 세세요. 4번 반복하세요. 공부를 시작하기 전이나 시험 전 불안을 가라앉히는 데 유용해요.",
      },
    },
  },
  {
    emoji: "🤸",
    duration_minutes: 1,
    translations: {
      it: {
        title: "Salti sul posto per resettare",
        summary: "1 minuto per svegliare corpo e mente.",
        body: "Quando ti senti annebbiato o assonnato, fai 20-30 jumping jack (salti a gambe e braccia divaricate) o semplici salti sul posto. L'attivazione cardiovascolare rapida aumenta l'afflusso di sangue al cervello ed è spesso più efficace di un caffè per la lucidità immediata.",
      },
      en: {
        title: "Jumping to reset",
        summary: "1 minute to wake up body and mind.",
        body: "When you feel foggy or sleepy, do 20-30 jumping jacks or simple jumps in place. The quick cardio spike boosts blood flow to the brain and is often more effective than coffee for immediate alertness.",
      },
      ko: {
        title: "제자리 점프로 리셋",
        summary: "몸과 마음을 깨우는 1분.",
        body: "멍하거나 졸릴 때 점핑잭 20~30개나 제자리에서 간단히 점프해 보세요. 빠른 심박수 상승은 뇌로 가는 혈류를 늘려주고, 즉각적인 각성 효과는 커피보다 나을 때가 많아요.",
      },
    },
  },
  {
    emoji: "🪑",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Stretching della schiena da seduti",
        summary: "2 minuti senza nemmeno alzarti dalla sedia.",
        body: "1) Seduto, porta le mani dietro la schiena della sedia e apri il petto per 10 secondi. 2) Piega il busto in avanti verso le ginocchia, braccia rilassate, per 15 secondi. 3) Ruota il busto verso destra tenendo lo schienale, poi verso sinistra, 10 secondi per lato.",
      },
      en: {
        title: "Seated back stretch",
        summary: "2 minutes without even leaving your chair.",
        body: "1) Seated, reach your hands behind the chair back and open your chest for 10 seconds. 2) Fold your torso forward toward your knees, arms relaxed, for 15 seconds. 3) Twist your torso to the right holding the chair back, then to the left, 10 seconds each side.",
      },
      ko: {
        title: "앉아서 하는 등 스트레칭",
        summary: "의자에서 일어나지 않고도 2분.",
        body: "1) 앉은 채로 손을 의자 등받이 뒤로 보내고 가슴을 열어 10초 유지하세요. 2) 팔을 편안히 늘어뜨린 채 상체를 무릎 쪽으로 15초간 숙이세요. 3) 등받이를 잡고 상체를 오른쪽으로, 그다음 왼쪽으로 각 10초씩 돌리세요.",
      },
    },
  },
  {
    emoji: "🤲",
    duration_minutes: 1,
    translations: {
      it: {
        title: "Rotazione dei polsi",
        summary: "1 minuto dopo scrittura o digitazione prolungata.",
        body: "Estendi le braccia davanti a te e ruota i polsi 10 volte in senso orario, poi 10 in senso antiorario. Poi apri e chiudi le dita a pugno 10 volte. Previene tensione e affaticamento dopo lunghe sessioni al computer o di scrittura a mano.",
      },
      en: {
        title: "Wrist rolls",
        summary: "1 minute after long writing or typing sessions.",
        body: "Extend your arms in front of you and roll your wrists 10 times clockwise, then 10 times counterclockwise. Then open and close your hands into fists 10 times. Prevents tension and fatigue after long computer or handwriting sessions.",
      },
      ko: {
        title: "손목 돌리기",
        summary: "오래 쓰거나 타이핑한 후 1분.",
        body: "팔을 앞으로 뻗고 손목을 시계 방향으로 10번, 반시계 방향으로 10번 돌리세요. 그다음 손을 주먹 쥐었다 폈다 10번 반복하세요. 컴퓨터나 손글씨를 오래 한 후 긴장과 피로를 예방해줘요.",
      },
    },
  },
  {
    emoji: "🏋️",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Squat leggeri in pausa",
        summary: "2 minuti per riattivare la circolazione.",
        body: "Fai 15 squat lenti e controllati: piedi larghezza spalle, scendi come per sederti su una sedia immaginaria, risali. Se preferisci meno impatto, alterna con 15 sollevamenti sui talloni. Ottimo per chi resta seduto a lungo — riattiva le gambe e la circolazione.",
      },
      en: {
        title: "Light squats on a break",
        summary: "2 minutes to get circulation going again.",
        body: "Do 15 slow, controlled squats: feet shoulder-width apart, lower as if sitting on an imaginary chair, then rise. Prefer something gentler? Alternate with 15 calf raises. Great for anyone sitting for long stretches — it reactivates your legs and circulation.",
      },
      ko: {
        title: "휴식 중 가벼운 스쿼트",
        summary: "혈액순환을 다시 돌리는 2분.",
        body: "천천히 15번 스쿼트를 해보세요: 어깨너비로 서서 상상 속 의자에 앉듯 내려갔다 올라오세요. 더 가벼운 걸 원한다면 종아리 들기 15번으로 바꿔보세요. 오래 앉아 있는 사람에게 좋아요 — 다리와 혈액순환을 다시 활성화해줘요.",
      },
    },
  },
  {
    emoji: "🗣️",
    duration_minutes: 3,
    translations: {
      it: {
        title: "Cammina mentre ripeti a voce alta",
        summary: "Unisci movimento e ripasso in un solo gesto.",
        body: "Scegli 3-5 concetti da ripassare e cammina per la stanza ripetendoli a voce alta, uno per ogni 'giro'. Il movimento combinato con la voce coinvolge più canali sensoriali insieme, spesso più efficace della sola lettura silenziosa per fissare la memoria.",
      },
      en: {
        title: "Walk while reciting out loud",
        summary: "Combine movement and review in one motion.",
        body: "Pick 3-5 concepts to review and pace around the room reciting them out loud, one per 'lap'. Movement combined with voice engages more sensory channels at once, often more effective than silent reading alone for locking in memory.",
      },
      ko: {
        title: "소리 내어 말하며 걷기",
        summary: "움직임과 복습을 한 번에.",
        body: "복습할 개념 3~5개를 골라 방을 걸으며 한 바퀴마다 하나씩 소리 내어 말해보세요. 움직임과 목소리를 함께 쓰면 더 많은 감각 채널이 동시에 활성화되어, 조용히 읽기만 하는 것보다 기억을 다지는 데 더 효과적일 때가 많아요.",
      },
    },
  },
  {
    emoji: "💃",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Balla per 2 minuti",
        summary: "La canzone preferita, senza regole.",
        body: "Metti la tua canzone preferita e balla liberamente per la sua durata, senza pensare a come sembri. È un modo rapido e gioioso per scaricare energia in eccesso o frustrazione accumulata, e riportare un po' di dopamina prima di tornare a studiare.",
      },
      en: {
        title: "Dance for 2 minutes",
        summary: "Your favorite song, no rules.",
        body: "Play your favorite song and dance freely for its length, without worrying how you look. It's a quick, joyful way to burn off excess energy or built-up frustration, and bring back a bit of dopamine before returning to studying.",
      },
      ko: {
        title: "2분간 춤추기",
        summary: "좋아하는 노래 한 곡, 규칙은 없이.",
        body: "좋아하는 노래를 틀고 어떻게 보이는지 신경 쓰지 말고 자유롭게 춤춰보세요. 남는 에너지나 쌓인 답답함을 빠르고 즐겁게 발산하고, 다시 공부하기 전에 도파민을 조금 채우는 방법이에요.",
      },
    },
  },
  {
    emoji: "🔮",
    duration_minutes: 1,
    translations: {
      it: {
        title: "Fidget consapevole durante l'ascolto",
        summary: "Le mani occupate possono aiutare l'attenzione.",
        body: "Se devi ascoltare una lezione o un audio, tieni in mano una pallina antistress, un elastico o qualsiasi oggetto da manipolare senza guardarlo. Per molte menti ADHD, occupare le mani in modo automatico libera attenzione per l'ascolto invece di sottrarla.",
      },
      en: {
        title: "Mindful fidgeting while listening",
        summary: "Busy hands can actually help focus.",
        body: "If you need to listen to a lecture or audio, hold a stress ball, a rubber band, or any object you can fidget with without looking at it. For many ADHD minds, occupying your hands automatically frees up attention for listening rather than draining it.",
      },
      ko: {
        title: "들을 때 의식적으로 피젯하기",
        summary: "바쁜 손이 오히려 집중을 도울 수 있어요.",
        body: "강의나 오디오를 들어야 한다면 스트레스볼, 고무줄, 또는 보지 않고 만질 수 있는 아무 물건이나 손에 쥐어보세요. 많은 ADHD 뇌에게는 손을 자동으로 바쁘게 하는 것이 듣기에 쓸 주의력을 빼앗기보다 오히려 자유롭게 해줘요.",
      },
    },
  },
  {
    emoji: "🦵",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Stretching delle gambe in piedi",
        summary: "2 minuti per chi resta seduto a lungo.",
        body: "1) In piedi, afferra una caviglia dietro di te e tieni il tallone vicino al gluteo per 15 secondi per lato (quadricipite). 2) Porta un piede su una sedia bassa e piega il busto in avanti per allungare il retro della gamba, 15 secondi per lato. 3) Cammina sul posto per 30 secondi.",
      },
      en: {
        title: "Standing leg stretch",
        summary: "2 minutes for anyone sitting for long periods.",
        body: "1) Standing, grab an ankle behind you and hold your heel near your glute for 15 seconds per side (quad stretch). 2) Prop one foot on a low chair and fold forward to stretch the back of your leg, 15 seconds per side. 3) March in place for 30 seconds.",
      },
      ko: {
        title: "서서 하는 다리 스트레칭",
        summary: "오래 앉아 있는 사람을 위한 2분.",
        body: "1) 서서 발목을 뒤로 잡고 발뒤꿈치를 엉덩이 가까이 15초간 유지하세요 (허벅지 앞쪽). 2) 낮은 의자에 한쪽 발을 올리고 상체를 앞으로 숙여 다리 뒤쪽을 15초씩 양쪽 스트레칭하세요. 3) 제자리 걸음을 30초간 하세요.",
      },
    },
  },
  {
    emoji: "📦",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Respirazione a scatola",
        summary: "Contro l'ansia da esame, in 4 fasi uguali.",
        body: "1) Inspira contando fino a 4. 2) Trattieni il respiro contando fino a 4. 3) Espira contando fino a 4. 4) Trattieni a polmoni vuoti contando fino a 4. Ripeti per 4-6 cicli. Usata anche da atleti e forze speciali per calmarsi rapidamente sotto pressione.",
      },
      en: {
        title: "Box breathing",
        summary: "For exam anxiety, in 4 equal phases.",
        body: "1) Inhale counting to 4. 2) Hold your breath counting to 4. 3) Exhale counting to 4. 4) Hold with empty lungs counting to 4. Repeat for 4-6 cycles. Used by athletes and special forces alike to calm down quickly under pressure.",
      },
      ko: {
        title: "박스 호흡법",
        summary: "시험 불안에, 동일한 4단계로.",
        body: "1) 4까지 세며 숨을 들이쉬세요. 2) 4까지 세며 숨을 참으세요. 3) 4까지 세며 숨을 내쉬세요. 4) 폐를 비운 채 4까지 세며 참으세요. 4~6번 반복하세요. 운동선수와 특수부대에서도 압박감 속에서 빠르게 진정하기 위해 사용하는 방법이에요.",
      },
    },
  },
  {
    emoji: "💧",
    duration_minutes: 1,
    translations: {
      it: {
        title: "Acqua fredda sul viso",
        summary: "Un reset sensoriale in 60 secondi.",
        body: "Se ti senti sopraffatto o la mente corre troppo veloce, bagna viso e polsi con acqua fredda per qualche secondo. Lo shock termico attiva il nervo vago e può aiutare a calmare rapidamente il sistema nervoso — utile prima di un esame o dopo una sessione intensa.",
      },
      en: {
        title: "Cold water on your face",
        summary: "A sensory reset in 60 seconds.",
        body: "If you feel overwhelmed or your mind is racing, splash cold water on your face and wrists for a few seconds. The temperature shock activates the vagus nerve and can help calm the nervous system quickly — useful before an exam or after an intense session.",
      },
      ko: {
        title: "얼굴에 찬물 끼얹기",
        summary: "60초 만에 감각을 리셋하기.",
        body: "압도되거나 생각이 너무 빨리 달릴 때, 얼굴과 손목에 찬물을 몇 초간 끼얹어 보세요. 온도 자극이 미주신경을 활성화해 신경계를 빠르게 진정시키는 데 도움이 될 수 있어요 — 시험 전이나 힘든 세션 후에 유용해요.",
      },
    },
  },
  {
    emoji: "🐈",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Yoga rapido: gatto-mucca",
        summary: "2 minuti per mobilizzare la colonna.",
        body: "A quattro zampe (mani e ginocchia a terra): 1) Inspira inarcando la schiena verso il basso, testa e coccige verso l'alto (mucca). 2) Espira arrotondando la schiena verso l'alto, mento verso il petto (gatto). Alterna lentamente per 8-10 respiri, seguendo il ritmo del respiro.",
      },
      en: {
        title: "Quick yoga: cat-cow",
        summary: "2 minutes to mobilize your spine.",
        body: "On all fours (hands and knees on the floor): 1) Inhale, arching your back downward, head and tailbone lifting (cow). 2) Exhale, rounding your back upward, chin toward chest (cat). Alternate slowly for 8-10 breaths, following the rhythm of your breathing.",
      },
      ko: {
        title: "빠른 요가: 고양이-소 자세",
        summary: "척추를 풀어주는 2분.",
        body: "네발 자세로(손과 무릎을 바닥에): 1) 숨을 들이쉬며 등을 아래로 젖히고 머리와 꼬리뼈를 위로 올리세요 (소 자세). 2) 숨을 내쉬며 등을 위로 둥글게 말고 턱을 가슴 쪽으로 당기세요 (고양이 자세). 호흡 리듬에 맞춰 8~10번 천천히 반복하세요.",
      },
    },
  },
  {
    emoji: "🖐️",
    duration_minutes: 1,
    translations: {
      it: {
        title: "Massaggio a mani e dita",
        summary: "1 minuto dopo scrittura prolungata.",
        body: "Con il pollice dell'altra mano, premi e massaggia il palmo in piccoli cerchi per 20 secondi per mano. Poi tira delicatamente ogni dito dalla base alla punta. Rilascia la tensione accumulata da presa sulla penna o digitazione prolungata.",
      },
      en: {
        title: "Hand and finger massage",
        summary: "1 minute after long writing sessions.",
        body: "With the thumb of your other hand, press and massage your palm in small circles for 20 seconds per hand. Then gently pull each finger from base to tip. Releases tension built up from gripping a pen or typing for a long time.",
      },
      ko: {
        title: "손과 손가락 마사지",
        summary: "오래 쓴 후 1분.",
        body: "반대쪽 엄지손가락으로 손바닥을 작은 원을 그리며 20초간 눌러 마사지하세요, 양손 모두. 그다음 각 손가락을 뿌리부터 끝까지 부드럽게 당겨주세요. 펜을 오래 쥐거나 타이핑하며 쌓인 긴장을 풀어줘요.",
      },
    },
  },
  {
    emoji: "🧱",
    duration_minutes: 1,
    translations: {
      it: {
        title: "Push-up contro il muro",
        summary: "1 minuto per un'iniezione rapida di energia.",
        body: "In piedi a un braccio di distanza da un muro, mani appoggiate all'altezza delle spalle, piega i gomiti avvicinando il petto al muro e spingi indietro. Ripeti 10-15 volte. Attiva la parte superiore del corpo senza bisogno di attrezzi o di sudare troppo.",
      },
      en: {
        title: "Wall push-ups",
        summary: "1 minute for a quick energy boost.",
        body: "Stand an arm's length from a wall, hands placed at shoulder height, bend your elbows to bring your chest toward the wall, then push back. Repeat 10-15 times. Activates your upper body with no equipment and barely any sweat.",
      },
      ko: {
        title: "벽 팔굽혀펴기",
        summary: "빠른 에너지 충전을 위한 1분.",
        body: "벽에서 팔 하나 정도 거리에 서서 손을 어깨 높이에 대고, 팔꿈치를 굽혀 가슴을 벽 쪽으로 가져갔다가 다시 밀어내세요. 10~15번 반복하세요. 장비 없이, 땀도 거의 안 나면서 상체를 활성화할 수 있어요.",
      },
    },
  },
  {
    emoji: "👀",
    duration_minutes: 1,
    translations: {
      it: {
        title: "Regola 20-20-20 per gli occhi",
        summary: "Ogni 20 minuti, guarda lontano 20 secondi.",
        body: "Ogni 20 minuti di schermo o lettura, guarda qualcosa a circa 6 metri (20 piedi) di distanza per 20 secondi. Riduce l'affaticamento visivo, che spesso si traduce in mal di testa e cali di concentrazione durante sessioni di studio lunghe.",
      },
      en: {
        title: "The 20-20-20 rule for your eyes",
        summary: "Every 20 minutes, look 20 feet away for 20 seconds.",
        body: "Every 20 minutes of screen time or reading, look at something about 20 feet (6 meters) away for 20 seconds. Reduces eye strain, which often turns into headaches and focus drops during long study sessions.",
      },
      ko: {
        title: "눈을 위한 20-20-20 규칙",
        summary: "20분마다 20초간 20피트 먼 곳 보기.",
        body: "화면을 보거나 책을 읽은 지 20분마다, 약 6미터(20피트) 떨어진 곳을 20초간 바라보세요. 눈의 피로를 줄여주는데, 이 피로는 긴 공부 세션 중 두통과 집중력 저하로 이어질 때가 많아요.",
      },
    },
  },
  {
    emoji: "🦶",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Cammina scalzo per il grounding",
        summary: "2 minuti di stimolazione sensoriale ai piedi.",
        body: "Togli scarpe e calzini e cammina lentamente su superfici diverse — erba, pavimento, tappeto — prestando attenzione a cosa senti sotto i piedi. È una tecnica di grounding sensoriale che aiuta a interrompere il rimuginio mentale e riportare l'attenzione al corpo.",
      },
      en: {
        title: "Barefoot grounding walk",
        summary: "2 minutes of sensory input through your feet.",
        body: "Take off your shoes and socks and walk slowly on different surfaces — grass, floor, carpet — paying attention to what you feel underfoot. This sensory grounding technique helps interrupt mental spiraling and bring your attention back to your body.",
      },
      ko: {
        title: "맨발로 걷는 그라운딩",
        summary: "발을 통한 감각 자극 2분.",
        body: "신발과 양말을 벗고 잔디, 바닥, 카펫 등 다양한 표면을 천천히 걸으며 발밑에서 느껴지는 감각에 주의를 기울여 보세요. 이 감각적 그라운딩 기법은 생각이 소용돌이치는 것을 멈추고 몸으로 주의를 되돌리는 데 도움이 돼요.",
      },
    },
  },
  {
    emoji: "🌪️",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Torsione della colonna da seduti",
        summary: "2 minuti per sciogliere la rigidità della schiena.",
        body: "Seduto con la schiena dritta, ruota lentamente il busto verso destra, appoggiando una mano allo schienale e l'altra al ginocchio opposto, tieni 15 secondi respirando profondamente. Ripeti dall'altro lato. Aiuta a rilasciare la tensione accumulata dalla postura statica prolungata.",
      },
      en: {
        title: "Seated spinal twist",
        summary: "2 minutes to loosen a stiff back.",
        body: "Sitting with a straight back, slowly twist your torso to the right, resting one hand on the chair back and the other on your opposite knee, hold for 15 seconds breathing deeply. Repeat on the other side. Helps release tension built up from prolonged static posture.",
      },
      ko: {
        title: "앉아서 하는 척추 비틀기",
        summary: "뻣뻣한 등을 풀어주는 2분.",
        body: "허리를 곧게 펴고 앉아 상체를 천천히 오른쪽으로 비틀며 한 손은 의자 등받이에, 다른 손은 반대쪽 무릎에 두고 깊게 호흡하며 15초간 유지하세요. 반대쪽도 반복하세요. 오랫동안 정적인 자세로 인해 쌓인 긴장을 풀어줘요.",
      },
    },
  },
  {
    emoji: "⭐",
    duration_minutes: 2,
    translations: {
      it: {
        title: "Mini cardio tra un capitolo e l'altro",
        summary: "2 minuti di jumping jack per riattivarti.",
        body: "Alla fine di un capitolo o di un argomento, fai 1-2 minuti di jumping jack (salti a gambe e braccia aperte/chiuse) a ritmo sostenuto. Aumenta rapidamente battito cardiaco e ossigenazione, un modo semplice per marcare la fine di un blocco e ricaricarti per il prossimo.",
      },
      en: {
        title: "Mini cardio between chapters",
        summary: "2 minutes of jumping jacks to re-energize.",
        body: "At the end of a chapter or topic, do 1-2 minutes of jumping jacks at a brisk pace. It quickly raises your heart rate and oxygen levels — a simple way to mark the end of a block and recharge for the next one.",
      },
      ko: {
        title: "챕터 사이 미니 유산소",
        summary: "재충전을 위한 2분간 점핑잭.",
        body: "한 챕터나 주제가 끝나면 빠른 속도로 1~2분간 점핑잭을 하세요. 심박수와 산소량을 빠르게 높여주며, 한 구간의 끝을 표시하고 다음을 위해 재충전하는 간단한 방법이에요.",
      },
    },
  },
  {
    emoji: "🧘‍♂️",
    duration_minutes: 1,
    translations: {
      it: {
        title: "Plank breve per attivare il core",
        summary: "30 secondi per svegliare corpo e concentrazione.",
        body: "Mettiti in posizione plank (avambracci e punte dei piedi a terra, corpo dritto come una tavola) e resisti 20-30 secondi respirando normalmente. Attiva tutto il corpo in poco tempo ed è un ottimo modo per interrompere la sonnolenza da studio prolungato senza uscire dalla stanza.",
      },
      en: {
        title: "Short plank to activate your core",
        summary: "30 seconds to wake up body and focus.",
        body: "Get into plank position (forearms and toes on the floor, body straight like a board) and hold for 20-30 seconds, breathing normally. It activates your whole body in a short time and is a great way to break drowsiness from long study sessions without even leaving the room.",
      },
      ko: {
        title: "코어를 깨우는 짧은 플랭크",
        summary: "몸과 집중력을 깨우는 30초.",
        body: "플랭크 자세(팔뚝과 발끝을 바닥에 대고 몸을 판자처럼 일직선으로)를 취하고 평소처럼 호흡하며 20~30초간 버티세요. 짧은 시간에 온몸을 활성화하고, 방을 나가지 않고도 장시간 공부로 인한 졸음을 깨는 좋은 방법이에요.",
      },
    },
  },
];

function stripTranslationsInfo(tip, lang) {
  const tr = tip.translations[lang];
  return {
    category: "studio",
    language: lang,
    emoji: tip.emoji,
    duration_minutes: tip.duration_minutes,
    is_premium: false,
    title: tr.title,
    summary: tr.summary,
    body: tr.body,
  };
}

/** Flattens the 50 tips into 150 LibraryContent-shaped records (50 × it/en/ko). */
export function buildLibraryRecords() {
  const records = [];
  for (const tip of STUDY_TIPS) {
    for (const lang of ["it", "en", "ko"]) {
      records.push(stripTranslationsInfo(tip, lang));
    }
  }
  return records;
}
