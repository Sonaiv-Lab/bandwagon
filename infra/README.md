## Infra 
### 手動部署 -> IaC 的演進決策

隨著應用分成多個 Service，Infra 的各種設定會更加複雜：

- 要讓 Spot VM 可以自動重啟，需要設定 MIG
- VM 啟動
- Network, DNS, Address 等

這時候有兩個選擇，一個是使用 scripts 來紀錄，然後透過 gcloud CLI 控制及自動化，另一個是用 IaC 工具，Terraform 是其中一個選項，使用 IaC 有幾個好處

- 透過 diff 會自動執行 mutation
- 宣告式的寫法較直覺，隱藏執行細節本身
- 讓 Infra 設計可迭代，可版本化

長期而言，學習成本會遠小於維護的成本，infra 的迭代也更順利、可移植。如果整個應用開始有多個服務設定，這會是值得的投資。

### Server 服務類型考量

前面提到有這些 services，每個 Service 有不同適合的 IaaS 基礎設施類型

- job orchestrator：Compute Engine
    - 需要常駐、穩定
- stable job worker：Cloud run
    - 僅比賽時需要啟動
    - 需要高擴展性：利用 Cloud run 的自動擴展
- best-effort job worker：Spot VM
    - 不需即時執行，只需要持續消化任務，無須常駐、穩定的 server
    - 利用 Spot VM 的低成本 (50% 以下)，配合 auto restart，獲得長期經濟效益
- API server：Cloud run
    - 需要常駐，需要高可用性，低延遲
    - 應用性質為 read heavy，大部分資料可以 cache，只有少量資料具即時性 （TTL 短）

為什麼不用 K8s？

- 單純 K8s 需要學習成本
- 常駐一個 K8s service 的設定複雜，還需要考慮可靠性問題。但使用  cloud service(e.g. GKE) 價格不菲，一個月在 3000 台幣以上
- 需要自動擴展的服務複雜度不高，可以僅依靠 API or 排程控制

### 服務儲存考量

在整個服務有四類資料需要進行儲存（可以參考[資料儲存策略](/README.md#資料儲存策略)），四類資料對應到不同的儲存服務性質

- 主結構化資料：Document store
    - 原使用 Firestore
        - Pros
            - 減少部署問題
            - Firestore 主要開銷來自於讀取，但可透過 CDN 來大幅減少讀取次數降低開銷
            - 提供 SDK 加快開發速度
            - 有免費額度
        - Cons
            - 預覽 Query 很麻煩
            - Migration 麻煩，需要自己寫 scripts
            - 沒有 CDC，只有 event，但 event 價格不菲（需要 read）
            - SDK 需要一些學習成本
            - Data model 為 Document base，跟 Relational 的心智模型不同，有學習成本
            - TypeScript 不友好
    - 後來覺得用 Postgres 較好，可以自架 or Cloud SQL
        - Pros
            - 學習成本較低
            - 生態完整
                - extension 多
                - 可使用 ORM
                - ORM 意味著 TypeScript 友好，易於整個 Data Schema
                - Migration 有既有生態工具
                - 有 CDC
                - 可以用 JSONB 儲存 / 查詢 document 資料
            - 不依吞吐量計價（或極小）
        - Cons
            - 自架維護相對麻煩，而 Cloud SQL 需要一定價格，對開發機而言不友好
- snapshot：Storage Store
    - Google Cloud Storage
    - 儲存便宜，適合儲存沒有結構，不需要複雜 query 的資料
    - 如果有需要儲存 metadata，再使用 Relational store 儲存
- pipeline audit：Relational store
    - Googl Cloud SQL (Postgres)
      - 使用 Cloud service 能大量降低維運成本像是重啟、持久儲存、環境設定、logging 等，也跟其他 service 的串接更順利
- jobs data：Relational store
    - Googl Cloud SQL (Postgres)

