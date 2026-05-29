import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const userCount = await db.user.count()
    if (userCount > 0) {
      return NextResponse.json({ message: 'Database already seeded', seeded: false })
    }

    const users = await db.user.createMany({
      data: [
        { email: 'arjun@iitd.ac.in', name: 'Arjun Sharma', phone: '9876543210', college: 'IIT Delhi', city: 'Delhi', isVerified: true, isAdmin: true, rating: 4.8, totalSales: 15, whatsapp: '9876543210' },
        { email: 'priya@aiims.ac.in', name: 'Priya Patel', phone: '9876543211', college: 'AIIMS Delhi', city: 'Delhi', isVerified: true, rating: 4.9, totalSales: 8, whatsapp: '9876543211' },
        { email: 'rohit@iitb.ac.in', name: 'Rohit Kumar', phone: '9876543212', college: 'IIT Bombay', city: 'Mumbai', isVerified: true, rating: 4.5, totalSales: 12, whatsapp: '9876543212' },
        { email: 'sneha@nlu.ac.in', name: 'Sneha Gupta', phone: '9876543213', college: 'NLU Delhi', city: 'Delhi', rating: 4.3, totalSales: 5, whatsapp: '9876543213' },
        { email: 'vikram@iitm.ac.in', name: 'Vikram Singh', phone: '9876543214', college: 'IIT Madras', city: 'Chennai', isVerified: true, rating: 4.7, totalSales: 20, whatsapp: '9876543214' },
        { email: 'ananya@cmc.ac.in', name: 'Ananya Iyer', phone: '9876543215', college: 'CMC Vellore', city: 'Chennai', rating: 4.6, totalSales: 10, whatsapp: '9876543215' },
        { email: 'rahul@iisc.ac.in', name: 'Rahul Verma', phone: '9876543216', college: 'IISc Bangalore', city: 'Bangalore', isVerified: true, rating: 4.9, totalSales: 25, whatsapp: '9876543216' },
        { email: 'meera@bitspilani.ac.in', name: 'Meera Joshi', phone: '9876543217', college: 'BITS Pilani', city: 'Jaipur', rating: 4.4, totalSales: 7, whatsapp: '9876543217' },
        { email: 'aditya@nitk.ac.in', name: 'Aditya Reddy', phone: '9876543218', college: 'NITK Surathkal', city: 'Bangalore', rating: 4.2, totalSales: 3, whatsapp: '9876543218' },
        { email: 'kavya@jnu.ac.in', name: 'Kavya Nair', phone: '9876543219', college: 'JNU Delhi', city: 'Delhi', isVerified: true, rating: 4.5, totalSales: 9, whatsapp: '9876543219' },
      ]
    })

    const allUsers = await db.user.findMany()

    const listings = [
      // School Books
      { title: 'NCERT Mathematics Class 10', description: 'NCERT Math textbook for Class 10 CBSE. Latest edition. Minor pencil marks that can be erased. Good for board exam prep.', originalPrice: 180, sellingPrice: 80, category: 'school-books', subcategory: 'Mathematics', standard: '10', board: 'CBSE', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isFeatured: true, views: 345 },
      { title: 'NCERT Science Class 9 Textbook Set', description: 'Complete set of NCERT Science textbooks for Class 9. Physics, Chemistry, Biology combined. Clean pages.', originalPrice: 250, sellingPrice: 100, category: 'school-books', subcategory: 'Science', standard: '9', board: 'CBSE', city: 'Mumbai', condition: 'Like New', whatsappNumber: '9876543212', sellerId: allUsers[2].id, views: 234 },

      // CBSE Books
      { title: 'RD Sharma Mathematics Class 12', description: 'Complete mathematics textbook for class 12 CBSE. Slightly used, all pages intact. Great for board exam preparation.', originalPrice: 500, sellingPrice: 200, category: 'cbse', subcategory: 'Mathematics', standard: '12', board: 'CBSE', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isFeatured: true, views: 189 },
      { title: 'NCERT Physics Class 11 Part 1 & 2', description: 'Both parts of NCERT Physics for Class 11. CBSE board. No highlights, clean condition.', originalPrice: 200, sellingPrice: 90, category: 'cbse', subcategory: 'Physics', standard: '11', board: 'CBSE', city: 'Jaipur', condition: 'Good', whatsappNumber: '9876543217', sellerId: allUsers[7].id, views: 156 },
      { title: 'CBSE English Communicative Class 10', description: 'CBSE English Communicative textbook with workbook. Minor notes in pencil.', originalPrice: 220, sellingPrice: 80, category: 'cbse', subcategory: 'English', standard: '10', board: 'CBSE', city: 'Pune', condition: 'Fair', whatsappNumber: '9876543216', sellerId: allUsers[6].id, views: 98 },

      // GSEB Books
      { title: 'GSEB Gujarati Medium Std 10 Science', description: 'Gujarat Board Science textbook for Std 10. Gujarati medium. Clean pages, minimal usage.', originalPrice: 150, sellingPrice: 60, category: 'gseb', subcategory: 'Science', standard: '10', board: 'GSEB', city: 'Ahmedabad', condition: 'Good', whatsappNumber: '9876543217', sellerId: allUsers[7].id, views: 87 },
      { title: 'GSEB Std 12 Physics Gujarati Medium', description: 'Gujarat Board Physics textbook Std 12. Part 1 and Part 2 both included.', originalPrice: 200, sellingPrice: 90, category: 'gseb', subcategory: 'Physics', standard: '12', board: 'GSEB', city: 'Ahmedabad', condition: 'Like New', whatsappNumber: '9876543218', sellerId: allUsers[8].id, views: 112 },

      // ICSE Books
      { title: 'ICSE Concise Physics Class 10', description: 'Selina Concise Physics for ICSE Class 10. Solved numericals and examples. Excellent condition.', originalPrice: 350, sellingPrice: 150, category: 'icse', subcategory: 'Physics', standard: '10', board: 'ICSE', city: 'Kolkata', condition: 'Like New', whatsappNumber: '9876543219', sellerId: allUsers[9].id, views: 134 },
      { title: 'ICSE Chemistry Class 9 Viraf Dalal', description: 'Simplified ICSE Chemistry by Viraf J. Dalal. Standard 9. Good condition.', originalPrice: 280, sellingPrice: 120, category: 'icse', subcategory: 'Chemistry', standard: '9', board: 'ICSE', city: 'Mumbai', condition: 'Good', whatsappNumber: '9876543212', sellerId: allUsers[2].id, views: 76 },

      // College Books
      { title: 'Engineering Mathematics by B.S. Grewal', description: 'Higher Engineering Mathematics 44th edition. Essential for all engineering branches. Some solved examples highlighted.', originalPrice: 600, sellingPrice: 280, category: 'college-books', subcategory: 'Mathematics', course: 'Engineering', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isFeatured: true, views: 456 },

      // Medical Books
      { title: 'Campbell Biology 12th Edition', description: 'International edition Campbell Biology. Essential for NEET and medical entrance. Minor highlighting in first 3 chapters.', originalPrice: 2500, sellingPrice: 1200, category: 'medical', subcategory: 'Biology', course: 'MBBS', semester: '1st', college: 'AIIMS Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543211', sellerId: allUsers[1].id, isFeatured: true, isVerified: true, views: 456 },
      { title: 'BD Chaurasia Human Anatomy Vol 1', description: 'Standard anatomy textbook for medical students. 8th edition. Some pencil annotations.', originalPrice: 850, sellingPrice: 450, category: 'medical', subcategory: 'Anatomy', course: 'MBBS', semester: '1st', college: 'CMC Vellore', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543215', sellerId: allUsers[5].id, views: 198 },
      { title: 'Harrison Principles of Internal Medicine', description: 'Two volume set, 21st edition. The most comprehensive medicine textbook. Excellent condition.', originalPrice: 5000, sellingPrice: 2800, category: 'medical', subcategory: 'Medicine', course: 'MBBS', semester: '5th', college: 'AIIMS Delhi', city: 'Delhi', condition: 'Like New', whatsappNumber: '9876543211', sellerId: allUsers[1].id, isFeatured: true, isVerified: true, views: 389 },

      // Engineering Books
      { title: 'Made Easy GATE CSE 2024', description: 'Complete GATE Computer Science package including theory and previous year questions. Brand new unused.', originalPrice: 1800, sellingPrice: 1100, category: 'engineering', subcategory: 'CSE', course: 'CSE', semester: '7th', college: 'IIT Bombay', city: 'Mumbai', condition: 'Like New', whatsappNumber: '9876543212', sellerId: allUsers[2].id, isFeatured: true, isUrgent: true, views: 312 },
      { title: 'Organic Chemistry Morrison & Boyd', description: 'Classic organic chemistry textbook. 7th edition. Some wear on cover but pages are clean.', originalPrice: 900, sellingPrice: 400, category: 'engineering', subcategory: 'Chemistry', course: 'Chemical Engineering', semester: '2nd', college: 'NITK Surathkal', city: 'Bangalore', condition: 'Fair', whatsappNumber: '9876543218', sellerId: allUsers[8].id, views: 176 },

      // Commerce & Law
      { title: 'Bare Acts Constitution of India', description: 'Latest edition Bare Acts for law students. Includes all amendments. Lightly used.', originalPrice: 350, sellingPrice: 150, category: 'commerce-law', subcategory: 'Constitutional Law', course: 'LLB', semester: '3rd', college: 'NLU Delhi', city: 'Delhi', condition: 'Like New', whatsappNumber: '9876543213', sellerId: allUsers[3].id, views: 145 },
      { title: 'TS Grewal Accountancy Class 12', description: 'Double Entry Book Keeping TS Grewal. CBSE class 12. Solved illustrations and practice problems.', originalPrice: 450, sellingPrice: 180, category: 'commerce-law', subcategory: 'Accountancy', course: 'BCom', college: 'BITS Pilani', city: 'Jaipur', condition: 'Good', whatsappNumber: '9876543217', sellerId: allUsers[7].id, views: 123 },

      // Competitive
      { title: 'HC Verma Concepts of Physics Vol 1 & 2', description: 'Best physics book for JEE preparation. Both volumes in excellent condition. No marks.', originalPrice: 750, sellingPrice: 350, category: 'competitive', subcategory: 'Physics', course: 'JEE', city: 'Delhi', condition: 'Like New', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isFeatured: true, isVerified: true, views: 567 },
      { title: 'Laxmikanth Indian Polity 7th Edition', description: 'The holy grail for UPSC Polity preparation. Slightly worn cover but pages are clean.', originalPrice: 650, sellingPrice: 300, category: 'competitive', subcategory: 'Polity', course: 'UPSC', college: 'JNU Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543219', sellerId: allUsers[9].id, isVerified: true, views: 567 },
      { title: 'Physics Galaxy Vol 1-4 Complete Set', description: 'Complete Physics Galaxy set by Ashish Arora. Best for JEE Advanced. All 4 volumes.', originalPrice: 2200, sellingPrice: 1400, category: 'competitive', subcategory: 'Physics', course: 'JEE', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543214', sellerId: allUsers[4].id, isFeatured: true, views: 278 },
      { title: 'Spectrum Modern History India', description: 'A Brief History of Modern India by Spectrum. UPSC essential. 3rd edition with latest updates.', originalPrice: 450, sellingPrice: 220, category: 'competitive', subcategory: 'History', course: 'UPSC', college: 'JNU Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543219', sellerId: allUsers[9].id, views: 432 },

      // Notes & PDFs
      { title: 'Digital Circuits and Design Notes (PDF + Print)', description: 'Complete semester notes for Digital Electronics. Includes lab manual. Printed on A4 sheets in folder.', originalPrice: 0, sellingPrice: 200, category: 'notes-pdfs', subcategory: 'ECE', course: 'ECE', semester: '3rd', college: 'IIT Bombay', city: 'Mumbai', condition: 'Like New', whatsappNumber: '9876543212', sellerId: allUsers[2].id, isDigital: true, views: 134 },

      // Handwritten Notes
      { title: 'Handwritten NEET Biology Notes', description: 'Comprehensive biology notes from Aakash coaching. Covers entire NCERT + extra. Very neat handwriting. Includes diagrams.', originalPrice: 0, sellingPrice: 500, category: 'handwritten', subcategory: 'Biology', course: 'NEET', college: 'AIIMS Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543211', sellerId: allUsers[1].id, isFeatured: true, views: 512 },
      { title: 'UPSC GS Paper 1 Handwritten Notes', description: 'Detailed handwritten notes for UPSC GS Paper 1. Covers History, Geography, Art & Culture. 200+ pages.', originalPrice: 0, sellingPrice: 400, category: 'handwritten', subcategory: 'General Studies', course: 'UPSC', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543219', sellerId: allUsers[9].id, views: 298 },

      // E-books
      { title: 'Data Structures & Algorithms in Python (E-book)', description: 'Digital PDF version of the popular DSA textbook. Complete with exercises. Instant delivery via email.', originalPrice: 1200, sellingPrice: 299, category: 'ebooks', subcategory: 'Computer Science', course: 'CSE', city: 'Bangalore', condition: 'Like New', whatsappNumber: '9876543216', sellerId: allUsers[6].id, isDigital: true, isFeatured: true, views: 678 },
      { title: 'Organic Chemistry E-book by Morrison Boyd', description: 'PDF version of the classic Organic Chemistry textbook. Searchable and bookmarked. Digital delivery.', originalPrice: 900, sellingPrice: 199, category: 'ebooks', subcategory: 'Chemistry', course: 'Engineering', city: 'Mumbai', condition: 'Like New', whatsappNumber: '9876543212', sellerId: allUsers[2].id, isDigital: true, views: 234 },

      // Notebooks
      { title: 'Classmate Notebooks Set (5 pcs, 200 pages)', description: 'Set of 5 Classmate notebooks. 200 pages each, ruled. Barely used - only first few pages written. Great for college notes.', originalPrice: 500, sellingPrice: 200, category: 'notebooks', subcategory: 'Ruled', city: 'Pune', condition: 'Good', whatsappNumber: '9876543216', sellerId: allUsers[6].id, views: 89 },

      // Pens & Writing
      { title: 'Cello Finegrip Ball Pen Pack of 10', description: 'Pack of 10 Cello Finegrip pens. Blue ink. Brand new sealed pack. Smooth writing for exams.', originalPrice: 150, sellingPrice: 100, category: 'pens', subcategory: 'Ball Pens', city: 'Delhi', condition: 'Like New', whatsappNumber: '9876543210', sellerId: allUsers[0].id, views: 67 },
      { title: 'Staedtler Highlighter Set (6 colors)', description: 'Set of 6 Staedtler Textsurfer highlighters. Essential for marking important text. 2 months used.', originalPrice: 450, sellingPrice: 250, category: 'pens', subcategory: 'Highlighters', city: 'Bangalore', condition: 'Good', whatsappNumber: '9876543216', sellerId: allUsers[6].id, views: 98 },

      // Stationery Items
      { title: 'Complete Stationery Kit for College', description: 'Includes ruler set, compass box, sticky notes, paper clips, stapler, and scissors. All in one kit. Moving out sale.', originalPrice: 800, sellingPrice: 350, category: 'stationery', subcategory: 'Kit', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543214', sellerId: allUsers[4].id, views: 156 },

      // Calculators
      { title: 'Casio FX-991EX Scientific Calculator', description: 'Casio ClassWiz FX-991EX. Best calculator for engineering. Natural textbook display. Works perfectly.', originalPrice: 1200, sellingPrice: 700, category: 'calculators', subcategory: 'Scientific', course: 'Engineering', college: 'IIT Bombay', city: 'Mumbai', condition: 'Like New', whatsappNumber: '9876543212', sellerId: allUsers[2].id, isFeatured: true, isVerified: true, views: 445 },
      { title: 'Casio FX-82MS Calculator', description: 'Basic scientific calculator good for school students. Battery operated. Works perfectly fine.', originalPrice: 500, sellingPrice: 250, category: 'calculators', subcategory: 'Standard', city: 'Jaipur', condition: 'Good', whatsappNumber: '9876543217', sellerId: allUsers[7].id, views: 123 },

      // Drawing Materials
      { title: 'Engineering Drawing Instrument Box', description: 'Complete drawing instrument set with compass, divider, protractor, set squares, and ruler. Mini drafter compatible.', originalPrice: 600, sellingPrice: 300, category: 'drawing', subcategory: 'Instruments', course: 'Engineering', semester: '1st', college: 'NITK Surathkal', city: 'Bangalore', condition: 'Good', whatsappNumber: '9876543218', sellerId: allUsers[8].id, views: 134 },
      { title: 'Faber-Castell Color Pencils 48 Set', description: '48 color pencils set from Faber-Castell. Perfect for art students. Some colors used but most are like new.', originalPrice: 900, sellingPrice: 450, category: 'drawing', subcategory: 'Color Pencils', city: 'Mumbai', condition: 'Good', whatsappNumber: '9876543212', sellerId: allUsers[2].id, views: 89 },

      // Bags
      { title: 'Wildcraft College Backpack 32L', description: 'Wildcraft 32L laptop backpack with rain cover. USB charging port. Used for 1 semester. No damage.', originalPrice: 2500, sellingPrice: 1200, category: 'bags', subcategory: 'Backpacks', college: 'IIT Delhi', city: 'Delhi', condition: 'Like New', whatsappNumber: '9876543210', sellerId: allUsers[0].id, views: 234 },
      { title: 'School Bag Class 6-8 Skybags', description: 'Skybags school backpack for middle school. Multiple compartments. Good condition, minor wear.', originalPrice: 1200, sellingPrice: 500, category: 'bags', subcategory: 'School Bags', city: 'Ahmedabad', condition: 'Good', whatsappNumber: '9876543217', sellerId: allUsers[7].id, views: 78 },

      // Lab Coats
      { title: 'White Lab Coat for Medical Students', description: 'Full sleeve white lab coat for MBBS/BDS students. Size L. Washed and clean. One pocket torn but stitched.', originalPrice: 500, sellingPrice: 200, category: 'lab-coats', subcategory: 'Medical', course: 'MBBS', college: 'AIIMS Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543211', sellerId: allUsers[1].id, views: 156 },
      { title: 'Chemistry Lab Apron (Pack of 2)', description: 'Two chemistry lab aprons. Thick cotton material. Used for 2 semesters. Good condition.', originalPrice: 400, sellingPrice: 150, category: 'lab-coats', subcategory: 'Chemistry', course: 'Chemistry', college: 'IIT Madras', city: 'Chennai', condition: 'Fair', whatsappNumber: '9876543214', sellerId: allUsers[4].id, views: 67 },

      // Instruments
      { title: 'Stethoscope Littmann Classic III', description: 'Littmann Classic III stethoscope in black. Used for 1 year of MBBS. Excellent acoustic performance.', originalPrice: 8500, sellingPrice: 5500, category: 'instruments', subcategory: 'Medical', course: 'MBBS', college: 'CMC Vellore', city: 'Chennai', condition: 'Like New', whatsappNumber: '9876543215', sellerId: allUsers[5].id, isFeatured: true, views: 345 },
      { title: 'Geometry Box with Premium Compass Set', description: 'Premium geometry instrument set. Metal compass, divider, protractor, and rulers. Perfect for school.', originalPrice: 350, sellingPrice: 150, category: 'instruments', subcategory: 'Mathematics', city: 'Pune', condition: 'Good', whatsappNumber: '9876543216', sellerId: allUsers[6].id, views: 89 },

      // Study Lamps
      { title: 'LED Desk Lamp with USB Charging', description: 'Portable LED desk lamp with 3 brightness levels. USB rechargeable. Perfect for late night study sessions. 1 semester used.', originalPrice: 800, sellingPrice: 400, category: 'study-lamps', subcategory: 'LED', college: 'IISc Bangalore', city: 'Bangalore', condition: 'Like New', whatsappNumber: '9876543216', sellerId: allUsers[6].id, views: 156 },
      { title: 'Philips Study Light with Flexible Neck', description: 'Philips LED study lamp. Flexible gooseneck for directional lighting. Eye-care technology. 6 months used.', originalPrice: 1500, sellingPrice: 800, category: 'study-lamps', subcategory: 'LED', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543210', sellerId: allUsers[0].id, views: 112 },

      // Hostel Essentials
      { title: 'Hostel Room LED Desk Lamp', description: 'Portable LED desk lamp with 3 brightness levels. USB rechargeable. Perfect for late night study sessions.', originalPrice: 800, sellingPrice: 400, category: 'hostel', subcategory: 'Lamp', college: 'IISc Bangalore', city: 'Bangalore', condition: 'Like New', whatsappNumber: '9876543216', sellerId: allUsers[6].id, views: 156 },
      { title: 'Coaching Pillow + Bedsheet Set', description: 'Comfortable pillow and matching bedsheets. Used for 1 year in hostel. Washed and clean. Moving out sale!', originalPrice: 1200, sellingPrice: 500, category: 'hostel', subcategory: 'Bedding', college: 'IIT Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isUrgent: true, views: 145 },
      { title: 'Hostel Room Wall Shelf & Organizer Set', description: 'Wall-mounted shelf and desk organizer. Perfect for keeping books and supplies organized in small hostel rooms.', originalPrice: 900, sellingPrice: 400, category: 'hostel', subcategory: 'Organizer', college: 'IIT Madras', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543214', sellerId: allUsers[4].id, views: 98 },

      // Project Files
      { title: 'Engineering Final Year Project Report + Code', description: 'Complete final year project on IoT-based Smart Home. Includes report, code, and circuit diagrams. Can be used as reference.', originalPrice: 0, sellingPrice: 300, category: 'projects', subcategory: 'Engineering', course: 'ECE', semester: '8th', college: 'IIT Bombay', city: 'Mumbai', condition: 'Good', whatsappNumber: '9876543212', sellerId: allUsers[2].id, views: 234 },

      // Art & Craft
      { title: 'Acrylic Paint Set 24 Colors + Canvas Board', description: '24 tube acrylic paint set with 2 canvas boards (12x16). Perfect for art students. Some colors partially used.', originalPrice: 1200, sellingPrice: 600, category: 'art-craft', subcategory: 'Painting', city: 'Mumbai', condition: 'Good', whatsappNumber: '9876543212', sellerId: allUsers[2].id, views: 87 },

      // Study Kits
      { title: 'JEE Complete Study Kit (Books + Notes + Formula Sheets)', description: 'Complete JEE prep kit: HC Verma, OP Tandon, RD Sharma, coaching notes, and formula sheets. Everything you need!', originalPrice: 4500, sellingPrice: 2200, category: 'study-kits', subcategory: 'JEE', course: 'JEE', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isFeatured: true, views: 567 },
      { title: 'NEET Bio Complete Kit (Books + Notes + Flashcards)', description: 'Includes Campbell Biology, NCERT Biology 11-12, Aakash notes, and custom flashcards. All in one bundle.', originalPrice: 3500, sellingPrice: 1800, category: 'study-kits', subcategory: 'NEET', course: 'NEET', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543211', sellerId: allUsers[1].id, isFeatured: true, views: 423 },

      // Exchange listings
      { title: 'Exchange: Data Structures in C for DBMS Book', description: 'I have "Data Structures Using C" by Tanenbaum and want to exchange it for any DBMS textbook. Fair condition.', originalPrice: 500, sellingPrice: 0, category: 'college-books', subcategory: 'CSE', course: 'CSE', semester: '3rd', college: 'IIT Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543210', sellerId: allUsers[0].id, listingType: 'exchange', views: 178 },

      // Giveaway listings
      { title: 'FREE: Old NCERT History Books Class 6-8', description: 'Giving away old NCERT history textbooks from class 6, 7, and 8. Good for starting UPSC prep. Just pay for shipping.', originalPrice: 0, sellingPrice: 0, category: 'school-books', subcategory: 'History', city: 'Delhi', condition: 'Fair', whatsappNumber: '9876543219', sellerId: allUsers[9].id, listingType: 'giveaway', views: 345 },
      { title: 'FREE: Previous Year GATE Papers Printout', description: 'Printed GATE CSE previous year papers from 2015-2023. Free to take. Available in Bangalore only.', originalPrice: 0, sellingPrice: 0, category: 'notes-pdfs', subcategory: 'GATE', course: 'CSE', city: 'Bangalore', condition: 'Good', whatsappNumber: '9876543216', sellerId: allUsers[6].id, listingType: 'giveaway', views: 267 },

      // OP Tandon
      { title: 'OP Tandon Physical Chemistry', description: 'GRB Publications Physical Chemistry by OP Tandon. Great for NEET/JEE chemistry. Some solved examples highlighted.', originalPrice: 600, sellingPrice: 250, category: 'competitive', subcategory: 'Chemistry', course: 'JEE', city: 'Delhi', condition: 'Fair', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isUrgent: true, views: 167 },
      { title: 'Disha Publications 41 Years JEE Physics', description: 'Chapterwise topicwise solved papers from 1978-2019. Excellent for practice.', originalPrice: 550, sellingPrice: 280, category: 'competitive', subcategory: 'Physics', course: 'JEE', city: 'Mumbai', condition: 'Like New', whatsappNumber: '9876543212', sellerId: allUsers[2].id, views: 201 },
      { title: 'Shankar IAS Environment Book', description: 'Latest edition environment book for UPSC. Covers all topics for prelims and mains. Minimal highlighting.', originalPrice: 450, sellingPrice: 250, category: 'competitive', subcategory: 'Environment', course: 'UPSC', college: 'IISc Bangalore', city: 'Bangalore', condition: 'Good', whatsappNumber: '9876543216', sellerId: allUsers[6].id, views: 289 },
      { title: 'Irodov Problems in General Physics', description: 'The legendary Irodov for physics enthusiasts. Must have for JEE Advanced. Solutions included.', originalPrice: 300, sellingPrice: 150, category: 'competitive', subcategory: 'Physics', course: 'JEE', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543214', sellerId: allUsers[4].id, views: 223 },
      { title: 'Motorola Study Tablet with Stylus', description: 'Used for 6 months for note-taking and PDF reading. Comes with original charger and stylus. Great for digital notes.', originalPrice: 15000, sellingPrice: 8500, category: 'hostel', subcategory: 'Electronics', college: 'IIT Madras', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543214', sellerId: allUsers[4].id, isFeatured: true, isVerified: true, views: 678 },
      { title: 'DK Goel Accountancy Class 11', description: 'Financial Accounting part 1 by DK Goel. CBSE class 11. Clean pages, no writing inside.', originalPrice: 380, sellingPrice: 150, category: 'commerce-law', subcategory: 'Accountancy', course: 'Commerce', city: 'Jaipur', condition: 'Good', whatsappNumber: '9876543217', sellerId: allUsers[7].id, views: 98 },
      { title: 'NCERT Complete Set Class 11-12 (PCM)', description: 'Full NCERT set for Physics, Chemistry, Mathematics for classes 11 and 12. Total 12 books. Some pencil marks.', originalPrice: 1800, sellingPrice: 600, category: 'cbse', subcategory: 'PCM', standard: '11', board: 'CBSE', city: 'Delhi', condition: 'Fair', whatsappNumber: '9876543210', sellerId: allUsers[0].id, views: 345 },
    ]

    for (const listing of listings) {
      await db.listing.create({ data: listing })
    }

    return NextResponse.json({ message: 'Database seeded successfully', userCount: allUsers.length, listingCount: listings.length, seeded: true })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const userCount = await db.user.count()
    const listingCount = await db.listing.count()
    return NextResponse.json({ userCount, listingCount, isSeeded: userCount > 0 })
  } catch {
    return NextResponse.json({ userCount: 0, listingCount: 0, isSeeded: false })
  }
}
