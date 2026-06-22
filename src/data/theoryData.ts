// 반도체 후공정 5대 공정 이론 교재 (MD 교재 기반, 마크다운 포맷)
// 각 공정 페이지의 "실습 이론" 탭에서 TheoryView 로 렌더링됩니다.
// 표/목록/흐름을 마크다운으로 작성하며, 중복되는 참고자료·평가 항목은 제외하고
// 전체 공정이 일관되게 이어지도록 구성했습니다.

export interface TheoryChapter {
  title: string;
  content: string;
}

export type TheoryKey = 'dicing' | 'dieBonding' | 'wireBonding' | 'molding' | 'test';
type TheoryLanguage = 'en' | 'ko' | 'ar';

export const theoryData: Record<string, TheoryChapter> = {
  // ── 1단계: 웨이퍼 다이싱 (교재 02_다이싱) ─────────────────────────────
  dicing: {
    title: "다이싱(Dicing): 웨이퍼를 개별 칩으로 분리하는 정밀 절단 공정",
    content: `웨이퍼 위에 만들어진 칩은 아직 서로 붙어 있습니다. 실제 제품에 넣을 수 있는 칩을 만들려면 웨이퍼를 개별 칩 단위로 잘라야 하며, 이 절단 과정이 **다이싱**입니다. 단순히 자르는 작업처럼 보이지만, 칩 가장자리의 작은 균열 하나가 이후 패키징이나 사용 중 열·충격 조건에서 불량으로 이어질 수 있는 매우 정밀한 공정입니다.

## 학습 목표
- 다이싱 공정의 목적과 위치를 설명한다
- 블레이드 다이싱과 레이저 다이싱의 차이를 이해한다
- 다이싱 테이프와 웨이퍼 고정의 중요성을 이해한다
- Chipping, Crack, Burr 등 대표 불량 원인을 이해한다
- 절단 품질이 후속 공정에 미치는 영향을 설명한다

## 기초 이론
### 다이와 스트리트
웨이퍼에는 많은 칩이 격자 형태로 배열되어 있습니다. 칩과 칩 사이의 절단용 공간을 **스트리트(Street)** 또는 **스크라이브 라인(Scribe Line)** 이라고 하며, 다이싱 장비는 이 영역을 따라 웨이퍼를 절단합니다.

> **공정 흐름:** 웨이퍼 → 칩 배열 → 스트리트 영역 확인 → 절단 경로 설정 → 개별 다이 분리

### 왜 정밀 절단이 필요한가
실리콘은 단단하지만 취성이 있어 충격·진동에 깨질 수 있습니다. 절단 중 발생하는 힘·열·진동·이물질을 제어하지 못하면 다음과 같은 문제가 발생합니다.
- Chipping(칩 가장자리 깨짐)
- 내부 미세 균열
- 금속 배선 손상
- 후속 본딩 정렬 불량
- 패키지 신뢰성 저하

## 주요 다이싱 방식
### 블레이드 다이싱
얇은 원형 절단날을 고속 회전시켜 웨이퍼를 자르는 가장 널리 쓰이는 전통적 방식입니다.

| 장점 | 단점 |
|---|---|
| 공정 안정성이 높음 | 블레이드 마모 발생 |
| 장비·공정이 비교적 성숙함 | 칩핑·크랙 가능성 |
| 다양한 웨이퍼에 적용 가능 | 냉각수·세정 관리 필요 |

회전 속도, 이송 속도, 절단 깊이, 냉각수 조건, 블레이드 재질이 품질에 영향을 줍니다.

### 레이저 다이싱
레이저 에너지로 웨이퍼를 절단하거나, 내부에 균열 유도층을 형성한 뒤 분리하는 방식입니다.

| 장점 | 단점 |
|---|---|
| 기계적 접촉이 적음 | 장비 비용이 높음 |
| 미세 패턴 제품에 유리 | 열 영향 관리 필요 |
| 절단 폭을 줄일 수 있음 | 재료별 조건 최적화 필요 |

### 스텔스 다이싱
웨이퍼 내부에 레이저로 변형층을 만든 뒤 외부 힘으로 분리하는 방식입니다. 표면 손상을 줄일 수 있어 얇은 웨이퍼나 고부가 제품에 활용됩니다.

## 공정 절차
1. 웨이퍼 후면에 다이싱 테이프 부착
2. 웨이퍼 프레임 고정
3. 웨이퍼 정렬 및 절단 경로 인식
4. 절단 조건 설정
5. X방향 절단
6. Y방향 절단
7. 세정 및 건조
8. 절단 품질 검사
9. 후속 다이 본딩 공정으로 이동

## 핵심 장비와 재료
| 구분 | 내용 |
|---|---|
| 다이싱 소우 | 블레이드로 웨이퍼를 절단하는 장비 |
| 레이저 다이서 | 레이저로 절단하거나 내부 변형층을 형성 |
| 다이싱 블레이드 | 절단날. 입자 크기와 두께가 중요 |
| 다이싱 테이프 | 절단 중 칩 고정, 분리 후 픽업 보조 |
| 냉각수/DI Water | 절단 열과 파티클 제거 |
| 비전 시스템 | 절단 경로와 웨이퍼 위치 인식 |

## 주요 공정 변수
| 변수 | 영향 |
|---|---|
| 블레이드 회전 속도 | 절단면 품질, 열 발생, 블레이드 마모 |
| 이송 속도 | 생산성, 칩핑 발생 가능성 |
| 절단 깊이 | 완전 절단 여부, 테이프 손상 |
| 냉각수 유량 | 열 제거, 파티클 제거 |
| 블레이드 두께 | 절단 폭, 칩 간격 활용도 |
| 웨이퍼 두께 | 파손 위험, 절단 조건 |

## 대표 불량과 원인
- **칩핑**: 칩 가장자리가 깨지는 현상. 블레이드 마모, 과도한 이송 속도, 냉각 부족, 웨이퍼 고정 불량이 원인.
- **크랙**: 칩 내부·표면 균열. 미세 크랙은 육안으로 보이지 않을 수 있으나, 패키징 이후 열충격·신뢰성 시험에서 불량으로 나타날 수 있음.
- **버·파티클**: 절단 중 발생한 미세 조각·이물질이 칩 표면이나 본딩 패드에 남으면 전기적 연결 불량 유발.

## 품질 검사
다이싱 후 현미경 또는 비전검사 장비로 다음을 확인합니다.
- 절단선이 정확한 위치를 통과했는가
- Chipping(칩 가장자리 깨짐)이 기준 이내인가
- 크랙이 발생하지 않았는가
- 파티클이 과도하게 남아 있지 않은가
- 칩이 테이프 위에서 안정적으로 고정되어 있는가

## 응용: 생산성과 품질의 균형
이송 속도를 높이면 시간당 처리량은 늘지만 칩핑이 증가할 수 있고, 품질을 위해 속도를 지나치게 낮추면 생산량이 줄고 원가가 오릅니다. **최적 조건**은 가장 느린 조건이 아니라, 품질 기준을 만족하면서 생산성을 확보하는 조건입니다.

## 학문적 심화
### 취성 파괴와 Griffith 기준
실리콘은 연성 변형보다 균열 전파가 우세한 취성 재료입니다. 절단 중 블레이드가 가하는 국부 응력이 임계값을 넘으면 미세 균열이 성장합니다. Griffith 파괴 역학에서는 균열 길이와 응력 상태가 재료의 파괴 인성보다 커지는 순간 균열이 불안정하게 전파된다고 봅니다.

| 개념 | 의미 | 다이싱에서의 해석 |
|---|---|---|
| 응력집중 | 결함·모서리에서 응력이 커지는 현상 | 다이 가장자리 칩핑의 출발점 |
| 파괴인성 | 균열 전파에 저항하는 능력 | 웨이퍼 재료·방향성에 따라 달라짐 |
| 미세균열 | 육안으로 보이지 않는 균열 | 후속 열충격에서 크랙으로 성장 가능 |

### 절삭 에너지와 열 발생
블레이드 다이싱에서 열은 절삭력과 상대 속도의 곱에 비례해 증가합니다. 회전수만 높이면 절단면이 좋아지는 것이 아니라, 냉각·세정이 부족할 경우 마찰열과 슬러지가 증가해 블레이드 로딩과 칩핑이 악화될 수 있습니다.

> **해석 포인트:** 회전수(RPM), 이송 속도, 블레이드 입도, 냉각수 유량은 서로 독립이 아니라 함께 공정 창(Process Window)을 형성합니다.

### Kerf Width와 수율 손실
Kerf Width는 블레이드 두께와 측면 마모, 스핀들 런아웃, 웨이퍼 진동의 영향을 받습니다. Kerf Width가 넓어지면 동일 웨이퍼에서 사용할 수 있는 유효 다이 면적이 줄고, 스크라이브 라인 여유가 작은 제품에서는 패턴 손상 위험이 커집니다.

### 실습 시뮬레이터 관찰 항목
슬라이더를 조정할 때 다음 관계를 관찰합니다.
- 이송 속도 증가 → 기계적 부하 증가 → 칩핑 증가
- 냉각수 부족 → 절삭 온도 증가 → 열손상 위험 증가
- 블레이드 마모 증가 → Kerf Width 불안정 → 다이 가장자리 품질 저하
- 공정 판정은 단일 변수보다 칩핑과 온도의 동시 조건으로 해석

## 정리
다이싱은 단순 절단이 아니라 칩의 기계적 안정성과 후속 공정 품질을 결정하는 정밀 제조 공정입니다. 품질·생산성·장비 조건·재료 특성이 함께 작용한다는 점을 이해해야 합니다.`
  },

  // ── 2단계: 다이 본딩 (교재 03_다이본딩) ───────────────────────────────
  dieBonding: {
    title: "다이 본딩(Die Bonding): 칩을 기판·리드프레임에 정확히 부착하는 공정",
    content: `다이싱으로 분리된 칩은 매우 작고 얇아 그대로 사용할 수 없습니다. 칩을 외부 회로와 연결하고 보호하기 위해서는 먼저 칩을 일정한 위치에 안정적으로 고정해야 하며, 이 과정이 **다이 본딩**입니다. "칩을 붙이는 작업"이지만 실제로는 위치 정밀도, 열전달, 접착 강도, 전기적 특성까지 고려해야 하는 중요한 공정입니다.

## 학습 목표
- 다이 본딩의 목적과 역할을 설명한다
- 리드프레임, 기판, 인터포저의 기본 개념을 이해한다
- Epoxy, DAF, Solder 등 die attach 재료의 차이를 이해한다
- 위치 정렬, 접착 두께, 경화 조건의 중요성을 이해한다
- Void, Die Tilt, 오염 등 대표 불량의 원인과 영향을 이해한다

## 기초 이론
다이 본딩은 개별 칩을 리드프레임, 패키지 기판, 세라믹 기판, 인터포저 등에 부착하는 공정입니다.

> **공정 흐름:** 다이싱 완료 칩 → 픽업 → 위치 정렬 → 접착재 도포/필름 접합 → 다이 배치 → 경화·접합

### 리드프레임과 기판
| 구분 | 설명 | 주 사용 제품 |
|---|---|---|
| 리드프레임 | 금속 판 형태의 전기적 연결 구조 | 범용 IC, 일부 전력반도체 |
| 패키지 기판 | 회로 패턴이 형성된 기판 | BGA, 고성능 반도체 |
| 인터포저 | 칩과 기판 사이의 중간 연결층 | 2.5D/3D 고급 패키징 |

### 다이 본딩이 중요한 이유
다이 본딩 품질은 칩 위치 정확도, 열 방출 성능, 전기적 접지 특성, 후속 와이어 본딩·플립칩 연결 품질, 패키지 신뢰성, 장기 사용 중 박리·균열 가능성에 영향을 줍니다.

## 다이 부착 재료
### 에폭시 접착제
가장 널리 쓰이는 재료로, 액상·페이스트 형태로 도포하고 열로 경화시킵니다.

| 장점 | 단점 |
|---|---|
| 공정 적용이 비교적 쉬움 | 경화 조건 관리 필요 |
| 비용이 비교적 낮음 | 보이드 발생 가능 |
| 다양한 패키지에 적용 가능 | 열전도 특성 한계 가능 |

### DAF (Die Attach Film)
필름 형태의 접착재로, 웨이퍼 뒷면에 붙인 뒤 다이싱하여 개별 칩을 기판에 부착합니다. 접착재 두께를 균일하게 관리하기 좋아 소형·박형 패키지에 유리합니다.

### 솔더 다이 본딩
금속 접합을 이용하는 방식으로 열전도·전기전도 특성이 좋아 전력반도체나 고열 제품에 사용됩니다. 다만 공정 온도, 젖음성, 보이드 관리가 중요합니다.

## 공정 절차
1. 다이싱 완료 웨이퍼 준비
2. 정상 칩 위치 확인
3. 픽업 노즐로 다이 분리
4. 기판/리드프레임 위치 인식
5. 접착재 도포 또는 필름 접합
6. 다이를 목표 위치에 배치
7. 압력·시간을 제어하여 부착
8. 열 경화 또는 접합
9. 위치·접착 상태 검사

## 핵심 장비와 구성 요소
| 장비/부품 | 역할 |
|---|---|
| 다이 본더 | 칩을 픽업하고 기판에 배치 |
| 픽업 노즐 | 칩을 손상 없이 들어 올림 |
| 디스펜서 | 에폭시 등 접착재 도포 |
| 비전 시스템 | 칩·기판 위치 인식 |
| 경화 오븐 | 접착재를 열로 경화 |
| 본딩 스테이지 | 기판 고정·온도 제어 |

## 주요 공정 변수
| 변수 | 의미 | 품질 영향 |
|---|---|---|
| 접착재 도포량 | 칩 아래 접착재 양 | 부족하면 접착력 저하, 과다하면 오염 |
| 본딩 압력 | 칩을 누르는 힘 | 과하면 칩 손상, 부족하면 접합 불량 |
| 위치 정렬 오차 | 목표와 실제 위치 차이 | 후속 연결 불량 |
| 경화 온도 | 접착재를 굳히는 온도 | 강도·신뢰성 영향 |
| 경화 시간 | 열 처리 시간 | 불완전 경화/과경화 |
| 접착층 두께 | 칩과 기판 사이 두께 | 열저항·기계적 안정성 영향 |

## 대표 불량과 원인
- **보이드**: 접착층 내부의 빈 공간. 많으면 열 전달이 나빠지고 접착 강도가 떨어짐. 원인 — 접착재 내 기포, 도포 패턴 불량, 경화 조건 부적절, 표면 오염, 압력 부족.
- **다이 틸트**: 칩이 기울어져 부착되는 현상. 와이어 본딩 높이가 불균일해지고 몰딩 중 응력 집중 발생.
- **위치 오차**: 다이가 목표 위치를 벗어나 전기적 연결 위치가 맞지 않거나 내부 공간 설계가 어긋남.
- **접착재 오염**: 접착재가 칩 표면·본딩 패드로 번져 와이어 본딩 불량·전기적 오염 유발.

## 품질 검사
다이 위치 정확도, 회전 각도, 틸트, 접착재 번짐, 접착층 보이드, 접착 강도, 표면 오염을 검사합니다. 비전검사, X-ray, 초음파 검사, 전단강도 시험 등이 활용됩니다.

## 응용: 열 관리와 다이 본딩
칩에서 발생한 열은 패키지 기판과 방열 구조를 통해 빠져나가야 하며, 다이 본딩층은 열 전달 경로의 일부입니다. 접착층에 보이드가 많거나 열전도율이 낮은 재료를 쓰면 칩 온도가 상승해 성능 저하·수명 단축·열폭주 가능성이 커집니다. 따라서 고출력 제품에서는 다이 본딩 재료·조건이 매우 중요합니다.

## 학문적 심화
### 접착층 두께와 열저항
다이 접착층은 칩과 리드프레임 사이의 열전달 경로입니다. 단순화하면 열저항은 다음 관계로 이해할 수 있습니다.

> **R_th ≈ t / (k × A)**  
> t: 접착층 두께, k: 열전도율, A: 접촉 면적

따라서 접착층이 너무 두꺼우면 열저항이 커지고, 너무 얇거나 불균일하면 접착 강도와 응력 완화 능력이 떨어집니다. 실습 시뮬레이터의 10~30μm 권장 범위는 열전달과 기계적 완충 사이의 타협값으로 이해할 수 있습니다.

### 경화 반응과 Arrhenius 모델
에폭시 경화는 온도에 민감한 화학 반응입니다. 일반적으로 온도가 올라가면 반응 속도는 증가하지만, 과도한 온도는 잔류응력·열화·계면 손상을 유발할 수 있습니다.

| 변수 | 부족할 때 | 과도할 때 |
|---|---|---|
| 경화 온도 | 미경화, 낮은 접착강도 | 열응력, 재료 열화 |
| 경화 시간 | 가교 반응 불충분 | 생산성 저하, 과경화 가능 |
| 본딩 압력 | 보이드, 접촉 불량 | 다이 크랙, 접착재 과다 번짐 |

### 유변학과 디스펜싱
에폭시 토출량은 노즐 직경, 토출 압력, 시간, 점도에 의해 결정됩니다. 점도는 온도와 보관 상태에 따라 변하므로 같은 압력·시간 조건이라도 실제 토출량이 달라질 수 있습니다. 고점도 재료는 형상 유지에는 유리하지만 보이드 배출이 어려울 수 있습니다.

### 실습 시뮬레이터 관찰 항목
- 에폭시량 증가 → 접착층 두께 증가 가능
- 압력 증가 → 접착층이 얇아지고 보이드 감소 가능, 과하면 다이 손상 위험
- 경화 온도·시간 증가 → 경화도 상승, 과도하면 열응력 고려 필요
- 보이드율은 열저항과 전단강도 판정에 직접 연결

## 정리
다이 본딩은 칩을 패키지 구조에 고정하는 공정으로, 그 품질은 전기적 연결·열 관리·기계적 안정성·장기 신뢰성에 영향을 미칩니다. 단순 접착이 아니라 패키지 전체 성능을 결정하는 핵심 공정입니다.`
  },

  // ── 3단계: 전기적 연결 - 와이어 본딩/플립칩 (교재 04) ───────────────────
  wireBonding: {
    title: "전기적 연결(Wire Bonding · Flip Chip): 칩과 외부 단자를 잇는 공정",
    content: `칩 내부에는 수많은 회로가 있지만, 외부와 연결되지 않으면 아무 기능도 할 수 없습니다. 칩이 계산한 신호를 외부로 보내고 전원·명령을 받기 위해서는 전기적 연결이 필요하며, 후공정에서 이 역할을 하는 대표 방식이 **와이어 본딩**과 **플립칩 본딩**입니다.

## 학습 목표
- 칩과 외부 단자를 전기적으로 연결해야 하는 이유를 이해한다
- 와이어 본딩과 플립칩 본딩의 원리·흐름을 설명한다
- Bump, Pad, Substrate, Solder joint의 개념을 이해한다
- 본딩 불량의 종류와 검사 방법을 이해한다
- 제품 특성에 따라 연결 방식을 선택하는 기준을 이해한다

## 기초 이론: 패드와 단자
칩 표면에는 외부와 연결하기 위한 금속 영역인 **패드**가 있고, 패키지에는 외부 회로와 연결되는 **단자**가 있습니다. 전기적 연결 공정은 칩 패드와 패키지 단자를 이어주는 과정입니다.

> **신호 경로:** 칩 내부 회로 → 칩 패드 → 와이어/범프 → 기판·리드프레임 → 외부 회로

## 와이어 본딩
매우 가는 금속선(금선·알루미늄선·구리선)으로 칩 패드와 리드프레임/기판 패드를 연결하는 방식입니다.

### 공정 흐름
1. 칩과 기판 위치 인식
2. 본딩 툴이 와이어 공급
3. 칩 패드에 첫 번째 접합 형성
4. 와이어 루프 형성
5. 기판/리드프레임에 두 번째 접합 형성
6. 와이어 절단
7. 반복 작업
8. 본딩 상태 검사

### 본딩 방식
| 방식 | 설명 | 특징 |
|---|---|---|
| 볼 본딩 | 와이어 끝에 볼을 만들어 접합 | 금선·구리선에 많이 사용 |
| 웨지 본딩 | 쐐기 모양 툴로 접합 | 알루미늄선에 많이 사용 |
| 초음파 본딩 | 초음파 진동으로 접합 | 열 영향이 비교적 낮음 |
| 열압착 본딩 | 열·압력으로 접합 | 접합 안정성 확보 |

### 장점과 한계
| 장점 | 한계 |
|---|---|
| 공정이 성숙하고 비용 경쟁력 | I/O 수가 많아지면 한계 |
| 다양한 제품에 적용 가능 | 와이어 길이에 따른 전기적 지연 |
| 장비·재료 공급망이 안정적 | 고속·고주파에서 기생 인덕턴스 문제 |

## 플립칩 본딩
칩을 뒤집어 칩 표면의 **범프**를 기판과 직접 연결하는 방식입니다. 와이어 본딩이 칩 가장자리 패드를 잇는 것과 달리, 플립칩은 칩 표면 전체에 범프를 배치할 수 있습니다.

> **공정 흐름:** 칩 표면에 범프 형성 → 칩 뒤집기 → 기판 패드와 정렬 → 열·압력·리플로우 접합 → 언더필/몰딩

범프는 칩과 기판을 잇는 작은 돌기 형태의 금속 접합부로, 솔더 범프·구리 필러 범프 등이 있습니다.

| 장점 | 한계 |
|---|---|
| 짧은 전기 경로 (고속 신호 유리) | 공정 난이도 높음 (정렬·접합 조건) |
| 많은 I/O 수용 (칩 전체 면적) | 웨이퍼 단계 범핑 공정 필요 |
| 낮은 인덕턴스 (고주파 성능) | 칩-기판 열팽창 차이 관리 필요 |
| 패키지 소형화 | 접합부가 칩 아래라 검사 난이도 높음 |

## 와이어 본딩 vs 플립칩
| 구분 | 와이어 본딩 | 플립칩 본딩 |
|---|---|---|
| 연결 방식 | 금속 와이어 | 범프 직접 연결 |
| 신호 경로 | 상대적으로 김 | 상대적으로 짧음 |
| 비용 | 비교적 낮음 | 비교적 높음 |
| I/O 수 | 중간 수준 | 고I/O 제품 유리 |
| 전기적 성능 | 범용 제품 | 고속·고성능 제품 |
| 검사 | 광학검사 용이 | X-ray 등 필요 |

## 대표 불량
**와이어 본딩** — 리프트(접합부 떨어짐), Wire Sweep(몰딩 중 휨), 넥 크랙(목 부분 균열), 쇼트(와이어끼리 접촉), 미스 본드(위치 오류).

**플립칩** — 오픈(범프 미접합), 브리지(범프끼리 연결), 보이드(접합부 빈 공간), 언더필 불량(칩 아래 충진 불량), 열피로(반복 열변화 손상).

## 검사 방법
| 방법 | 적용 |
|---|---|
| 광학검사 | 와이어 위치·접합부 외관 |
| Pull Test | 와이어 접합 강도 |
| Shear Test | 볼·범프 접합 강도 |
| X-ray 검사 | 칩 아래 범프·보이드 |
| 전기적 테스트 | 오픈/쇼트·기능 |
| 단면 분석 | 불량 원인 정밀 분석 |

## 응용: 제품별 연결 방식 선택
| 제품 유형 | 적합 방식 | 이유 |
|---|---|---|
| 범용 센서 IC | 와이어 본딩 | 비용·안정성 |
| 고속 프로세서 | 플립칩 | 짧은 신호 경로·고I/O |
| 전력반도체 | 와이어·클립·솔더 | 큰 전류·열 관리 |
| 모바일 AP | 플립칩·고급 패키징 | 소형화·고성능 |
| 메모리 패키지 | 와이어 본딩 또는 TSV/적층 | 용량·집적도 |

## 학문적 심화
### 열초음파 본딩의 세 가지 에너지
금선 볼 본딩은 열, 초음파 에너지, 하중이 동시에 작용하여 금속 계면의 산화막을 깨고 원자 확산 접합을 형성합니다. 세 변수 중 하나가 부족하면 접합 강도가 낮아지고, 과도하면 패드 손상이나 크레이터링이 발생합니다.

| 변수 | 주요 역할 | 과도 조건의 위험 |
|---|---|---|
| 온도 | 금속 확산 촉진 | IMC 과성장, Kirkendall void |
| 초음파 | 산화막 파괴, 계면 활성화 | 패드 크레이터링, 볼 변형 과다 |
| 하중 | 실제 접촉 면적 확보 | 패드 손상, 다이 균열 |

### IMC와 Kirkendall Void
Au-Al 계면에는 AuAl계 IMC(Intermetallic Compound)이 형성됩니다. 적절한 IMC는 접합 강도에 필요하지만, 고온 보관 중 확산 속도 차이로 공공이 축적되면 Kirkendall void가 발생해 접합부 리프트나 전기적 오픈으로 이어질 수 있습니다.

### 와이어 루프 역학
와이어 루프는 단순 곡선이 아니라 전기적·기계적 제약을 동시에 만족해야 합니다. 루프가 낮으면 다이 에지 쇼트 위험이 증가하고, 지나치게 높거나 길면 몰딩 유동 중 Wire Sweep이 커집니다. 고속 신호에서는 와이어 길이가 기생 인덕턴스와 임피던스에 영향을 줍니다.

### 실습 시뮬레이터 관찰 항목
- 루프 높이 증가 → 쇼트 위험 감소, 그러나 몰딩 중 변형 여지 증가
- 와이어 길이 증가 → 처짐과 기생 성분 증가
- 초음파/하중 과다 → 볼 변형과 패드 손상 가능
- IMC는 “많을수록 좋다”가 아니라 적정 성장 범위가 중요

## 정리
전기적 연결은 칩 내부 회로와 외부 시스템을 잇는 핵심 단계입니다. 와이어 본딩은 성숙하고 경제적이며, 플립칩은 고성능·고집적 제품에 적합합니다. 방식의 이름보다 **제품 요구사항에 따라 왜 다른 방식을 선택하는지**를 이해하는 것이 중요합니다.`
  },

  // ── 4단계: 몰딩 (교재 05_몰딩 부분) ───────────────────────────────────
  molding: {
    title: "몰딩(Molding): 칩과 연결부를 수지로 감싸 보호하는 공정",
    content: `칩을 기판에 붙이고 전기적으로 연결했다고 제품이 완성되는 것은 아닙니다. 칩과 연결부는 외부 충격·습기·먼지·열·정전기에 매우 취약하므로 이를 보호하는 구조가 필요합니다. **몰딩**은 칩과 와이어·접합부를 수지로 감싸 보호하는 공정입니다.

## 학습 목표
- 몰딩 공정의 목적과 재료 특성을 설명한다
- EMC와 패키지 보호 기능의 관계를 이해한다
- Transfer Molding과 Compression Molding의 차이를 이해한다
- 마킹, 트림/폼, 싱귤레이션의 의미를 이해한다
- 대표 몰딩 불량의 원인을 이해한다

## 기초 이론
몰딩은 단순 포장이 아니라 **전기적 절연, 기계적 보호, 습기 차단, 열 안정성**을 담당합니다.

> **공정 흐름:** 칩과 연결부 → 몰딩 수지 주입 → 경화 → 외부 보호 구조 형성 → 마킹·분리·최종 테스트

### EMC (Epoxy Molding Compound)
반도체 패키지 몰딩에 쓰이는 에폭시 기반 복합 재료로, 수지·충전재·경화제·첨가제가 포함됩니다. EMC가 가져야 할 특성:
- 전기 절연성
- 낮은 수분 흡수율
- 적절한 열팽창 계수
- 기계적 강도
- 열 안정성
- 칩·기판에 대한 접착성

## 몰딩 방식
### 트랜스퍼 몰딩
가열된 몰딩 재료를 금형 내부로 밀어 넣어 성형하는 방식으로 대량 생산에 널리 쓰입니다.

| 장점 | 단점 |
|---|---|
| 대량 생산에 적합 | 금형 설계 중요 |
| 공정 안정성이 높음 | Wire Sweep 가능성 |
| 다양한 패키지에 적용 | 수지 흐름 제어 필요 |

### 컴프레션 몰딩
몰딩 재료를 압축하여 패키지를 형성하는 방식으로, 대면적 패널·웨이퍼 레벨 패키징 등에 활용됩니다.

## 대표 몰딩 불량
| 불량 | 설명 | 가능한 원인 |
|---|---|---|
| 보이드 | 몰딩 내부 빈 공간 | 수지 흐름 불량, 가스 잔류 |
| 델라미네이션 | 계면 박리 | 표면 오염, 열응력, 접착 불량 |
| Wire Sweep | 몰딩 중 와이어 휨 | 수지 흐름 압력 과다 |
| 크랙 | 패키지 균열 | 열응력, 재료 불일치 |
| 미충전 | 수지 미충전 | 압력 부족, 금형 문제 |
| 플래시 | 불필요한 수지 누출 | 금형 밀착 불량 |

## 마킹 · 트림/폼 · 싱귤레이션
- **마킹**: 패키지 표면에 제품명·제조사·로트 번호·추적 코드를 표시(주로 레이저). 품질 추적·불량 분석에 중요.
- **트림/폼**: 리드프레임 기반 패키지에서 몰딩 후 리드를 자르고 원하는 형상으로 구부리는 작업.
- **싱귤레이션**: 기판·스트립 형태로 함께 처리된 패키지를 개별 제품으로 분리하는 공정. 다이싱처럼 절단 품질이 중요.

## 학문적 심화
### EMC 유동과 Hagen-Poiseuille 관점
트랜스퍼 몰딩의 EMC는 점성 유체처럼 캐비티와 게이트를 통과합니다. 좁은 채널에서 유량은 압력차에 비례하고 점도와 유로 저항에 반비례합니다. 실제 EMC는 충전재가 포함된 비뉴턴성 재료에 가깝지만, 실습에서는 압력·점도·캐비티 형상이 충전 시간을 결정한다는 관점이 중요합니다.

### 경화 수축과 잔류응력
EMC는 경화하면서 화학적 수축이 발생하고, 고온 성형 후 상온으로 냉각되면서 열수축이 추가됩니다. 실리콘, 리드프레임, EMC의 CTE(열팽창계수)가 다르면 계면에 전단응력이 생기며 델라미네이션이나 패키지 크랙으로 이어질 수 있습니다.

| 재료 | 특징 | 신뢰성 이슈 |
|---|---|---|
| 실리콘 다이 | 낮은 CTE, 취성 | 크랙, 패드 손상 |
| 리드프레임/기판 | 금속·복합재 | 휨, 계면 응력 |
| EMC | 수분 흡수와 수축 존재 | 박리, 팝콘 크랙 |

### Wire Sweep과 유동 전단력
몰딩 중 EMC 유동이 와이어에 전단력을 가하면 와이어가 휘어집니다. 유동 속도, 점도, 와이어 길이, 루프 높이가 함께 영향을 주며, 와이어 간 간격이 좁은 패키지에서는 쇼트 위험으로 이어질 수 있습니다.

### 실습 시뮬레이터 관찰 항목
- 트랜스퍼 압력 증가 → 충전성 향상, 플래시·Wire Sweep 위험 증가
- 금형 온도 증가 → 점도 저하와 경화 촉진이 동시에 발생
- 클램핑 힘 부족 → 파팅 라인 플래시 발생
- 경화도 부족 → 기계적 강도와 내습 신뢰성 저하

## 정리
몰딩은 칩을 외부 환경으로부터 보호하여 패키지의 기계적·환경적 신뢰성을 확보하는 공정입니다. 이후 마킹·트림/폼·싱귤레이션을 거쳐 개별 제품으로 정리되며, 최종 테스트로 이어집니다.`
  },

  // ── 5단계: 검사 및 테스트 (교재 01_웨이퍼테스트 + 05_최종테스트) ─────────
  test: {
    title: "검사 및 테스트(Test): 좋은 칩을 선별하고 출하 품질을 검증하는 관문",
    content: `반도체는 가능한 한 이른 단계에서 불량을 찾아내는 것이 중요합니다. 테스트는 두 곳에서 이루어집니다 — 후공정의 시작점에서 칩 단위로 선별하는 **웨이퍼 테스트**와, 패키징을 마친 완성품의 출하 여부를 판정하는 **최종 테스트**입니다.

## 학습 목표
- 웨이퍼 테스트와 최종 테스트의 목적·차이를 설명한다
- Probe Card, ATE 등 테스트 장비의 역할을 이해한다
- 전기적 검사 항목과 Yield의 의미를 이해한다
- Burn-in 및 신뢰성 시험의 목적을 이해한다
- 추적성과 출하 품질 관리의 중요성을 이해한다

# Ⅰ. 웨이퍼 테스트 (초기 선별)
전공정을 마친 웨이퍼에는 수백~수천 개의 칩이 배열되어 있습니다. 다이싱 전에 각 다이의 전기적 특성을 검사하여 정상/불량 칩을 구분합니다. 일찍 불량을 거르면 이후 공정 비용을 줄이고 신뢰성을 높일 수 있습니다.

### 전기적 검사 항목
| 항목 | 의미 |
|---|---|
| 오픈 검사 | 회로가 끊어졌는지 확인 |
| 쇼트 검사 | 닿으면 안 되는 회로가 붙었는지 확인 |
| 누설전류 검사 | 꺼져 있어야 할 때 전류가 새는지 확인 |
| 동작 전압 검사 | 지정 전압에서 동작하는지 확인 |
| 기능 검사 | 논리 회로가 설계대로 동작하는지 확인 |
| 속도 검사 | 목표 주파수에서 동작 가능한지 확인 |

### 프로브 카드
테스트 장비와 웨이퍼 위 칩을 연결하는 인터페이스로, 가는 탐침(니들)이 칩 패드에 접촉해 신호를 전달합니다. 접촉 품질이 결과에 큰 영향을 주며, 접촉 불량은 정상 칩을 불량으로 오판하게 하고 과도한 압력은 패드를 손상시킵니다.

> **연결 경로:** 테스터 → 프로브 카드 → 프로브 니들 → 웨이퍼 위 칩 패드 → 전기적 응답 측정

### 웨이퍼 맵과 수율
웨이퍼 맵은 칩들의 검사 결과를 위치별로 표시한 데이터입니다. 불량이 가장자리에 몰리는지, 특정 영역·방향에 집중되는지, 랜덤한지에 따라 전공정·장비·오염 문제를 추정할 수 있습니다.

**수율(%) = 정상 칩 수 ÷ 전체 칩 수 × 100** — 예: 1,000개 중 920개 정상이면 수율 92%. 수율은 제조 경쟁력의 핵심 지표로, 낮으면 같은 웨이퍼에서 판매 가능한 칩이 줄어 원가가 상승합니다.

# Ⅱ. 최종 테스트 (출하 판정)
패키징이 완료된 제품이 실제 사용 조건에서 정상 동작하는지 확인하는 검사입니다. 웨이퍼 테스트가 칩 단위 초기 선별이라면, 최종 테스트는 패키지 완성품 기준의 출하 판정입니다.

### 주요 검사 항목
| 검사 항목 | 의미 |
|---|---|
| 전기적 특성 검사 | 전압·전류·누설·저항 확인 |
| 기능 검사 | 제품 기능 정상 동작 확인 |
| 속도 검사 | 목표 동작 주파수 만족 확인 |
| 온도 조건 검사 | 고온·저온 정상 동작 확인 |
| 오픈/쇼트 검사 | 패키지 단자 연결 상태 확인 |
| 소비전력 검사 | 전력 소모가 기준 이내인지 확인 |

### Burn-in Test
일정 시간 동안 높은 온도와 전기적 스트레스를 가해 초기 불량을 찾아내는 시험입니다. 모든 제품에 적용되는 것은 아니며, 신뢰성 요구 수준에 따라 적용 여부·조건이 달라집니다.

## 신뢰성 시험
제품이 장기간 사용 환경을 견디는지 평가합니다.

| 시험 | 목적 |
|---|---|
| 고온 보관 시험 | 고온 환경 내구성 |
| 온도 사이클 시험 | 반복 열팽창·수축 손상 |
| 습도 시험 | 수분 침투·부식 가능성 |
| 낙하/충격 시험 | 기계적 충격 내구성 |
| 솔더 접합 신뢰성 시험 | 보드 실장 후 접합부 내구성 |

## 출하 품질 관리
최종 테스트를 통과한 제품은 포장·출하됩니다. 중요한 것은 합격 여부만이 아니라 **추적성**입니다. 제조 일자·로트·장비·작업 조건·검사 결과가 연결되어 있어야 문제 발생 시 원인을 빠르게 찾을 수 있습니다. 스마트팩토리 관점에서는 MES·설비·검사·물류 데이터가 연결되어 특정 공정·장비·재료 로트와의 관계를 분석할 수 있어야 합니다.

## 응용: 고급 패키징 기술
칩 미세화만으로 성능 향상이 어려워지면서, 여러 칩을 하나의 패키지에 통합하거나 수직으로 쌓는 패키징 기술이 중요해지고 있습니다.
- **SiP (System in Package)**: 프로세서·메모리·RF·센서 등 여러 기능 칩을 하나의 패키지에 통합.
- **2.5D 패키징**: 여러 칩을 인터포저 위에 배치해 고속 연결. HPC·AI 가속기·HBM에 활용.
- **3D 패키징 / TSV**: 칩을 수직으로 쌓아 집적도 향상. TSV(Through Silicon Via)는 실리콘을 관통하는 수직 전기 연결.
- **팬아웃 패키징**: 칩 주변으로 재배선층을 확장해 더 많은 I/O를 구현. 모바일·박형·고성능 제품에 활용.

## 학문적 심화
### 테스트는 측정 시스템이다
테스트 결과는 제품 특성뿐 아니라 측정 시스템의 정확도, 반복성, 접촉 안정성에도 영향을 받습니다. 양품이 소켓 접촉 불량 때문에 불량으로 판정되는 경우를 **False Fail**이라 하고, 불량품이 테스트를 통과해 출하될 수 있는 경우를 **Test Escape**라고 합니다. 양산에서는 두 오류를 모두 줄이는 것이 중요합니다.

| 오류 유형 | 의미 | 영향 |
|---|---|---|
| False Fail | 양품을 불량으로 판정 | 수율 손실, 재검 비용 증가 |
| Test Escape | 불량품을 양품으로 판정 | 고객 불량, 신뢰성 리스크 |
| Guard Band | 판정 한계에 여유를 둠 | 출하 품질과 수율의 균형 |

### Burn-in과 Arrhenius 가속
Burn-in은 고온·전압 스트레스로 잠재 불량을 조기에 드러내는 시험입니다. Arrhenius 모델은 온도가 올라갈수록 열활성화 고장 메커니즘이 빨라진다고 설명합니다. 단, 모든 고장 메커니즘이 같은 활성화 에너지를 갖는 것은 아니므로, 실제 제품에서는 시험 조건의 타당성 검증이 필요합니다.

### DPMO와 수율 해석
수율은 제품 단위의 합격률이고, DPMO는 결함 발생 기회당 결함 수입니다. 복잡한 제품일수록 한 제품 안에 결함 기회가 많아지므로, 단순 불량률보다 DPMO가 공정 개선 우선순위를 잡는 데 유용합니다.

### 실습 시뮬레이터 관찰 항목
- 고온/저온 조건 → 전기적 마진과 누설 특성 변화
- 전압 변동 증가 → 파라메트릭 불량 가능성 증가
- Burn-in 온도 증가 → Acceleration Factor 증가, 과도 조건은 스트레스 손상 가능
- 최종 수율은 이전 공정 수율과 테스트 조건의 조합으로 해석

## 정리
검사·테스트는 후공정의 처음(웨이퍼 테스트)과 끝(최종 테스트)을 지키는 품질 관문입니다. 조기 선별로 비용을 줄이고, 최종 검증·신뢰성 시험으로 출하 품질을 보증하며, 데이터 추적성으로 지속적인 공정 개선을 가능하게 합니다.`
  }
};

const theoryDataEn: Record<TheoryKey, TheoryChapter> = {
  dicing: {
    title: "Dicing: precision separation of a wafer into individual dies",
    content: `Dicing separates the fabricated wafer into individual dies by cutting along the street or scribe-line area. It is a mechanical and thermal precision process, not a simple cutting step.

## Learning goals
- Explain why dicing is performed after wafer test
- Identify street, scribe line, kerf, blade, coolant, dicing tape, and chuck table
- Relate RPM, feed rate, coolant flow, and blade wear to chipping and yield
- Understand brittle fracture and why silicon cracks easily under local stress

## Core theory
Silicon has high hardness but low tolerance for tensile crack propagation. During blade dicing, a rotating diamond blade removes material while coolant carries away heat and debris. If the mechanical load or heat is excessive, edge chipping, microcracks, burrs, and particle contamination increase.

> Flow: wafer mounting → alignment → X/Y cutting → cleaning → die inspection → die bonding

## Academic deepening
### Griffith brittle fracture
Silicon is a brittle material. A small pre-existing flaw can grow when the local stress intensity exceeds the material's fracture toughness. This is why edge quality, vibration, and blade wear strongly influence reliability.

### Cutting heat and kerf stability
Cutting heat increases with cutting force and relative velocity. Higher RPM alone does not guarantee better quality; if coolant and debris removal are insufficient, blade loading and chipping can worsen. Kerf width is mainly determined by blade thickness, side wear, runout, and vibration.

| Variable | Main effect | Failure risk |
|---|---|---|
| Blade RPM | surface finish, heat generation | thermal damage |
| Feed rate | throughput, mechanical load | backside chipping |
| Coolant flow | cooling, debris removal | heat damage, particles |
| Blade wear | cutting efficiency | unstable kerf, cracks |

## Simulator interpretation
Increase feed rate to observe higher chipping. Reduce coolant to observe higher cutting temperature. Increase blade wear to understand why worn blades destabilize kerf width and lower predicted yield.`
  },
  dieBonding: {
    title: "Die Bonding: attaching a die to a leadframe or substrate",
    content: `Die bonding fixes the separated silicon die onto a leadframe, package substrate, ceramic carrier, or interposer. It defines the mechanical support, heat path, and alignment basis for later wire bonding or molding.

## Learning goals
- Explain the role of epoxy, DAF, solder, leadframe, and substrate
- Relate dispense volume, pressure, cure temperature, and cure time to bond quality
- Understand voids, die tilt, adhesive bleed, and incomplete cure

## Core theory
The die attach layer must provide adhesion, thermal conduction, stress relief, and positional stability. Too little adhesive causes poor bonding; too much adhesive can contaminate pads or create uncontrolled fillets.

## Academic deepening
### Thermal resistance
The die attach layer is part of the heat path:

> R_th ≈ t / (k × A)

where t is attach thickness, k is thermal conductivity, and A is contact area. Excessive thickness or voiding increases thermal resistance and creates hot spots.

### Arrhenius cure behavior
Epoxy curing is a temperature-dependent chemical cross-linking reaction. Insufficient time or temperature leaves the material under-cured. Excessive thermal exposure can increase residual stress or material degradation.

### Rheology and dispensing
Dispense volume depends on viscosity, pressure, dispense time, and nozzle geometry. Viscosity changes with temperature, storage age, and filler loading, so a fixed pneumatic condition does not always produce the same dot volume.

| Variable | Too low | Too high |
|---|---|---|
| Dispense amount | weak attach, voids | bleed, contamination |
| Bond pressure | poor wetting | die crack, squeeze-out |
| Cure temp/time | incomplete cure | stress, degradation |

## Simulator interpretation
Use epoxy volume and pressure to observe attach thickness. Use cure time and temperature to observe cure degree. Voids should be interpreted as thermal and mechanical reliability risks.`
  },
  wireBonding: {
    title: "Wire Bonding: forming electrical interconnects between die pads and package terminals",
    content: `Wire bonding connects chip pads to leadframe or substrate pads using fine Au, Al, or Cu wires. It remains widely used because it is mature, flexible, and cost-effective.

## Learning goals
- Explain ball bonding, wedge bonding, capillary, loop height, and stitch bond
- Relate ultrasonic power, force, temperature, loop height, and wire length to defects
- Understand IMC growth, Kirkendall voids, cratering, wire sweep, and die-edge shorts

## Core theory
Thermosonic bonding combines heat, ultrasonic energy, and force. These break surface films, activate the metal interface, and create a solid-state bond.

## Academic deepening
### Three bonding energies
| Factor | Role | Excess risk |
|---|---|---|
| Heat | promotes diffusion | IMC overgrowth, Kirkendall voiding |
| Ultrasonic power | breaks oxide and activates interface | pad cratering |
| Force | increases real contact area | pad damage, die cracking |

### IMC and Kirkendall voiding
Au-Al interfaces form intermetallic compounds. Controlled IMC is necessary, but high-temperature storage can create voids because Au and Al diffuse at different rates. These voids reduce bond strength and can cause electrical opens.

### Loop mechanics
Low loop height can touch the die edge and cause shorts. Long wires increase sag and parasitic inductance. During molding, resin flow can sweep long or weakly supported wires.

## Simulator interpretation
Increase loop length to observe sag risk. Lower loop height to understand die-edge short risk. Treat excessive ultrasonic power or force as a pad-cratering risk, not merely a stronger bond.`
  },
  molding: {
    title: "Molding: encapsulating the die and interconnects with protective resin",
    content: `Molding protects the die, wires, and bonding interfaces from moisture, contamination, mechanical impact, and electrical stress. Transfer molding with EMC is common in high-volume packaging.

## Learning goals
- Explain EMC, mold chase, cavity, gate, flow front, cure, and clamping force
- Relate transfer pressure, mold temperature, preheat, cure time, and clamp force to defects
- Understand voiding, delamination, wire sweep, flash, short shot, and package cracking

## Core theory
EMC is an epoxy-based composite containing resin, filler, curing agent, and additives. It must flow into the cavity, fill around wires and dies, cure, and remain reliable through thermal and humidity stress.

## Academic deepening
### Flow model
Molding flow can be approximated by viscous laminar flow. In a narrow path, flow rate increases with pressure difference and decreases with viscosity and flow resistance. Real EMC is more complex, but the pressure-viscosity-cavity relationship remains central.

### Cure shrinkage and residual stress
EMC shrinks chemically during curing and thermally during cooling. CTE mismatch between silicon, metal, substrate, and EMC creates stress that can cause delamination or package cracking.

### Wire sweep
The resin flow front applies drag force to wires. Higher flow velocity, high viscosity, long wire length, and high loop profile can increase sweep and short risk.

| Variable | Benefit | Risk |
|---|---|---|
| Transfer pressure | better fill | flash, wire sweep |
| Mold temperature | lower viscosity, faster cure | premature gel, stress |
| Clamp force | suppresses flash | tool stress |
| Cure time | package strength | throughput loss |

## Simulator interpretation
Increase transfer pressure to see faster filling. Reduce clamp force in concept to understand flash. Interpret low cure degree as a reliability issue, not only a cosmetic defect.`
  },
  test: {
    title: "Inspection and Test: screening defects and verifying outgoing quality",
    content: `Inspection and test determine whether dies and packaged devices meet electrical, visual, and reliability requirements. Testing protects customer quality and provides feedback to upstream process steps.

## Learning goals
- Distinguish wafer test, final test, burn-in, and reliability test
- Explain ATE, probe pins, DUT, socket board, open/short, leakage, and parametric test
- Understand yield, DPMO, false fail, test escape, and guard band

## Core theory
Final test verifies electrical behavior under specified voltage and temperature conditions. Burn-in uses elevated temperature and electrical stress to expose latent early-life defects.

## Academic deepening
### Test as a measurement system
Test results depend not only on device quality but also on contact resistance, socket wear, calibration, noise, and measurement repeatability. A good unit failing due to poor contact is a false fail. A bad unit passing test is a test escape.

### Arrhenius acceleration
Thermally activated failure mechanisms accelerate at high temperature. Arrhenius modeling relates temperature to acceleration factor, but real products require validation because different mechanisms have different activation energies.

### Yield and DPMO
Yield is the percentage of units that pass. DPMO counts defects per million opportunities, which is more useful when one product has many possible defect locations.

| Concept | Meaning | Risk |
|---|---|---|
| False fail | good unit rejected | yield loss |
| Test escape | bad unit shipped | customer failure |
| Guard band | margin around limit | yield-quality tradeoff |

## Simulator interpretation
Change temperature and voltage variation to observe electrical margin effects. Increase burn-in temperature or time to understand acceleration and early-failure screening. Interpret final yield as a combined result of upstream process yields and test conditions.`
  }
};

const theoryDataAr: Record<TheoryKey, TheoryChapter> = {
  dicing: {
    title: "التقطيع: فصل الرقاقة إلى شرائح منفردة بدقة",
    content: `التقطيع يفصل الرقاقة المصنعة إلى شرائح منفردة عبر خطوط الفصل أو الـ Scribe Lines. هذه العملية ليست قصا بسيطا، بل عملية دقيقة تتأثر بالإجهاد والحرارة والاهتزاز والتبريد.

## أهداف التعلم
- فهم الشارع، عرض القطع، الشفرة، سائل التبريد، شريط التقطيع، وطاولة التثبيت
- ربط سرعة التغذية وسرعة الشفرة والتبريد بتكسر الحواف والعائد
- فهم الكسر الهش في السيليكون

## تعمق أكاديمي
السيليكون مادة هشة. حسب مفهوم Griffith للكسر، يمكن للعيب الصغير أن ينمو عندما يتجاوز تركيز الإجهاد حد مقاومة الكسر. لذلك يؤدي تآكل الشفرة أو الاهتزاز أو نقص التبريد إلى Microcracks وChipping.

| المتغير | الأثر | الخطر |
|---|---|---|
| سرعة الشفرة | جودة السطح والحرارة | تلف حراري |
| سرعة التغذية | الإنتاجية والحمل | تكسر خلفي |
| التبريد | إزالة الحرارة والمخلفات | جسيمات وتلف حراري |
| تآكل الشفرة | استقرار القطع | عرض قطع غير مستقر |

## تفسير المحاكي
زيادة سرعة التغذية ترفع التكسر. تقليل التبريد يرفع درجة القطع. زيادة تآكل الشفرة تخفض استقرار القطع والعائد المتوقع.`
  },
  dieBonding: {
    title: "ربط القالب: تثبيت الشريحة على إطار الرصاص أو الركيزة",
    content: `ربط القالب يثبت شريحة السيليكون على Leadframe أو Substrate ويحدد مسار الحرارة والدعم الميكانيكي ومحاذاة العمليات اللاحقة.

## أهداف التعلم
- فهم الإيبوكسي وDAF واللحام والركيزة
- ربط كمية الإيبوكسي والضغط ودرجة/زمن المعالجة بجودة الربط
- فهم الفراغات، ميلان القالب، وتلوث اللاصق

## تعمق أكاديمي
مقاومة الحرارة في طبقة اللصق تقريبا:

> R_th ≈ t / (k × A)

زيادة السمك أو وجود فراغات يرفع المقاومة الحرارية ويولد نقاطا ساخنة. كما أن معالجة الإيبوكسي تتبع سلوكا حراريا قريبا من نموذج Arrhenius؛ نقص الحرارة أو الزمن يسبب معالجة غير مكتملة.

| المتغير | منخفض جدا | مرتفع جدا |
|---|---|---|
| كمية الإيبوكسي | ضعف التصاق | تلوث وانتشار زائد |
| الضغط | فراغات وضعف بلل | كسر القالب |
| المعالجة | عدم اكتمال | إجهاد حراري |

## تفسير المحاكي
راقب تغير سمك طبقة الالتصاق والفراغات ودرجة المعالجة عند تغيير الكمية والضغط والزمن.`
  },
  wireBonding: {
    title: "ربط الأسلاك: إنشاء التوصيل الكهربائي بين الشريحة والحزمة",
    content: `ربط الأسلاك يصل Pads الشريحة بأطراف الحزمة باستخدام أسلاك دقيقة من الذهب أو الألمنيوم أو النحاس.

## أهداف التعلم
- فهم Capillary وLoop Height وStitch Bond وBall Bond
- ربط الطاقة فوق الصوتية والقوة والحرارة بطبقة الربط
- فهم IMC وKirkendall Void وCratering وWire Sweep

## تعمق أكاديمي
الربط الحراري الصوتي يعتمد على الحرارة والطاقة فوق الصوتية والقوة. الحرارة تزيد الانتشار، الطاقة فوق الصوتية تكسر الأكسيد وتنشط السطح، والقوة تزيد مساحة التلامس الحقيقية.

| العامل | الدور | خطر الزيادة |
|---|---|---|
| الحرارة | نشر معدني | نمو IMC زائد |
| الطاقة فوق الصوتية | تنشيط السطح | Cratering |
| القوة | تلامس جيد | تلف Pad |

انخفاض الحلقة قد يسبب تماس حافة القالب، وطول السلك يزيد الترهل والحث الطفيلي.

## تفسير المحاكي
زيادة طول السلك ترفع خطر الترهل. انخفاض ارتفاع الحلقة يزيد خطر القصر عند حافة القالب.`
  },
  molding: {
    title: "القولبة: تغليف الشريحة والتوصيلات بمركب واق",
    content: `القولبة تحمي الشريحة والأسلاك وواجهات الربط من الرطوبة والصدمات والتلوث. في الإنتاج الكمي يستخدم غالبا EMC في قولبة النقل.

## أهداف التعلم
- فهم EMC والقالب والتجويف والبوابة وجبهة التدفق
- ربط الضغط ودرجة حرارة القالب والزمن وقوة التثبيت بالعيوب
- فهم الفراغات والانفصال وWire Sweep وFlash وShort Shot

## تعمق أكاديمي
يمكن تقريب تدفق EMC كتدفق لزج داخل قناة ضيقة. يزداد التدفق مع الضغط وينخفض مع اللزوجة ومقاومة المسار. أثناء المعالجة يحدث انكماش كيميائي، وبعد التبريد يحدث انكماش حراري. اختلاف CTE بين السيليكون والمعدن وEMC يولد إجهادا متبقيا.

| المتغير | الفائدة | الخطر |
|---|---|---|
| ضغط النقل | ملء أفضل | Flash وWire Sweep |
| حرارة القالب | لزوجة أقل | تصلب مبكر |
| قوة التثبيت | تقليل Flash | إجهاد الأداة |

## تفسير المحاكي
زيادة الضغط تسرع الملء. انخفاض درجة المعالجة يعني مشكلة موثوقية وليس مظهرا فقط.`
  },
  test: {
    title: "الفحص والاختبار: فرز العيوب والتحقق من جودة الشحن",
    content: `الفحص والاختبار يحددان ما إذا كانت الشرائح أو الحزم تحقق المواصفات الكهربائية والبصرية والموثوقية.

## أهداف التعلم
- التمييز بين اختبار الرقاقة والاختبار النهائي وBurn-in
- فهم ATE وDUT وSocket وOpen/Short وLeakage
- فهم Yield وDPMO وFalse Fail وTest Escape

## تعمق أكاديمي
الاختبار نظام قياس. النتيجة تتأثر بجودة المنتج وأيضا بمقاومة التلامس ومعايرة الجهاز وتآكل المقبس والضجيج. رفض وحدة سليمة بسبب تماس سيئ يسمى False Fail، ومرور وحدة معيبة يسمى Test Escape.

Burn-in يستخدم حرارة وجهدا أعلى لكشف عيوب العمر المبكر. نموذج Arrhenius يربط الحرارة بعامل التسريع، لكن يجب التحقق من صلاحية الشرط لكل آلية فشل.

| المفهوم | المعنى | الخطر |
|---|---|---|
| False Fail | رفض وحدة جيدة | فقدان العائد |
| Test Escape | شحن وحدة سيئة | فشل عند العميل |
| Guard Band | هامش حول الحد | توازن العائد والجودة |

## تفسير المحاكي
غيّر درجة الحرارة وتذبذب الجهد لملاحظة هامش الأداء. ارفع حرارة أو زمن Burn-in لفهم تسريع الأعطال المبكرة.`
  }
};

export function getTheoryChapter(key: TheoryKey, language: TheoryLanguage): TheoryChapter {
  if (language === 'en') return theoryDataEn[key];
  if (language === 'ar') return theoryDataAr[key];
  return theoryData[key];
}
