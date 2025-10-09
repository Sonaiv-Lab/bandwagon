## page link

```
https://www.cpbl.com.tw/box/index?gameSno=303&year=2025&kindCode=A
```

## API request

```
curl 'https://www.cpbl.com.tw/box/getlive' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8' \
  -b 'FSize=M; __RequestVerificationToken=sf93qE7f8ZCEjrs6of23JKpKMm0aLpG9FUXh6q8dm91bV_xwhEG1TXCsC4vL4f58Q6ApcI_LEGvw1RzNUi6jiJYusw81; FSize=M' \
  -H 'origin: https://www.cpbl.com.tw' \
  -H 'priority: u=1, i' \
  -H 'referer: https://www.cpbl.com.tw/box/index?gameSno=303&year=2025&kindCode=A' \
  -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-gpc: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' \
  -H 'x-requested-with: XMLHttpRequest' \
  --data-raw '__RequestVerificationToken=YmxN5pRMI2h_Js2_9kO3R2Ky4dZhkoRlWpHHT6wwCmrh_nMNNYS2EvCRvpWoegwnlwDVGV-dsVh1aOXB4PiGe26zOx81&GameSno=303&KindCode=A&Year=2025&PrevOrNext=&PresentStatus=&SelectKindCode=A&SelectYear=2025&SelectMonth=9'
```


- `__RequestVerificationToken` 這個要從原本的找過來。但他原本是藏在網頁的 form 表單裡面
問題在說，這裡會重複使用？還是會一直拿新的。如果會重複使用的話，那就維持原本的設計
