# CHANGES

## Birim testleri eklendi

### Kararlar

- **Test framework:** Proje Create React App (`react-scripts` 2.1.1) kullanıyor; Jest + jsdom
  zaten dahil. Yeni framework kurulmadı, `npm test` ile çalışır.
- **Ek bağımlılık yok:** React Testing Library / Enzyme eklenmedi. React 16.6 ile uyumlu sürüm
  seçme ve lock dosyalarını değiştirme riskine girmemek için React ile birlikte gelen
  `react-dom/test-utils` (`Simulate`) kullanıldı. `package.json`, `package-lock.json` ve `yarn.lock`
  değişmedi.
- **Refactor yok:** Kaynak kod mevcut haliyle test edilebilir olduğu için üretim koduna dokunulmadı.
  - `BooksAPI.js` token'ı modül yüklenirken `localStorage`'dan okuyor/oluşturuyor. Bunu kodu
    değiştirmek yerine testlerde `jest.resetModules()` + `require` ile modülü her testte yeniden
    yükleyerek ele aldım.
  - `fetch`, `global.fetch = jest.fn()` ile mock'landı; gerçek ağ çağrısı yapılmıyor.
- **`src/index.js` test edilmedi:** Yalnızca `ReactDOM.render` çağıran giriş noktası; mantık
  içermiyor.

### Eklenen/güncellenen testler

- `src/App.test.js` (genişletildi): varsayılan görünüm, 3 rafın sırası, kitapların raflara
  dağılımı, kapak/yazar bilgisi, raf değiştirici seçenekleri ("Move to..." disabled),
  "Add a book" → arama sayfası, "Close" → ana sayfa, tekrar tekrar geçiş.
- `src/BooksAPI.test.js` (yeni): token oluşturma ve mevcut token'ı yeniden kullanma, `get`,
  `getAll`, `update`, `search` için URL/method/header/body doğrulaması ve dönüş değerleri,
  `books` alanı olmayan arama yanıtı, ağ hatasının çağırana iletilmesi.

### Doğrulama

`CI=true npx react-scripts test --env=jsdom --coverage` → 2 suite, 17 test geçti.
Kapsam: `App.js` %100, `BooksAPI.js` %100 (`index.js` %0, yukarıda açıklandı).
Ortam: Node 26.5.0, npm 12.0.1.

## 2026-09-24 — Yeniden doğrulama

Repo tekrar "eksik unit testleri yaz" talimatıyla gözden geçirildi. `src/` altında mantık
içeren tek dosyalar `App.js`, `BooksAPI.js` ve `index.js`; ilk ikisi zaten yukarıdaki testlerle
%100 stmt/branch/func/line kapsamında (`CI=true npx react-scripts test --env=jsdom --coverage`
ile doğrulandı, 2 suite / 17 test geçti). `index.js` yine yalnızca `ReactDOM.render` çağırıyor,
ek mantık yok. Kapsanmamış bir dal, fonksiyon veya hata yolu bulunamadı; bu nedenle yeni test
veya refactor eklenmedi, kod değişikliği yapılmadı.
