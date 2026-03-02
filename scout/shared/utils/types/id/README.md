## 棒球資訊 ID 設計

### 賽事 ID 設計

如果要設計一個能夠對應到世界上任何一場棒球比賽的「id」，應該考慮哪些事情？

需要揭露的賽事資訊
- 年份
- 賽事單位：例如聯盟 / 聯賽 / 層級（3A, 2A, A+, 一軍, 二軍等）
- 賽事類型：例如例行賽、季後賽、挑戰賽等
- 賽事編號：需要能夠對上各賽事網站、資訊上可搜尋的編號

這個 ID 還需要承載哪些功能
- 人類需要可讀，因此不能使用 hash 類的ID 例如 UUID 等。需要是語意化 ID (Sementic ID)
- 使用情境
    - 可能會放到 URL 裡面
        - 把可用的字元限制在 ASCII 中
    - 可能被使用在不同的程式語言、情境
        - 例如可能在 Python, Javascript, Kotlin, Swift, Dart 等等
        - 可能被用在「檔案名稱」，例如比賽影片的檔名等
            - 大小寫區別，在不同作業系統可能有錯誤
        - => 使用 kebab case，而非以大小寫區分的 Camel case
- 可以直接對 ID 作「篩選」
    - 需要把比賽的資訊放到 ID 裡面
- 可以直接對 ID 作「order」
    - ID 的字串設計上需要能夠排序，不能使用 UUID 且長度、組合需要固定
    - 字元排序結果需要符合常用設計，以賽事先後順序排序
    - 類型相同比賽應該在同一區
- 可以直接對 ID 作「分組」
    - 以棒球的需求而言，比起同比賽類型 / 層級，尋找同年份的搜尋更常被使用。首先需要能夠以「年份」作分組
- 可以透過兩個 ID 來作「範圍」的表示，兩個 ID 

實際的設計為

以[這場](https://www.mlb.com/gameday/padres-vs-dodgers/2024/03/21/746175/final/box) 2024/03/21 ，教士 vs 道奇的大聯盟比賽為例，賽事 ID 為 `2024-mlb-a-778251`

|      | 資訊                   | value  |                                                 |
| ---- | -------------------- | ------ | ----------------------------------------------- |
| 年份   | 2024                 | 2024   |                                                 |
| 賽事單位 | 大聯盟                  | mlb    | MLB 的例行賽中，有聯盟內部打，也有國聯 vs 美聯，因此在比賽單位中，只紀錄到 `mlb` |
| 賽事類型 | 例行賽 (regular season) | rs     |                                                 |
| 賽事編號 |                      | 778251 | 沿用 mlb 內部的 game_pk                              |

另外[這場](https://www.mlb.com/gameday/brewers-vs-dodgers/2025/10/17/813031/final/box) 2025 國聯冠軍賽 ID 則為：`2025-mlb-nlcs-813031`

|      | 資訊       | value  |
| ---- | -------- | ------ | 
| 年份   | 2025     | 2025   |
| 賽事單位 | 大聯盟      | mlb    |
| 賽事類型 | 國聯冠軍賽 | nlcs   |
| 賽事編號 |          | 778251 |  

### 賽事事件 ID 設計

除比賽外，棒球賽事還有其他事件需要考慮

- Game：比賽資訊
- GamePlay：比賽進行資訊
- Inning：局
- Pitch：每一個「投球」

在設計 ID 時需要考慮
- 一樣需要考慮人類可讀性
    - 在 ID 資訊區塊中，用 `__` 雙底線作區隔
        - 視覺上與 `-` hyphen 做出更明顯的區隔
- ID 彼此之間要有「從屬」關係，例如每個 Pitch 需要在 Inning 之下，而 Inning 又需要在 GamePlay 之下
    - 階層化 ID 設計
- 其他 Game ID 的考量也需要納入

以前面提到的 2025 [國聯冠軍賽](https://www.mlb.com/gameday/brewers-vs-dodgers/2025/10/17/813031/final/box)，山本由伸完封的[最後一球](https://baseballsavant.mlb.com/gamefeed?date=10/15/2025&gamePk=813034&chartType=pitch&legendType=pitchName&playerType=pitcher&inning=&count=&pitchHand=&batSide=&descFilter=&ptFilter=&resultFilter=&hf=pitchVelocity&sportId=1&liveAb=#813034)為例

- GameId：`2025-mlb-nlcs-813031`
- GamePlayId：`2025-mlb-nlcs-813031__1015`
- Inning：`2025-mlb-nlcs-813031__1015__09-1`
    - 有可能會打到雙位數局數，使用 2 位數字並 pad
    - 用 0, 1 表示上半局，下半局
- Pitch：`2025-mlb-nlcs-813031__1015__09-1__0014`
    - `0014` 代表當局的「第幾球」

### Game / GamePlay

棒球比賽有特別的狀況：比賽有可能因雨延賽，或保留而之後繼續把。因此一場比賽需要區分賽事（Game），以及進行的比賽（GamePlay），一的 Game 可能有多場 GamePlay。彼此為一對多的關係

- Game
    - 官方排定的賽事
    - 會紀錄對戰隊伍
    - 預定日期
- GamePlay
    - 實際日期
    - 比賽事件：例如局數、投球等

例如，原本的中華職棒 2025/4/20 (日) 的例行賽，打到四局上半[因雨保留](https://cpbl.com.tw/news/cont?SId=0P089442528282841240)，移至 6/29 (日)。紀錄的 ID 結構為

-  `2025-cpbl-a-00047`
    -  `2025-cpbl-a-00047__0420`
    -  `2025-cpbl-a-00047__0629`