"use client"

import { motion } from "framer-motion"
import { Music, Heart, Users, Star, Target, Lightbulb, Globe } from "lucide-react"
import "../css/About.css"

const About = () => {
  const values = [
    {
      icon: <Music size={32} />,
      title: "תשוקה למוזיקה",
      description: "אנחנו מאמינים שמוזיקה היא השפה האוניברסלית שמחברת בין לבבות",
    },
    {
      icon: <Users size={32} />,
      title: "קהילה תומכת",
      description: "יצירת סביבה בטוחה ומעודדת לכל יוצר ומאזין",
    },
    {
      icon: <Lightbulb size={32} />,
      title: "חדשנות",
      description: "פיתוח כלים מתקדמים שעוזרים לאמנים להגיע לקהל הרחב",
    },
    {
      icon: <Globe size={32} />,
      title: "נגישות",
      description: "מוזיקה איכותית נגישה לכולם, בכל מקום ובכל זמן",
    },
  ]

  const team = [
    {
      name: "אלכס כהן",
      role: 'מייסד ומנכ"ל',
      description: "מוזיקאי ויזמי עם ניסיון של 15 שנה בתעשיית המוזיקה",
      avatar: "אכ",
    },
    {
      name: "מיכל לוי",
      role: "מנהלת פיתוח",
      description: "מפתחת תוכנה מנוסה עם התמחות בפלטפורמות מוזיקליות",
      avatar: "מל",
    },
    {
      name: "דני אברהם",
      role: "מנהל קהילה",
      description: "מפיק מוזיקלי שמתמחה בבניית קהילות אמנים",
      avatar: "דא",
    },
  ]

  const achievements = [
    { number: "50K+", label: "משתמשים פעילים" },
    { number: "15K+", label: "שירים הועלו" },
    { number: "2.8K+", label: "אמנים" },
    { number: "1M+", label: "השמעות חודשיות" },
  ]

  return (
    <div className="about-container">
      {/* Background Effects */}
      <div className="about-background">
        <div className="about-gradient-orb orb-1"></div>
        <div className="about-gradient-orb orb-2"></div>
        <div className="about-gradient-orb orb-3"></div>

        <div className="floating-about-notes">
          <div className="about-note note-1">♪</div>
          <div className="about-note note-2">♫</div>
          <div className="about-note note-3">♬</div>
          <div className="about-note note-4">🎵</div>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="about-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="about-icon-container">
          <Heart size={48} className="about-main-icon" />
        </div>
        <h2>אודות SingSong</h2>
        <div className="about-divider">
          <div className="divider-line"></div>
          <Music size={24} />
          <div className="divider-line"></div>
        </div>
        <p className="about-intro">
          אנחנו מאמינים שלכל אדם יש סיפור מוזיקלי ייחודי לספר. SingSong נוצרה כדי לתת במה לכל יוצר, מהחובב הביתי ועד
          האמן המקצועי, לשתף את המוזיקה שלו עם העולם.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        className="about-mission"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="mission-content">
          <div className="mission-icon">
            <Target size={64} />
          </div>
          <div className="mission-text">
            <h3>המשימה שלנו</h3>
            <p>
              ליצור פלטפורמה מוזיקלית שמחברת בין יוצרים למאזינים, מעודדת יצירתיות ומאפשרת לכל אדם לגלות ולשתף את האהבה
              שלו למוזיקה. אנחנו שואפים לבנות קהילה גלובלית שבה מוזיקה איכותית נגישה לכולם.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Values */}
      <motion.div
        className="about-values"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h3>הערכים שלנו</h3>
        <div className="values-grid">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="value-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="value-icon">{value.icon}</div>
              <h4>{value.title}</h4>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="about-achievements"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <h3>ההישגים שלנו</h3>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="achievement-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="achievement-number">{achievement.number}</div>
              <div className="achievement-label">{achievement.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team */}
      <motion.div
        className="about-team"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <h3>הצוות שלנו</h3>
        <div className="team-grid">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="team-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="team-avatar">{member.avatar}</div>
              <h4>{member.name}</h4>
              <span className="team-role">{member.role}</span>
              <p>{member.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Vision */}
      <motion.div
        className="about-vision"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        viewport={{ once: true }}
      >
        <div className="vision-content">
          <div className="vision-icon">
            <Star size={64} />
          </div>
          <div className="vision-text">
            <h3>החזון שלנו</h3>
            <p>
              אנחנו רואים עתיד שבו כל יוצר מוזיקלי, ללא קשר למיקום או רקע, יכול להגיע לקהל גלובלי ולהשפיע על חיים
              באמצעות המוזיקה שלו. SingSong תהיה הפלטפורמה המובילה לגילוי כישרונות חדשים ולחיבור בין תרבויות שונות דרך
              השפה האוניברסלית של המוזיקה.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default About
