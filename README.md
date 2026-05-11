# סיידר בעיתו

**Sayder B'Ito – לוח שנה ולימוד תורני**

אפליקציית שולחן עבודה לניהול לימוד חומרים תורניים על גבי לוח שנה עברי.
המטרה: לעזור ללומד להגדיר תכנית לימוד (ש"ס, משניות, רמב"ם יומי, תנ"ך, או ספר מותאם אישית), לקבוע קצב או תאריך יעד, ולעקוב אחר ההתקדמות יום-יום על לוח שנה עברי.

> **סטטוס:** שלב 1 (MVP) – לוח שנה עברי עצמאי + אריזה ל-Windows. שכבת הלימוד תתווסף בהמשך.

## פיצ'רים בגרסה הנוכחית

- חלון תכנה מקומי (Electron) – לא דפדפן.
- תצוגת חודש עברי מלאה עם RTL וגופנים עבריים (Heebo + Frank Ruhl Libre).
- כל יום מציג: מספר עברי באותיות (`א'`, `י"ב`, `כ"ז`), תאריך לועזי, חגים, פרשת השבוע, ראש חודש, צומות, חוה"מ.
- ניווט חודש קודם/הבא + כפתור "היום". טיפול נכון באדר א'/ב' בשנה מעוברת ובמעבר אלול → תשרי.
- כרטיס תאריך מודגש בראש החלון שמשתנה לפי היום הנבחר.
- פאנל פרטי יום עם פרשה/אירועי היום וקטגוריזציה.
- אריזה ל-Windows: NSIS Installer + גרסה ניידת (Portable).

## דרישות

- [Node.js](https://nodejs.org/) גרסה 20 ומעלה (מומלץ 22).
- npm 10+.
- מערכת הפעלה: Windows / macOS / Linux (אריזה כרגע ל-Windows בלבד).

## התקנה למשתמש קצה

> אם פורסמה גרסה ב-[Releases](https://github.com/ChayaAlter/sayder/releases), מורידים משם את ה-Installer ומריצים. כרגע ניתן לבנות את ה-Installer מקומית – ראו "בניית installer" למטה.

לאחר בניית ה-Installer (או הורדה מ-Releases):

1. הרצת `Sayder-0.1.0-x64.exe` (NSIS Installer) – פותח אשף התקנה. ניתן לבחור תיקיית התקנה. ההתקנה היא **לכל משתמש** (Per-User) ולא דורשת הרשאות אדמין.
2. ההתקנה יוצרת קיצור דרך לשולחן העבודה ולתפריט Start בשם **סיידר בעיתו**.
3. לחילופין: גרסה ניידת `Sayder-Portable-0.1.0.exe` רצה ישירות בלי התקנה.

הסרה: דרך "Apps & features" של Windows, או הרצת ה-Uninstaller מתפריט Start. נתוני אפליקציה נמחקים בעת הסרה.

## התקנה והרצה (פיתוח)

```powershell
git clone https://github.com/ChayaAlter/sayder.git
cd sayder
npm install
npm run dev
```

הפקודה האחרונה תפתח חלון אפליקציה עם לוח השנה. שינויים בקוד יטענו מחדש אוטומטית (HMR לרכיבי React, restart לתהליך ה-main).

## פקודות נוספות

| פקודה | תיאור |
| --- | --- |
| `npm run dev` | מריץ את האפליקציה במצב פיתוח. |
| `npm run typecheck` | בדיקת טיפוסים של renderer + main + preload. |
| `npm run build` | בילד פרודקשן ל-`out/`. |
| `npm run preview` | מריץ את הבילד שנוצר. |
| `npm run build:win` | בילד + אריזת installer ל-Windows (NSIS + Portable). פלט ב-`release/`. |
| `npm run dist` | אריזה לכל הפלטפורמות שמוגדרות ב-`electron-builder.yml`. |

## בניית installer

האריזה משתמשת ב-[electron-builder](https://www.electron.build/). הקונפיגורציה ב-`electron-builder.yml`.

```powershell
npm run build:win
```

הפקודה תרוץ קודם `electron-vite build` ואז `electron-builder --win`. תהליך הבנייה אורך מספר דקות ומוריד בפעם הראשונה את ה-electron runtime. בסיום נוצרים בתיקייה `release/`:

- `Sayder-0.1.0-x64.exe` – NSIS Installer (לא One-Click; משתמש בוחר תיקיית התקנה; פר-משתמש; יוצר קיצורי דרך).
- `Sayder-Portable-0.1.0.exe` – גרסה ניידת בקובץ exe יחיד.
- `latest.yml`, `*.blockmap` – metadata לעדכוני אוטו (אם תופעל בעתיד תכונה זו).

> **TODO:** להוסיף אייקון מותאם ב-`build/icon.ico` (256×256 או multi-resolution). כרגע משתמשים באייקון ברירת המחדל של Electron.

## מבנה הפרויקט

```
sayder/
├── electron.vite.config.ts        # קונפיגורציית Vite ל-3 התהליכים
├── electron-builder.yml           # קונפיגורציית אריזה (NSIS + Portable)
├── tailwind.config.js             # פלטה (parchment / royal / gold) + גופנים
├── src/
│   ├── main/index.ts              # תהליך ראשי של Electron (חלון, מחזור חיים)
│   ├── preload/index.ts           # contextBridge
│   └── renderer/
│       ├── index.html
│       └── src/
│           ├── App.tsx            # פריסה ראשית
│           ├── domain/
│           │   └── hebrewCalendar/  # wrappers סביב @hebcal/core
│           └── components/
│               └── calendar/      # Hero / MonthGrid / DayCell / DayDetail / MonthNavigator
├── build/                         # משאבי אריזה (icon.ico וכו') – gitignored כרגע
├── release/                       # תוצרי electron-builder – gitignored
└── tsconfig.{json,node,web}.json
```

## ארכיטקטורה - מבט על

- **Main process** (`src/main`) – Electron, יוצר את החלון. בעתיד: גישה ל-better-sqlite3 לאחסון מקומי, IPC handlers.
- **Preload** (`src/preload`) – contextBridge בטוח ל-renderer.
- **Renderer** (`src/renderer`) – React + Tailwind. כל הלוגיקה היום בצד הלקוח. שכבת הלימוד תועבר בעתיד דרך IPC ל-main.
- **Domain** (`src/renderer/src/domain`) – לוגיקה טהורה ללא תלות ב-React. כרגע: `hebrewCalendar/` שמספק API נקי מעל `@hebcal/core`. בעתיד: `corpus/`, `plan/`, `boundaryEngine/`.

## מפת דרכים (Roadmap)

- ✅ **שלב 0 – תשתית** – Electron + Vite + React + TS + Tailwind RTL + hebcal.
- ✅ **שלב 1 – לוח שנה עצמאי** – תצוגה מלאה של החודש העברי.
- ⏳ **שלב 2 – ליבת דומיין** – Corpus/Plan/Progress, מנוע קצב בסיסי, SQLite, JSON של ש"ס בבלי.
- ⏳ **שלב 3 – מנוע גבולות חכם** – Start/End strategies, snap-to-perek, מהדורות וכרכים, תצוגה מקדימה של ימים.
- ⏳ **שלב 4 – שכבת לימוד על הלוח** – Dashboard "מה היום", סימון בוצע, התקדמות, חגיגות סיום.
- ⏳ **שלב 5 – ריבוי קורפוסים** – משניות, תנ"ך, רמב"ם יומי, מחולל ספר מותאם, עורך מהדורות.
- ✅ **שלב 6 – אריזה** – electron-builder, NSIS Installer ו-Portable ל-Windows.
- ⏳ **שלב 7 – פיצ'רים מתקדמים** – Sefaria, תעודות סיום, התראות, גיבוי ושחזור.

## ספריות עיקריות

- [Electron](https://www.electronjs.org/) + [electron-vite](https://electron-vite.org/) – חלון תכנה מקומי.
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/).
- [Tailwind CSS](https://tailwindcss.com/) – עיצוב.
- [@hebcal/core](https://github.com/hebcal/hebcal-es6) – לוח שנה עברי, חגים, פרשות.
- [electron-builder](https://www.electron.build/) – אריזה ל-Windows (NSIS + Portable).
