# Parse 
- 要去思考這個階段要找出來的錯誤
- 如果是一些 enum 有錯，應該要即時更改才對
- 有錯要怎麼處理？報錯 + 改成 default 值？觀測性很重要



# 比賽相關資訊

## 比賽狀態

###  延賽
- 會有多場比賽
- 第一場
  - PresentStatus = 0
  - GameResult = 1
  - "GameDateTimeS": 會是正常的開賽時間
  - ReserveDate: 應該要延賽的時間，但當下不一定會有，會等 CPBL 定時間
  - 會有投手資訊
  - "MultyGame": ""
- 第二場
  - PresentStatus = 1
  - GameResult = 0
  - GameDateTimeS:  會是「第一場」的開賽時間
  - PreExeDate: 「第二場」開始的時間
  - "MultyGame": "N"


### 保留
  - 會有多場比賽 => 結束的那場 MultiGame: ""
  - 第一場
   - PresentStatus = 0
   - GameResult = 1
   - "GameDateTimeS": 會是正常的開賽時間
   - ReserveDate: 應該要延賽的時間，但當下不一定會有，會等 CPBL 定時間
   - 不會有投手資訊 (? 為啥？？)，看要不要自己記
   - "MultyGame": "" 
   - 會有分數
   
  - 第二場
   - PresentStatus = 1
   - GameResult = 0
   - GameDateTimeS:  會是「第一場」的開賽時間
   - "MultyGame": "N"