// app/map/_menus.ts

export type Menu = {
  id: string;
  boothId: string;
  name: string;
  price: number;
  spiciness: number; // 0~4
  imageUrl: string;
  halalCertified?: boolean;
  containsPork?: boolean;
  containsAlcohol?: boolean;
  containsBeef?: boolean;
  containsShellfish?: boolean;
  allergens?: Array<"nuts" | "dairy" | "gluten" | "egg" | "soy" | "seafood">;
  description: string;
  steps: string[];
};

/**
 * 이미지 링크는 Unsplash 등 퍼블릭 이미지를 사용했습니다.
 * 필요 시 자체 CDN/스토리지로 교체하세요.
 */

export const MENUS: Record<string, Menu[]> = {
  /** =======================
   * B01: Halal Kebab House
   * ======================= */
  B01: [
    {
      id: "M01",
      boothId: "B01",
      name: "치킨 케밥 랩",
      price: 9000,
      spiciness: 2,
      halalCertified: true,
      allergens: ["dairy", "gluten"],
      imageUrl:
        "https://img.freepik.com/premium-photo/chicken-wrap-roll-durum-doner-kebab-with-meat-vegetable-salad-wooden-background-top-view_89816-46822.jpg",
      description: "그릴 치킨과 신선한 채소, 요거트 소스를 또띠아에 감싼 정통 스타일 케밥 랩.",
      steps: [
        "닭다리살을 요거트·레몬·향신료(커민, 코리앤더)로 2시간 이상 마리네이드합니다.",
        "고열의 그릴에서 치킨 표면을 먼저 강하게 구워 육즙을 가둡니다.",
        "또띠아를 데워 부드럽게 만듭니다.",
        "양상추·토마토·양파를 얇게 썰어 물기를 제거합니다.",
        "또띠아 위에 채소→치킨→요거트 소스 순서로 올립니다.",
        "단단히 말아 반으로 컷팅하고, 포장지로 감싸 완성합니다.",
      ],
    },
    {
      id: "M02",
      boothId: "B01",
      name: "비프 케밥 플레이트",
      price: 12000,
      spiciness: 2,
      halalCertified: true,
      containsBeef: true,
      allergens: ["gluten"],
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
      description: "향신료로 밑간한 비프 케밥, 터머릭 라이스, 샐러드가 한 접시에.",
      steps: [
        "비프 큐브를 올리브오일·파프리카·갈릭·소금으로 마리네이드(30분).",
        "금속 꼬치에 비프를 꽂고 중앙부 62℃까지 굽습니다.",
        "터머릭 라이스를 뜸 들여 고슬하게 준비합니다.",
        "샐러드는 올리브오일·레몬·소금으로 가볍게 버무립니다.",
        "플레이트에 라이스→비프→샐러드→소스(화이트/레드)를 담아 냅니다.",
      ],
    },
    {
      id: "M03",
      boothId: "B01",
      name: "팔라펠 랩(비건)",
      price: 8000,
      spiciness: 1,
      halalCertified: true,
      allergens: ["gluten"],
      imageUrl:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
      description: "병아리콩과 허브로 만든 팔라펠을 타히니 소스와 함께 또띠아에.",
      steps: [
        "불린 병아리콩을 양파·마늘·파슬리와 함께 굵게 갈아 반죽을 만듭니다.",
        "베이킹파우더·소금·후추로 간하고 30분 휴지.",
        "180℃ 오일에서 3~4분 황금색이 될 때까지 튀깁니다.",
        "또띠아에 샐러드 채소를 깔고 팔라펠을 올립니다.",
        "타히니 소스를 뿌리고 단단히 말아 컷팅합니다.",
      ],
    },
    {
      id: "M04",
      boothId: "B01",
      name: "램 케밥 라이스볼",
      price: 13000,
      spiciness: 2,
      halalCertified: true,
      containsBeef: false,
      imageUrl:
        "https://storage.googleapis.com/takeapp/media/cm2w4igjf00050ci92mp8479y.jpg",
      description: "부드러운 양고기 케밥과 허브 라이스, 피클이 조화로운 보울.",
      steps: [
        "양고기를 로즈마리·타임·갈릭으로 2시간 마리네이드합니다.",
        "팬 시어링으로 겉면을 바삭하게 굽고 레스팅 5분.",
        "허브 라이스(파슬리, 레몬제스트)를 따뜻하게 준비합니다.",
        "보울에 라이스→램→피클→화이트 소스 순으로 담습니다.",
        "파프리카 파우더로 마무리합니다.",
      ],
    },
    {
      id: "M05",
      boothId: "B01",
      name: "후무스 & 피타",
      price: 6000,
      spiciness: 0,
      halalCertified: true,
      allergens: ["gluten"],
      imageUrl:
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop",
      description: "집에서 만든 크리미한 후무스에 따끈한 피타 브레드를 곁들인 사이드.",
      steps: [
        "삶은 병아리콩을 타히니·레몬즙·올리브오일·마늘과 함께 곱게 블렌딩.",
        "소금으로 간을 맞추고 냉장 휴지 30분.",
        "피타를 살짝 데워 결을 살립니다.",
        "접시에 후무스를 펴 바르고 올리브오일·파프리카 파우더 뿌리기.",
        "피타를 컷팅해 곁들입니다.",
      ],
    },
  ],

  /** =======================
   * B02: Seoul Tteokbokki
   * ======================= */
  B02: [
    {
      id: "M06",
      boothId: "B02",
      name: "오리지널 떡볶이",
      price: 5000,
      spiciness: 4,
      allergens: ["gluten", "seafood"],
      imageUrl:
        "https://images.unsplash.com/photo-1550409174-2d2e1bcd85f0?q=80&w=1200&auto=format&fit=crop",
      description: "쌀떡과 어묵, 고추장 소스가 어우러진 대표 메뉴.",
      steps: [
        "멸치·다시마로 기본 육수를 15분 끓여 준비합니다.",
        "고추장·고춧가루·간장·설탕으로 양념장을 만듭니다.",
        "떡을 미지근한 물에 10분 불려 둡니다.",
        "팬에 육수+양념장을 넣고 끓이다 떡과 어묵 투입.",
        "점도 날 때까지 졸이고 파/참깨로 마무리.",
      ],
    },
    {
      id: "M07",
      boothId: "B02",
      name: "순한 떡볶이",
      price: 5000,
      spiciness: 2,
      allergens: ["gluten", "seafood"],
      imageUrl:
        "https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=1200&auto=format&fit=crop",
      description: "고춧가루 비율을 낮춘 부드러운 버전.",
      steps: [
        "기본 육수를 준비하고 설탕은 살짝 줄입니다.",
        "고추장 비율을 60%로 낮춘 양념장을 만듭니다.",
        "떡·어묵을 넣고 은근하게 졸입니다.",
        "모짜렐라 토핑 추가 옵션(알레르기: 유제품).",
        "파 송송 올려 서빙합니다.",
      ],
    },
    {
      id: "M08",
      boothId: "B02",
      name: "로제 떡볶이",
      price: 7000,
      spiciness: 2,
      allergens: ["gluten", "dairy", "seafood"],
      imageUrl:
        "https://images.unsplash.com/photo-1613478223719-2ae4b9c4ca67?q=80&w=1200&auto=format&fit=crop",
      description: "크림과 토마토를 더해 매콤·고소한 로제 스타일.",
      steps: [
        "팬에 버터를 녹여 다진 마늘을 볶습니다.",
        "크림+우유+토마토 소스를 넣어 뻑뻑하지 않게 조절.",
        "기본 양념장과 섞어 로제 베이스 완성.",
        "떡·어묵을 넣고 3~4분 졸입니다.",
        "파마산을 살짝 뿌려 마무리.",
      ],
    },
    {
      id: "M09",
      boothId: "B02",
      name: "튀김 모둠",
      price: 5000,
      spiciness: 0,
      allergens: ["gluten", "egg", "seafood"],
      imageUrl:
        "https://images.unsplash.com/photo-1617093727343-374698b1f8b6?q=80&w=1200&auto=format&fit=crop",
      description: "야채·김말이·오징어 등 바삭한 튀김 모둠.",
      steps: [
        "튀김 반죽(박력분, 차가운 탄산수, 달걀)을 잘 섞어 둡니다.",
        "재료에 가볍게 반죽을 입힙니다.",
        "175℃ 기름에 바삭하게 튀깁니다.",
        "철망에서 기름을 빼고 소금 간.",
        "떡볶이 국물에 찍어 먹도록 서빙.",
      ],
    },
    {
      id: "M10",
      boothId: "B02",
      name: "어묵 국물",
      price: 3000,
      spiciness: 0,
      allergens: ["seafood", "gluten"],
      imageUrl:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop",
      description: "따끈한 다시 국물에 꼬치 어묵을 곁들인 사이드.",
      steps: [
        "멸치·다시마·건새우로 육수를 20분 끓입니다.",
        "간장·소금으로 간을 맞춥니다.",
        "어묵 꼬치를 데쳐 비린내 제거.",
        "컵에 육수와 어묵을 담고 다진 파를 올립니다.",
      ],
    },
  ],

  /** =======================
   * B03: BBQ Pork Bun
   * ======================= */
  B03: [
    {
      id: "M11",
      boothId: "B03",
      name: "BBQ 포크 번",
      price: 4000,
      spiciness: 1,
      containsPork: true,
      allergens: ["gluten", "soy"],
      imageUrl:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
      description: "달콤 짭짤한 차슈 스타일 돼지고기 번.",
      steps: [
        "돼지고기를 간장·설탕·오이스터소스·오향분으로 조리.",
        "고기를 잘게 찢어 소스와 버무립니다.",
        "번 반죽을 둥글게 성형해 발효.",
        "속을 채워 스팀에 10~12분 찝니다.",
        "따뜻할 때 제공.",
      ],
    },
    {
      id: "M12",
      boothId: "B03",
      name: "치킨 번",
      price: 3800,
      spiciness: 1,
      allergens: ["gluten", "soy"],
      imageUrl:
        "https://png.pngtree.com/png-clipart/20250126/original/pngtree-burger-featuring-a-golden-brown-bun-tender-chicken-png-image_20332406.png",
      description: "간장 베이스 닭고기 소를 넣은 번.",
      steps: [
        "닭고기를 간장·마늘·생강으로 볶아 수분을 날립니다.",
        "번 반죽에 소를 채워 성형.",
        "스팀에 10분 찐 뒤 표면 광택을 살립니다.",
      ],
    },
    {
      id: "M13",
      boothId: "B03",
      name: "야채 번",
      price: 3500,
      spiciness: 0,
      allergens: ["gluten", "soy"],
      imageUrl:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop",
      description: "양배추·당근·표고로 만든 담백한 번.",
      steps: [
        "채소를 잘게 썰어 팬에서 수분을 날리며 볶습니다.",
        "간장·참기름으로 간하고 식혀 둡니다.",
        "반죽에 채워 스팀 8~10분.",
      ],
    },
    {
      id: "M14",
      boothId: "B03",
      name: "홍두병(단팥 번)",
      price: 3500,
      spiciness: 0,
      allergens: ["gluten"],
      imageUrl:
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1200&auto=format&fit=crop",
      description: "달큰한 팥소를 넣은 스윗 번.",
      steps: [
        "팥소를 적당한 농도로 졸입니다.",
        "반죽에 팥소를 넣고 매끈하게 성형.",
        "스팀으로 부드럽게 찝니다.",
      ],
    },
  ],

  /** =======================
   * B04: Curry & Naan
   * ======================= */
  B04: [
    {
      id: "M15",
      boothId: "B04",
      name: "버터 치킨",
      price: 11000,
      spiciness: 2,
      halalCertified: true,
      allergens: ["dairy"],
      imageUrl:
        "https://recipe1.ezmember.co.kr/cache/recipe/2021/08/18/afef7d74461185cadc62bc27f86e1a001.jpg",
      description: "크리미한 토마토·버터 소스의 부드러운 치킨 커리.",
      steps: [
        "치킨을 탄두리 마살라로 마리네이드(2시간).",
        "팬에서 치킨을 부분 조리해 향을 내고 건져 둡니다.",
        "버터에 토마토퓨레·가람마살라·생크림을 넣고 끓입니다.",
        "치킨을 넣고 약불로 5분 졸입니다.",
        "버터 한 조각으로 광택을 내며 마무리.",
      ],
    },
    {
      id: "M16",
      boothId: "B04",
      name: "치킨 티카 마살라",
      price: 12000,
      spiciness: 3,
      halalCertified: true,
      allergens: ["dairy"],
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
      description: "향신료 가득한 오렌지빛 소스의 치킨 티카.",
      steps: [
        "요거트·마살라에 치킨을 재우고 꼬치 구이로 그릴 마크를 냅니다.",
        "양파·토마토를 볶아 베이스를 만들고 향신료를 더합니다.",
        "크림을 넣어 점도를 조절하고 치킨을 넣어 끓입니다.",
        "코리앤더로 마무리.",
      ],
    },
    {
      id: "M17",
      boothId: "B04",
      name: "베지터블 커리(비건)",
      price: 10000,
      spiciness: 2,
      imageUrl:
        "https://recipe1.ezmember.co.kr/cache/recipe/2022/11/09/aaed0982a55d762fe1b92c6e1cbc2a1e1.jpg",
      description: "제철 채소로 만든 가벼운 코코넛 커리.",
      steps: [
        "코코넛 밀크와 커리 페이스트를 끓입니다.",
        "감자·당근·브로콜리를 순서대로 넣어 익힘 정도를 맞춥니다.",
        "소금으로 간하고 라임즙으로 상큼함 추가.",
      ],
    },
    {
      id: "M18",
      boothId: "B04",
      name: "갈릭 난",
      price: 3000,
      spiciness: 0,
      halalCertified: true,
      allergens: ["gluten", "dairy"],
      imageUrl:
        "https://images.unsplash.com/photo-1625944527935-4a43b0135b3c?q=80&w=1200&auto=format&fit=crop",
      description: "마늘 버터 향이 진한 화덕 난.",
      steps: [
        "반죽을 1시간 발효.",
        "화덕 벽면에 붙여 60~90초 고온 구이.",
        "마늘 버터를 발라 향을 입힙니다.",
      ],
    },
    {
      id: "M19",
      boothId: "B04",
      name: "라씨(요거트 음료)",
      price: 4000,
      spiciness: 0,
      allergens: ["dairy"],
      imageUrl:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop",
      description: "달콤하고 부드러운 망고 라씨.",
      steps: [
        "플레인 요거트·망고퓨레·꿀을 블렌딩.",
        "우유로 농도 조절 후 차게 보관.",
        "얼음과 함께 서빙.",
      ],
    },
  ],

  /** =======================
   * B05: Korean Beef Skewer
   * ======================= */
  B05: [
    {
      id: "M20",
      boothId: "B05",
      name: "비프 꼬치",
      price: 9000,
      spiciness: 2,
      containsBeef: true,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYCHP5Fs-rPukeNHujXkLk2DBLXupxi9q1mg&s",
      description: "숯불 향이 살아 있는 소고기 꼬치.",
      steps: [
        "비프 큐브를 간장·설탕·마늘·후추로 마리네이드(1시간).",
        "꼬치에 고기와 파를 번갈아 꽂습니다.",
        "강한 화력에서 앞뒤로 짧게 굽고 레스팅.",
        "윤기를 위해 간장 글레이즈를 살짝 바릅니다.",
      ],
    },
    {
      id: "M21",
      boothId: "B05",
      name: "치킨 꼬치",
      price: 8000,
      spiciness: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-8a4f9b7e4fc2?q=80&w=1200&auto=format&fit=crop",
      description: "담백한 닭꼬치, 간장 글레이즈.",
      steps: [
        "닭다리살을 깍둑 썰기 후 간장 베이스로 30분 마리네이드.",
        "강화열에서 겉면을 먼저 구워 육즙을 잠급니다.",
        "글레이즈를 발라가며 2~3분 더 구워 마무리.",
      ],
    },
    {
      id: "M22",
      boothId: "B05",
      name: "야채 꼬치",
      price: 7000,
      spiciness: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1514514521170-2fb33f0b0e1c?q=80&w=1200&auto=format&fit=crop",
      description: "파프리카·양파·버섯을 그릴링한 채소 꼬치.",
      steps: [
        "채소를 큼직하게 잘라 꼬치에 꽂습니다.",
        "올리브오일·소금·후추로 간합니다.",
        "그릴에서 각 면을 빠르게 구워 단맛을 끌어올립니다.",
      ],
    },
    {
      id: "M23",
      boothId: "B05",
      name: "라이스볼 콤보",
      price: 9500,
      spiciness: 2,
      containsBeef: true,
      imageUrl:
        "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1200&auto=format&fit=crop",
      description: "비프/치킨 꼬치 선택 + 라이스/샐러드 구성.",
      steps: [
        "기본 라이스를 그릇에 담습니다.",
        "선택한 꼬치를 먹기 좋은 크기로 잘라 올립니다.",
        "샐러드와 소스를 곁들여 완성.",
      ],
    },
  ],

  /** =======================
   * B06: Seafood Tempura
   * ======================= */
  B06: [
    {
      id: "M24",
      boothId: "B06",
      name: "새우 튀김",
      price: 7000,
      spiciness: 0,
      containsShellfish: true,
      allergens: ["seafood", "gluten", "egg"],
      imageUrl:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop",
      description: "겉은 바삭, 속은 탱글한 새우튀김.",
      steps: [
        "새우 껍질과 내장을 제거하고 키친타월로 물기 제거.",
        "차가운 반죽(박력분+얼음물+달걀)을 얇게 입힙니다.",
        "175℃ 오일에서 2분 30초 튀깁니다.",
        "철망에서 기름을 빼고 소금으로 간.",
      ],
    },
    {
      id: "M25",
      boothId: "B06",
      name: "야채 튀김",
      price: 6000,
      spiciness: 0,
      allergens: ["gluten", "egg"],
      imageUrl:
        "https://images.unsplash.com/photo-1586201375754-1421e0aa2fda?q=80&w=1200&auto=format&fit=crop",
      description: "제철 야채의 식감을 살린 모둠 튀김.",
      steps: [
        "야채를 동일한 두께로 썰어 수분 제거.",
        "차가운 반죽을 가볍게 묻혀 175℃에서 바삭하게.",
        "기름을 빼고 텐츠유/소금과 함께 제공합니다.",
      ],
    },
    {
      id: "M26",
      boothId: "B06",
      name: "우동(가쓰오 베이스)",
      price: 8000,
      spiciness: 0,
      allergens: ["gluten", "seafood", "soy"],
      imageUrl:
        "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop",
      description: "따끈한 가쓰오·다시마 베이스의 우동.",
      steps: [
        "가쓰오부시·다시마로 맑은 국물을 냅니다.",
        "우동 면을 별도로 삶아 찬물에 헹굽니다.",
        "그릇에 면→육수→대파·유부 순으로 담습니다.",
      ],
    },
    {
      id: "M27",
      boothId: "B06",
      name: "연어 라이스볼",
      price: 9500,
      spiciness: 0,
      allergens: ["seafood", "soy"],
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-84d6c1e6e8f1?q=80&w=1200&auto=format&fit=crop",
      description: "구운 연어와 밥, 간장 소스의 단정한 그릇.",
      steps: [
        "연어를 소금·후추로 간하고 팬에서 겉바속촉 굽습니다.",
        "밥 위에 연어를 올리고 간장 소스를 살짝.",
        "김가루·참깨로 향을 더합니다.",
      ],
    },
  ],

  /** =======================
   * B07: Non-Alcohol Mojito
   * ======================= */
  B07: [
    {
      id: "M28",
      boothId: "B07",
      name: "버진 모히또",
      price: 6000,
      spiciness: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?q=80&w=1200&auto=format&fit=crop",
      description: "라임·민트로 만드는 상큼한 무알코올 모히또.",
      steps: [
        "라임 웨지를 머들러로 으깨 즙을 냅니다.",
        "민트 잎·설탕을 넣고 살짝만 머들링.",
        "얼음을 채우고 탄산수를 붓습니다.",
        "가볍게 저어 민트로 데코.",
      ],
    },
    {
      id: "M29",
      boothId: "B07",
      name: "레모네이드",
      price: 5000,
      spiciness: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1200&auto=format&fit=crop",
      description: "달콤 새콤한 베이직 레모네이드.",
      steps: [
        "레몬즙·설탕시럽·물 비율(1:1:3)로 섞습니다.",
        "얼음을 넣고 잘 저은 뒤 레몬 슬라이스로 장식.",
      ],
    },
    {
      id: "M30",
      boothId: "B07",
      name: "복숭아 아이스티",
      price: 5000,
      spiciness: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?q=80&w=1200&auto=format&fit=crop",
      description: "홍차 베이스에 복숭아 시럽을 더한 향긋한 아이스티.",
      steps: [
        "홍차를 진하게 우려 냉장 보관.",
        "복숭아 시럽과 혼합해 농도 맞춤.",
        "얼음에 붓고 레몬/민트로 마무리.",
      ],
    },
    {
      id: "M31",
      boothId: "B07",
      name: "스파클링 워터",
      price: 3000,
      spiciness: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1544126592-67e6200d0a24?q=80&w=1200&auto=format&fit=crop",
      description: "깔끔한 탄산수. 라임 추가 가능.",
      steps: ["차가운 잔에 얼음→탄산수→라임즙 순으로 붓고 가볍게 저어 서빙."],
    },
  ],

  /** =======================
   * B08: Local Festival Set
   * ======================= */
  B08: [
    {
      id: "M32",
      boothId: "B08",
      name: "로컬 세트(막걸리 포함)",
      price: 15000,
      spiciness: 2,
      containsAlcohol: true,
      imageUrl:
        "https://images.unsplash.com/photo-1611211510519-28a8972e61a1?q=80&w=1200&auto=format&fit=crop",
      description: "지역 대표 안주 + 막걸리 구성의 로컬 세트.",
      steps: [
        "메인 안주(전/볶음 등)를 조리합니다.",
        "반찬 2종을 접시에 배치.",
        "차갑게 보관한 막걸리를 잔과 함께 제공합니다.",
      ],
    },
    {
      id: "M33",
      boothId: "B08",
      name: "로컬 세트(무알콜)",
      price: 14000,
      spiciness: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
      description: "막걸리 대신 논알콜 음료를 제공하는 세트.",
      steps: [
        "메인 안주 조리.",
        "부가 반찬과 함께 플레이트 구성.",
        "탄산수/무알콜 음료를 곁들여 제공합니다.",
      ],
    },
    {
      id: "M34",
      boothId: "B08",
      name: "김치전",
      price: 8000,
      spiciness: 1,
      allergens: ["gluten"],
      imageUrl:
        "https://images.unsplash.com/photo-1611817755603-01f09f72f2c4?q=80&w=1200&auto=format&fit=crop",
      description: "겉바속촉 김치전.",
      steps: [
        "김치와 대파를 잘게 썹니다.",
        "부침가루·물 비율(1:1.2)로 반죽 후 김치를 섞어줍니다.",
        "팬에 기름을 두르고 넓게 부쳐 가장자리를 바삭하게.",
        "뒤집어 한 번 더 굽고 썰어 서빙.",
      ],
    },
    {
      id: "M35",
      boothId: "B08",
      name: "삼겹살 구이",
      price: 12000,
      spiciness: 1,
      containsPork: true,
      imageUrl:
        "https://images.unsplash.com/photo-1604908554023-9424b8bade43?q=80&w=1200&auto=format&fit=crop",
      description: "노릇하게 구운 삼겹살, 쌈과 함께.",
      steps: [
        "삼겹살을 상온에 10분 둔 뒤 소금·후추 간.",
        "강한 화력으로 한 면씩 충분히 구워 지방을 바삭하게.",
        "먹기 좋게 썰어 쌈채소와 함께 제공합니다.",
      ],
    },
    {
      id: "M36",
      boothId: "B08",
      name: "불고기 라이스볼",
      price: 9000,
      spiciness: 1,
      containsBeef: true,
      allergens: ["soy"],
      imageUrl:
        "https://images.unsplash.com/photo-1630383249896-582c819a7b8a?q=80&w=1200&auto=format&fit=crop",
      description: "달큰짭짤한 불고기를 밥 위에 듬뿍.",
      steps: [
        "얇은 소고기를 간장·설탕·참기름·마늘에 30분 재웁니다.",
        "팬에서 센 불로 빠르게 볶아 육즙을 살립니다.",
        "밥 위에 올리고 김가루·참깨로 마무리.",
      ],
    },
  ],
};
