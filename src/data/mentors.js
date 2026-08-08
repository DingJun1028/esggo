/**
 * Berkeley ESG Consulting Lab Mentor 介紹資料。
 *
 * 每個 Mentor 物件使用以下欄位命名規則：
 * - track / positions / bio / expertise 為语系後綴版本。
 *   例：trackZhTw 為繁體中文、trackZhCn 為簡體中文、trackEn 為英文。
 */

const mentors = [
  {
    id: 'kashibadze',
    name: 'Irakli Kashibadze',
    trackZhTw: '策略與創新諮詢室',
    trackZhCn: '策略与创新咨询室',
    trackEn: 'Strategy & Innovation Lab',
    positionsZhTw: [
      'Future Laboratory Ventures 執行合夥人（Managing Partner）',
      '喬治亞創新技術局 (GITA) 創辦人暨前主席',
      '加州大學柏克萊分校 Haas 商學院 創新研究中心客座研究員',
    ],
    positionsZhCn: [
      'Future Laboratory Ventures 执行合伙人（Managing Partner）',
      '乔治亚创新技术局 (GITA) 创办人暨前主席',
      '加州大学柏克莱分校 Haas 商学院 创新研究中心客座研究员',
    ],
    positionsEn: [
      'Managing Partner, Future Laboratory Ventures',
      'Founder & Former Chairman, Georgian Innovation and Technology Agency (GITA)',
      'Visiting Researcher, UC Berkeley Haas Institute for Business Innovation',
    ],
    bioZhTw: `Irakli Kashibadze 是一位享譽國際的創新生態系統建構者、創投家與科技政策專家。他目前擔任 Future Laboratory Ventures 的執行合夥人，致力於發掘、投資並加速具有潛力的早期科技新創企業，推動區域性的數位轉型。

在進入創投領域之前，Irakli 是喬治亞共和國科技創新發展的關鍵推手。他創辦了喬治亞創新技術局 (GITA) 並擔任首任主席。在任職期間，他成功制定了國家級的創新政策、建立科技園區網絡、引進早期新創資助機制，並將喬治亞打造成高加索地區的區域創新樞紐。

此外，他積極參與國際學術與前沿創新研究，曾擔任加州大學柏克萊分校 Haas 商學院的客座研究員，將矽谷的創新思維與全球最佳實踐經驗相結合。他長期為各國政府、企業及國際組織提供關於數位經濟、創業生態系建構以及前瞻科技應用的戰略諮詢。`,
    bioZhCn: `Irakli Kashibadze 是一位享誉国际的创新创业生态系统建构者、创投家与科技政策专家。他目前担任 Future Laboratory Ventures 的执行合伙人，致力于发掘、投资并加速具有潜力的早期科技新创企业，推动区域性数位转型。

在进入创投领域之前，Irakli 是乔治亚共和国科技创新发展的关键推手。他创办了乔治亚创新技术局 (GITA) 并担任首任主席。在任职期间，他成功制定了国家级的创新政策、建立科技园区网络、引进早期新创资助机制，并将乔治亚打造成高加索地区的区域创新枢纽。

此外，他积极参与国际学术与前沿创新研究，曾任加州大学柏克莱分校 Haas 商学院创新研究中心的客座研究员，将矽谷的创新思维与全球最佳实践经验相结合。他长期为各国政府、企业及国际组织提供关于数位经济、创业生态系统建构以及前瞻科技应用的策略咨询。`,
    bioEn: `Irakli Kashibadze is an internationally recognized innovation ecosystem builder, venture investor, and science and technology policy expert. He currently serves as Managing Partner of Future Laboratory Ventures, where he discovers, invests in, and accelerates promising early-stage technology startups while advancing regional digital transformation.

Prior to venture investing, Irakli was a key force behind Georgia's technology and innovation development. He founded the Georgian Innovation and Technology Agency (GITA) and served as its first chairman. During his tenure, he designed national innovation policy, established a science park network, launched early-stage startup funding mechanisms, and turned Georgia into a regional innovation hub in the South Caucasus.

He also participates actively in international academic and frontier innovation research, and has served as a visiting researcher at the UC Berkeley Haas Institute for Business Innovation, bringing Silicon Valley innovation thinking and global best practices together. He regularly advises governments, corporations, and international organizations on digital economy strategy, entrepreneurship ecosystem building, and emerging-technology application.`,
    expertiseZhTw: [
      '創新經濟與科技政策制定',
      '早期創業投資與孵化（Venture Capital）',
      '國家級創新生態系統建構',
      '企業數位轉型策略',
    ],
    expertiseZhCn: [
      '创新经济与科技政策制定',
      '早期创业投资与孵化（Venture Capital）',
      '国家级创新生态系统建构',
      '企业数位转型策略',
    ],
    expertiseEn: [
      'Innovation economy and science and technology policy design',
      'Early-stage venture investing and incubation',
      'National innovation ecosystem building',
      'Enterprise digital transformation strategy',
    ],
  },
  {
    id: 'radhakrishnan',
    name: 'Dr. Chandra Vadhana Radhakrishnan',
    trackZhTw: '轉型實務諮詢室',
    trackZhCn: '转型实务咨询室',
    trackEn: 'Transformation Practice Lab',
    positionsZhTw: [
      '聯合國貿發會議 (UNCTAD) Empretec 女性商業獎得主',
      '史丹佛大學博士後研究員（傅爾布萊特學者）',
      '澳洲莫納什大學 (Monash University) 創業與創新高級講師',
      'Prayaana Labs、SheBusiness.net、SheSight Global、EcoCaptain 創辦人',
    ],
    positionsZhCn: [
      '联合国贸发会议 (UNCTAD) Empretec 女性商业奖得主',
      '史丹佛大学博士后研究员（傅尔布莱特学者）',
      '澳洲莫纳什大学 (Monash University) 创业与创新高级讲师',
      'Prayaana Labs、SheBusiness.net、SheSight Global、EcoCaptain 创办人',
    ],
    positionsEn: [
      'UNCTAD Empretec Women in Business Award winner',
      'Stanford University Postdoctoral Researcher (Fulbright Scholar)',
      'Senior Lecturer in Entrepreneurship & Innovation, Monash Business School',
      'Founder, Prayaana Labs, SheBusiness.net, SheSight Global, and EcoCaptain',
    ],
    bioZhTw: `Dr. Chandra Vadhana Radhakrishnan（常被親切地稱為 Dr. CeeVee）是一位享譽國際的學者、連續創業家與永續創新推手。她的足跡橫跨三大洲，在長達 20 多年的職涯中，她成功將學術研究、企業管理與社會影響力完美結合。

在學術領域，Dr. CeeVee 擁有管理學（心理計量學）博士學位。她曾以傅爾布萊特學者的身份前往史丹佛大學進行博士後研究，並在當地開發了創新的「再生新創評估框架（Regenerative Startups Assessment Framework）」，致力於為創業生態系注入社會平權與永續基因。她目前在澳洲墨爾本的莫納什大學擔任創業與創新高級講師。

作為一名深具社會責任感的企業家，她創立了包含 Prayaana Labs、SheBusiness.net、SheSight Global、EcoCaptain 在內的 7 家社會企業與機構，積極為女性創業者與影響力驅動型企業提供孵化、導師指導與資金支持。

她對社會創新的卓越貢獻使她於 2018 年榮獲聯合國貿發會議頒發的「女性商業獎（社會創業類別）」，成為第一位獲得該獎項的印度女性。Dr. CeeVee 也是一位活躍的國際演說家，曾受邀至聯合國、史丹佛大學等 200 多個全球舞台發表演說，同時也是一名出版過多本詩集與自助書籍的跨界作家。`,
    bioZhCn: `Dr. Chandra Vadhana Radhakrishnan（常被亲切地称为 Dr. CeeVee）是一位享誉国际的学者、连续创业家与永续创新推手。她的足迹横跨三大洲，在长达 20 多年的职涯中，她成功将学术研究、企业管理与社会影响力完美结合。

在学术领域，Dr. CeeVee 拥有管理学（心理计量学）博士学位。她曾以傅尔布莱特学者的身份前往史丹佛大学进行博士后研究，并在当地开发了创新的「再生新创评估框架（Regenerative Startups Assessment Framework）」，致力于为创业生态系注入社会平权与永续基因。她目前在澳洲墨尔本的莫纳什大学担任创业与创新高级讲师。

作为一名深具社会责任感的企业家，她创立了包含 Prayaana Labs、SheBusiness.net、SheSight Global、EcoCaptain 在内的 7 家社会企业与机构，积极为女性创业者与影响力驱动型企业提供孵化、导师指导与资金支持。

她对社会创新的卓越贡献使她于 2018 年荣膺联合国贸发会议颁发的「女性商业奖（社会创业类别）」，成为第一位获得该奖项的印度女性。Dr. CeeVee 也是一位活跃的国际演说家，曾受邀至联合国、史丹佛大学等 200 多个全球舞台发表演说，同时也是一名出版过多本诗集与自助书籍的跨界作家。`,
    bioEn: `Dr. Chandra Vadhana Radhakrishnan, often called Dr. CeeVee, is an internationally recognized academic, serial entrepreneur, and sustainable innovation advocate. Across more than two decades and three continents, she combines academic research, business leadership, and social impact.

She holds a doctorate in management with a focus on psychometrics. As a Fulbright Scholar at Stanford University, she developed the Regenerative Startups Assessment Framework, embedding social equity and sustainability into startup evaluation. She is currently a Senior Lecturer in entrepreneurship and innovation at Monash Business School in Melbourne, Australia.

She has founded seven social enterprises and institutions—including Prayaana Labs, SheBusiness.net, SheSight Global, and EcoCaptain—that provide incubation, mentorship, and funding support for women founders and impact-driven ventures.

In 2018, she became the first Indian woman to win the UNCTAD Empretec Women in Business Award in the social entrepreneurship category. Dr. CeeVee is also an active international speaker who has addressed more than 200 global stages, including the United Nations and Stanford University, and is a cross-disciplinary published author of poetry and self-help books.`,
    expertiseZhTw: [
      '永續創業與社會創新',
      '再生新創評估框架（Regenerative Startups Assessment Framework）',
      '女性創業支持與影響力企業孵化',
      '跨洲學術、企業、政策與國際倡議整合',
    ],
    expertiseZhCn: [
      '永续创业与社会创新',
      '再生新创评估框架（Regenerative Startups Assessment Framework）',
      '女性创业支持与影响力企业孵化',
      '跨洲学术、企业、政策与国际倡议整合',
    ],
    expertiseEn: [
      'Sustainable entrepreneurship and social innovation',
      'Regenerative Startups Assessment Framework',
      'Women entrepreneurship support and impact-venture incubation',
      'Cross-continental academic, corporate, policy, and advocacy integration',
    ],
  },
];

export default mentors;
