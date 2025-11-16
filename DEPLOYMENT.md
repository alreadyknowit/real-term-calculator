# GitHub Pages Deployment Rehberi

Bu uygulama GitHub Pages'ta yayınlanmak üzere yapılandırılmıştır.

## Deployment Adımları

### 1. GitHub Repository Ayarları

1. GitHub repository'nizde **Settings** > **Pages** bölümüne gidin
2. **Source** altında **GitHub Actions** seçeneğini seçin

### 2. package.json'da Homepage URL'ini Güncelleme

`package.json` dosyasındaki `homepage` değerini kendi kullanıcı adınız ve repo adınızla değiştirin:

```json
"homepage": "https://KULLANICI_ADINIZ.github.io/REPO_ADINIZ"
```

Örnek:
```json
"homepage": "https://demir.github.io/real-term-calculator"
```

### 3. Deployment

#### Otomatik Deployment (Önerilen)

Repository'nizi `main` branch'ine her push yaptığınızda, GitHub Actions otomatik olarak uygulamanızı build edip deploy edecektir.

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

#### Manuel Deployment

Alternatif olarak manuel deployment yapabilirsiniz:

```bash
npm run deploy
```

Bu komut:
1. Uygulamanızı build eder (`npm run build`)
2. Build klasörünü `gh-pages` branch'ine push eder

## Kontrol

Deployment tamamlandıktan sonra uygulamanız şu adreste yayında olacak:
`https://KULLANICI_ADINIZ.github.io/REPO_ADINIZ`

GitHub Actions workflow'unun durumunu **Actions** sekmesinden kontrol edebilirsiniz.

## Notlar

- İlk deployment 1-2 dakika sürebilir
- DNS değişikliklerinin yayılması biraz zaman alabilir
- Değişiklikler anında görünmüyorsa tarayıcı cache'ini temizleyin (Ctrl+Shift+R veya Cmd+Shift+R)
