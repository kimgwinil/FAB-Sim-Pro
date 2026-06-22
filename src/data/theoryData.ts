export const theoryData = {
  dicing: {
    en: {
      title: "Wafer Dicing: Fracture Mechanics & Thermal Dynamics",
      content: `The wafer dicing process is fundamentally governed by the principles of fracture mechanics and tribology. As the diamond-impregnated resin or nickel blade rotates at extreme angular velocities ($v = r \\omega$, typically 30,000–60,000 RPM), the diamond abrasive grits microscopically shear the silicon lattice. 

In single-crystal silicon ($Si$), the diamond cubic structure makes it brittle. The critical stress intensity factor (fracture toughness, $K_{Ic}$) is approximately $0.7 \\sim 0.9 \\text{ MPa}\\sqrt{\\text{m}}$. When the cutting force normal exceeds this threshold, micro-cracks propagate along the cleavage planes (mostly $\\{111\\}$ planes).

Coolant flow is a critical thermodynamic parameter to dissipate the frictional heat generated at the blade-wafer interface. Failure to maintain nucleate boiling regimes leads to localized film boiling, causing catastrophic thermal expansion of the blade ($Q = mc \\Delta T$) and subsequent blade warping, manifesting as backside chipping or die crack.`
    },
    ko: {
      title: "웨이퍼 절단: 파괴 역학 및 열역학",
      content: `웨이퍼 절단(Dicing) 공정은 근본적으로 파괴 역학(Fracture Mechanics) 및 마찰학(Tribology) 원리의 지배를 받습니다. 다이아몬드가 함유된 레진 도는 니켈 블레이드가 극도의 각속도($v = r \\omega$, 초당 30,000~60,000 RPM 범주)로 회전할 때, 다이아몬드 연마 입자가 실리콘 격자를 미시적으로 전단(Shear)합니다.

단결정 실리콘($Si$)에서 다이아몬드 입방 구조는 취성(Brittle)을 갖게 합니다. 임계 응력 확대 계수(파괴 인성, $K_{Ic}$)는 약 $0.7 \\sim 0.9 \\text{ MPa}\\sqrt{\\text{m}}$입니다. 수직 절단력이 이 임계값을 초과하면 벽개면(주로 $\\{111\\}$ 결정면)을 따라 미세 균열이 전파됩니다.

냉각수 유량은 블레이드-웨이퍼 계면에서 발생하는 마찰열을 소산시키기 위한 중요한 열역학적 매개변수입니다. 핵비등(Nucleate boiling) 영역을 유지하지 못하고 국부적인 막비등(Film boiling)이 발생하면, 블레이드의 파괴적인 열팽창($Q = mc \\Delta T$)을 초래하여 블레이드 휨(Warping) 현상을 유발하고 곧 후면 칩핑(Backside Chipping)이나 다이 크랙(Die Crack)으로 발현됩니다.`
    },
    ar: {
      title: "تقطيع الرقائق: ميكانيكا الكسر والديناميكا الحرارية",
      content: `تُحكم عملية تقطيع الرقائق بشكل أساسي بمبادئ ميكانيكا الكسر وعلم الاحتكاك. نظرًا لأن الشفرة المشبعة بالماس تدور بسرعات زاوية قصوى (سرعة = نصف القطر × السرعة الزاوية، عادةً 30,000-60,000 دورة في الدقيقة)، فإن حبيبات الماس تقص شبكة السيليكون مجهريًا.

في السيليكون أحادي البلورة (Si)، يجعله التركيب المكعب الماسي هشًا. يبلغ عامل شدة الإجهاد الحرج (صلابة الكسر) حوالي 0.7 إلى 0.9 ميجا باسكال جذر متر. عندما تتجاوز قوة القطع هذا الحد، تنتشر الشقوق الدقيقة على طول مستويات الانفصام.

يعد تدفق سائل التبريد معلمة ديناميكية حرارية مهمة لتبديد حرارة الاحتكاك المتولدة عند واجهة الشفرة والرقاقة. يؤدي الفشل في تبديد الحرارة إلى غليان موضعي واحتكاك مدمر، مما يسبب تمدد حراري للشفرة وينعكس على شكل تشظي خلفي أو تشققات في الرقاقة.`
    }
  },
  dieBonding: {
    en: {
      title: "Die Bonding: Adhesion Kinetics and Rheology",
      content: `Die attachment utilizes epoxy resins (often silver-filled for electrical/thermal conductivity) whose application is governed by Non-Newtonian fluid dynamics—specifically Bingham plastic or pseudoplastic flow behavior.

The dispense volume $V$ must satisfy specific spreading dynamics derived from the Navier-Stokes equations for highly viscous flow under the compression force $F$ of the collet. Capillary action and surface tension (Young's equation: $\\gamma_{SV} = \\gamma_{SL} + \\gamma_{LV} \\cos\\theta$) dictate the fillet formation at the die edges. A proper fillet minimizes stress concentrations during thermal cycling.

During the curing stage, the epoxy undergoes an exothermic cross-linking polymerization. According to the Arrhenius equation ($k = A e^{-E_a/RT}$), the curing temperature profile directly impacts the degree of conversion. Excessive ramp rates cause rapid outgassing of solvents, leading to interfacial voids, which drastically increase the thermal resistance ($R_{th}$) of the package.`
    },
    ko: {
      title: "다이 본딩: 접착 동역학 및 유변학",
      content: `다이 어태치(Die Attach) 공정은 비뉴턴 유체 역학(Non-Newtonian fluid dynamics) — 특히 빙햄 가소성(Bingham plastic) 또는 의소성(Pseudoplastic) 유동 거동의 지배를 받는 에폭시 수지(전기/열 전도성을 위해 결합된 Silver-filled)를 사용합니다.

토출되는 부피 $V$는 콜렛(Collet)의 압축력 $F$ 하에서 고점도 유동에 대한 나비에-스토크스(Navier-Stokes) 방정식에서 파생된 특수한 퍼짐 동역학을 만족해야 합니다. 모세관 현상 및 표면 장력 (Young의 방정식: $\\gamma_{SV} = \\gamma_{SL} + \\gamma_{LV} \\cos\\theta$)이 다이 가장자리의 필렛(Fillet) 형성을 결정합니다. 적절한 필렛은 열 사이클링 중 응력 집중을 최소화합니다.

경화(Curing) 단계에서 에폭시는 발열성 가교 중합(Cross-linking polymerization)을 겪습니다. 아레니우스 방정식($k = A e^{-E_a/RT}$)에 따라 경화 온도 프로파일은 변환 정도에 직접적인 영향을 미칩니다. 과도한 승온 속도는 용매의 급격한 아웃가싱(Outgassing)을 유발하여 계면 보이드를 생성하며, 이는 패키지의 열저항($R_{th}$)을 급격히 증가시킵니다.`
    },
    ar: {
      title: "ربط القالب: حركيات الالتصاق والريولوجيا",
      content: `تستخدم عملية ربط القالب راتنجات الإيبوكسي التي يخضع تطبيقها لديناميكيات الموائع غير النيوتونية، وتحديداً سلوك التدفق البلاستيكي الزائف.

يجب أن يفي حجم التوزيع بديناميكيات انتشار محددة مشتقة من معادلات نافييه-ستوكس للتدفق عالي اللزوجة تحت قوة ضغط الكوليت. تحدد الخاصية الشعرية والتوتر السطحي تكوين الشرائح عند حواف القالب (معادلة يونغ). الشريحة المناسبة تقلل من تركيزات الإجهاد أثناء التدوير الحراري.

أثناء مرحلة المعالجة، يخضع الإيبوكسي لبلمرة متشابكة طاردة للحرارة. وفقًا لمعادلة أرهينيوس، يؤثر المظهر الحراري للمعالجة بشكل مباشر على درجة التحويل. تؤدي معدلات التعلية المفرطة إلى خروج الغازات السريعة للمذيبات، مما يؤدي إلى فراغات بينية، والتي تزيد بشكل كبير من المقاومة الحرارية للحزمة.`
    }
  },
  wireBonding: {
    en: {
      title: "Wire Bonding: Solid-State Welding and Intermetallic Formation",
      content: `Thermosonic wire bonding represents a form of solid-state welding combining thermal energy ($T$), ultrasonic kinetic energy ($US$), and mechanical compressive force ($F$). 

The fundamental mechanism requires the plastic deformation of the gold free-air ball (FAB) and acoustic softening of the underlying aluminum pad, rupturing the naturally occurring $\\text{Al}_2\\text{O}_3$ native oxide layer ($~50\\AA$). This allows pure atomic lattices of Au and Al to share electron clouds, facilitating diffusion. 

Prolonged thermal exposure induces Kirkendall voiding due to the disparate diffusion rates of Au into Al versus Al into Au. A complex phase diagram manifests, sequentially forming Intermetallic Compounds (IMCs) such as $Au_4Al$, $Au_5Al_2$, $Au_2Al$, $AuAl$, and $AuAl_2$ ("purple plague"). 
The dynamics of the wire loop formation are dictated by beam deflection theory and wire plasticity limits, where capillary trajectory determines the neutral axis curvature and prevents heel cracking.`
    },
    ko: {
      title: "와이어 본딩: 고상 용접 및 금속간 화합물 (IMC) 형성",
      content: `열초음파 와이어 본딩(Thermosonic wire bonding)은 열에너지($T$), 초음파 운동 에너지($US$), 기계적 압축력($F$)을 결합한 고상 용접(Solid-state welding)의 한 형태입니다.

근본적인 메커니즘은 생성된 금(Au) 프리 에어 볼(FAB, Free-Air Ball)의 소성 변형과 그 아래 알루미늄 패드의 음향 연화(Acoustic softening) 과정을 통해 자연적으로 발생하는 $\\text{Al}_2\\text{O}_3$ 자연 산화막($~50\\AA$)을 파괴하는 것을 요구합니다. 이를 통해 Au와 Al의 순수 원자 격자가 전자 구름을 공유하며 확산(Diffusion)을 촉진합니다.

장기간 열에 노출되면 Au가 Al로 확산하는 속도와 Al이 Au로 확산하는 속도의 불일치로 인해 커켄달 보이드(Kirkendall voiding)가 유발됩니다. 복잡한 상태도(Phase diagram)가 나타나며, $Au_4Al$, $Au_5Al_2$, $Au_2Al$, $AuAl$ 및 $AuAl_2$('퍼플 플레이그')와 같은 금속간 화합물(IMC, Intermetallic Compounds)이 순차적으로 형성됩니다.
와이어 루프 형성의 역학은 보의 처짐 이론(Beam deflection theory) 및 와이어 소성 한계에 의해 결정되며, 캐필러리의 이동 궤적은 중립축의 곡률을 결정하고 힐 크랙(Heel cracking)을 방지합니다.`
    },
    ar: {
      title: "ربط الأسلاك: اللحام بالحالة الصلبة وتكوين المركبات بين الفلزية",
      content: `يمثل ربط الأسلاك بالموجات الصوتية والحرارة شكلًا من أشكال اللحام بالحالة الصلبة الذي يجمع بين الطاقة الحرارية والطاقة الحركية فوق الصوتية وقوة الضغط الميكانيكية.

تتطلب الآلية الأساسية التشوه اللدن لكرة الهواء الحر الذهبية والترقيق الصوتي لوسادة الألومنيوم الأساسية، مما يكسر طبقة الأكسيد الطبيعي المتكونة بشكل طبيعي. يسمح هذا للشبكات الذرية النقية من الذهب والألومنيوم بمشاركة السحب الإلكترونية، مما يسهل الانتشار.

يؤدي التعرض الحراري المطول إلى فراغات كيركيندال بسبب معدلات الانتشار المتباينة للذهب في الألومنيوم مقابل الألومنيوم في الذهب. يظهر مخطط طور معقد، مكونًا بشكل تسلسلي مركبات الفلزات (IMCs) مثل طاعون الأرجواني. تتحدد ديناميكيات تشكيل حلقة السلك من خلال نظرية انحراف الشعاع وحدود لدونة السلك.`
    }
  },
  molding: {
    en: {
      title: "Molding: Polymer Rheology and Heat Transfer",
      content: `The encapsulation using Epoxy Molding Compound (EMC) is a complex interplay of non-isothermal polymer reactive flow. As the solid EMC pellet undergoes transformation within the preheater and heated cull ($170-180^{\\circ}\\text{C}$), it exhibits dramatic viscosity reduction followed by exponential viscosity increase due to gelation.

The flow front progression inside the cavity can be approximated using a modified Hagen-Poiseuille equation for non-Newtonian power-law fluids: $\\Delta P = \\frac{1}{R^n} \\mu L \\left( \\frac{Q}{A} \\right)^n$. Capillary forces and multi-scale porosity require precise transfer pressure profiles.

If transfer velocity exceeds a critical threshold, wire sweep occurs due to hydrodynamic drag forces: $F_D = \\frac{1}{2} \\rho u^2 C_D A$. Because of the filler particles (e.g., fused silica to match Coefficient of Thermal Expansion $CTE$ to silicon, typically $85\\%$ by weight), the flow can experience filler separation. Proper cure scheduling prevents incomplete cross-linking, which otherwise lowers the glass transition temperature ($T_g$) and compromises moisture resistance.`
    },
    ko: {
      title: "몰딩: 고분자 유변학 및 열 전달",
      content: `에폭시 몰딩 컴파운드(EMC)를 사용한 패키지 인캡슐레이션 공정은 비등온 고분자 반응성 유동(Non-isothermal polymer reactive flow)의 복잡한 상호 작용입니다. 고체 EMC 펠릿(Pellet)이 프리히터와 가열된 컬($170~180^{\\circ}\\text{C}$) 내에서 상변화를 겪으면서 융점 근방에서 극적인 점도(Viscosity) 감소를 보인 후, 겔화(Gelation)로 인해 지수함수적인 점도 상승을 일으킵니다.

캐비티 내부의 유동 선단(Flow front) 진행은 비뉴턴 멱법칙 유체(Power-law fluids)에 대해 수정된 하겐-푸아죄유(Hagen-Poiseuille) 방정식으로 근사할 수 있습니다: $\\Delta P = \\frac{1}{R^n} \\mu L \\left( \\frac{Q}{A} \\right)^n$. 모세관력 및 다중 스케일 다공성 구조로 인해 정밀한 이송 압력(Transfer pressure) 프로필이 요구됩니다.

이송 속도가 임계값을 초과하면 수력학적 항력(Hydrodynamic drag forces) $F_D = \\frac{1}{2} \\rho u^2 C_D A$ 로 인해 와이어 스윕(Wire sweep) 불량이 발생합니다. 열팽창 계수(CTE)를 실리콘과 맞추기 위한 필러 입자(예: 85wt% 용융 실리카)로 인해 유로는 필러 분리(Filler separation) 현상을 겪을 수 있습니다. 적절한 경화(Cure) 스케줄링은 불완전한 가교를 방지하는데 필수적이며, 이를 실패할 시 유리 전이 온도($T_g$)가 낮아지고 내습성이 손상됩니다.`
    },
    ar: {
      title: "القولبة: ريولوجيا البوليمر وانتقال الحرارة",
      content: `يمثل التغليف باستخدام مركب قولبة الإيبوكسي (EMC) تفاعلًا معقدًا للتدفق التفاعلي للبوليمر غير متساوي الحرارة. نظرًا لأن بيليه مركب قولبة الإيبوكسي الصلب يخضع للتحول، فإنه يُظهر انخفاضًا كبيرًا في اللزوجة يليه زيادة أسية في اللزوجة بسبب التبلور.

يمكن تقريب تقدم جبهة التدفق داخل التجويف باستخدام معادلة هاجن-بويزوييل المعدلة للسوائل غير النيوتونية. تتطلب القوى الشعرية والمسامية متعددة النطاقات ملفات تعريف دقيقة لضغط النقل.

إذا تجاوزت سرعة النقل العتبة الحرجة، يحدث اكتساح السلك بسبب قوى السحب الهيدروديناميكية. وبسبب جزيئات الحشو (مثل السيليكا المنصهرة لمطابقة معامل التمدد الحراري)، يمكن أن يواجه التدفق فصل الحشو. تمنع جدولة المعالجة المناسبة التشابك غير المكتمل، والذي بدوره يقلل من درجة حرارة التحول الزجاجي ويضر بمقاومة الرطوبة.`
    }
  },
  test: {
    en: {
      title: "Test & Reliability: Failure Distribution & Arrhenius Models",
      content: `The final test and inspection phase assesses electrical viability, structural integrity, and long-term reliability. Screening tests are statistically designed to isolate infant mortality failures defined by the bathtub curve of reliability engineering ($h(t) = \\frac{f(t)}{R(t)}$).

Burn-in testing accelerates thermally activated failure mechanisms through Elevated Temperature and Voltage. Acceleration factors are mathematically quantified using the Arrhenius model: $AF = \\exp\\left[ \\frac{E_a}{k_B} \\left( \\frac{1}{T_{use}} - \\frac{1}{T_{stress}} \\right) \\right]$, dictating how a short period under extreme stress (e.g., $125^{\\circ}\\text{C}$) equates to years of typical field-use lifetimes.

Parametric testing utilizes automated ATE to measure $I_{DDQ}$ (quiescent supply current). Elevated $I_{DDQ}$ indicates latent defects such as gate-oxide shorts or bridging faults resulting from fabrication or packaging stress. Visual inspection encompasses SAM (Scanning Acoustic Microscopy) to detect internal delamination using acoustic impedance mismatches: $R = \\left(\\frac{Z_2 - Z_1}{Z_2 + Z_1}\\right)^2$.`
    },
    ko: {
      title: "테스트 및 신뢰성: 고장 분포 및 아레니우스 모델",
      content: `최종 테스트 및 검사 단계에서는 전기적 정상 확인, 구조적 무결성 및 장기 신뢰성을 평가합니다. 스크리닝(Screening) 테스트는 신뢰성 공학의 욕조 곡선(Bathtub curve)에 정의된 초기 불량률(Infant mortality) 결함을 분리해 내도록 통계적으로 설계됩니다 ($h(t) = \\frac{f(t)}{R(t)}$).

번인(Burn-in) 테스트는 상승된 온도와 전압 환경을 통해 열 활성화(Thermally activated) 고장 메커니즘을 가속시킵니다. 가속 계수(AF)는 아레니우스(Arrhenius) 모델을 사용하여 수학적으로 정량화됩니다. $AF = \\exp\\left[ \\frac{E_a}{k_B} \\left( \\frac{1}{T_{use}} - \\frac{1}{T_{stress}} \\right) \\right]$ 이는 극단적인 스트레스(예: $125^{\\circ}\\text{C}$)에서의 짧은 시간이 일반적인 현장 사용 수명의 몇 년과 어떻게 수학적으로 등가하는지 지시합니다.

파라메트릭(Parametric) 테스트는 자동화된 ATE 검사 장비를 활용하여 정적 공급 전류($I_{DDQ}$)를 측정합니다. $I_{DDQ}$의 증가는 제조 또는 패키징 스트레스로 인한 게이트-옥사이드 단락(Gate-oxide short) 또는 브릿징 결함(Bridging fault)과 같은 잠재적 결함을 나타냅니다. 외관 및 비파괴 검사는 음향 임피던스 불일치를 사용하여 단면 박리(Delamination)를 감지하는 SAM(주사 음향 현미경)을 포함합니다: $R = \\left(\\frac{Z_2 - Z_1}{Z_2 + Z_1}\\right)^2$.`
    },
    ar: {
      title: "الاختبار والموثوقية: توزيع الفشل ونماذج أرهينيوس",
      content: `تقيم مرحلة الاختبار والفحص النهائي الجدوى الكهربائية والسلامة الهيكلية والموثوقية طويلة المدى. تم تصميم اختبارات الفرز إحصائياً لعزل إخفاقات معدات الأطفال المبكرة المحددة في منحنى حوض الاستحمام لهندسة الموثوقية.

يسرع اختبار الاحتراق آليات الفشل المنشطة حرارياً من خلال ارتفاع درجة الحرارة والجهد. يتم تحديد عوامل التسريع رياضياً باستخدام نموذج أرهينيوس، والذي يملي كيف أن فترة قصيرة تحت ضغط شديد تعادل سنوات من فترات الاستخدام الميداني المعتادة.

يستخدم الاختبار المعياري ATE الآلي لقياس تيار الإمداد الهادئ. يشير الارتفاع في التيار إلى عيوب كامنة مثل دوائر القصر أو أعطال التجسير الناتجة عن ضغوط التصنيع أو التغليف. يتضمن الفحص البصري استخدام المجاهر الصوتية للبحث عن الانفصال الداخلي باستخدام عدم تطابق الممانعة الصوتية.`
    }
  }
};
