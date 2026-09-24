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

## Yeniden doğrulama (2026-09-24)

Repo tekrar incelendi: kaynak kod (`App.js`, `BooksAPI.js`, `index.js`) önceki oturumdan beri
değişmemiş. `CI=true npx react-scripts test --env=jsdom --coverage` yeniden çalıştırıldı:
2 suite, 17 test geçti; `App.js` ve `BooksAPI.js` %100 kapsam, `index.js` yukarıdaki gerekçeyle
kasıtlı olarak test dışı. Eklenecek eksik test veya gereken refactor bulunmadı, dosya
değişikliği yapılmadı (bu not hariç).
