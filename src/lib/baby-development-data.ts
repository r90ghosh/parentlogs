import { BabyDevelopment, MomSymptom, DadTip } from '@/types/dashboard'
import { babySizes, getBabySize } from './baby-sizes'

// Heart rate data by week (approximate ranges)
const heartRateByWeek: Record<number, number> = {
  4: 0, 5: 0, 6: 90, 7: 110, 8: 150, 9: 170, 10: 170, 11: 165, 12: 165,
  13: 160, 14: 155, 15: 150, 16: 150, 17: 145, 18: 145, 19: 140, 20: 140,
  21: 140, 22: 140, 23: 140, 24: 140, 25: 140, 26: 140, 27: 140, 28: 140,
  29: 140, 30: 140, 31: 140, 32: 140, 33: 140, 34: 140, 35: 135, 36: 135,
  37: 130, 38: 130, 39: 130, 40: 130
}

// Key developments by week
const keyDevelopmentsByWeek: Record<number, string[]> = {
  4: ["Implantation complete", "Placenta forming"],
  5: ["Neural tube developing", "Heart beginning to form"],
  6: ["Heart starts beating", "Arm and leg buds forming"],
  7: ["Brain developing rapidly", "Face features forming"],
  8: ["All major organs forming", "Tiny fingers and toes"],
  9: ["Essential organs present", "Baby starting to move"],
  10: ["Fingers and toes separating", "Bones hardening"],
  11: ["Genitals developing", "Moving more actively"],
  12: ["Reflexes developing", "Can make sucking motions", "Miscarriage risk drops"],
  13: ["Fingerprints forming", "Vocal cords developing"],
  14: ["Can make facial expressions", "May start sucking thumb"],
  15: ["Bones becoming harder", "Can sense light"],
  16: ["Can hear sounds", "Growing hair", "Facial expressions"],
  17: ["Fat layer forming", "Skeleton hardening"],
  18: ["Can hear your voice", "Yawning and hiccuping"],
  19: ["Vernix coating forming", "Brain growing rapidly"],
  20: ["Halfway point!", "Movements felt", "Anatomy scan time"],
  21: ["Movements getting stronger", "Eyebrows forming"],
  22: ["Grip strength developing", "Sleep cycles forming"],
  23: ["Lungs developing", "Hearing improving"],
  24: ["Viable outside womb", "Face fully formed"],
  25: ["Responds to voices", "Growing hair"],
  26: ["Eyes opening", "Can distinguish light"],
  27: ["Third trimester starts", "Brain very active"],
  28: ["REM sleep occurring", "Can dream"],
  29: ["Bones fully developed", "Brain controlling breathing"],
  30: ["Growing rapidly", "Brain controlling temperature"],
  31: ["All five senses working", "Gaining weight quickly"],
  32: ["Toenails present", "Practicing breathing"],
  33: ["Skull bones flexible", "Immune system developing"],
  34: ["Lungs nearly mature", "Could survive if born now"],
  35: ["Most organs complete", "Less room to move"],
  36: ["Full term next week!", "Head may drop"],
  37: ["Early term begins", "Lungs mature"],
  38: ["Shedding lanugo", "Ready for birth"],
  39: ["Full term!", "Brain still growing"],
  40: ["Due date!", "Ready to meet you"]
}

// Get trimester from week
function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1
  if (week <= 27) return 2
  return 3
}

// Parse weight to number (oz)
function parseWeight(weightStr: string): number {
  if (weightStr.includes('lb')) {
    return parseFloat(weightStr) * 16
  }
  if (weightStr === '<0.01') return 0.01
  return parseFloat(weightStr)
}

/**
 * Get baby development data for a specific week
 */
export function getBabyDevelopment(week: number): BabyDevelopment {
  const babySize = getBabySize(week) || babySizes[babySizes.length - 1]

  return {
    week: babySize.week,
    trimester: getTrimester(babySize.week),
    sizeComparison: babySize.fruit.toLowerCase(),
    sizeEmoji: babySize.emoji,
    lengthInches: parseFloat(babySize.lengthInches),
    weightOz: parseWeight(babySize.weightOz),
    heartRateBpm: heartRateByWeek[week] || 140,
    keyDevelopments: keyDevelopmentsByWeek[week] || ["Growing and developing"]
  }
}

// Mom symptoms by week
export const momSymptomsByWeek: Record<number, MomSymptom[]> = {
  4: [
    { name: "Missed period", isCommon: true },
    { name: "Mild cramping", isCommon: false },
    { name: "Breast tenderness", isCommon: true },
    { name: "Fatigue", isCommon: true }
  ],
  5: [
    { name: "Morning sickness starting", isCommon: true },
    { name: "Frequent urination", isCommon: true },
    { name: "Fatigue", isCommon: true },
    { name: "Mood swings", isCommon: false }
  ],
  6: [
    { name: "Morning sickness", isCommon: true },
    { name: "Food aversions", isCommon: true },
    { name: "Heightened smell", isCommon: false },
    { name: "Bloating", isCommon: false }
  ],
  7: [
    { name: "Nausea increasing", isCommon: true },
    { name: "Excess saliva", isCommon: false },
    { name: "Food cravings", isCommon: true },
    { name: "Fatigue", isCommon: true }
  ],
  8: [
    { name: "Morning sickness peak", isCommon: true },
    { name: "Breast changes", isCommon: true },
    { name: "Constipation", isCommon: false },
    { name: "Vivid dreams", isCommon: false }
  ],
  9: [
    { name: "Waistline expanding", isCommon: true },
    { name: "Mood swings", isCommon: true },
    { name: "Heartburn starting", isCommon: false },
    { name: "Nasal congestion", isCommon: false }
  ],
  10: [
    { name: "Visible veins", isCommon: false },
    { name: "Round ligament pain", isCommon: true },
    { name: "Growing belly", isCommon: true },
    { name: "Headaches", isCommon: false }
  ],
  11: [
    { name: "Nausea may ease", isCommon: true },
    { name: "Skin changes", isCommon: false },
    { name: "Hair changes", isCommon: false },
    { name: "Leg cramps", isCommon: false }
  ],
  12: [
    { name: "Morning sickness easing", isCommon: true },
    { name: "More energy returning", isCommon: true },
    { name: "Possible food aversions", isCommon: false },
    { name: "Mild headaches", isCommon: false }
  ],
  13: [
    { name: "Energy returning", isCommon: true },
    { name: "Visible bump", isCommon: true },
    { name: "Less nausea", isCommon: true },
    { name: "Increased appetite", isCommon: false }
  ],
  14: [
    { name: "Second trimester energy", isCommon: true },
    { name: "Less fatigue", isCommon: true },
    { name: "Rounder belly", isCommon: true },
    { name: "Clearer skin", isCommon: false }
  ],
  15: [
    { name: "Baby bump showing", isCommon: true },
    { name: "Feeling good", isCommon: true },
    { name: "Increased libido", isCommon: false },
    { name: "Nose bleeds", isCommon: false }
  ],
  16: [
    { name: "Feeling movement soon", isCommon: true },
    { name: "Glowing skin", isCommon: false },
    { name: "Round ligament pain", isCommon: true },
    { name: "Back pain starting", isCommon: false }
  ],
  17: [
    { name: "May feel flutters", isCommon: true },
    { name: "Growing steadily", isCommon: true },
    { name: "Stretch marks may appear", isCommon: false },
    { name: "Itchy skin", isCommon: false }
  ],
  18: [
    { name: "First kicks!", isCommon: true },
    { name: "Appetite increase", isCommon: true },
    { name: "Swollen feet", isCommon: false },
    { name: "Dizziness", isCommon: false }
  ],
  19: [
    { name: "Clear movement", isCommon: true },
    { name: "Hip pain", isCommon: false },
    { name: "Leg cramps", isCommon: true },
    { name: "Skin darkening", isCommon: false }
  ],
  20: [
    { name: "Halfway there!", isCommon: true },
    { name: "Strong kicks", isCommon: true },
    { name: "Shortness of breath", isCommon: false },
    { name: "Heartburn", isCommon: true }
  ],
  21: [
    { name: "Regular movement", isCommon: true },
    { name: "Varicose veins", isCommon: false },
    { name: "Stretch marks", isCommon: true },
    { name: "Braxton Hicks possible", isCommon: false }
  ],
  22: [
    { name: "Baby very active", isCommon: true },
    { name: "Swelling in feet", isCommon: true },
    { name: "Back pain", isCommon: true },
    { name: "Trouble sleeping", isCommon: false }
  ],
  23: [
    { name: "Feeling kicks externally", isCommon: true },
    { name: "Swollen ankles", isCommon: true },
    { name: "Gum bleeding", isCommon: false },
    { name: "Carpal tunnel", isCommon: false }
  ],
  24: [
    { name: "Glucose test time", isCommon: true },
    { name: "Skin stretching", isCommon: true },
    { name: "Linea nigra", isCommon: false },
    { name: "Clumsiness", isCommon: false }
  ],
  25: [
    { name: "Baby responds to touch", isCommon: true },
    { name: "Hemorrhoids possible", isCommon: false },
    { name: "Restless legs", isCommon: true },
    { name: "Snoring", isCommon: false }
  ],
  26: [
    { name: "Third trimester approaching", isCommon: true },
    { name: "Swelling increasing", isCommon: true },
    { name: "Lower back pain", isCommon: true },
    { name: "Sciatica", isCommon: false }
  ],
  27: [
    { name: "Third trimester starts!", isCommon: true },
    { name: "Baby very active", isCommon: true },
    { name: "Leg cramps at night", isCommon: true },
    { name: "Heartburn worse", isCommon: true }
  ],
  28: [
    { name: "Shortness of breath", isCommon: true },
    { name: "Trouble sleeping", isCommon: true },
    { name: "Braxton Hicks", isCommon: true },
    { name: "Leaky breasts", isCommon: false }
  ],
  29: [
    { name: "Baby running out of room", isCommon: true },
    { name: "Frequent bathroom trips", isCommon: true },
    { name: "Fatigue returning", isCommon: true },
    { name: "Varicose veins", isCommon: false }
  ],
  30: [
    { name: "Feeling heavy", isCommon: true },
    { name: "Heartburn intense", isCommon: true },
    { name: "Swelling", isCommon: true },
    { name: "Mood swings", isCommon: false }
  ],
  31: [
    { name: "Baby movements change", isCommon: true },
    { name: "Braxton Hicks more frequent", isCommon: true },
    { name: "Back pain", isCommon: true },
    { name: "Insomnia", isCommon: true }
  ],
  32: [
    { name: "Baby drops soon", isCommon: false },
    { name: "Shortness of breath", isCommon: true },
    { name: "Leaky breasts", isCommon: true },
    { name: "Nesting instinct", isCommon: false }
  ],
  33: [
    { name: "Increased pressure", isCommon: true },
    { name: "Frequent urination", isCommon: true },
    { name: "Trouble sleeping", isCommon: true },
    { name: "Swelling in hands", isCommon: false }
  ],
  34: [
    { name: "Fatigue", isCommon: true },
    { name: "Pelvic pressure", isCommon: true },
    { name: "Braxton Hicks", isCommon: true },
    { name: "Nesting strong", isCommon: true }
  ],
  35: [
    { name: "Baby may drop", isCommon: true },
    { name: "Breathing easier", isCommon: false },
    { name: "More bathroom trips", isCommon: true },
    { name: "Aches everywhere", isCommon: true }
  ],
  36: [
    { name: "Baby engaged", isCommon: false },
    { name: "Cervix softening", isCommon: false },
    { name: "Nesting urge", isCommon: true },
    { name: "Excitement building", isCommon: true }
  ],
  37: [
    { name: "Early term!", isCommon: true },
    { name: "Mucus plug may release", isCommon: false },
    { name: "More Braxton Hicks", isCommon: true },
    { name: "Baby could come anytime", isCommon: true }
  ],
  38: [
    { name: "Ready for labor", isCommon: true },
    { name: "Cervix dilating", isCommon: false },
    { name: "Nesting in overdrive", isCommon: true },
    { name: "Excitement and anxiety", isCommon: true }
  ],
  39: [
    { name: "Full term!", isCommon: true },
    { name: "Watching for signs", isCommon: true },
    { name: "Discomfort", isCommon: true },
    { name: "Ready to meet baby", isCommon: true }
  ],
  40: [
    { name: "Due date!", isCommon: true },
    { name: "Labor could start", isCommon: true },
    { name: "Very ready", isCommon: true },
    { name: "Waiting game", isCommon: true }
  ]
}

// Dad tips by week
export const dadTipsByWeek: Record<number, string> = {
  4: "She may not feel pregnant yet, but the hormones are already at work. Be patient with mood changes and offer extra support.",
  5: "Morning sickness often starts now. Keep crackers by the bed and be understanding if she needs to rest more.",
  6: "The first prenatal appointment is coming up. Offer to go with her for support - hearing the heartbeat is magical!",
  7: "Food aversions are real. Don't take it personally if she suddenly hates your cooking. Help find foods that work.",
  8: "All those bathroom trips at night are normal. Consider sleeping arrangements that let her rest better.",
  9: "She may be emotional. Just listen, don't try to fix everything. Your presence matters more than solutions.",
  10: "Her body is changing. Compliment her - she may feel self-conscious. Help with tasks that are getting harder.",
  11: "Plan something nice for when the nausea eases. A special date or small getaway can boost both your moods.",
  12: "Energy often returns in the 2nd trimester. This is a great time to plan a babymoon or tackle nursery projects together!",
  13: "Time to share the news if you haven't! Discuss how you want to announce and who to tell first.",
  14: "Start thinking about baby names together. Make it fun - take turns suggesting and veto-ing.",
  15: "Research childbirth classes. Signing up early ensures you get the schedule that works best.",
  16: "She might start feeling movement soon. Put your hand on her belly and be patient - it's worth the wait!",
  17: "Anatomy scan is coming up. Go with her - it's amazing to see your baby in detail!",
  18: "Start talking to the baby. They can hear now! Reading stories out loud is a great bonding activity.",
  19: "Help her stay active. Walks together are great for both of you and good for conversation.",
  20: "Halfway there! Celebrate this milestone. Take a bump photo and make a special memory.",
  21: "Research pediatricians now while you have time. Make a list together of what matters most to you both.",
  22: "Her feet may be swelling. Offer foot rubs and help her prop up her legs when resting.",
  23: "Start the baby registry if you haven't. Research together what you'll actually need vs. nice-to-haves.",
  24: "Glucose test time. Offer to drive her and have a post-test snack ready - she'll be hungry!",
  25: "Baby's kicks are visible now. Watch for them and share these moments together.",
  26: "Third trimester is coming. Plan what still needs to be done and make a realistic timeline.",
  27: "Final trimester starts! She'll tire more easily. Take on more household tasks without being asked.",
  28: "Hospital bag prep time. Help her pack and have yours ready too.",
  29: "Practice the hospital route. Know where to park and which entrance to use day or night.",
  30: "Install the car seat now. Get it checked by a certified technician - it's usually free.",
  31: "Take a hospital tour if you haven't. Knowing the layout reduces stress during labor.",
  32: "Help set up the nursery. Put together furniture and make it feel ready for baby.",
  33: "Discuss your birth plan. Know her preferences and be ready to advocate for her.",
  34: "Stock up on freezer meals. You'll both be grateful to have easy food ready after baby arrives.",
  35: "Review what to expect during labor. Be her calm support - she's counting on you.",
  36: "Baby could come anytime! Make sure your work knows and have your out-of-office ready.",
  37: "Early term - baby is considered full! Keep your phone charged and nearby.",
  38: "Pamper her. A prenatal massage or her favorite treats can help during this uncomfortable time.",
  39: "Full term! Stay close to home and keep the car gassed up. The waiting is hard - be patient together.",
  40: "Due date! Remember, babies come when they're ready. Keep her comfortable and distracted."
}

/**
 * Get mom symptoms for a specific week
 */
export function getMomSymptoms(week: number): MomSymptom[] {
  return momSymptomsByWeek[week] || momSymptomsByWeek[20] || []
}

/**
 * Get dad tip for a specific week
 */
export function getDadTip(week: number): DadTip {
  return {
    week,
    tip: dadTipsByWeek[week] || "Be supportive and present. Every week brings new experiences!"
  }
}

/**
 * Get achievement for milestone weeks
 */
export function getAchievement(week: number): { title: string; description: string; icon: string } | null {
  const achievements: Record<number, { title: string; description: string; icon: string }> = {
    12: {
      title: "First Trimester Complete!",
      description: "You've hit a major milestone",
      icon: "🏆"
    },
    20: {
      title: "Halfway There!",
      description: "50% of the journey complete",
      icon: "🎉"
    },
    24: {
      title: "Viability Milestone!",
      description: "Baby could survive if born now",
      icon: "⭐"
    },
    27: {
      title: "Third Trimester Starts!",
      description: "The home stretch begins",
      icon: "🚀"
    },
    37: {
      title: "Early Term!",
      description: "Baby is considered full term",
      icon: "🎊"
    },
    40: {
      title: "Due Date!",
      description: "The big day is here",
      icon: "👶"
    }
  }

  return achievements[week] || null
}
