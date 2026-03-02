# Jumbotron
## 前端應用框架考量

原本使用 React Native 作開發，但中間遇到幾個問題
- 雙平台樣式不一致
- 沒有能力 Debug native 部分的能力，對於整體應用掌控低下。但要學習雙平台曲線又很高
- React Native 的 ios 在 Building 過程很容易有依賴問題，沒有 iOS 開發經驗難以除錯

後來嘗試使用 Flutter，這裡條列幾項在初步使用後的差異
- building 過程較容易
- 雙平台非常一致
- 生態比想像的完整、方便
- 在套件管理、環境設定方面比起 JS 成熟、單純
- 有類似 React hook 概念的套件可以使用

除了要重學語言和框架以外非常自在，轉換的疼痛程度比想像小。但如果未來需要考慮雙平台的開發，Flutter 與 React Native 之間應該如何選擇？

- 有沒有熟悉 Native 開發的成員
    - 有 => React Native，可協助除錯，或編寫控制的元件層
    - 無 => Flutter
- App 互動複雜
    - 無 => React Native 在基本的元件上已十分完善
    - 有 => Flutter 控制程度相對較高，並且在雙平台上呈現一致，尤其在 Animation 方面
- App 一致性要求
    - 高 => Flutter
    - 低 => React Native
- 遷移成本
    - 團隊大，既有 App 龐大 => React Native
    - 團隊小 & App 規模有限
- 有沒有同定位的 Web 應用
    - 有 => React Native 可以大量共用邏輯層、API 介接層
    - 無 => Flutter

縱上所述，React Native 更適合 App 單純、或者既有應用團隊作遷移。而 Flutter 更適合 0 至 1 的 App 開發，以及中小團隊、介面較自由的應用。