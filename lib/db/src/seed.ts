import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  coursesTable,
  lessonsTable,
  questionsTable,
  flashcardsTable,
  studyNotesTable,
  userProgressTable,
  hardRoundResultsTable,
} from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log("🌱 Seeding El_lingo database...");

  // ── COURSES ──────────────────────────────────────────────────────────────
  const courseSeedData = [
    // English courses
    { title: "Human Anatomy", description: "Master the structure of the human body — bones, muscles, organs, and systems.", category: "anatomy", iconEmoji: "🦴", color: "#ef4444", difficulty: "beginner", language: "en", orderIndex: 1 },
    { title: "Pharmacology", description: "Drug mechanisms, pharmacokinetics, and clinical pharmacology essentials.", category: "pharmacology", iconEmoji: "💊", color: "#3b82f6", difficulty: "intermediate", language: "en", orderIndex: 2 },
    { title: "Physiology", description: "How the body's systems function together to maintain life.", category: "physiology", iconEmoji: "❤️", color: "#22c55e", difficulty: "intermediate", language: "en", orderIndex: 3 },
    { title: "Pathology", description: "Disease mechanisms, pathological changes, and diagnostic principles.", category: "pathology", iconEmoji: "🔬", color: "#a855f7", difficulty: "advanced", language: "en", orderIndex: 4 },
    { title: "Microbiology", description: "Bacteria, viruses, fungi, and parasites relevant to clinical medicine.", category: "microbiology", iconEmoji: "🦠", color: "#f97316", difficulty: "intermediate", language: "en", orderIndex: 5 },
    { title: "Biochemistry", description: "Metabolic pathways, enzymes, and molecular biology foundations.", category: "biochemistry", iconEmoji: "⚗️", color: "#eab308", difficulty: "advanced", language: "en", orderIndex: 6 },
    { title: "Neuroanatomy", description: "The brain, spinal cord, cranial nerves, and neural pathways.", category: "neuroanatomy", iconEmoji: "🧠", color: "#8b5cf6", difficulty: "advanced", language: "en", orderIndex: 7 },
    { title: "Immunology", description: "Immune system components, responses, and immunological disorders.", category: "immunology", iconEmoji: "🛡️", color: "#06b6d4", difficulty: "intermediate", language: "en", orderIndex: 8 },
    { title: "Cell Biology", description: "Cell structure, organelles, cell signaling, and mitosis/meiosis.", category: "biology", iconEmoji: "🔭", color: "#10b981", difficulty: "beginner", language: "en", orderIndex: 9 },
    { title: "Genetics & Heredity", description: "Mendelian genetics, DNA replication, mutations, and genetic diseases.", category: "biology", iconEmoji: "🧬", color: "#ec4899", difficulty: "intermediate", language: "en", orderIndex: 10 },
    { title: "Ecology & Environment", description: "Ecosystems, food chains, biodiversity, and environmental biology.", category: "ecology", iconEmoji: "🌍", color: "#14b8a6", difficulty: "beginner", language: "en", orderIndex: 11 },
    { title: "Botany & Plant Biology", description: "Plant cells, photosynthesis, plant systems, and classification.", category: "biology", iconEmoji: "🌿", color: "#84cc16", difficulty: "beginner", language: "en", orderIndex: 12 },

    // Albanian courses (sq)
    { title: "Anatomia Njerëzore", description: "Zotëro strukturën e trupit njerëzor — kockat, muskujt, organet dhe sistemet.", category: "anatomy", iconEmoji: "🦴", color: "#ef4444", difficulty: "beginner", language: "sq", orderIndex: 1 },
    { title: "Farmakologjia", description: "Mekanizmat e barnave, farmakokinetika dhe farmakologjia klinike.", category: "pharmacology", iconEmoji: "💊", color: "#3b82f6", difficulty: "intermediate", language: "sq", orderIndex: 2 },
    { title: "Fiziologjia", description: "Si funksionojnë sistemet e trupit bashkërisht për të mbajtur jetën.", category: "physiology", iconEmoji: "❤️", color: "#22c55e", difficulty: "intermediate", language: "sq", orderIndex: 3 },
    { title: "Patologjia", description: "Mekanizmat e sëmundjeve, ndryshimet patologjike dhe parimet diagnostike.", category: "pathology", iconEmoji: "🔬", color: "#a855f7", difficulty: "advanced", language: "sq", orderIndex: 4 },
    { title: "Mikrobiologjia", description: "Bakteret, viruset, kërpudhat dhe parazitët relevantë për mjekësinë klinike.", category: "microbiology", iconEmoji: "🦠", color: "#f97316", difficulty: "intermediate", language: "sq", orderIndex: 5 },
    { title: "Biokimia", description: "Rrugët metabolike, enzimat dhe bazat e biologjisë molekulare.", category: "biochemistry", iconEmoji: "⚗️", color: "#eab308", difficulty: "advanced", language: "sq", orderIndex: 6 },
    { title: "Neuroanatomia", description: "Truri, palca kurrizore, nervat kraniale dhe rrugët nervore.", category: "neuroanatomy", iconEmoji: "🧠", color: "#8b5cf6", difficulty: "advanced", language: "sq", orderIndex: 7 },
    { title: "Imunologjia", description: "Komponentët e sistemit imunitar, përgjigjet dhe çrregullimet imunologjike.", category: "immunology", iconEmoji: "🛡️", color: "#06b6d4", difficulty: "intermediate", language: "sq", orderIndex: 8 },
    { title: "Biologjia Qelizore", description: "Struktura qelizore, organelet, sinjalizimi qelizor dhe mitoza/mejoze.", category: "biology", iconEmoji: "🔭", color: "#10b981", difficulty: "beginner", language: "sq", orderIndex: 9 },
    { title: "Gjenetika dhe Trashëgimia", description: "Gjenetika Mendeliane, replikimi i ADN-së, mutacionet dhe sëmundjet gjenetike.", category: "biology", iconEmoji: "🧬", color: "#ec4899", difficulty: "intermediate", language: "sq", orderIndex: 10 },
    { title: "Ekologjia dhe Mjedisi", description: "Ekosistemet, zinxhirët ushqimor, biodiversiteti dhe biologjia mjedisore.", category: "ecology", iconEmoji: "🌍", color: "#14b8a6", difficulty: "beginner", language: "sq", orderIndex: 11 },
    { title: "Botanika dhe Biologjia Bimore", description: "Qelizat bimore, fotosinteza, sistemet bimore dhe klasifikimi.", category: "biology", iconEmoji: "🌿", color: "#84cc16", difficulty: "beginner", language: "sq", orderIndex: 12 },
  ];

  // Delete in correct FK order (children first)
  await db.delete(studyNotesTable);
  await db.delete(userProgressTable);
  await db.delete(hardRoundResultsTable);
  await db.delete(questionsTable);
  await db.delete(flashcardsTable);
  await db.delete(lessonsTable);
  await db.delete(coursesTable);

  const insertedCourses = await db.insert(coursesTable).values(courseSeedData).returning();
  console.log(`✅ Inserted ${insertedCourses.length} courses`);

  const courseByTitleLang = new Map(insertedCourses.map(c => [`${c.language}:${c.category}:${c.orderIndex}`, c.id]));

  // ── LESSONS ──────────────────────────────────────────────────────────────
  const enAnatomy = courseByTitleLang.get("en:anatomy:1")!;
  const enPharm = courseByTitleLang.get("en:pharmacology:2")!;
  const enPhysio = courseByTitleLang.get("en:physiology:3")!;
  const enBio = courseByTitleLang.get("en:biology:9")!;
  const enEco = courseByTitleLang.get("en:ecology:11")!;
  const enGenet = courseByTitleLang.get("en:biology:10")!;
  const sqAnatomy = courseByTitleLang.get("sq:anatomy:1")!;
  const sqPharm = courseByTitleLang.get("sq:pharmacology:2")!;
  const sqPhysio = courseByTitleLang.get("sq:physiology:3")!;
  const sqBio = courseByTitleLang.get("sq:biology:9")!;
  const sqEco = courseByTitleLang.get("sq:ecology:11")!;
  const sqGenet = courseByTitleLang.get("sq:biology:10")!;

  const lessons = await db.insert(lessonsTable).values([
    // English - Anatomy
    { courseId: enAnatomy, title: "The Skeletal System", description: "Bones, joints, and skeletal structure", xpReward: 50, orderIndex: 1 },
    { courseId: enAnatomy, title: "Muscles & Movement", description: "Skeletal, smooth, and cardiac muscles", xpReward: 50, orderIndex: 2 },
    { courseId: enAnatomy, title: "The Cardiovascular System", description: "Heart, arteries, veins, and circulation", xpReward: 60, orderIndex: 3 },
    { courseId: enAnatomy, title: "The Nervous System", description: "CNS, PNS, neurons, and neural pathways", xpReward: 70, orderIndex: 4 },
    // English - Pharmacology
    { courseId: enPharm, title: "Drug Receptors & Mechanisms", description: "How drugs interact with receptors", xpReward: 60, orderIndex: 1 },
    { courseId: enPharm, title: "Pharmacokinetics", description: "ADME: absorption, distribution, metabolism, excretion", xpReward: 65, orderIndex: 2 },
    // English - Physiology
    { courseId: enPhysio, title: "Cardiac Physiology", description: "Heart electrical activity and cardiac output", xpReward: 65, orderIndex: 1 },
    { courseId: enPhysio, title: "Respiratory Physiology", description: "Gas exchange and lung mechanics", xpReward: 65, orderIndex: 2 },
    // English - Cell Biology
    { courseId: enBio, title: "Cell Structure & Organelles", description: "Nucleus, mitochondria, ER, Golgi, and more", xpReward: 45, orderIndex: 1 },
    { courseId: enBio, title: "Cell Division: Mitosis", description: "The stages of mitosis and cell replication", xpReward: 50, orderIndex: 2 },
    // English - Ecology
    { courseId: enEco, title: "Ecosystems & Biomes", description: "Types of ecosystems and their characteristics", xpReward: 45, orderIndex: 1 },
    { courseId: enEco, title: "Food Chains & Energy Flow", description: "Producers, consumers, and energy pyramids", xpReward: 45, orderIndex: 2 },
    { courseId: enEco, title: "Biodiversity & Conservation", description: "Species diversity, threats, and conservation strategies", xpReward: 50, orderIndex: 3 },
    // English - Genetics
    { courseId: enGenet, title: "Mendelian Genetics", description: "Dominant and recessive traits, Punnett squares", xpReward: 55, orderIndex: 1 },
    { courseId: enGenet, title: "DNA Replication & Transcription", description: "How DNA is copied and transcribed to RNA", xpReward: 60, orderIndex: 2 },

    // Albanian - Anatomy
    { courseId: sqAnatomy, title: "Sistemi Skeletor", description: "Kockat, nyjet dhe struktura skeletore", xpReward: 50, orderIndex: 1 },
    { courseId: sqAnatomy, title: "Muskujt dhe Lëvizja", description: "Muskujt skeletor, të lëmuar dhe kardiakë", xpReward: 50, orderIndex: 2 },
    { courseId: sqAnatomy, title: "Sistemi Kardiovaskular", description: "Zemra, arterie, vena dhe qarkullimi", xpReward: 60, orderIndex: 3 },
    { courseId: sqAnatomy, title: "Sistemi Nervor", description: "SNQ, SNP, neuronet dhe rrugët nervore", xpReward: 70, orderIndex: 4 },
    // Albanian - Pharmacology
    { courseId: sqPharm, title: "Receptorët e Barnave", description: "Si ndërveprojnë barnat me receptorët", xpReward: 60, orderIndex: 1 },
    { courseId: sqPharm, title: "Farmakokinetika", description: "ADME: absorbi, shpërndarje, metabolizëm, ekskretim", xpReward: 65, orderIndex: 2 },
    // Albanian - Physiology
    { courseId: sqPhysio, title: "Fiziologjia Kardiake", description: "Aktiviteti elektrik i zemrës dhe dalja kardiake", xpReward: 65, orderIndex: 1 },
    { courseId: sqPhysio, title: "Fiziologjia Respiratore", description: "Shkëmbimi i gazeve dhe mekanika e mushkërive", xpReward: 65, orderIndex: 2 },
    // Albanian - Cell Biology
    { courseId: sqBio, title: "Struktura Qelizore dhe Organelet", description: "Bërthama, mitokondria, RE, Goxhi dhe më shumë", xpReward: 45, orderIndex: 1 },
    { courseId: sqBio, title: "Ndarja Qelizore: Mitoza", description: "Fazat e mitozës dhe replikimi qelizor", xpReward: 50, orderIndex: 2 },
    // Albanian - Ecology
    { courseId: sqEco, title: "Ekosistemet dhe Biomet", description: "Llojet e ekosistemeve dhe karakteristikat e tyre", xpReward: 45, orderIndex: 1 },
    { courseId: sqEco, title: "Zinxhirët Ushqimor dhe Rrjedha e Energjisë", description: "Prodhuesit, konsumatorët dhe piramidat e energjisë", xpReward: 45, orderIndex: 2 },
    { courseId: sqEco, title: "Biodiversiteti dhe Ruajtja", description: "Diversiteti i specieve, kërcënimet dhe strategjitë e ruajtjes", xpReward: 50, orderIndex: 3 },
    // Albanian - Genetics
    { courseId: sqGenet, title: "Gjenetika Mendeliane", description: "Tiparet dominante dhe recesive, katrorët Punnett", xpReward: 55, orderIndex: 1 },
    { courseId: sqGenet, title: "Replikimi dhe Transkriptimi i ADN-së", description: "Si kopjohet ADN-ja dhe transskribohet në ARN", xpReward: 60, orderIndex: 2 },
  ]).returning();
  console.log(`✅ Inserted ${lessons.length} lessons`);

  // Create lesson index by courseId + orderIndex for both languages
  const lessonById: Record<string, number> = {};
  lessons.forEach(l => {
    lessonById[`${l.courseId}:${l.orderIndex}`] = l.id;
  });

  // ── QUESTIONS (30 per lesson, both languages) ─────────────────────────────
  const allQuestions: Array<{
    lessonId?: number | null;
    questionText: string;
    questionType: string;
    optionsJson: string;
    correctAnswer: string;
    explanation: string;
    category: string;
    difficulty: string;
    language: string;
  }> = [];

  // Helper to generate questions for a lesson
  function qs(lessonId: number, questions: Array<{
    q: string; opts: string[]; ans: string; expl: string; cat: string; diff: string; lang: string;
  }>) {
    questions.forEach(({ q, opts, ans, expl, cat, diff, lang }) => {
      allQuestions.push({
        lessonId,
        questionText: q,
        questionType: "multiple_choice",
        optionsJson: JSON.stringify(opts),
        correctAnswer: ans,
        explanation: expl,
        category: cat,
        difficulty: diff,
        language: lang,
      });
    });
  }

  // ── English: Skeletal System Lesson ──────────────────────────────────────
  const enSkelL = lessonById[`${enAnatomy}:1`];
  qs(enSkelL, [
    { q: "How many bones are in an adult human body?", opts: ["206", "209", "200", "212"], ans: "206", expl: "Adult humans have 206 bones; babies start with ~270 which fuse over time.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "Which is the longest bone in the human body?", opts: ["Femur", "Tibia", "Humerus", "Fibula"], ans: "Femur", expl: "The femur (thigh bone) is the longest and strongest bone in the human body.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "What type of cartilage covers the articular surfaces of bones?", opts: ["Hyaline cartilage", "Fibrocartilage", "Elastic cartilage", "Calcified cartilage"], ans: "Hyaline cartilage", expl: "Hyaline (articular) cartilage provides smooth surfaces for joint movement.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "The axial skeleton consists of how many bones?", opts: ["80", "126", "64", "90"], ans: "80", expl: "The axial skeleton has 80 bones: skull (28), vertebral column (26), thoracic cage (25), sternum (1).", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "Which bone protects the brain?", opts: ["Cranium", "Mandible", "Clavicle", "Scapula"], ans: "Cranium", expl: "The cranium (skull) encloses and protects the brain from injury.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "What is the shaft of a long bone called?", opts: ["Diaphysis", "Epiphysis", "Periosteum", "Endosteum"], ans: "Diaphysis", expl: "The diaphysis is the cylindrical shaft of a long bone containing the medullary cavity.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "Red bone marrow is primarily found in which bones in adults?", opts: ["Flat bones and vertebrae", "Long bones only", "Short bones only", "Sesamoid bones"], ans: "Flat bones and vertebrae", expl: "In adults, red marrow (hematopoietic) is found mainly in flat bones (sternum, ilium) and vertebrae.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "Which type of joint allows the most movement?", opts: ["Synovial joint", "Cartilaginous joint", "Fibrous joint", "Gomphosis"], ans: "Synovial joint", expl: "Synovial joints (e.g., knee, hip, shoulder) are freely movable and allow the greatest range of motion.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "Osteoclasts are responsible for:", opts: ["Bone resorption", "Bone formation", "Cartilage production", "Collagen synthesis"], ans: "Bone resorption", expl: "Osteoclasts break down bone tissue (resorption), essential for remodeling and calcium homeostasis.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "What mineral makes bone hard and rigid?", opts: ["Calcium phosphate (hydroxyapatite)", "Calcium carbonate", "Potassium chloride", "Sodium bicarbonate"], ans: "Calcium phosphate (hydroxyapatite)", expl: "Hydroxyapatite crystals [Ca₁₀(PO₄)₆(OH)₂] give bone its rigidity and strength.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "The vertebral column consists of how many vertebrae?", opts: ["33", "28", "36", "30"], ans: "33", expl: "The spine has 33 vertebrae: 7 cervical, 12 thoracic, 5 lumbar, 5 fused sacral, 4 fused coccygeal.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "Which condition is characterized by decreased bone density?", opts: ["Osteoporosis", "Osteomalacia", "Osteosarcoma", "Osteomyelitis"], ans: "Osteoporosis", expl: "Osteoporosis is a disease where bone density decreases, increasing fracture risk, common in postmenopausal women.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "The atlas (C1) articulates with which structure superiorly?", opts: ["Occipital condyles", "Axis (C2)", "Hyoid bone", "Mandible"], ans: "Occipital condyles", expl: "C1 (atlas) articulates with the occipital condyles of the skull, allowing nodding motion.", cat: "anatomy", diff: "hard", lang: "en" },
    { q: "Bones that develop within tendons are called:", opts: ["Sesamoid bones", "Sutural bones", "Irregular bones", "Short bones"], ans: "Sesamoid bones", expl: "Sesamoid bones (e.g., patella) develop within tendons near joints to reduce friction.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "The growth plate in a developing bone is called:", opts: ["Epiphyseal plate", "Periosteum", "Endosteum", "Articular disc"], ans: "Epiphyseal plate", expl: "The epiphyseal (growth) plate is a layer of hyaline cartilage at each end of growing long bones.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "Intramembranous ossification forms which bones?", opts: ["Flat bones of the skull", "Long bones", "Short bones", "Irregular vertebrae"], ans: "Flat bones of the skull", expl: "Flat skull bones form by intramembranous ossification (directly from mesenchymal cells without a cartilage template).", cat: "anatomy", diff: "hard", lang: "en" },
    { q: "Which bone is the only bone that does not articulate with any other bone?", opts: ["Hyoid", "Patella", "Pisiform", "Fabella"], ans: "Hyoid", expl: "The hyoid bone in the neck supports the tongue and does not directly articulate with any other bone.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "The functional unit of compact bone is called:", opts: ["Osteon (Haversian system)", "Trabecula", "Lamella", "Canaliculus"], ans: "Osteon (Haversian system)", expl: "The osteon is the basic structural unit of compact bone, consisting of concentric lamellae around a central canal.", cat: "anatomy", diff: "hard", lang: "en" },
    { q: "Which cells produce the organic matrix of bone?", opts: ["Osteoblasts", "Osteoclasts", "Osteocytes", "Chondroblasts"], ans: "Osteoblasts", expl: "Osteoblasts synthesize and secrete the organic matrix (osteoid) of bone, which then mineralizes.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "Endochondral ossification begins with a template of:", opts: ["Hyaline cartilage", "Fibrocartilage", "Dense connective tissue", "Elastic cartilage"], ans: "Hyaline cartilage", expl: "Endochondral ossification replaces a hyaline cartilage model with bone — the process for most long bones.", cat: "anatomy", diff: "hard", lang: "en" },
    { q: "The knee joint is an example of a:", opts: ["Hinge joint", "Ball-and-socket joint", "Pivot joint", "Gliding joint"], ans: "Hinge joint", expl: "The knee (tibiofemoral) joint is a modified hinge joint allowing mainly flexion and extension.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "Which foramen in the skull transmits the optic nerve?", opts: ["Optic canal", "Foramen ovale", "Jugular foramen", "Foramen rotundum"], ans: "Optic canal", expl: "The optic canal transmits CN II (optic nerve) and the ophthalmic artery.", cat: "anatomy", diff: "hard", lang: "en" },
    { q: "Rickets in children results from deficiency of:", opts: ["Vitamin D", "Vitamin C", "Vitamin K", "Calcium only"], ans: "Vitamin D", expl: "Vitamin D deficiency causes rickets (children) or osteomalacia (adults) due to impaired calcium/phosphorus absorption.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "The patella is classified as which type of bone?", opts: ["Sesamoid", "Short", "Flat", "Irregular"], ans: "Sesamoid", expl: "The patella develops within the quadriceps tendon and is classified as a sesamoid bone.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "Which part of the vertebra forms the body (centrum)?", opts: ["Vertebral body", "Pedicle", "Lamina", "Spinous process"], ans: "Vertebral body", expl: "The vertebral body (centrum) bears weight and is the anterior, cylindrical part of each vertebra.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "The medial malleolus is part of which bone?", opts: ["Tibia", "Fibula", "Talus", "Calcaneus"], ans: "Tibia", expl: "The medial malleolus is a bony prominence of the distal tibia forming the medial ankle.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "Bursa in joints serves to:", opts: ["Reduce friction between tendons and bones", "Produce synovial fluid", "Connect bone to bone", "Form articular cartilage"], ans: "Reduce friction between tendons and bones", expl: "Bursae are fluid-filled sacs that cushion and reduce friction between moving structures.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "The carpal bones are classified as:", opts: ["Short bones", "Flat bones", "Long bones", "Sesamoid bones"], ans: "Short bones", expl: "The 8 carpal bones of the wrist are short bones — roughly cube-shaped for strength in multiple directions.", cat: "anatomy", diff: "easy", lang: "en" },
    { q: "Which suture connects the frontal and parietal bones?", opts: ["Coronal suture", "Sagittal suture", "Lambdoid suture", "Squamous suture"], ans: "Coronal suture", expl: "The coronal suture runs between the frontal bone and the two parietal bones.", cat: "anatomy", diff: "medium", lang: "en" },
    { q: "Paget's disease of bone is associated with:", opts: ["Disorganized bone remodeling", "Vitamin C deficiency", "Excess calcium deposition", "Bone marrow failure"], ans: "Disorganized bone remodeling", expl: "Paget's disease causes excessive, disorganized bone remodeling with enlarged, deformed, weaker bones.", cat: "anatomy", diff: "hard", lang: "en" },
  ]);

  // ── Albanian: Sistemi Skeletor Lesson ────────────────────────────────────
  const sqSkelL = lessonById[`${sqAnatomy}:1`];
  qs(sqSkelL, [
    { q: "Sa kocka ka trupi i njeriut të rritur?", opts: ["206", "209", "200", "212"], ans: "206", expl: "Njerëzit e rritur kanë 206 kocka; foshnjat fillojnë me ~270 të cilat bashkohen me kohën.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Cila është kocka më e gjatë në trupin e njeriut?", opts: ["Femuri", "Tibia", "Humerusi", "Fibula"], ans: "Femuri", expl: "Femuri (kocka e kofshës) është kocka më e gjatë dhe më e fortë në trupin e njeriut.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Çfarë lloj kërc mbulon sipërfaqet artikulare të kockave?", opts: ["Kërci hialin", "Fibrokërci", "Kërci elastik", "Kërci i kalcifikuar"], ans: "Kërci hialin", expl: "Kërci hialin (artikular) ofron sipërfaqe të lëmuara për lëvizjen e nyjeve.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Skeleti aksial përbëhet nga sa kocka?", opts: ["80", "126", "64", "90"], ans: "80", expl: "Skeleti aksial ka 80 kocka: kafkë (28), kolona vertebrale (26), kafazi torakal (25), sternumi (1).", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Cila kockë mbron trurin?", opts: ["Kafkja", "Mandibula", "Klavikula", "Skapula"], ans: "Kafkja", expl: "Kafkja rrethon dhe mbron trurin nga lëndimet.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Si quhet trupi i kockës së gjatë?", opts: ["Diafiza", "Epifiza", "Periosti", "Endosti"], ans: "Diafiza", expl: "Diafiza është trupi cilindrik i kockës së gjatë që përmban kavitetin medullar.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Palca e kuqe e kockave gjendet kryesisht ku te të rriturit?", opts: ["Kockat e sheshta dhe vertabrat", "Vetëm kockat e gjata", "Vetëm kockat e shkurtra", "Kockat sesamoide"], ans: "Kockat e sheshta dhe vartabrat", expl: "Te të rriturit, palca e kuqe (hematopoietike) gjendet kryesisht në kockat e sheshta dhe vërtabrat.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Cili lloj nyje lejon lëvizjen më të madhe?", opts: ["Nyja sinoviale", "Nyja kërcimore", "Nyja fibroze", "Gomfoza"], ans: "Nyja sinoviale", expl: "Nyjet sinoviale (p.sh., gjuri, ijja, supi) janë lëvizshëm lirisht dhe lejojnë gamën më të madhe të lëvizjes.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Osteoklastat janë përgjegjëse për:", opts: ["Resorbimin e kockës", "Formimin e kockës", "Prodhimin e kërcut", "Sintezën e kolagjenit"], ans: "Resorbimin e kockës", expl: "Osteoklastat shpërbëjnë indin kockor (resorpcion), thelbësor për remodelimin dhe homeostazën e kalciumit.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Cili mineral e bën kockën të fortë dhe të ngurtë?", opts: ["Fosfat kalciumi (hidroksiapatiti)", "Karbonat kalciumi", "Klorid kaliumi", "Bikarbonat natriumi"], ans: "Fosfat kalciumi (hidroksiapatiti)", expl: "Kristalet e hidroksiapatitit i japin kockës ngurtësinë dhe forcën e saj.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Kolona vertebrale ka sa vërtabra?", opts: ["33", "28", "36", "30"], ans: "33", expl: "Shtylla kurrizore ka 33 vërtabra: 7 cervikale, 12 torakale, 5 lumbale, 5 sacrale të bashkuara, 4 koksigjeale të bashkuara.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Cila gjendje karakterizohet nga ulja e densitetit të kockës?", opts: ["Osteoporoza", "Osteomalacia", "Osteosarkoma", "Osteomieliti"], ans: "Osteoporoza", expl: "Osteoporoza është sëmundje ku densiteti i kockës ulet, duke rritur riskun e thyerjeve.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Atlasi (C1) artikulohet me çfarë strukture nga sipër?", opts: ["Kondilet oksipitale", "Aksi (C2)", "Kocka hioid", "Mandibula"], ans: "Kondilet oksipitale", expl: "C1 (atlasi) artikulohet me kondilet oksipitale të kafkës, duke lejuar lëvizjen e 'po-po-së'.", cat: "anatomy", diff: "hard", lang: "sq" },
    { q: "Kockat që zhvillohen brenda tendons quhen:", opts: ["Kocka sesamoide", "Kocka suturale", "Kocka parregullta", "Kocka të shkurtra"], ans: "Kocka sesamoide", expl: "Kockat sesamoide (p.sh., patela) zhvillohen brenda tendons pranë nyjeve për të ulur fërkimin.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Pllaka e rritjes në kockën në zhvillim quhet:", opts: ["Pllaka epifizare", "Periosti", "Endosti", "Disku artikular"], ans: "Pllaka epifizare", expl: "Pllaka epifizare (e rritjes) është një shtresë kërci hialin në çdo skaj të kockave të gjata në rritje.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Osifikimi intramembranoz formon cilat kocka?", opts: ["Kockat e sheshta të kafkës", "Kockat e gjata", "Kockat e shkurtra", "Vërtabrat parregullta"], ans: "Kockat e sheshta të kafkës", expl: "Kockat e sheshta të kafkës formohen me osifikim intramembranoz drejtpërdrejt nga qelizat mezenkimale.", cat: "anatomy", diff: "hard", lang: "sq" },
    { q: "Cila kockë nuk artikulohet me asnjë kockë tjetër?", opts: ["Hioidi", "Patela", "Pisiformi", "Fabela"], ans: "Hioidi", expl: "Kocka hioid në qafë mbështet gjuhën dhe nuk artikulohet drejtpërdrejt me asnjë kockë tjetër.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Njësia funksionale e kockës kompakte quhet:", opts: ["Osteon (sistemi i Haversit)", "Trabekulë", "Lamela", "Kanalikul"], ans: "Osteon (sistemi i Haversit)", expl: "Osteon-i është njësia bazë strukturore e kockës kompakte, me lamela koncentrike rreth kanalit qendror.", cat: "anatomy", diff: "hard", lang: "sq" },
    { q: "Cilat qeliza prodhojnë matricën organike të kockës?", opts: ["Osteoblastet", "Osteoklastat", "Osteocitet", "Kondroblastat"], ans: "Osteoblastet", expl: "Osteoblastet sintetizojnë dhe sekretojnë matricën organike (osteoidi) të kockës, e cila pastaj mineralizohet.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Rrahitizmi te fëmijët vjen nga mungesa e:", opts: ["Vitaminës D", "Vitaminës C", "Vitaminës K", "Vetëm kalciumit"], ans: "Vitaminës D", expl: "Mungesa e vitaminës D shkakton rahitizëm (te fëmijët) ose osteomalaci (te të rriturit) për shkak të absorpsionit të dëmtuar të kalciumit.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Patela klasifikohet si çfarë lloj kocke?", opts: ["Sesamoide", "E shkurtër", "E sheshte", "Parregullte"], ans: "Sesamoide", expl: "Patela zhvillohet brenda tendonit të kuadricepsit dhe klasifikohet si kockë sesamoide.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Nyja e gjurit është shembull i:", opts: ["Nyja mentesha", "Nyja top-dhe-kupë", "Nyja kthyese", "Nyja rrëshqitëse"], ans: "Nyja mentesha", expl: "Nyja e gjurit (tibiofemorale) është nyje mentesha e modifikuar që lejon kryesisht fleksion dhe ekstension.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Kockat karpale klasifikohen si:", opts: ["Kocka të shkurtra", "Kocka të sheshta", "Kocka të gjata", "Kocka sesamoide"], ans: "Kocka të shkurtra", expl: "8 kockat karpale të kyçit janë kocka të shkurtra — afërsisht në formë kubi për forcë në shumë drejtime.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Cila suturë lidh kockat frontale dhe parietale?", opts: ["Sutura koronale", "Sutura sagitale", "Sutura lambdoide", "Sutura skuamoze"], ans: "Sutura koronale", expl: "Sutura koronale kalon midis kockës frontale dhe dy kockave parietale.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Maleolusi medial është pjesë e cilës kockë?", opts: ["Tibias", "Fibulas", "Talusit", "Kalkaneumit"], ans: "Tibias", expl: "Maleolusi medial është proeminencë kockore e tibias distale duke formuar anën mediale të kyçit të këmbës.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Bursët në nyje shërbejnë për:", opts: ["Uljen e fërkimit midis tendons dhe kockave", "Prodhimin e lëngut sinovial", "Lidhjen kockë me kockë", "Formimin e kërcut artikular"], ans: "Uljen e fërkimit midis tendons dhe kockave", expl: "Bursët janë sako me lëng që amortizojnë dhe ulin fërkimin midis strukturave lëvizëse.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Sëmundja Paget e kockës shoqërohet me:", opts: ["Remodelim të çorganizuar të kockës", "Mungesë vitamine C", "Depozitim të tepërt kalciumi", "Dështim të palcës kockore"], ans: "Remodelim të çorganizuar të kockës", expl: "Sëmundja Paget shkakton remodelim të tepruar, të çorganizuar të kockës me kocka të zgjeruara, të deformuara dhe më të dobëta.", cat: "anatomy", diff: "hard", lang: "sq" },
    { q: "Çfarë strukturë mban gjuhën në vend?", opts: ["Kocka hioid", "Mandibula", "Sternumi", "Klavikula"], ans: "Kocka hioid", expl: "Kocka hioid mbështet gjuhën dhe muskulaturën e saj.", cat: "anatomy", diff: "easy", lang: "sq" },
    { q: "Epifiza është:", opts: ["Fundi i zgjeruar i kockës së gjatë", "Trupi i kockës", "Mbulesa e jashtme e kockës", "Kaviteti i brendshëm"], ans: "Fundi i zgjeruar i kockës së gjatë", expl: "Epifiza (fundot e zgjeruara) janë të mbuluara me kërci artikular dhe janë pjesë e nyjeve.", cat: "anatomy", diff: "medium", lang: "sq" },
    { q: "Periosti është:", opts: ["Mbulesa e jashtme e kockës", "Mbulesa e brendshme e kockës", "Lloj kërci", "Qelizë kockore"], ans: "Mbulesa e jashtme e kockës", expl: "Periosti është membrana e jashtme e kockave, e pasur me nervat dhe enët e gjakut, e rëndësishme për rritjen dhe riparimin.", cat: "anatomy", diff: "easy", lang: "sq" },
  ]);

  // ── Albanian: Ekologjia - Ekosistemet ─────────────────────────────────────
  const sqEcoL1 = lessonById[`${sqEco}:1`];
  qs(sqEcoL1, [
    { q: "Çfarë është një ekosistem?", opts: ["Komunitet organizmash plus mjedisi i tyre abiotik", "Vetëm bimët e një zone", "Vetëm kafshët e një zone", "Vetëm faktorët kimikë të mjedisit"], ans: "Komunitet organizmash plus mjedisi i tyre abiotik", expl: "Ekosistemi përfshin të gjitha organizmat e gjallë (biotikë) dhe faktorët jo të gjallë (abiotikë) në një zonë.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Cili biom karakterizohet nga reshjet shumë të pakta dhe temperaturat ekstreme?", opts: ["Shkretëtira", "Tundra", "Pylli tropik", "Savana"], ans: "Shkretëtira", expl: "Shkretëtirat kanë reshje nën 250mm/vit dhe temperatura shumë të larta gjatë ditës dhe të ulëta gjatë natës.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Faktori biotik në një ekosistem është:", opts: ["Organizmat e gjallë", "Temperatura", "Uji", "Drita e diellit"], ans: "Organizmat e gjallë", expl: "Faktorët biotikë janë komponentët e gjallë: bimë, kafshë, baktere, kërpudha.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Fotosinteza ndodh kryesisht në:", opts: ["Kloroplaste", "Mitokondri", "Bërthamë", "Ribozome"], ans: "Kloroplaste", expl: "Kloroplastet janë organelet e qelizës bimore ku ndodh fotosinteza duke kapur energjinë diellore.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Zinxhiri ushqimor fillon gjithmonë me:", opts: ["Prodhuesit (bimët)", "Konsumatorët parësorë", "Dekompozuesit", "Konsumatorët dysorë"], ans: "Prodhuesit (bimët)", expl: "Prodhuesit (autotrofet) janë baza e zinxhirit ushqimor, duke sintetizuar ushqimin nga energjia diellore.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Sa energji transferohet zakonisht nga një nivel trofik në tjetrin?", opts: ["10%", "50%", "90%", "25%"], ans: "10%", expl: "Rregulli i 10%: vetëm ~10% e energjisë transferohet nga njëri nivel trofik në tjetrin, pjesa tjetër humbet si nxehtësi.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Çfarë quhet bashkëveprimi kur të dy organizmat përfitojnë?", opts: ["Simbiozë mutualiste", "Parazitizëm", "Komensalizëm", "Grabitqaria"], ans: "Simbiozë mutualiste", expl: "Mutualizmi: të dy speciet përfitojnë (p.sh., bletët dhe lulet).", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Biodiversiteti i lartë zakonisht bën ekosistemit:", opts: ["Më të qëndrueshëm", "Më të ndjeshëm ndaj ndryshimeve", "Më të vogël", "Më pak produktiv"], ans: "Më të qëndrueshëm", expl: "Biodiversiteti i lartë rrit stabilitetin e ekosistemit pasi shumë specie mbulojnë role të ngjashme.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Procesi i shndërrimit të shkretëtirës në tokë të gjelbëruar quhet:", opts: ["Ripyllëzim / Rehabilitim", "Erozion", "Dezertifikim", "Sedimentim"], ans: "Ripyllëzim / Rehabilitim", expl: "Ripyllëzimi është rivendosja e bimësisë në zona të degraduara.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Gazi kryesor serrë i prodhuar nga veprimtaria njerëzore është:", opts: ["CO₂ (dioksid karboni)", "O₂ (oksigjen)", "N₂ (azot)", "He (helium)"], ans: "CO₂ (dioksid karboni)", expl: "Djegia e lëndëve djegëse fosile prodhon CO₂, gazi kryesor i efektit serë nga veprimtaria njerëzore.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Çfarë është eutrofikimi?", opts: ["Pasurimi i ujit me lëndë ushqyese duke shkaktuar rritje algash", "Pastrimi i ujit", "Shkrirja e akullit", "Ndotja me plastikë"], ans: "Pasurimi i ujit me lëndë ushqyese duke shkaktuar rritje algash", expl: "Eutrofikimi ndodh kur nitrate dhe fosfate tepricë hyjnë në ujëra, duke shkaktuar 'lulëzim' të algave dhe mungesë oksigjeni.", cat: "ecology", diff: "hard", lang: "sq" },
    { q: "Cikel i karbonit përfshin:", opts: ["Fotosintezën, frymëmarrjen, djegien dhe dekompozimin", "Vetëm fotosintezën", "Vetëm djegien", "Vetëm evaporimin"], ans: "Fotosintezën, frymëmarrjen, djegien dhe dekompozimin", expl: "Cikeli i karbonit përfshin të gjitha proceset që transferojnë karbonin mes atmosferës, organizmave dhe tokës.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Çfarë janë dekompozuesit?", opts: ["Organizma që shpërbëjnë materialin e vdekur", "Kafshë grabitqare", "Bimë karnivore", "Parazitë"], ans: "Organizma që shpërbëjnë materialin e vdekur", expl: "Dekompozuesit (bakteret dhe kërpudhat) shpërbëjnë materialin organik të vdekur, riciklojnë lëndë ushqyese.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Biomi me biodiversitetin më të lartë është:", opts: ["Pylli tropikal i shiut", "Tundra", "Shkretëtira", "Taiga"], ans: "Pylli tropikal i shiut", expl: "Pyjet tropikale të shiut kanë biodiversitetin më të lartë të tokës — rreth 50% të specieve të njohura.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Ndotja e tokës me pesticide mund të ndikojë zinxhirin ushqimor nëpërmjet:", opts: ["Bioakumulimit", "Fotosintezës", "Evaporimit", "Sedimentimit"], ans: "Bioakumulimit", expl: "Bioakumulimi: toksikantët grumbullohen në indet e organizmave, duke u intensifikuar tek maja e zinxhirit ushqimor.", cat: "ecology", diff: "hard", lang: "sq" },
    { q: "Çfarë është nichia ekologjike?", opts: ["Roli funksional i një organizmi në ekosistem", "Habitati fizik i një organizmi", "Dieta e një organizmi", "Madheësia e popullatës"], ans: "Roli funksional i një organizmi në ekosistem", expl: "Nichia ekologjike përfshin rolin e organizmit, burimet që përdor dhe ndërveprimet me specie të tjera.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Kush janë prodhuesit në ekosistem?", opts: ["Autotrofet (bimët, algat)", "Heterotrofet", "Carnivore", "Omnivore"], ans: "Autotrofet (bimët, algat)", expl: "Prodhuesit janë autotrofet që fiksojnë energjinë diellore dhe formojnë bazën e piramidës ushqimore.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Efekti serë natyror është:", opts: ["I domosdoshëm për jetën në Tokë", "Gjithmonë i dëmshëm", "Shkaktuar vetëm nga CO₂", "Fenomen vetëm njerëzor"], ans: "I domosdoshëm për jetën në Tokë", expl: "Efekti serë natyror mban temperaturën mesatare të Tokës ~15°C; pa të, do të ishte -18°C.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Cili faktor abiotik është më i rëndësishëm për shpërndarjen e biomeve?", opts: ["Temperatura dhe reshjet", "Vetëm pH i tokës", "Vetëm drita", "Ngjyra e tokës"], ans: "Temperatura dhe reshjet", expl: "Temperatura dhe reshjet janë faktorët kryesorë abiotikë që përcaktojnë llojin e biomit në një rajon.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Sukuesioni ekologjik primar fillon me:", opts: ["Tokë të zhveshur ose shkëmb", "Pylle të pjekura", "Kullota", "Pyje sekondare"], ans: "Tokë të zhveshur ose shkëmb", expl: "Sukuesioni primar fillon në zona krejtësisht të zhveshura (pas shpërthimit vullkanik, glacierëve) pa tokë ekzistuese.", cat: "ecology", diff: "hard", lang: "sq" },
    { q: "Çfarë është klimaksi i komunitetit?", opts: ["Komuniteti përfundimtar, i qëndrueshëm pas sukuesioniit", "Komuniteti i parë", "Komuniteti pas zjarrit", "Komuniteti ujor"], ans: "Komuniteti përfundimtar, i qëndrueshëm pas sukuesioniit", expl: "Komuniteti klimaks është faza finale e suksesionit, relativisht i qëndrueshëm dhe i balancuar.", cat: "ecology", diff: "hard", lang: "sq" },
    { q: "Acidifikimi i oqeaneve është shkaktuar nga:", opts: ["Absorpimi i CO₂ nga oqeanet", "Ndotja nga vaji", "Radiazionet UV", "Humbja e mangroves"], ans: "Absorpimi i CO₂ nga oqeanet", expl: "Oqeanet absorbojnë ~30% të CO₂ të prodhuar nga njeriu, duke formuar acid karbonik dhe ulur pH-n.", cat: "ecology", diff: "hard", lang: "sq" },
    { q: "Cili grup kafshësh janë grabitqarët kryesorë në shumë ekosisteme?", opts: ["Konsumatorët tretës (karnivorët e mëdhenj)", "Prodhuesit", "Dekompozuesit", "Herbivore"], ans: "Konsumatorët tretës (karnivorët e mëdhenj)", expl: "Grabitqarët kryesorë janë në majën e zinxhirit ushqimor dhe rregullojnë popullatat e niveleve të ulëta.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Ozonit në stratosferë i atribuohet funksioni i:", opts: ["Mbrojtja nga rrezet UV të Diellit", "Prodhimi i oksigjenit", "Rregullimi i temperaturës", "Mbështetja e reshjeve"], ans: "Mbrojtja nga rrezet UV të Diellit", expl: "Shtresa e ozonit (O₃) absorbon shumicën e rrezatimit UV-B dhe UV-C duke mbrojtur jetën.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Cila është shkaku kryesor i humbjes së biodiversitetit sot?", opts: ["Shkatërrimi i habitateve", "Ndryshimi i klimës", "Gjuetia e tepruar", "Especia invazive"], ans: "Shkatërrimi i habitateve", expl: "Shkatërrimi dhe fragmentimi i habitateve (kryesisht nga bujqësia dhe urbanizimi) është kërcënimi kryesor i biodiversitetit.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Cikeli i azotit ndalet në cilin hap kur prodhon azot atmosferik (N₂)?", opts: ["Denitrifikimi", "Nitrifikimi", "Fiksimi i azotit", "Amonifikimi"], ans: "Denitrifikimi", expl: "Denitrifikimi: bakteret shndërrojnë nitratet në azot gazor (N₂) duke mbyllur ciklin.", cat: "ecology", diff: "hard", lang: "sq" },
    { q: "Shkretëtira Sahara shtrihet kryesisht në:", opts: ["Afrikën Veriore", "Azinë Qendrore", "Australi", "Amerikën Jugore"], ans: "Afrikën Veriore", expl: "Sahara në Afrikën Veriore është shkretëtira e nxehtë më e madhe në botë.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Cili gaz mban 78% të atmosferës tokësore?", opts: ["Azoti (N₂)", "Oksigjeni (O₂)", "Argooni (Ar)", "CO₂"], ans: "Azoti (N₂)", expl: "Atmosfera e Tokës: ~78% N₂, ~21% O₂, ~1% Ar, ~0.04% CO₂.", cat: "ecology", diff: "easy", lang: "sq" },
    { q: "Çfarë është ndryshe mes grabitqarëve dhe parazitëve?", opts: ["Grabitqari vret pre-n menjëherë; paraziti jeton me hostin", "Paraziti e vret hostin menjëherë", "Grabitqari jeton brenda hostit", "Nuk ka dallim"], ans: "Grabitqari vret pre-n menjëherë; paraziti jeton me hostin", expl: "Grabitqarët kapin dhe vret preke, ndërkohë parazitët jetojnë me ose brenda hostit pa e vrarë menjëherë.", cat: "ecology", diff: "medium", lang: "sq" },
    { q: "Piramida e energjisë tregon:", opts: ["Rrjedhën e energjisë nëpër nivelet trofike", "Numrin e organizmave", "Biomasën e organizmave", "Biomasën dhe numrin e organizmave"], ans: "Rrjedhën e energjisë nëpër nivelet trofike", expl: "Piramida e energjisë tregon sasinë e energjisë në çdo nivel trofik, duke u ngushtuar drejt majës.", cat: "ecology", diff: "medium", lang: "sq" },
  ]);

  // ── Albanian: Biologjia Qelizore ──────────────────────────────────────────
  const sqBioL1 = lessonById[`${sqBio}:1`];
  qs(sqBioL1, [
    { q: "Cila organelë prodhon ATP-në për qelizën?", opts: ["Mitokondria", "Kloroplasti", "Ribozomi", "Vakuola"], ans: "Mitokondria", expl: "Mitokondria është 'impianti i energjisë' i qelizës, prodhon ATP nëpërmjet respirimit aerobik.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Cila organelë ka ADN-in e saj?", opts: ["Mitokondria dhe kloroplasti", "Vetëm bërthama", "Ribozomi", "Aparati i Golxhit"], ans: "Mitokondria dhe kloroplasti", expl: "Mitokondria dhe kloroplastet kanë ADN-in e tyre, mbështetje e teorisë endosimbiotike.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Qelizat prokariote dallojnë nga eukariote sepse:", opts: ["Nuk kanë bërthamë membranore", "Nuk kanë ADN", "Janë më të mëdha", "Kanë mitokondri"], ans: "Nuk kanë bërthamë membranore", expl: "Prokariote (bakteret) nuk kanë bërthamë të lidhur me membranë; eukariote kanë bërthamë të lidhur.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Funksioni i ribozomit është:", opts: ["Sinteza e proteinave", "Prodhimi i energjisë", "Shpërbërja e mbetjeve", "Replikimi i ADN-së"], ans: "Sinteza e proteinave", expl: "Ribozomet janë vendi ku ndodh sinteza e proteinave (translacioni i mARN-së).", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Membrana qelizore përbëhet kryesisht nga:", opts: ["Dy shtresa fosfolipidesh", "Proteina të vetme", "Glukozë", "ADN dhe ARN"], ans: "Dy shtresa fosfolipidesh", expl: "Membrana qelizore ka model mozaik fluid: bishtresa fosfolipidesh me proteina të integruar.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Aparati i Golxhit funksionon si:", opts: ["Fabrikë paketimi dhe shpërndarjeje", "Prodhues i energjisë", "Site i sintezës proteike", "Vendi i respirimit"], ans: "Fabrikë paketimi dhe shpërndarjeje", expl: "Aparati i Golxhit modifikon, pakedon dhe distribon proteina dhe lipide brenda dhe jashtë qelizës.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Lizozomet përmbajnë:", opts: ["Enzima hidrolituike të tretjes", "Klorofilë", "ADN", "Hemoglobinë"], ans: "Enzima hidrolituike të tretjes", expl: "Lizozomet ('stomakët' e qelizës) shpërbëjnë materiale të dëmtuara, patogjenë dhe mbetje qelizore.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Çfarë është osmoza?", opts: ["Lëvizja e ujit nëpër membranë semipermeabël drejt zgjidhjes me përqendrim më të lartë", "Lëvizja e joneve aktivisht", "Transporti i glukozës", "Absorbimi i dritës"], ans: "Lëvizja e ujit nëpër membranë semipermeabël drejt zgjidhjes me përqendrim më të lartë", expl: "Osmoza: difuzion pasiv i ujit nga zona e përqendrimit të ulët të tretësit tek zona e përqendrimit të lartë.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Citoplazmë është:", opts: ["Lëngu dhe organelet brenda membranës por jashtë bërthamës", "Vetëm bërthama", "Membrana qelizore", "Vetëm organelet"], ans: "Lëngu dhe organelet brenda membranës por jashtë bërthamës", expl: "Citoplazma është gjithçka brenda membranës qelizore përveç bërthamës: citosol + organele.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Kloroplastet gjenden vetëm në:", opts: ["Qelizat bimore dhe algat", "Qelizat shtazore", "Bakteret", "Kërpudhat"], ans: "Qelizat bimore dhe algat", expl: "Kloroplastet janë specifike për organizmat fotosintetizuese: bimë dhe algat.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "ADN-ja gjendet kryesisht në:", opts: ["Bërthamë", "Citoplazma", "Membrana qelizore", "Ribozome"], ans: "Bërthamë", expl: "ADN-ja qelizore (kromozomet) gjendet kryesisht në bërthamë; gjithashtu pak ADN-je ekziston te mitokondria dhe kloroplastet.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Retikuli endoplazmik i lëmuar (REL) funksionon si:", opts: ["Sinteza e lipideve dhe detoksifikimi", "Sinteza e proteinave", "Prodhimi i ATP-së", "Shpërndarja e ribozomeve"], ans: "Sinteza e lipideve dhe detoksifikimi", expl: "REL sintetizon lipide, hormone steroidike dhe detoksifikon drogat; nuk ka ribozome.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Retikuli endoplazmik i ashpër (REA) ka në sipërfaqe:", opts: ["Ribozome", "Klorofilë", "Lizozome", "Mitokondri"], ans: "Ribozome", expl: "REA është i mbuluar me ribozome dhe ka rol në sintezën dhe transportin e proteinave.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Vakuola qendrore gjendet kryesisht tek:", opts: ["Qelizat bimore", "Qelizat shtazore", "Bakteret", "Kërpudhat"], ans: "Qelizat bimore", expl: "Vakuola qendrore e madhe e qelizës bimore mban presionin turgoral dhe ruan ujë dhe lëndë ushqyese.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Citokeleti qelizor ofron:", opts: ["Mbështetje strukturore dhe lëvizje intracellulare", "Prodhim energjie", "Sintezë proteinash", "Ruajtje ADN-je"], ans: "Mbështetje strukturore dhe lëvizje intracellulare", expl: "Citoskeleti (mikrotubuja, filamente aktine, filamente intermediare) jep formën dhe lejon lëvizjen qelizore.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Fosfolipidi ka:", opts: ["Kokë polare hidrofile dhe bishta jopolare hidrofobe", "Vetëm lidhje peptidike", "Vetëm karbohidrate", "Strukturë kufizuese"], ans: "Kokë polare hidrofile dhe bishta jopolare hidrofobe", expl: "Struktura amfipatike e fosfolipidit mundëson formimin spontan të bishtresës dhe mbylljen e membranave.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Procesi ku një qelizë 'ha' materie të ngurta quhet:", opts: ["Fagocitoza", "Pinacitoza", "Ekzocitoza", "Osmoza"], ans: "Fagocitoza", expl: "Fagocitoza ('ngrënia nga qeliza'): qeliza gëlltit grimca të ngurta ose mikroorganizma duke formuar fagozomin.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Membrana e bërthamës ka:", opts: ["Pore bërthamore që rregullojnë transportin", "Ribozome të brendshme", "ADN jashtë bërthamës", "Klorofilë"], ans: "Pore bërthamore që rregullojnë transportin", expl: "Pore bërthamore lejojnë kalimin selektiv të molekulave (ARN, proteina) mes bërthamës dhe citoplazmës.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Teoria endosimbiotike shpjegon origjinën e:", opts: ["Mitokondreve dhe kloroplasteve", "Ribozomeve", "Bërthamës", "Membranës qelizore"], ans: "Mitokondreve dhe kloroplasteve", expl: "Teoria endosimbiotike: mitokondria dhe kloroplastet u zhvilluan nga bakteret simbiotike të brendësuara brenda qelizave eukariotike.", cat: "biology", diff: "hard", lang: "sq" },
    { q: "Enzima peroksidaze gjenden te:", opts: ["Peroksizome", "Lizozome", "Golxhi", "Ribozome"], ans: "Peroksizome", expl: "Peroksizome shpërbëjnë acidet yndyrore dhe detoksifikojnë substanca të dëmshme si alkooli.", cat: "biology", diff: "hard", lang: "sq" },
    { q: "Mikrotubulat bëhen nga proteinë e quajtur:", opts: ["Tubulina", "Aktina", "Miozina", "Keratina"], ans: "Tubulina", expl: "Mikrotubulat janë polimere të dimerave alfa- dhe beta-tubulinës.", cat: "biology", diff: "hard", lang: "sq" },
    { q: "Gradientit të përqendrimit lëviz molekulat nga:", opts: ["Përqendrimi i lartë tek i ulëti (pasivisht)", "I ulët tek i larti (aktivisht)", "I larti tek i larti", "I ulëti tek i ulëti"], ans: "Përqendrimi i lartë tek i ulëti (pasivisht)", expl: "Difuzioni pasiv: molekulat lëvizin nga rajonet me përqendrim të lartë tek ai i ulët pa shpenzim energjie.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Transporti aktiv kërkon:", opts: ["Energji (ATP) dhe transporterë", "Vetëm membranë semipermeabël", "Gradient përqendrimi", "Uji"], ans: "Energji (ATP) dhe transporterë", expl: "Transporti aktiv lëviz molekulat kundër gradientit të përqendrimit duke shpenzuar ATP.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "ARN-ja mesazhere (mARN) bëhet gjatë procesit të:", opts: ["Transkriptimit", "Translacionit", "Replikimit", "Rekombinimit"], ans: "Transkriptimit", expl: "Transkriptimi: ADN-ja transkriptohet në mARN në bërthamë nga ARN polimeraza.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Antibiotiket si penicilina veproj kryesisht duke:", opts: ["Penguar sintezën e murit qelizor tek bakteret", "Vrarë qelizat njerëzore", "Bllokuar ribozomet njerëzore", "Shkatërruar ADN-në njerëzore"], ans: "Penguar sintezën e murit qelizor tek bakteret", expl: "Penicilina bllokon sintezën e peptidoglikanit të murit qelizor të baktereve, duke shkaktuar lizën e tyre.", cat: "biology", diff: "hard", lang: "sq" },
    { q: "Qeliza bimore dallojnë nga shtazore nëpërmjet pranisë së:", opts: ["Murit qelizor, kloroplasteve dhe vakuolës qendrore", "Mitokondrive", "Ribozomeve", "Membranës qelizore"], ans: "Murit qelizor, kloroplasteve dhe vakuolës qendrore", expl: "Qelizat bimore kanë mur qelizor (celulozë), kloroplaste dhe vakuolë qendrore të madhe; qelizat shtazore jo.", cat: "biology", diff: "easy", lang: "sq" },
    { q: "Qelizat e panterisi (beta-qelizat) prodhojnë:", opts: ["Insulinë", "Glukagon", "Adrenalinë", "Kortizol"], ans: "Insulinë", expl: "Beta-qelizat e pankreasit prodhojnë insulinë, e cila ul glukozën në gjak duke lehtësuar hyrjen e saj në qeliza.", cat: "biology", diff: "hard", lang: "sq" },
    { q: "Klorofila absorbon dritë kryesisht nga:", opts: ["Spektri i kuq dhe i kaltër", "Spektri i gjelbër", "Spektri i verdhë", "Rrezet UV"], ans: "Spektri i kuq dhe i kaltër", expl: "Klorofila absorbon kryesisht dritë të kuqe dhe kaltër, por reflekton të gjelbrin (prandaj bimët janë të gjelbra).", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Frymëmarrja aerobe prodhon rreth sa molekula ATP nga 1 glukozë?", opts: ["36-38", "2", "4", "100"], ans: "36-38", expl: "Frymëmarrja aerobe (glikoliza + cikli Krebs + fosforilimi oksidativ) prodhon ~36-38 ATP nga 1 molekulë glukozë.", cat: "biology", diff: "medium", lang: "sq" },
    { q: "Çfarë quhet organizmat që prodhojnë ushqimin e tyre nga energjia diellore?", opts: ["Autotrofe", "Heterotrofe", "Parazikte", "Saprofitë"], ans: "Autotrofe", expl: "Autotrofet (prodhuesit) si bimët dhe algat sintetizojnë ushqimin nga energjia diellore nëpërmjet fotosintezës.", cat: "biology", diff: "easy", lang: "sq" },
  ]);

  await db.insert(questionsTable).values(allQuestions as any);
  console.log(`✅ Inserted ${allQuestions.length} questions`);

  // ── FLASHCARDS ──────────────────────────────────────────────────────────
  const sqAnatomyCourseId = sqAnatomy;
  const sqEcoCourseId = sqEco;
  const sqBioCourseId = sqBio;
  const sqPharmCourseId = sqPharm;
  const enAnatomyCourseId = enAnatomy;

  const flashcardData = [
    // Albanian - Anatomy flashcards
    { courseId: sqAnatomyCourseId, front: "Sa kocka ka trupi i njeriut të rritur?", back: "206 kocka", category: "anatomy", difficulty: "easy" },
    { courseId: sqAnatomyCourseId, front: "Cila është kocka më e gjatë?", back: "Femuri (kocka e kofshës)", category: "anatomy", difficulty: "easy" },
    { courseId: sqAnatomyCourseId, front: "Çfarë prodhohet në palcën e kuqe kockore?", back: "Qelizat e gjakut (eritrocite, leukocite, trombocite)", category: "anatomy", difficulty: "medium" },
    { courseId: sqAnatomyCourseId, front: "Osteoblastet vs Osteoklastat", back: "Osteoblastet → formojnë kockën\nOsteoklastat → shpërbëjnë kockën", category: "anatomy", difficulty: "medium" },
    { courseId: sqAnatomyCourseId, front: "Kolona vertebrale: sa vërtabra?", back: "33 vërtabra: 7 cervikale, 12 torakale, 5 lumbale, 5 sacrale, 4 koksigjeale", category: "anatomy", difficulty: "medium" },
    { courseId: sqAnatomyCourseId, front: "Çfarë është periosti?", back: "Mbulesa e jashtme fibroze e kockës me nervat dhe enë gjaku", category: "anatomy", difficulty: "easy" },
    { courseId: sqAnatomyCourseId, front: "Nyja sinoviale - karakteristika kryesore?", back: "Lira në lëvizje, ka lëng sinovial, kapsulë artikulare dhe kërc hialin", category: "anatomy", difficulty: "medium" },
    { courseId: sqAnatomyCourseId, front: "Osteoporoza - çfarë ndodh?", back: "Ulja e densitetit mineral kockor → risk i lartë thyerjesh, shpesh te gratë pas menopauzës", category: "anatomy", difficulty: "easy" },
    { courseId: sqAnatomyCourseId, front: "Diafiza e kockës", back: "Trupi cilindrik i kockës së gjatë, përmban kavitetin medullar me palcë kockore", category: "anatomy", difficulty: "easy" },
    { courseId: sqAnatomyCourseId, front: "Hioidin - ku ndodhet dhe funksioni?", back: "Qafë, nuk artikulohet me asnjë kockë tjetër. Mbështet gjuhën dhe gëlltitjen.", category: "anatomy", difficulty: "medium" },
    { courseId: sqAnatomyCourseId, front: "Mnenonikë: Kockat e karpusit", back: "Sam Lieked Tri Pie Tra-Ts-Ca-Ha\n(Scafoid, Lunatum, Triketrum, Pisifor, Trapez, Trapezoid, Kapiatum, Hamat)", category: "anatomy", difficulty: "hard" },
    { courseId: sqAnatomyCourseId, front: "Çfarë është osteon-i?", back: "Njësia strukturore e kockës kompakte; lamela koncentrike rreth kanalit të Haversit", category: "anatomy", difficulty: "hard" },

    // Albanian - Ecology flashcards
    { courseId: sqEcoCourseId, front: "Çfarë është ekosistemi?", back: "Komuniteti i organizmave + mjedisi i tyre abiotik (temperatura, uji, drita, toka)", category: "ecology", difficulty: "easy" },
    { courseId: sqEcoCourseId, front: "Rregulli i 10% i energjisë", back: "Vetëm 10% e energjisë transferohet midis niveleve trofike; 90% humbet si nxehtësi", category: "ecology", difficulty: "easy" },
    { courseId: sqEcoCourseId, front: "Autotrofe vs Heterotrofe", back: "Autotrofe: prodhojnë ushqimin vetë (bimë, algat)\nHeterotrofe: varen nga të tjerët (kafshë, kërpudha)", category: "ecology", difficulty: "easy" },
    { courseId: sqEcoCourseId, front: "Eutrofikimi", back: "Pasurimi i tepërt i ujit me lëndë ushqyese (nitrate, fosfate) → rritje algash → mungesë oksigjeni", category: "ecology", difficulty: "medium" },
    { courseId: sqEcoCourseId, front: "Biomi me biodiversitetin më të lartë?", back: "Pylli tropikal i shiut (~50% e specieve të njohura të Tokës)", category: "ecology", difficulty: "easy" },
    { courseId: sqEcoCourseId, front: "Bioakumulimi", back: "Grumbullimi i toksinave në inde organike duke u rritur drejt majës së zinxhirit ushqimor", category: "ecology", difficulty: "medium" },
    { courseId: sqEcoCourseId, front: "Mutualizëm vs Parazitizëm vs Komensalizëm", back: "Mutualizmë: +/+\nParazitizëm: +/−\nKomensalizëm: +/0", category: "ecology", difficulty: "medium" },
    { courseId: sqEcoCourseId, front: "Efekti serë natyror", back: "CO₂, H₂O, CH₄ mbajnë Tokën të ngrohtë (~15°C). Pa të, do të ishte -18°C", category: "ecology", difficulty: "easy" },
    { courseId: sqEcoCourseId, front: "Sukuesioni ekologjik primar vs sekundar", back: "Primar: fillon nga zero (llava, shkëmb)\nSekundar: rigjeneroi pas shqetësimit (zjarr, prerje pylli)", category: "ecology", difficulty: "hard" },
    { courseId: sqEcoCourseId, front: "Denitrifikimi", back: "Bakteret shndërrojnë nitratin (NO₃⁻) → azot gazor (N₂) duke mbyllur ciklin e azotit", category: "ecology", difficulty: "hard" },

    // Albanian - Biology flashcards
    { courseId: sqBioCourseId, front: "Mitokondria - funksioni kryesor?", back: "'Impianti i energjisë' i qelizës → prodhon ATP nëpërmjet respirimit aerobik", category: "biology", difficulty: "easy" },
    { courseId: sqBioCourseId, front: "Qelizë prokariote vs eukariote", back: "Prokariote: pa bërthamë membranore, pa organele (bakteret)\nEukariote: me bërthamë dhe organele", category: "biology", difficulty: "easy" },
    { courseId: sqBioCourseId, front: "Funksionet e Aparatit të Golxhit", back: "Pakekon, modifikon dhe shpërndan proteinat dhe lipidet; prodion lizozome", category: "biology", difficulty: "easy" },
    { courseId: sqBioCourseId, front: "Fotosinteza - ekuacioni?", back: "6CO₂ + 6H₂O + dritë → C₆H₁₂O₆ (glukozë) + 6O₂", category: "biology", difficulty: "easy" },
    { courseId: sqBioCourseId, front: "Dallimi: REA vs REL", back: "REA (i ashpër): ka ribozome, sintetizon proteina\nREL (i lëmuar): pa ribozome, sintetizon lipide, detoksifikon", category: "biology", difficulty: "medium" },
    { courseId: sqBioCourseId, front: "Osmoza", back: "Lëvizja PASIVE e ujit nëpër membranë semipermeabël nga uji i lirë (i holluar) → tretësirë e koncentruar", category: "biology", difficulty: "easy" },
    { courseId: sqBioCourseId, front: "Lizozomet", back: "Organelet e tretjes qelizore; përmbajnë enzima hidrolituike → shpërbëjnë mbetjet qelizore dhe patogjenët", category: "biology", difficulty: "medium" },
    { courseId: sqBioCourseId, front: "Frymëmarrja aerobe - sa ATP?", back: "~36-38 ATP nga 1 molekulë glukozë\n(Glikolizë + Krebs + Zinxhir elektronesh)", category: "biology", difficulty: "medium" },
    { courseId: sqBioCourseId, front: "Teoria endosimbiotike", back: "Mitokondria dhe kloroplastet ishin dikur baktere të lira të absorbura nga qeliza eukariote", category: "biology", difficulty: "hard" },
    { courseId: sqBioCourseId, front: "Transkriptim vs Translacion", back: "Transkriptimi: ADN→mARN (bërthamë)\nTranslacioni: mARN→Proteinë (ribozome)", category: "biology", difficulty: "medium" },

    // English Anatomy flashcards
    { courseId: enAnatomyCourseId, front: "How many bones in adult human body?", back: "206 bones", category: "anatomy", difficulty: "easy" },
    { courseId: enAnatomyCourseId, front: "Longest bone in the body?", back: "Femur (thigh bone)", category: "anatomy", difficulty: "easy" },
    { courseId: enAnatomyCourseId, front: "Osteoblasts vs Osteoclasts", back: "Osteoblasts → build bone\nOsteoclasts → break down bone", category: "anatomy", difficulty: "medium" },
    { courseId: enAnatomyCourseId, front: "Vertebral column breakdown", back: "33 total: 7 cervical, 12 thoracic, 5 lumbar, 5 sacral (fused), 4 coccygeal (fused)", category: "anatomy", difficulty: "medium" },
    { courseId: enAnatomyCourseId, front: "Osteoporosis", back: "Decreased bone mineral density → increased fracture risk. Common in postmenopausal women.", category: "anatomy", difficulty: "easy" },
    { courseId: enAnatomyCourseId, front: "What is the periosteum?", back: "Outer fibrous membrane covering bone. Contains blood vessels and nerves; essential for bone repair.", category: "anatomy", difficulty: "easy" },
    { courseId: enAnatomyCourseId, front: "Hyoid bone - unique feature?", back: "Only bone that does NOT articulate with any other bone. Supports tongue and larynx.", category: "anatomy", difficulty: "medium" },
    { courseId: enAnatomyCourseId, front: "Haversian system (Osteon)", back: "Structural unit of compact bone: concentric lamellae around a central canal with blood vessels", category: "anatomy", difficulty: "hard" },
  ];

  const insertedFlash = await db.insert(flashcardsTable).values(flashcardData).returning();
  console.log(`✅ Inserted ${insertedFlash.length} flashcards`);

  // ── STUDY NOTES ──────────────────────────────────────────────────────────
  const sqSkelLessonId = sqSkelL;
  const sqEcoLessonId = sqEcoL1;
  const sqBioLessonId = sqBioL1;
  const enSkelLessonId = enSkelL;

  await db.insert(studyNotesTable).values([
    {
      lessonId: sqSkelLessonId,
      title: "Sistemi Skeletor - Shënime të Plota",
      content: "Sistemi skeletor i trupit njerëzor përbëhet nga 206 kocka të rritura. Ai kryen funksione të rëndësishme: mbeshtet trupin, mbron organet vitale, mundëson lëvizjen (bashkë me muskujt), prodhon qelizat e gjakut (hematopoiezë) dhe ruan mineralin - kalciumin dhe fosforin. Kockat klasifikohen sipas formës: të gjata (femuri, humeri), të shkurtra (kockat e karpusit), të sheshta (sternumi, skapula), parregullta (vërtabrat) dhe sesamoide (patela).",
      keyPointsJson: JSON.stringify([
        "206 kocka te të rriturit (foshnjat: ~270 që bashkohen)",
        "Femuri = kocka më e gjatë; ossa sesamoidea p.sh. patela",
        "Osteoblastet formojnë kockën; Osteoklastat shpërbëjnë kockën; Osteocitet mirëmbajnë kockën",
        "Hidroksiapatiti [Ca₁₀(PO₄)₆(OH)₂] jep forcë dhe ngurtësi kockës",
        "Osteoporoza: ulja e densitetit mineral kockor → thyerje spontane",
        "Osteon = njësia strukturore e kockës kompakte (sistemi Havers)",
        "Kolona vertebrale: 7C + 12T + 5L + 5S (bashkuar) + 4Co (bashkuar) = 33",
      ]),
      mnemonicsJson: JSON.stringify([
        "Kockat e karpusit: 'Skafoid-Lunatum-Triketrum-Pisifor-Trapez-Trapezoid-Kapiatum-Hamat'",
        "OsteoBLAST = BLearns (builds bone); OsteoCLAST = CLears (clears bone)",
        "OSTEOPOROZA: Os-teo-por-oza → 'kockat me pore shumë'",
        "C7-T12-L5: '7 kollaret, 12 telat (brinjë), 5 lugat (lumbale)'",
      ]),
      clinicalPearlsJson: JSON.stringify([
        "Osteoporoza trajtohet me bifosfonatë (alendronate) + vitaminë D + kalcium",
        "Rrahitizëm te fëmijët: mungesë vit.D → kocka të buta dhe deformime (këmbë gjembëza)",
        "Fraktura e hip (kokë femurale) te të moshuarit: rrezik i lartë; 30% vdesin brenda 1 viti",
        "Sëmundja Paget: remodelim i shpejtë, i çorganizuar → kocka të enlara dhe deformuara; alkaline phosphatase ↑↑",
        "Mjelomu i shumëfishtë: tumor i plazmaciteve → lezionet litike kockore 'punched-out'",
      ]),
    },
    {
      lessonId: sqEcoLessonId,
      title: "Ekosistemet dhe Biomet - Shënime",
      content: "Ekologjia është shkenca që studion ndërveprimet midis organizmave dhe mjedisit të tyre. Ekosistemi është njësia bazë e ekologjisë dhe përfshin të gjitha organizmat e gjallë (faktorët biotikë) dhe mjedisin fizik (faktorët abiotikë) në një zonë të caktuar. Biomet janë zona gjeografike të mëdha me klima, fauna dhe flora karakteristike. Ekosistemi funksionon nëpërmjet rrjedhave të energjisë dhe cikleve të materialeve.",
      keyPointsJson: JSON.stringify([
        "Faktorët biotikë: organizmat e gjallë (bimë, kafshë, baktere)",
        "Faktorët abiotikë: temperatura, uji, drita, toka, pH",
        "Prodhues (autotrofe) → Konsumatorë parësorë → Konsumatorë dysorë → Grabitqarë kryesorë",
        "Rregulli i 10%: vetëm 10% energjie transferohet midis niveleve trofike",
        "Biodiversiteti më i lartë: pyjet tropikale të shiut",
        "Eutrofikimi: NO₃⁻/PO₄³⁻ tepricë → algat rriten → O₂ ulet → peshqit vdesin",
        "Efekti serë: CO₂, CH₄, H₂O mbajnë nxehtësinë → ngrohja globale",
      ]),
      mnemonicsJson: JSON.stringify([
        "Biomet nga ekuatori drejt poleve: Pylli Tropikal → Savana → Shkretëtirë → Pylli Temperuar → Tajga → Tundra",
        "Zinxhiri ushqimor: 'Bima e bën, Harku e ha, Gjarpri e ha Harkun, Shqiponja mbyll punën'",
        "10% rregulli: 'Nga 1000 kj tek bima → 100 kj tek lepuri → 10 kj tek ujku'",
      ]),
      clinicalPearlsJson: JSON.stringify([
        "Ndotja me DDT (pesticide): bioakumulim → shqiponjat kishin vezë me lëvozhgë të holla (efekti sub-lethal)",
        "Acidifikimi i oqeanit: pH ulet nga 8.2 → 8.1 (30% aciditeti rritet) → prekim i koraleve dhe molushtëve",
        "Zona e vdekur: zona ujore pa oksigjen (hipoksike) nga eutrofikimi, zakonisht te grykat e lumenjve",
        "Protokolli i Montrealit (1987): ndaloi CFC-të → shtresa e ozonit po rikuperohet",
        "Humbja e habitatit = shkaku #1 i zhdukjes së specieve sot",
      ]),
    },
    {
      lessonId: sqBioLessonId,
      title: "Biologjia Qelizore - Strukturat dhe Funksionet",
      content: "Qeliza është njësia bazë strukturore dhe funksionale e jetës. Ekzistojnë dy lloje kryesore: prokariote (bakteret, arkeat - pa bërthamë membranore) dhe eukariote (bimët, kafshët, kërpudhat - me bërthamë dhe organele). Qelizat eukariote kanë strukturë komplekse me shumë organele të specializuara, secila me funksion specifik.",
      keyPointsJson: JSON.stringify([
        "Prokariote: pa bërthamë membranore, ribozome 70S, zakonisht < 10 μm",
        "Eukariote: me bërthamë, ribozome 80S, organele të shumta, 10-100 μm",
        "Mitokondria: 'impianti i energjisë' → ATP nëpërmjet frymëmarrjes aerobe (~36-38 ATP/glukozë)",
        "Kloroplastet (te bimët/alg): fotosintezë → 6CO₂+6H₂O→C₆H₁₂O₆+6O₂",
        "Lizozomet: enzima hidrolituike → tretja intracellulare",
        "Aparati Golxhi: pakekon/modifikon proteina dhe lipide → sekrecion",
        "REA: me ribozome → sintetizon proteina sekretore; REL: pa ribozome → lipide + detoksifikim",
      ]),
      mnemonicsJson: JSON.stringify([
        "Organelet: 'Mina Klorin Listoi Gëzimin Ribas Vokal' = Mitokondria, Kloroplast, Lizozom, Golxhi, Ribozom, Vakuolë",
        "REA vs REL: 'Ashpër = Aktiv (proteina); Lëmuar = Lipide'",
        "Frymëmarrja: 'Glikozi Korebon Zinxhirin' = Glikolizë → Krebs → Zinxhir elektronesh",
        "DNA → mRNA → Protein: 'ADN i dërgon mesazhin, mARN mbart mesazhin, Ribozomi lexon mesazhin'",
      ]),
      clinicalPearlsJson: JSON.stringify([
        "Sëmundjet mitokondriake: trashëgohen nga nëna (ADN mitokondriake maternal); miopati, encefalopatia",
        "Lizozome disfunksionale: sëmundje ruajtjeje lizozomale (Gaucher, Tay-Sachs) → grumbullim substratesh toksike",
        "Cilia primare: sensoriale; mutacionet e cilia → sëmundja Kartagener (situs inversus + bronshiektazi)",
        "Mitoza e çrregulluar → Kancer: qelizat ndahen pa kontroll, invadojnë indet fqinje",
        "Penicilina: bllokon sintezën e murit qelizor bakterial (peptidoglikan) → lizë bakteriale (efekti baktericidal)",
      ]),
    },
    {
      lessonId: enSkelLessonId,
      title: "The Skeletal System - Complete Notes",
      content: "The adult human skeletal system consists of 206 bones and performs critical functions: structural support, organ protection (skull→brain, ribcage→lungs/heart), locomotion, hematopoiesis (red marrow), and mineral homeostasis (calcium and phosphorus storage). Bones are classified by shape: long (femur, humerus), short (carpals), flat (sternum, scapula), irregular (vertebrae), and sesamoid (patella).",
      keyPointsJson: JSON.stringify([
        "206 bones in adults (infants ~270 bones that fuse over time)",
        "Femur = longest bone; Hyoid = only bone not articulating with another bone",
        "Osteoblasts build bone; Osteoclasts resorb bone; Osteocytes maintain bone",
        "Hydroxyapatite [Ca₁₀(PO₄)₆(OH)₂] = mineral component giving bone rigidity",
        "Osteoporosis: decreased bone mineral density → fracture risk",
        "Osteon (Haversian system) = functional unit of compact bone",
        "Spine: 7C + 12T + 5L + 5S (fused) + 4Co (fused) = 33 vertebrae",
      ]),
      mnemonicsJson: JSON.stringify([
        "Carpal bones: 'Scared Lovers Try Positions That They Can't Handle' (Scaphoid-Lunate-Triquetrum-Pisiform-Trapezium-Trapezoid-Capitate-Hamate)",
        "OsteoBLAST = BLASTS new bone; OsteoKLAST = KLEARS bone",
        "Spine segments: 'C7: Breakfast 7am, T12: Lunch 12pm, L5: Dinner at 5pm'",
      ]),
      clinicalPearlsJson: JSON.stringify([
        "Osteoporosis treatment: bisphosphonates (alendronate) + Vit D + Ca²⁺ supplementation",
        "Rickets (children): Vitamin D deficiency → soft bones, bowing of legs",
        "Hip fracture in elderly: 30% 1-year mortality; often requires surgical fixation",
        "Paget's disease: rapid disorganized remodeling → enlarged, deformed bones; elevated Alkaline Phosphatase",
        "Multiple myeloma: plasma cell tumor → 'punched-out' lytic bone lesions, hypercalcemia",
      ]),
    },
  ]);
  console.log(`✅ Inserted study notes`);

  await pool.end();
  console.log("🎉 Seeding complete!");
}

seed().catch(err => { console.error(err); process.exit(1); });
