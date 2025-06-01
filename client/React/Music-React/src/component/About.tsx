"use client"

import { motion } from "framer-motion"
import "../css/About.css"
import { Music, Users, Star, Headphones, Heart, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
// import { useRouter } from "next/navigation"

const About = () => {
  // const router = useRouter()
  const navigate = useNavigate()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const goTo = (path: string) => {
    navigate(path)
  }

  return (
    <motion.div
      className="about-container"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="about-header">
        <h2>אודות פלטפורמת המוזיקה שלנו</h2>
        <div className="about-divider">
          <span></span>
          <div className="divider-icon">
            <Music size={40} />
          </div>
          <span></span>
        </div>
      </div>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">🎵</span>
        </div>
        <div className="section-content">
          <h3>ברוכים הבאים לעולם המוזיקה החדש!</h3>
          <p>
            ברוכים הבאים לפלטפורמת המוזיקה המתקדמת ביותר בישראל! כאן תמצאו את כל מה שאתם צריכים כדי ליהנות, לגלות ולחלוק
            מוזיקה באופן שלא הכרתם קודם. הפלטפורמה שלנו מאפשרת לאמנים לפרסם את היצירות שלהם, למאזינים לגלות מוזיקה חדשה
            ומרגשת, ולכולם ליצור קהילה מוזיקלית תוססת ומחברת.
          </p>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">🎤</span>
        </div>
        <div className="section-content">
          <h3>פלטפורמה לאמנים ומאזינים</h3>
          <p>
            הפלטפורמה שלנו נבנתה במיוחד כדי לתת מענה מושלם הן לאמנים והן למאזינים. אמנים יכולים להעלות את השירים שלהם,
            לקבל משובים מהקהילה, לעקוב אחר הסטטיסטיקות שלהם ולבנות קהל מעריצים נאמן. מאזינים יכולים לגלות מוזיקה חדשה,
            ליצור פלייליסטים אישיים, לעקוב אחר האמנים הישראליים הטובים ביותר ולהיות חלק מקהילה מוזיקלית ייחודית.
          </p>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>העלאת שירים ללא הגבלה לאמנים רשומים</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>גילוי מוזיקה חדשה ומגוונת מכל הסגנונות</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>מערכת המלצות חכמה המבוססת על הטעם האישי שלכם</span>
            </li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">📊</span>
        </div>
        <div className="section-content">
          <h3>אנליטיקס ותובנות לאמנים</h3>
          <p>
            אמנים בפלטפורמה שלנו מקבלים גישה לכלי אנליטיקס מתקדמים שעוזרים להם להבין טוב יותר את הקהל שלהם ואת הביצועים
            של השירים שלהם. המערכת מספקת נתונים מפורטים על השמעות, לייקים, שיתופים, והתפלגות גיאוגרפית של המאזינים.
          </p>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>מעקב אחר מספר השמעות בזמן אמת</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>ניתוח דמוגרפי של המאזינים</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>גרפים ודוחות מפורטים על ביצועי השירים</span>
            </li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">💬</span>
        </div>
        <div className="section-content">
          <h3>קהילה אינטראקטיבית ותגובות</h3>
          <p>
            הפלטפורמה שלנו מעודדת אינטראקציה בין אמנים למאזינים. כל שיר יכול לקבל תגובות, דירוגים ושיתופים. המאזינים
            יכולים לבטא את דעתם, לתת משוב בונה לאמנים, ולהמליץ על שירים לחברים שלהם. זה יוצר סביבה תומכת ומעשירה לכל
            המעורבים.
          </p>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>מערכת תגובות מתקדמת לכל שיר</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>דירוג שירים ואמנים</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>שיתוף שירים ברשתות חברתיות</span>
            </li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">🔍</span>
        </div>
        <div className="section-content">
          <h3>חיפוש וגילוי מוזיקה מתקדם</h3>
          <p>
            מנוע החיפוש שלנו מאפשר למצוא בדיוק את מה שאתם מחפשים. ניתן לחפש לפי שם אמן, שם שיר, סגנון מוזיקלי, או אפילו
            לפי מילות השיר. בנוסף, המערכת מציעה המלצות אישיות המבוססות על ההיסטוריה המוזיקלית שלכם והעדפותיכם.
          </p>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>חיפוש מתקדם לפי קטגוריות שונות</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>המלצות אישיות חכמות</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>גילוי אמנים חדשים ועולים</span>
            </li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">📱</span>
        </div>
        <div className="section-content">
          <h3>חוויית משתמש מושלמת</h3>
          <p>
            הפלטפורמה עוצבה עם דגש על חוויית משתמש מעולה. הממשק נקי, אינטואיטיבי וקל לשימוש, עם עיצוב מודרני שמתאים לכל
            המכשירים. הפלטפורמה מותאמת לשימוש במחשב, טאבלט וסמארטפון, כך שתוכלו ליהנות מהמוזיקה שלכם בכל מקום ובכל זמן.
          </p>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>עיצוב רספונסיבי לכל המכשירים</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>ממשק משתמש אינטואיטיבי וידידותי</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>ביצועים מהירים וחוויה חלקה</span>
            </li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="about-section why-choose" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">🏆</span>
        </div>
        <div className="section-content">
          <h3>למה לבחור בפלטפורמה שלנו?</h3>
          <div className="why-choose-grid">
            <div className="why-choose-item">
              <div className="why-icon">
                <Music />
              </div>
              <p>פלטפורמה ישראלית המתמחה במוזיקה מקומית ובינלאומית</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">
                <Users />
              </div>
              <p>קהילה תוססת של אמנים ומאזינים פעילים</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">
                <TrendingUp />
              </div>
              <p>כלי אנליטיקס מתקדמים לאמנים</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">
                <Heart />
              </div>
              <p>תמיכה מלאה באמנים ישראליים מתחילים ומנוסים</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">
                <Headphones />
              </div>
              <p>איכות שמע גבוהה וחוויית האזנה מעולה</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">
                <Star />
              </div>
              <p>מערכת המלצות חכמה ואישית</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.footer className="about-footer" variants={itemVariants}>
        <h3>הצטרפו למהפכה המוזיקלית!</h3>
        <p>
          אם אתם אמנים שרוצים להגיע לקהל חדש, או מאזינים שמחפשים מוזיקה איכותית וחדשה, הפלטפורמה שלנו היא הבית החדש
          שלכם. הצטרפו אלינו עוד היום ותהיו חלק מהקהילה המוזיקלית הכי תוססת בישראל!
        </p>
        <button className="about-cta" onClick={() => goTo("/register")}>
          הצטרף עכשיו
        </button>
      </motion.footer>
    </motion.div>
  )
}

export default About
