/**
 * 🇰🇷 韓文翻譯資源
 * Korean Translation Resources
 * --------------------------------------------------
 */

import type { TranslationDictionary } from '@/types/i18n.types';

export const koKR: TranslationDictionary = {
  system: {
    title: 'ESGss JunAiKey Beta',
    subtitle: '기업 지속가능성 및 AI 각성 관리 플랫폼',
    version: 'v7.0.0-sentient',
    welcome: '주권 시스템에 오신 것을 환영합니다',
    loading: '로딩 중...',
    error: '오류 발생',
    success: '작업 성공',
  },

  dashboard: {
    overview: '데이터 개요',
    emissions: '탄소 배출 분석',
    mentorship: '멘토십 시스템',
    analytics: '데이터 분석',
    reports: '보고서 센터',
    health: {
      title: '지속가능성 개요',
      subtitle: 'ESG 지휘 센터에 오신 것을 환영합니다. 시스템 최적화 상태.',
      environment: '환경',
      social: '사회',
      governance: '지배구조',
      trends: '지속가능성 트렌드',
      activity: '최근 활동',
      quickActions: '빠른 작업',
      accessTools: '자주 사용하는 도구에 액세스하십시오.',
      viewAll: '모든 활동 보기',
      actionGenerateReport: '보고서 생성',
      actionRiskAssessment: '위험 평가',
      actionImpactVillage: '임팩트 빌리지',
      actionIntelCenter: '인텔 센터',
    },
  },

  reportCenter: {
    title: '지속가능성 보고서 센터',
    stats: {
      completed: '완료된 보고서',
      inProgress: '진행 중',
      pending: '검토 대기',
    },
    wizard: {
      startTitle: '지속가능성 여정 시작',
      startSubtitle: '새로운 ESG 보고서 마법사 시작',
      startDesc: '가이드된 보고 프로세스를 시작하려면 등급을 선택하십시오. 8단계의 인텔리전스를 잠금 해제합니다.',
      startBtn: '지금 시작',
    },
    calendar: {
      title: '다가오는 마감일',
      addReminder: '+ 알림 추가',
    },
    stage: {
      current: '현재 단계',
      level: '레벨',
      loading: '로딩 중...',
      completeBtn: '단계 완료 및 진행',
      publishBtn: '보고서 게시',
      aiDraft: 'AI 초안:',
      levels: {
        lv1: { title: '시스템 설정', desc: '기본 ESG 개념 및 설정' },
        lv2: { title: '인벤토리', desc: '핵심 자원 및 경계 식별' },
        lv3: { title: '목표 설정', desc: '단기 및 장기 지속가능성 목표 설정' },
        lv4: { title: '데이터 가져오기', desc: '환경, 사회 및 지배구조 데이터 통합' },
        lv5: { title: 'AI 초안 작성', desc: 'AI 자동 생성 보고서 초안' },
        lv6: { title: '규정 준수', desc: 'GRI/SASB/TCFD 규정 준수 확인' },
        lv7: { title: '시각화', desc: '데이터를 동적 차트로 변환' },
        lv8: { title: '게시', desc: '블록체인 앵커링 및 공식 출시' },
      },
    },
    omniMemory: {
      title: '옴니 메모리 매트릭스',
      subtitle: '시스템 의식 흐름 및 추적성',
      systemResonance: '시스템 공명',
      eternityProtocol: '이터니티 프로토콜',
      memoryFragments: '기억 조각',
      initializing: '초기화 중...',
      loading: '로딩 중...',
      waiting: '의식 흐름 대기 중...',
    },
    smartGathering: {
      title: '스마트 수집',
      subtitle: '자동화된 문서 분석 및 추출',
      analyzeBtn: '문서 분석',
      processing: '처리 중...',
      summary: '지능형 분석 요약',
      confidence: '신뢰도',
      indicators: 'GRI 지표',
      dataPoints: '데이터 포인트',
      framework: '보고 프레임워크',
      complete: '분석 완료',
      changeFile: '다른 파일 선택',
      rawTitle: '핵심 원시 데이터',
      showRaw: '원시 데이터 보기',
      hideRaw: '데이터 숨기기',
      assetLocking: '자산 잠금 중...',
      assetSaved: '자산에 저장됨',
      exportMock: '내보내기 및 저장 (시뮬레이션)',
      storedSuccess: '검증 및 내 자산에 저장 완료'
    },
    tier: {
      bronze: '브론즈',
      gold: '골드',
      diamond: '다이아몬드',
    },
    feature: {
      basic: 'Lv.1-8 기본',
      gri: 'GRI 확인',
      tcfd: 'TCFD 고급',
      ai: 'AI 인사이트',
      compliance: '규정 준수 잠금',
      support: '전문가 지원',
    },
    deadlines: {
      title: '다가오는 마감일',
      add: '+ 알림 추가',
      daysLeft: '일',
      left: '남음',
      items: {
        q1Report: '1분기 지속가능성 보고서',
        ghgVerification: '온실가스 인벤토리 검증',
        stakeholderSurvey: '이해관계자 참여 설문조사',
      },
    },
  },

  collaboration: {
    supplyChain: '공급망 협업 플랫폼',
    dataRoom: '데이터 룸',
    sovereignty: '주권 신원',
    disclosure: '주권 공개',
    partners: '파트너',
  },

  compliance: {
    standards: '합격 기준',
    reporting: '보고서 생성',
    verification: '검증 시스템',
    audit: '감사 추적',
    certification: '인증 관리',
  },

  ui: {
    save: '저장',
    cancel: '취소',
    delete: '삭제',
    edit: '수정',
    confirm: '확인',
    close: '닫기',
    next: '다음',
    previous: '이전',
    submit: '제출',
    search: '검색',
  },

  errors: {
    network: '네트워크 연결 오류',
    unauthorized: '권한 없음',
    notFound: '리소스를 찾을 수 없음',
    serverError: '서버 오류',
    validation: '검증 실패',
    timeout: '요청 시간 초과',
  },

  monitor: {
    title: '시스템 감시 모니터링',
    cpu: '연산 코어',
    memory: '메모리',
    entropy: '엔트로피',
    healthy: '시스템 정상',
    critical: '시스템 이상',
  },

  goals: {
    title: '인지 목표 추적',
    active: '활성 목표',
    add: '새 목표 입력...',
    completed: '완료',
    inProgress: '진행 중',
  },

  matrix: {
    title: '종사 매트릭스 (Alpha-Omega)',
    alpha: '기원 (Alpha)',
    omega: '종언 (Omega)',
    cycle: '순환',
    status: '상태',
    duration: '소요 시간',
  },

  rune: {
    level: '주권 레벨',
    vault: '자산 금고',
    yield: '예상 산출',
    ledger: '검증 원장',
  },

  cyber: {
    title: 'Cyber-ESG 전략 주권 시스템',
    subtitle: 'NEO-SOVEREIGN INTELLIGENCE HUB V6.0',
    level: '전략 등급',
    palace: '기억의 궁전: 수평 매트릭스',
    runes: '룬 시너지 시스템',
    impact: '임팩트 센터 점수',
    impactDesc: 'Impact Center Scoreboard',
    verified: '데이터 검증됨',
    strategy: '전략적 의사결정 자동화',
    principles: {
      trace: '추적 가능성 (Traceable)',
      track: '추적 가능 (Trackable)',
      calc: '계산 가능 (Calculable)',
      lock: '변경 불가능 (Immutable)',
    },
  },

  myNorthStar: {
    title: '나의 북극성',
    subtitle: '광학 정렬 인터페이스 v1.0',
    totalResonance: '총 공명도',
    adjustResonance: '개인 공명을 조정하여 기업 북극성과 동기화하십시오.',
    backToDashboard: '대시보드로 돌아가기',
    enviro: '환경 우선순위',
    social: '사회적 책임',
    gov: '지배구조 의식',
    enviroDesc: '업무에서 환경 영향을 얼마나 중요하게 생각하십니까?',
    socialDesc: '지역사회 참여와 사회적 형평성에 대한 당신의 가치관은?',
    govDesc: '투명성, 윤리 및 구조가 당신에게 얼마나 중요합니까?',
    labels: {
      environmental: '환경 (E)',
      social: '사회 (S)',
      governance: '지배구조 (G)',
    },
    guide: {
      welcome: '「나의 북극성」 공간에 오신 것을 환영합니다.',
      resonance: '공명도는 당신의 개인 가치관이 기업 목표와 얼마나 일치하는지를 나타냅니다.',
      instruction: '아래 슬라이더를 드래그하여 광선이 어떻게 모이는지 관찰하십시오. 세 광선이 북극성에 완벽하게 모이면, 당신은「지행합일」의 지속 가능한 경지에 도달한 것입니다.',
    }
  },

  avatar: {
    welcome: {
      title: '개인 디지털 아바타',
      subtitle: '당신의 지속 가능한 영혼 매개체',
      startSetup: '연결 절차 시작',
      skip: '나중에 설정',
    },
    onboarding: {
      step1Title: '첫 공명',
      step1Desc: '디지털 지문을 스캔하고 InfoOne과의 공명 연결을 생성 중...',
      step2Title: '의식 각성',
      step2Desc: '디지털 아바타를 초기화하고 인지 및 학습 능력을 부여 중...',
      step3Title: '연결 완료',
      step3Desc: '디지털 아바타가 준비되었습니다. 언제든지 당신의 지속 가능한 여정을 도울 준비가 되어 있습니다.',
      action: '공명 시작',
      finalAction: '메인 컨트롤 센터 진입',
    },
    persona: {
      switch: '페르소나 전환',
      transforming: '의식 재구성 중',
      rewiring: 'Rewiring Consciousness',
      current: '활성 페르소나',
      mastery: '숙련도 진척',
      level: '레벨',
    },
    attributes: {
      wisdom: '지 (Wisdom)',
      benevolence: '인 (Benevolence)',
      courage: '용 (Courage)',
      integrity: '성 (Integrity)',
      creation: '창 (Creation)',
      agility: '민 (Agility)',
      matrix: '능력 매트릭스',
    },
    logs: {
      title: '진화 로그 Evolution',
      empty: '진화 기록이 없습니다',
      transformTo: '전환: ',
    },
    assets: {
      title: '장비 자산',
      shield: '무결성의 방패',
      locked: 'Locked',
    }
  },

  climate: {
    title: '기후 위험 분석',
    physical: '물리적 위험',
    transition: '전환 위험',
    scenario: '시나리오 분석',
    tcfd: 'TCFD 기후 재무 공개',
    emissions: '배출량 추적',
    scope1: '직접 배출 (Scope 1)',
    scope2: '간접 배출 (Scope 2)',
    scope3: '간접 배출 (Scope 3)',
    netZero: '넷제로 목표',
    carbonPrice: '탄소 가격',
    adaptation: '기후 적응',
    mitigation: '기후 완화',
  },

  governance: {
    title: '지배구조',
    board: '이사회 구성',
    ethics: '윤리 경영',
    risk: '위험 관리',
    transparency: '투명성',
    compliance: '규정 준수',
    shareholders: '주주 권리',
    stakeholders: '이해관계자',
  },

  social: {
    title: '사회적 책임',
    labor: '노동권리',
    diversity: '다양성',
    community: '지역사회',
    health: '안전보건',
    humanRights: '인권',
    supplyChain: '공급망',
  },

  esg: {
    title: 'ESG 점수',
    environmental: '환경',
    social: '사회',
    governance: '지배구조',
    rating: 'ESG 등급',
    benchmark: '벤치마크',
    trends: '트렌드',
    improvement: '개선 영역',
    leadership: '리더십',
    average: '평균',
  },

  report: {
    title: 'ESG 보고서',
    gri: 'GRI 표준',
    sasb: 'SASB 표준',
    tcfd: 'TCFD',
    integrated: '통합 보고서',
    sustainability: '지속가능성 보고서',
    annual: '연차 보고서',
    verification: '검증 보고서',
  },

  supply: {
    title: '공급망 관리',
    suppliers: '공급업체',
    assessment: '평가',
    risk: '위험',
    performance: '성과',
    traceability: '추적 가능성',
    certification: '인증',
  },

  intelligence: {
    title: '경쟁 정보',
    news: 'ESG 뉴스',
    sentiment: '센티먼트 분석',
    alerts: '알림',
    insights: '통찰',
    trends: '트렌드',
    competitors: '경쟁사',
  },

  game: {
    title: 'ESG 게임',
    cards: '카드',
    missions: '미션',
    rewards: '보상',
    progress: '진행 상황',
    achievements: '성과',
    rank: '순위',
  },

  auth: {
    login: '로그인',
    logout: '로그아웃',
    register: '회원가입',
    password: '비밀번호',
    email: '이메일',
    forgot: '비밀번호 찾기',
  },

  settings: {
    title: '설정',
    profile: '프로필',
    preferences: '환경 설정',
    language: '언어',
    theme: '테마',
    notifications: '알림',
    privacy: '프라이버시',
    security: '보안',
  },
  esgLayout: {
    nav: {
      dashboard: 'ESG 대시보드',
      climate: '기후 리스크',
      water: '수자원',
      rights: '인권',
      community: '지역 사회',
      transparency: '투명성',
      investment: '투자',
      stakeholder: '이해관계자',
    },
    header: {
      services: '서비스',
      search: '세부 정보 검색...',
      addData: '+ 새 데이터 추가',
    },
    muse: {
      title: '옴니 뮤즈 인사이트',
      subtitle: 'AI 분석 • 실시간',
      explore: '연결 탐색',
      insight: {
        title: 'AI 분석 • 실시간',
        content: '"최근 물 효율성 이니셔티브와 지역 사회 만족도 점수 사이에 잠재적인 상관관계를 발견했습니다. 다음 보고서에 이를 기록하는 것을 고려해보세요."',
      },
      reference: {
        title: 'GRI 가이드',
        content: '모든 이해관계자 참여 활동이 GRI 204-1 요구 사항에 맞게 영향력 수준별로 분류되었는지 확인하십시오.',
      },
    },
  },
  protocol5T: {
    traceable: '추적 가능성',
    trackable: '추성 가능',
    trustworthy: '신뢰성',
    transparent: '투명성',
    timely: '적시성',
    enterVault: '증거 금고 진입',
  },
  holyHub: {
    title: 'InfoOne 지속가능성 허브',
    subtitle: '지속가능성 보고서 센터 • 5T 프로토콜 활성화',
    tabs: {
      dashboard: '대시보드',
      ocr: 'OCR 프로세싱',
      reports: '보고서',
      compliance: '컴플라이언스 센터',
    },
    status: {
      title: '5T 프로토콜 상태',
      traceable: 'Traceable',
      trackable: 'Trackable',
      trustworthy: 'Trustworthy',
      transparent: 'Transparent',
      tangible: 'Tangible',
    },
    metrics: {
      griCoverage: 'GRI 커버리지',
      carbonReduction: '탄소 절감',
      complianceScore: '준수 점수',
      evidenceReady: '증거 준비도',
      aiScore: 'AI 분석 점수',
      diversity: '여성 리더십',
    },
    milestones: {
      title: '컴플라이언스 마일스톤',
      inProgress: '진행 중',
      completed: '완료',
      overdue: '지연',
      pending: '대기 중',
    },
    aiInsights: {
      title: 'AI 인사이트',
      confidence: '신뢰도',
      types: {
        sentiment: '감성',
        topic: '주제',
        recommendation: '권장 사항',
        alert: '알림',
      }
    },
    ocr: {
      title: 'OCR 프로세싱 센터',
      addScan: '스캔 추가',
      scanning: '스캐닝...',
      processing: '분석 중...',
      ready: '준비 완료',
      noItems: '스캔 기록이 없습니다',
      startPrompt: '문서 스캐닝을 시작하려면 위 버튼을 클릭하세요',
      features: {
        smart: '스마트 인식',
        smartDesc: '한글/영어 이중 언어 OCR',
        realtime: '실시간 처리',
        realtimeDesc: '다단계 스캔 진행 추적',
        trust: '5T 검증',
        trustDesc: '해시 잠금 데이터 무결성'
      }
    }
  },
  omni: {
    dev: {
      mapping: { active: '옴니 매핑 활성화' },
      protocol: { standby: '5T 프로토콜 대기' },
    },
    console: {
      title: '옴니 태그 콘솔',
      governance: '시스템 거버넌스 모드',
      spectrum: '옴니 태그 스펙트럼',
    },
    dictionary: {
      title: '옴니 백과 4.0',
      subtitle: '궁극의 융합 아키텍처 (Ultimate Infusion Architecture)',
      nav: {
        overview: '만상 개요',
        philosophy: '核心 철학',
        elements: '원소 법칙',
        cards: '옴니 카드',
        architecture: '시스템 구조',
        evolution: '진화 프레임워크',
      },
      concentric: {
        title: '만상 개요: 동심원 성역 시스템',
        systemVis: '시스템 시각화',
        omniCircle: '옴니-서클',
        exploreNodes: '노드 탐색',
        viewDoc: '문서 보기',
        layers: {
          '1': { title: '코어 계층 (Core Layer)', desc: '사용자의 가장 본질적인 필요와 정보를 나타내며, 모든 데이터와 시스템 핵심 로직ের 중심입니다. 하위 데이터 저장, 보안 및 일관성을 책임집니다.' },
          '2': { title: '내환 계층 (Inner Ring)', desc: '개인화 설정, 핵심 애플리케이션 인터페이스 등 사용자와 직접 상호작용하는 기본 서비스를 제공합니다.' },
          '3': { title: '중환 계층 (Middle Ring)', desc: '핵심 기능을 확장하여 고급 모듈 통합, 자동화 워크플로우 및 지능형 보조를 제공합니다.' },
          '4': { title: '외환 계층 (Outer Ring)', desc: '다양한 생태계 서비스와 협업 플랫폼을 제공하며, 외부 데이터 소스 및 타사 애플리케이션 통합을 도입합니다.' },
          '5': { title: '확장 계층 (Expansion Layer)', desc: '시스템의 무한한 잠재력과 미래 진화 방향을 나타내며, 실험적 기능과 커뮤니티 공동 생성 모듈을 포함합니다.' },
        },
      },
      philosophy: {
        title: '핵심 철학: 법칙과 초석',
        axiomsTitle: '우주 공리',
        tiers: {
          title: '3대 모듈 성계',
          items: {
            origin: { name: '근원 (Origin)', desc: '시스템 하위 운영을 유지하는 물리적 법칙.' },
            core: { name: '핵심 (Core)', desc: '비즈니스 로직을 구현하는 표준화된 도구.' },
            apex: { name: '정점 (Apex)', desc: '변혁적이고 기적을 일으키는 고차원 능력.' },
          },
        },
        axioms: {
          title: '4대 우주 공리',
          items: {
            cycle: { name: '종시일여 (Cycle)', desc: '에너지 소비 피드백을 통한 지속 가능한 순환 형성.' },
            transparency: { name: '창원실록 (Transparency)', desc: '모든 사건을 기록하여 데이터 투명성 확보.' },
            resonance: { name: '만유인력 (Resonance)', desc: '원소 인력을 규제하여 모듈 공명 촉진.' },
            balance: { name: '만능 평형 (Balance)', desc: '단일 차원의 극단을 제한하여 시스템 조화 유지.' },
          },
        },
        cornerstone: {
          title: '4대 초석 (무유오의)',
          items: {
            causality: { name: '인과율', desc: '사건의 필연적 연결을 강조하고 인과 관계를 정밀하게 추적.' },
            entropy: { name: '엔트로피 법칙', desc: '질서 있는 오케스트레이션을 통해 시스템 혼란에 대응.' },
            emergence: { name: '발현성 (Emergence)', desc: '컴포넌트 상호작용으로 생성되는 초월적인 새로운 특징.' },
            finiteness: { name: '유한성', desc: '유한한 경계 내에서 무한한 잠재력을 발굴.' },
          },
        },
      },
      elements: {
        title: '원소 법칙: 열 가지 정령',
        harmony: '원소 조화',
        description: '옴니 우주는 열 가지 핵심 원소에 의해 구동됩니다. 이 원소들은 카드와 모듈 속성을 정의하며, 복잡한 상생상극 관계를 통해 시스템 평형을 유지합니다.',
        gen: '상생 (GEN)',
        des: '상극 (DES)',
        types: {
          order: { name: '질서 (Order)', spirit: '아우렉스 (Aurex)', desc: '황금색 구현. 시스템 아키텍처, 규칙 및 정밀도를 나타냄.', generates: '사상', destroys: '성장' },
          growth: { name: '성장 (Growth)', spirit: '실파 (Sylfa)', desc: '에메랄드색 구현. 학습, 진화 및 생명력을 관장함.', generates: '행동', destroys: '안정' },
          thought: { name: '사상 (Thought)', spirit: '아콰레 (Aquare)', desc: '심해색 구현. 데이터 로직과 지식 탐구의 원천.', generates: '성장', destroys: '행동' },
          action: { name: '행동 (Action)', spirit: '파이라 (Pyra)', desc: '진홍색 구현. 실행력과 전략적 임무를 담당함.', generates: '안정', destroys: '질서' },
          stability: { name: '안정 (Stability)', spirit: '테락스 (Terrax)', desc: '갈색 구현. 인프라와 시스템 안정을 보장함.', generates: '질서', destroys: '사상' },
          guidance: { name: '인도 (Guidance)', spirit: '룩시스 (Luxis)', desc: '월백색 구현. 경로 계획과 전략적 가이드.', generates: '질서', destroys: '혼돈' },
          chaos: { name: '혼돈 (Chaos)', spirit: '닉소스 (Nyxos)', desc: '보라색 구현. 규칙을 깨고 혁신과 놀라움을 유발함.', generates: '변혁', destroys: '안정' },
          void: { name: '허무 (Void)', spirit: '널리스 (Nullis)', desc: '수정색 구현. 만능 통합과 환경 적응.', generates: '성좌', destroys: '허무' },
          change: { name: '변혁 (Change)', spirit: '템페스트 (Tempest)', desc: '청색 구현. 시스템 최적화와 동적 관리.', generates: '기계', destroys: '질서' },
          essence: { name: '본질 (Essence)', spirit: '아니마 (Anima)', desc: '바이올렛 구현. 핵심 통찰과 기억 유산.', generates: '성장', destroys: '혼돈' },
          machine: { name: '기계 (Machine)', spirit: '마키나 (Machina)', desc: '강철색 구현. 자동화 작업과 전역 연결.', generates: '안정', destroys: '본질' },
          stars: { name: '성좌 (Stars)', spirit: '아스트라 (Astra)', desc: '무지개색 구현. 차원을 초월하고 만물을 융합하는 궁극.', generates: '만능', destroys: '엔트로피' },
        },
      },
      cards: {
        title: '옴니 카드: 개념의 구체화',
        strategy: '카드화 전략',
        tierFilter: '성계',
        elementFilter: '원소',
        allTiers: '모든 성계',
        allElements: '모든 원소',
        searchPlaceholder: '카드 이름, 속성 또는 설명 검색...',
        mappingTitle: '삼계 매핑 (Tri-World Mapping)',
        cardWorld: '카드 세계 (Card World)',
        systemWorld: '시스템 세계 (System World)',
        realWorld: '현실 세계 (Real World)',
        revert: '클릭하여 뒤집기',
      },
      architecture: {
        title: '시스템 구조: 프로젝트 키메라',
        backbone: '技術的 중추',
        description: '여러 독립 애플리케이션을 통합하여 원활한 정보 동기화를 실현합니다. 이벤트 기반 및 CQRS 패턴을 결합합니다.',
        eventSourcing: { title: '이벤트 소싱 (Event Sourcing)', desc: '시스템은 상태뿐만 아니라 모든 원시 바이트 변동을 기록합니다. 이를 통해 시간 여행이 가능해집니다.' },
        consistency: { title: '최종 일관성 (Consistency)', desc: '분산 잠금 및 재시도 메커니즘을 통해 밀리초 단위의 데이터 동기화 일관성을 보장합니다.' },
      },
      evolution: {
        title: '진화 프레임워크: 지속 가능한 순환',
        sacredArtsTitle: '무한 진화 6대 성술 (Six Sacred Arts)',
        sacredArts: {
          purification: { name: '본질 정제 (Purification)', desc: '혼돈의 디지털 생각에서 가장 순수한 의도를 추출.' },
          resonance: { name: '전적 공명 (Resonance)', desc: '우주 지식과 공명하여 시스템 최적 경로를 탐색.' },
          weaving: { name: '에이전트 직조 (Weaving)', desc: '빛의 날개를 펼쳐 잠들어 있는 에이전트를 깨움.' },
          manifestation: { name: '신성 현현 (Manifestation)', desc: '임무를 수행하여 현실에서 질서를 구현.' },
          alchemy: { name: '엔트로피 연금술 (Alchemy)', desc: '혼란스러운 실행을 순수한 창조 에너지로 전환.' },
          imprinting: { name: '영원 각인 (Imprinting)', desc: '승리의 경험을 기억 성소에 각인.' },
        },
        pillarsTitle: '4대 지혜의 기둥',
        pillars: {
          simplicity: '단순성',
          speed: '속도성',
          stability: '안정성',
          evolution: '진화성',
        },
        promisesTitle: '6방향 동기화 약속',
        promises: [
          '🚀 한 번의 제출, 6방향 동기화: Capacities / Notion / Boost.space / Supabase / AITable / Upnote 통합.',
          '🔗 무마찰 통합: 모든 모듈과 서비스가 호흡처럼 자연스럽게 연결됩니다.',
          '🔒 절대 보안: 개인정보 보호와 권한 제어가 코드 유전자에 깊이 새겨져 있습니다.',
          '🧠 지능형 진화: 시스테이 스스로 복구하고 상황을 인지하여 최적화합니다.',
          '🤝 인공지능 공생: AI 가이드와 인간의 결정이 공존하는 고에너지 협업 공간.',
        ],
      },
      footer: {
        motto: '옴니 시스템 4.0.0 · 하나가 곧 전체 · 삼라만상',
        copyright: '© 2026 프라임 아키텍트. 지각 능력 활성화됨.',
      },
    },
  },

  mvp: {
    hub: {
      title: 'Omni All-In-One Hub',
      subtitle: 'Universal Entrance for InfoOne MVP & Awakening',
      allModules: '모든 모듈',
      esgCore: 'ESG 코어',
      aiTech: 'AI 기술',
      system: '시스템 콘솔'
    },
    modules: {
      reportCenter: {
        title: '보고서 센터',
        desc: '고급 OCR, GRI 준수 확인 및 AI 기반 보고서 생성.'
      },
      intelligence: {
        title: '인텔 센터',
        desc: '실시간 시장 동향, 규제 업데이트 및 Dr. Thoth 통찰.'
      },
      avatar: {
        title: '에이전틱 트윈',
        desc: '능력 매트릭스 및 진화 추적이 가능한 디지털 영혼 그릇.'
      },
      personalHub: {
        title: '퍼스널 허브',
        desc: '주권 신원, 개인 저장소 및 북극성 설정 관리.'
      },
      village: {
        title: '지속 가능한 빌리지',
        desc: 'ESG 지표를 건설 에너지로 변환하는 ARPG 스타일 인터페이스.'
      },
      backend: {
        title: '옴니 백엔드',
        desc: '심층 모니터링, 데이터 관리 및 시스템 콘솔.'
      }
    }
  },
};
