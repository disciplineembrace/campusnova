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
      { title: 'HC Verma Concepts of Physics Vol 1 & 2', description: 'Best physics book for JEE preparation. Both volumes in excellent condition. No marks or highlights. Includes original dust jackets.', originalPrice: 750, sellingPrice: 350, category: 'neet-jee', course: 'Physics', semester: '1st', college: 'IIT Delhi', city: 'Delhi', condition: 'Like New', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isFeatured: true, isVerified: true, views: 234 },
      { title: 'RD Sharma Mathematics Class 12', description: 'Complete mathematics textbook for class 12 CBSE. Slightly used, all pages intact. Great for board exam preparation.', originalPrice: 500, sellingPrice: 200, category: 'school', course: 'Mathematics', semester: '1st', college: 'IIT Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isFeatured: true, views: 189 },
      { title: 'Campbell Biology 12th Edition', description: 'International edition Campbell Biology. Essential for NEET and medical entrance. Minor highlighting in first 3 chapters.', originalPrice: 2500, sellingPrice: 1200, category: 'medical', course: 'Biology', college: 'AIIMS Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543211', sellerId: allUsers[1].id, isFeatured: true, isVerified: true, views: 456 },
      { title: 'Made Easy GATE CSE 2024', description: 'Complete GATE Computer Science package including theory and previous year questions. Brand new unused copy.', originalPrice: 1800, sellingPrice: 1100, category: 'engineering', course: 'CSE', semester: '7th', college: 'IIT Bombay', city: 'Mumbai', condition: 'Like New', whatsappNumber: '9876543212', sellerId: allUsers[2].id, isFeatured: true, isUrgent: true, views: 312 },
      { title: 'Laxmikanth Indian Polity 7th Edition', description: 'The holy grail for UPSC Polity preparation. Slightly worn cover but pages are clean. Must have for any UPSC aspirant.', originalPrice: 650, sellingPrice: 300, category: 'upsc', course: 'Polity', college: 'JNU Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543219', sellerId: allUsers[9].id, isVerified: true, views: 567 },
      { title: 'BD Chaurasia Human Anatomy Vol 1', description: 'Standard anatomy textbook for medical students. 8th edition. Some pencil annotations that can be erased.', originalPrice: 850, sellingPrice: 450, category: 'medical', course: 'Anatomy', semester: '1st', college: 'CMC Vellore', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543215', sellerId: allUsers[5].id, views: 198 },
      { title: 'Harrison Principles of Internal Medicine', description: 'Two volume set, 21st edition. The most comprehensive medicine textbook. Excellent condition with minimal usage.', originalPrice: 5000, sellingPrice: 2800, category: 'medical', course: 'Medicine', semester: '5th', college: 'AIIMS Delhi', city: 'Delhi', condition: 'Like New', whatsappNumber: '9876543211', sellerId: allUsers[1].id, isFeatured: true, isVerified: true, views: 389 },
      { title: 'Bare Acts Constitution of India', description: 'Latest edition Bare Acts for law students. Includes all amendments. Lightly used, no marks.', originalPrice: 350, sellingPrice: 150, category: 'law', course: 'Constitutional Law', semester: '3rd', college: 'NLU Delhi', city: 'Delhi', condition: 'Like New', whatsappNumber: '9876543213', sellerId: allUsers[3].id, views: 145 },
      { title: 'TS Grewal Accountancy Class 12', description: 'Double Entry Book Keeping TS Grewal. CBSE class 12. Solved illustrations and practice problems. Good condition.', originalPrice: 450, sellingPrice: 180, category: 'commerce', course: 'Accountancy', college: 'BITS Pilani', city: 'Jaipur', condition: 'Good', whatsappNumber: '9876543217', sellerId: allUsers[7].id, views: 123 },
      { title: 'Physics Galaxy Vol 1-4 Complete Set', description: 'Complete Physics Galaxy set by Ashish Arora. Best for JEE Advanced. All 4 volumes. Minor wear.', originalPrice: 2200, sellingPrice: 1400, category: 'neet-jee', course: 'Physics', college: 'IIT Madras', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543214', sellerId: allUsers[4].id, isFeatured: true, views: 278 },
      { title: 'Spectrum Modern History India', description: 'A Brief History of Modern India by Spectrum. UPSC essential. 3rd edition with latest updates.', originalPrice: 450, sellingPrice: 220, category: 'upsc', course: 'History', college: 'JNU Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543219', sellerId: allUsers[9].id, views: 432 },
      { title: 'OP Tandon Physical Chemistry', description: 'GRB Publications Physical Chemistry by OP Tandon. Great for NEET/JEE chemistry. Some solved examples highlighted.', originalPrice: 600, sellingPrice: 250, category: 'neet-jee', course: 'Chemistry', college: 'IIT Delhi', city: 'Delhi', condition: 'Fair', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isUrgent: true, views: 167 },
      { title: 'Disha Publications 41 Years JEE Physics', description: 'Chapterwise topicwise solved papers from 1978-2019. Excellent for practice. Like new condition.', originalPrice: 550, sellingPrice: 280, category: 'neet-jee', course: 'Physics', college: 'IIT Bombay', city: 'Mumbai', condition: 'Like New', whatsappNumber: '9876543212', sellerId: allUsers[2].id, views: 201 },
      { title: 'NK Acharya Administrative Law', description: 'Standard textbook for Administrative Law. Law students essential reading. Minor wear on spine.', originalPrice: 400, sellingPrice: 200, category: 'law', course: 'Administrative Law', semester: '5th', college: 'NLU Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543213', sellerId: allUsers[3].id, views: 89 },
      { title: 'DK Goel Accountancy Class 11', description: 'Financial Accounting part 1 by DK Goel. CBSE class 11. Clean pages, no writing inside.', originalPrice: 380, sellingPrice: 150, category: 'commerce', course: 'Accountancy', college: 'BITS Pilani', city: 'Jaipur', condition: 'Good', whatsappNumber: '9876543217', sellerId: allUsers[7].id, views: 98 },
      { title: 'Hostel Room LED Desk Lamp', description: 'Portable LED desk lamp with 3 brightness levels. USB rechargeable. Perfect for late night study sessions. Used for 1 semester.', originalPrice: 800, sellingPrice: 400, category: 'hostel', course: 'General', college: 'IISc Bangalore', city: 'Bangalore', condition: 'Like New', whatsappNumber: '9876543216', sellerId: allUsers[6].id, views: 156 },
      { title: 'NCERT Complete Set Class 11-12 (PCM)', description: 'Full NCERT set for Physics, Chemistry, Mathematics for classes 11 and 12. Total 12 books. Some pencil marks.', originalPrice: 1800, sellingPrice: 600, category: 'school', course: 'PCM', college: 'IIT Delhi', city: 'Delhi', condition: 'Fair', whatsappNumber: '9876543210', sellerId: allUsers[0].id, views: 345 },
      { title: 'Motorola Study Tablet with Stylus', description: 'Used for 6 months for note-taking and PDF reading. Comes with original charger and stylus. Great for digital notes.', originalPrice: 15000, sellingPrice: 8500, category: 'hostel', course: 'General', college: 'IIT Madras', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543214', sellerId: allUsers[4].id, isFeatured: true, isVerified: true, views: 678 },
      { title: 'Handwritten NEET Biology Notes', description: 'Comprehensive biology notes from Aakash coaching. Covers entire NCERT + extra. Very neat handwriting. Includes diagrams.', originalPrice: 0, sellingPrice: 500, category: 'notes', course: 'Biology', college: 'AIIMS Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543211', sellerId: allUsers[1].id, views: 512 },
      { title: 'Digital Circuits and Design Notes (PDF + Print)', description: 'Complete semester notes for Digital Electronics. Includes lab manual. Printed on A4 sheets in folder.', originalPrice: 0, sellingPrice: 200, category: 'notes', course: 'ECE', semester: '3rd', college: 'IIT Bombay', city: 'Mumbai', condition: 'Like New', whatsappNumber: '9876543212', sellerId: allUsers[2].id, views: 134 },
      { title: 'Shankar IAS Environment Book', description: 'Latest edition environment book for UPSC. Covers all topics for prelims and mains. Minimal highlighting.', originalPrice: 450, sellingPrice: 250, category: 'upsc', course: 'Environment', college: 'IISc Bangalore', city: 'Bangalore', condition: 'Good', whatsappNumber: '9876543216', sellerId: allUsers[6].id, views: 289 },
      { title: 'Organic Chemistry Morrison & Boyd', description: 'Classic organic chemistry textbook. 7th edition. Some wear on cover but pages are clean and intact.', originalPrice: 900, sellingPrice: 400, category: 'engineering', course: 'Chemistry', semester: '2nd', college: 'NITK Surathkal', city: 'Bangalore', condition: 'Fair', whatsappNumber: '9876543218', sellerId: allUsers[8].id, views: 176 },
      { title: 'Coaching Pillow + Bedsheet Set', description: 'Comfortable pillow and matching bedsheets. Used for 1 year in hostel. Washed and clean. Moving out sale!', originalPrice: 1200, sellingPrice: 500, category: 'hostel', course: 'General', college: 'IIT Delhi', city: 'Delhi', condition: 'Good', whatsappNumber: '9876543210', sellerId: allUsers[0].id, isUrgent: true, views: 145 },
      { title: 'Irodov Problems in General Physics', description: 'The legendary Irodov for physics enthusiasts. Must have for JEE Advanced. Solutions included.', originalPrice: 300, sellingPrice: 150, category: 'neet-jee', course: 'Physics', college: 'IIT Madras', city: 'Chennai', condition: 'Good', whatsappNumber: '9876543214', sellerId: allUsers[4].id, views: 223 },
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
