# לוח שנה תורנית

אפליקציית שולחן עבודה לניהול לימוד חומרים תורניים על גבי לוח שנה עברי.
המטרה: לעזור ללומד להגדיר תכנית לימוד (ש"ס, משניות, רמב"ם יומי, תנ"ך, או ספר מותאם אישית), לקבוע קצב או תאריך יעד, ולעקוב אחר ההתקדמות יום-יום על לוח שנה עברי.

> **סטטוס:** שלב 1 (MVP-MVP) – לוח שנה עברי עצמאי. שכבת הלימוד תתווסף בהמשך.

## פיצ'רים בגרסה הנוכחית

- חלון תכנה מקומי (Electron) – לא דפדפן.
- תצוגת חודש עברי מלאה עם RTL וגופנים עבריים (Heebo + Frank Ruhl Libre).
- כל יום מציג: מספר עברי באותיות (`א'`, `י"ב`, `כ"ז`), תאריך לועזי, חגים, פרשת השבוע, ראש חודש, צומות, חוה"מ.
- ניווט חודש קודם/הבא + כפתור "היום". טיפול נכון באדר א'/ב' בשנה מעוברת ובמעבר אלול → תשרי.
- כרטיס תאריך מודגש בראש החלון שמשתנה לפי היום הנבחר.
- פאנל פרטי יום עם פרשה/אירועי היום וקטגוריזציה.

## דרישות

- [Node.js](https://nodejs.org/) גרסה 20 ומעלה (מומלץ 22).
- npm 10+.
- מערכת הפעלה: Windows / macOS / Linux.

## התקנה והרצה (פיתוח)

```powershell
git clone https://github.com/ChayaAlter/torah-learning-tracker.git
cd torah-learning-tracker
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
| `npm run preview` | מריץ את הבילד שנוצר ב-`build`. |

## מבנה הפרויקט

```
torah-learning-tracker/
├── electron.vite.config.ts        # קונפיגורציית Vite ל-3 התהליכים
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
- ⏳ **שלב 6 – אריזה** – electron-builder, Installer ל-Windows.
- ⏳ **שלב 7 – פיצ'רים מתקדמים** – Sefaria, תעודות סיום, התראות, גיבוי ושחזור.

## ספריות עיקריות

- [Electron](https://www.electronjs.org/) + [electron-vite](https://electron-vite.org/) – חלון תכנה מקומי.
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/).
- [Tailwind CSS](https://tailwindcss.com/) – עיצוב.
- [@hebcal/core](https://github.com/hebcal/hebcal-es6) – לוח שנה עברי, חגים, פרשות.
