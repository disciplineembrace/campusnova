from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSansBold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSansBold')


# Brand colors
NAVY = colors.HexColor('#012B5E')
ORANGE = colors.HexColor('#F16404')
TEXT_DARK = colors.HexColor('#1E293B')
TEXT_MUTED = colors.HexColor('#64748B')
BG_LIGHT = colors.HexColor('#F8FAFC')
WHITE = colors.white

# Styles
title_style = ParagraphStyle(name='DocTitle', fontName='DejaVuSans', fontSize=28, leading=36, textColor=NAVY, alignment=TA_CENTER, spaceAfter=8)
subtitle_style = ParagraphStyle(name='Subtitle', fontName='DejaVuSans', fontSize=14, leading=20, textColor=ORANGE, alignment=TA_CENTER, spaceAfter=24)
h1_style = ParagraphStyle(name='H1', fontName='DejaVuSans', fontSize=18, leading=26, textColor=NAVY, spaceBefore=18, spaceAfter=10)
h2_style = ParagraphStyle(name='H2', fontName='DejaVuSans', fontSize=14, leading=20, textColor=NAVY, spaceBefore=12, spaceAfter=6)
body_style = ParagraphStyle(name='Body', fontName='DejaVuSans', fontSize=10.5, leading=17, textColor=TEXT_DARK, alignment=TA_JUSTIFY, spaceAfter=6)
bullet_style = ParagraphStyle(name='Bullet', fontName='DejaVuSans', fontSize=10.5, leading=17, textColor=TEXT_DARK, leftIndent=20, bulletIndent=8, spaceAfter=4)
table_header_style = ParagraphStyle(name='TH', fontName='DejaVuSans', fontSize=10, textColor=WHITE, alignment=TA_CENTER)
table_cell_style = ParagraphStyle(name='TC', fontName='DejaVuSans', fontSize=9.5, textColor=TEXT_DARK, alignment=TA_LEFT, leading=14)
muted_style = ParagraphStyle(name='Muted', fontName='DejaVuSans', fontSize=9, leading=14, textColor=TEXT_MUTED, alignment=TA_CENTER)

output_path = '/home/z/my-project/download/EduCampusHub_SEO_Digital_Marketing_Strategy.pdf'

doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=1*inch, rightMargin=1*inch, topMargin=0.8*inch, bottomMargin=0.8*inch)

story = []

# Cover
story.append(Spacer(1, 80))
story.append(Paragraph('<b>EduCampusHub</b>', title_style))
story.append(Paragraph('SEO & Digital Marketing Strategy', subtitle_style))
story.append(Spacer(1, 30))

cover_info = [
    [Paragraph('<b>Prepared For</b>', table_header_style), Paragraph('<b>Website</b>', table_header_style), Paragraph('<b>Date</b>', table_header_style)],
    [Paragraph('EduCampusHub Team', table_cell_style), Paragraph('campusnova-beta.vercel.app', table_cell_style), Paragraph('May 2026', table_cell_style)],
]
cover_table = Table(cover_info, colWidths=[160, 180, 100], hAlign='CENTER')
cover_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    ('BACKGROUND', (0,1), (-1,1), BG_LIGHT),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
]))
story.append(cover_table)
story.append(Spacer(1, 40))
story.append(Paragraph('Buy  |  Sell  |  Exchange', ParagraphStyle(name='Tagline', fontName='DejaVuSans', fontSize=16, leading=22, textColor=ORANGE, alignment=TA_CENTER)))
story.append(Spacer(1, 10))
story.append(Paragraph("India's Trusted Student Marketplace for Books & Study Materials", muted_style))

story.append(PageBreak())

# Section 1: Executive Summary
story.append(Paragraph('<b>1. Executive Summary</b>', h1_style))
story.append(Paragraph(
    'EduCampusHub is a dedicated student-to-student marketplace designed to facilitate the buying, selling, and exchanging of academic materials across India. '
    'The platform serves a massive underserved market of over 50 million college students who spend an average of Rs 5,000-15,000 per semester on textbooks alone. '
    'By creating a direct peer-to-peer connection, EduCampusHub eliminates middlemen and allows students to save up to 70% on textbook costs while also earning money from books they no longer need. '
    'This SEO and digital marketing strategy outlines a comprehensive approach to driving organic traffic, building brand awareness, and establishing EduCampusHub as the go-to platform for academic material exchange in India.',
    body_style
))
story.append(Paragraph(
    'The strategy is built on three pillars: technical SEO excellence to ensure Google can crawl and index every page effectively; content marketing to establish topical authority in the student marketplace niche; '
    'and social media amplification through Instagram and community engagement to drive referral traffic and build trust. With proper execution of this strategy, EduCampusHub can achieve significant organic growth within 6-12 months, '
    'targeting 10,000+ monthly organic visitors by the end of the first year. The multilingual approach (English, Hindi, Gujarati) further expands the addressable audience across diverse Indian states and linguistic communities.',
    body_style
))

# Section 2: Current SEO Status
story.append(Paragraph('<b>2. Current SEO Status and Technical Foundation</b>', h1_style))
story.append(Paragraph(
    'The website has been built with a strong technical SEO foundation using Next.js 16, which provides server-side rendering, automatic code splitting, and excellent Core Web Vitals performance. '
    'The following technical SEO elements have already been implemented and are live on the platform:',
    body_style
))

tech_data = [
    [Paragraph('<b>Feature</b>', table_header_style), Paragraph('<b>Status</b>', table_header_style), Paragraph('<b>Details</b>', table_header_style)],
    [Paragraph('Structured Data (JSON-LD)', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('Organization, WebSite with SearchAction, WebPage with Offer schema', table_cell_style)],
    [Paragraph('Open Graph Meta Tags', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('Full OG tags for Facebook, LinkedIn, and social sharing with dynamic image', table_cell_style)],
    [Paragraph('Twitter Card Meta Tags', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('summary_large_image card type with title, description, and image', table_cell_style)],
    [Paragraph('Sitemap.xml', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('Dynamic sitemap with all 14 categories + exam-specific pages + listing pages', table_cell_style)],
    [Paragraph('Robots.txt', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('Allows Google, Bing, social crawlers; blocks admin/API routes', table_cell_style)],
    [Paragraph('Vercel Analytics', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('Web Vitals tracking via @vercel/analytics for performance monitoring', table_cell_style)],
    [Paragraph('OG Image Generation', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('Edge runtime auto-generates 1200x630 OG images', table_cell_style)],
    [Paragraph('Multilingual SEO', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('hreflang tags for English, Hindi, Gujarati; localStorage persistence', table_cell_style)],
    [Paragraph('Google Verification', table_cell_style), Paragraph('Ready', table_cell_style), Paragraph('Meta tag placeholder for Google Search Console verification', table_cell_style)],
    [Paragraph('Performance', table_cell_style), Paragraph('Optimized', table_cell_style), Paragraph('AVIF/WebP images, compression, font optimization, code splitting', table_cell_style)],
    [Paragraph('Security Headers', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('CSP, X-Frame-Options, XSS Protection, Referrer-Policy, Permissions-Policy', table_cell_style)],
    [Paragraph('PWA Manifest', table_cell_style), Paragraph('Implemented', table_cell_style), Paragraph('Standalone mode, brand colors, multiple icon sizes', table_cell_style)],
]

tech_table = Table(tech_data, colWidths=[130, 70, 250], hAlign='CENTER')
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    *[('BACKGROUND', (0,i), (-1,i), BG_LIGHT if i%2==0 else WHITE) for i in range(1, len(tech_data))],
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(tech_table)

# Section 3: Keyword Strategy
story.append(Spacer(1, 12))
story.append(Paragraph('<b>3. Keyword Strategy</b>', h1_style))
story.append(Paragraph(
    'A well-defined keyword strategy is critical for capturing organic search traffic. EduCampusHub should target three tiers of keywords: high-volume head terms that drive awareness, '
    'medium-tail keywords that capture intent, and long-tail keywords that convert at high rates. Each category page on the website should be optimized for its primary keyword cluster, '
    'and blog content should target informational long-tail queries that funnel users toward the marketplace.',
    body_style
))

kw_data = [
    [Paragraph('<b>Keyword Tier</b>', table_header_style), Paragraph('<b>Example Keywords</b>', table_header_style), Paragraph('<b>Target Page</b>', table_header_style), Paragraph('<b>Monthly Volume</b>', table_header_style)],
    [Paragraph('Head Terms', table_cell_style), Paragraph('buy old books, sell used books, second hand books India', table_cell_style), Paragraph('Homepage', table_cell_style), Paragraph('10K-50K', table_cell_style)],
    [Paragraph('Category Keywords', table_cell_style), Paragraph('NEET books second hand, JEE used books, engineering old books', table_cell_style), Paragraph('Category Pages', table_cell_style), Paragraph('2K-10K', table_cell_style)],
    [Paragraph('Board-Specific', table_cell_style), Paragraph('CBSE old books, GSEB textbooks Gujarati, ICSE second hand', table_cell_style), Paragraph('Category Pages', table_cell_style), Paragraph('1K-5K', table_cell_style)],
    [Paragraph('Local SEO', table_cell_style), Paragraph('old books Ahmedabad, used books Mumbai, second hand books Delhi', table_cell_style), Paragraph('Explore + City Filters', table_cell_style), Paragraph('500-2K', table_cell_style)],
    [Paragraph('Long-Tail (Blog)', table_cell_style), Paragraph('how to sell old NEET books online, best way to buy used engineering textbooks', table_cell_style), Paragraph('Blog (Future)', table_cell_style), Paragraph('100-500', table_cell_style)],
    [Paragraph('Transactional', table_cell_style), Paragraph('buy cheap NEET books online, sell old college books for cash', table_cell_style), Paragraph('Sell + Explore Pages', table_cell_style), Paragraph('500-2K', table_cell_style)],
]

kw_table = Table(kw_data, colWidths=[85, 175, 100, 85], hAlign='CENTER')
kw_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    *[('BACKGROUND', (0,i), (-1,i), BG_LIGHT if i%2==0 else WHITE) for i in range(1, len(kw_data))],
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(kw_table)

# Section 4: On-Page SEO
story.append(Spacer(1, 12))
story.append(Paragraph('<b>4. On-Page SEO Recommendations</b>', h1_style))

story.append(Paragraph('<b>4.1 Title Tags and Meta Descriptions</b>', h2_style))
story.append(Paragraph(
    'Every page must have a unique, keyword-rich title tag under 60 characters and a compelling meta description under 155 characters. '
    'The homepage title "EduCampusHub - Buy Sell Exchange" should be augmented with the primary keyword: "EduCampusHub - Buy & Sell Old Books Online | Student Marketplace India". '
    'Category pages should follow the pattern: "Buy Used [Category] Books Online | Save 70% | EduCampusHub". '
    'Each listing page should use the book title and condition as the title tag, such as "Concepts of Physics (Like New) - Rs 250 | EduCampusHub". '
    'Meta descriptions should include a call to action and price incentive, for example: "Buy and sell second-hand textbooks directly with students. Save up to 70% on NEET, JEE, and UPSC books. Free listing, instant connection."',
    body_style
))

story.append(Paragraph('<b>4.2 Heading Structure (H1-H3)</b>', h2_style))
story.append(Paragraph(
    'Each page should have exactly one H1 tag containing the primary keyword. The homepage H1 "Buy and Sell Old Books Directly With Students" already includes strong keyword targeting. '
    'Category pages should use H1s like "Buy Used Medical Books Online" or "Second Hand Engineering Textbooks". H2 tags should break the page into logical sections with secondary keywords, '
    'and H3 tags should address specific subtopics. For example, on the NEET category page: H1 "Buy Used NEET Books Online", H2 "Save 70% on NEET Preparation Books", H3 "Popular NEET Books Available". '
    'This hierarchical structure helps Google understand page content and improves the chances of featured snippet selection.',
    body_style
))

story.append(Paragraph('<b>4.3 Internal Linking Strategy</b>', h2_style))
story.append(Paragraph(
    'Internal links distribute page authority across the site and help Google discover new content. The homepage should link to all 14 category pages with keyword-rich anchor text. '
    'Each category page should link to related categories (e.g., "Medical Books" links to "NEET/JEE" and "Notes and PDFs"). '
    'Listing pages should include breadcrumbs (Home > Category > Listing Title) for both navigation and structured data. '
    'The footer should contain links to all major categories, the sell page, and support pages. Cross-linking between related listings ("Similar books you might like") '
    'keeps users on the site longer and creates a dense internal link graph that improves crawl efficiency.',
    body_style
))

# Section 5: Local SEO
story.append(Paragraph('<b>5. Local SEO Strategy</b>', h1_style))
story.append(Paragraph(
    'India is a geographically diverse market, and students frequently search for books with city-specific queries like "old books in Ahmedabad" or "second hand textbooks Mumbai". '
    'EduCampusHub should implement a comprehensive local SEO strategy that leverages the existing city filter functionality. '
    'Create dedicated landing pages for the top 20 Indian cities, each optimized with local keywords, college names, and region-specific board information. '
    'For example, the Ahmedabad page should mention Gujarat University, LD Engineering College, and GSEB board books, while the Delhi page should highlight Delhi University, JNU, and CBSE resources.',
    body_style
))
story.append(Paragraph(
    'Google Business Profile creation is essential even for an online marketplace. Claim and verify the profile for EduCampusHub with the business category "Educational Supply Store" or "Book Store". '
    'Add high-quality product photos, the logo, screenshots of the platform, and regularly post updates about new features and popular listings. '
    'Encourage satisfied users to leave Google reviews, as these appear in local search results and build trust. '
    'List EduCampusHub on Indian business directories such as JustDial, Sulekha, IndiaMart, and TradeIndia with consistent NAP (Name, Address, Phone) information across all platforms.',
    body_style
))

# Section 6: Content Marketing
story.append(Paragraph('<b>6. Content Marketing Plan</b>', h1_style))
story.append(Paragraph(
    'Content marketing is the engine of organic growth. A blog section should be created to target informational queries that potential users search for before they are ready to buy or sell. '
    'This creates a funnel: users discover EduCampusHub through helpful content, build trust with the brand, and eventually become active buyers and sellers on the platform. '
    'Content should be produced in all three supported languages (English, Hindi, Gujarati) to maximize reach across India.',
    body_style
))

content_data = [
    [Paragraph('<b>Content Type</b>', table_header_style), Paragraph('<b>Example Topics</b>', table_header_style), Paragraph('<b>Frequency</b>', table_header_style), Paragraph('<b>Target Keywords</b>', table_header_style)],
    [Paragraph('Exam Guides', table_cell_style), Paragraph('"Top 10 NEET Books Every Aspirant Must Have", "Complete JEE Study Material Guide"', table_cell_style), Paragraph('2/week', table_cell_style), Paragraph('NEET preparation, JEE study material', table_cell_style)],
    [Paragraph('Money-Saving Tips', table_cell_style), Paragraph('"How to Save 70% on College Textbooks", "Best Ways to Sell Old Books Online"', table_cell_style), Paragraph('1/week', table_cell_style), Paragraph('cheap textbooks, sell old books', table_cell_style)],
    [Paragraph('Board-Specific', table_cell_style), Paragraph('"GSEB vs CBSE: Which Books to Buy Used", "ICSE Complete Book List for Class 10"', table_cell_style), Paragraph('1/week', table_cell_style), Paragraph('GSEB books, CBSE old books, ICSE textbooks', table_cell_style)],
    [Paragraph('Student Life', table_cell_style), Paragraph('"Hostel Essentials Checklist", "Top 5 Study Apps for College Students"', table_cell_style), Paragraph('1/week', table_cell_style), Paragraph('student life, college tips', table_cell_style)],
    [Paragraph('City Guides', table_cell_style), Paragraph('"Best Book Markets in Ahmedabad", "Where to Find Used Books in Delhi"', table_cell_style), Paragraph('1/2 weeks', table_cell_style), Paragraph('old books + city name', table_cell_style)],
    [Paragraph('Success Stories', table_cell_style), Paragraph('"How Priya Saved Rs 20,000 on Medical Books", "Student Entrepreneur Earns Rs 50K Selling Notes"', table_cell_style), Paragraph('1/month', table_cell_style), Paragraph('student success, sell books online', table_cell_style)],
]

content_table = Table(content_data, colWidths=[80, 185, 60, 120], hAlign='CENTER')
content_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    *[('BACKGROUND', (0,i), (-1,i), BG_LIGHT if i%2==0 else WHITE) for i in range(1, len(content_data))],
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(content_table)

# Section 7: Social Media Strategy
story.append(Spacer(1, 12))
story.append(Paragraph('<b>7. Social Media Strategy (Instagram @educampushubofficial)</b>', h1_style))
story.append(Paragraph(
    'Instagram is the primary social media channel for EduCampusHub, given its visual nature and high usage among Indian college students (over 200 million Instagram users in India as of 2025). '
    'The account @educampushubofficial should serve as both a marketing channel and a community hub. Content should be a mix of product showcases, student testimonials, exam tips, memes, and interactive stories.',
    body_style
))

story.append(Paragraph('<b>7.1 Instagram Content Calendar</b>', h2_style))
story.append(Paragraph(
    'Post 4-5 times per week with a consistent visual style that matches the website branding (navy blue #012B5E and orange #F16404). '
    'Monday: Book of the Week (showcase a popular textbook with price comparison). Tuesday: Student Spotlight (feature a successful buyer or seller). '
    'Wednesday: Exam Tips carousel (study hacks, time management, book recommendations). Thursday: Meme or relatable student content for engagement. '
    'Friday: Deal Alert (highlight newly listed books at great prices). Weekend: Interactive Stories with polls, quizzes, and "Guess the Book" games. '
    'Use 20-25 relevant hashtags per post including #EduCampusHub #StudentMarketplace #OldBooks #SecondHandBooks #NEETBooks #JEEBooks #SellBooksOnline #BuyBooksCheap and trending exam hashtags.',
    body_style
))

story.append(Paragraph('<b>7.2 Instagram Growth Tactics</b>', h2_style))
story.append(Paragraph(
    'Collaborate with student influencers (1K-10K followers) in the education niche for product reviews and shoutouts. '
    'Run monthly giveaways (e.g., "Follow @educampushubofficial, tag 2 friends, and win free NEET books worth Rs 2,000"). '
    'Use Instagram Reels to create short, viral-optimised content like "3 ways to save money on textbooks" or "POV: You find your semester books at 70% off". '
    'Engage with comments within 1 hour of posting to boost algorithmic reach. Cross-promote with education pages, coaching centres, and college societies. '
    'Share user-generated content by encouraging students to tag @educampushubofficial when they receive books from the platform.',
    body_style
))

# Section 8: Backlink Strategy
story.append(Paragraph('<b>8. Backlink Acquisition Strategy</b>', h1_style))
story.append(Paragraph(
    'Backlinks remain one of the strongest ranking signals. EduCampusHub should pursue a multi-pronged backlink strategy focused on high-authority, relevant Indian education and student websites. '
    'Quality always trumps quantity - a single link from an education authority site like Shiksha.com or Collegedunia is worth more than hundreds of low-quality directory links.',
    body_style
))

bl_data = [
    [Paragraph('<b>Strategy</b>', table_header_style), Paragraph('<b>Target Sites</b>', table_header_style), Paragraph('<b>Approach</b>', table_header_style)],
    [Paragraph('Guest Blogging', table_cell_style), Paragraph('Shiksha, Collegedunia, GetMyUni, Careers360', table_cell_style), Paragraph('Offer to write "How to Save Money on College Books" articles with contextual backlinks', table_cell_style)],
    [Paragraph('Resource Pages', table_cell_style), Paragraph('University websites, college library pages, .edu.in domains', table_cell_style), Paragraph('Suggest EduCampusHub as a resource for affordable textbooks', table_cell_style)],
    [Paragraph('HARO / Quora', table_cell_style), Paragraph('Quora India, Reddit r/IndianAcademy, education forums', table_cell_style), Paragraph('Answer textbook-related questions, link to relevant EduCampusHub pages', table_cell_style)],
    [Paragraph('Digital PR', table_cell_style), Paragraph('Education news sites, student magazines', table_cell_style), Paragraph('Publish data stories like "Indian Students Spend Rs 5,000 Crore on Textbooks Yearly"', table_cell_style)],
    [Paragraph('Partnerships', table_cell_style), Paragraph('Coaching centres, book publishers, stationery brands', table_cell_style), Paragraph('Cross-promotional partnerships with reciprocal linking', table_cell_style)],
    [Paragraph('Directory Listings', table_cell_style), Paragraph('JustDial, Sulekha, IndiaMart, Startup directories', table_cell_style), Paragraph('Create complete profiles with website URL and description', table_cell_style)],
]

bl_table = Table(bl_data, colWidths=[85, 175, 190], hAlign='CENTER')
bl_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    *[('BACKGROUND', (0,i), (-1,i), BG_LIGHT if i%2==0 else WHITE) for i in range(1, len(bl_data))],
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(bl_table)

# Section 9: Performance Targets
story.append(Spacer(1, 12))
story.append(Paragraph('<b>9. Performance Targets and Timeline</b>', h1_style))

target_data = [
    [Paragraph('<b>Metric</b>', table_header_style), Paragraph('<b>Month 1-3</b>', table_header_style), Paragraph('<b>Month 4-6</b>', table_header_style), Paragraph('<b>Month 7-12</b>', table_header_style)],
    [Paragraph('Organic Traffic/Month', table_cell_style), Paragraph('500-1,000', table_cell_style), Paragraph('2,000-5,000', table_cell_style), Paragraph('10,000-25,000', table_cell_style)],
    [Paragraph('Indexed Pages', table_cell_style), Paragraph('50-100', table_cell_style), Paragraph('200-500', table_cell_style), Paragraph('1,000+', table_cell_style)],
    [Paragraph('Domain Authority', table_cell_style), Paragraph('5-10', table_cell_style), Paragraph('15-20', table_cell_style), Paragraph('25-35', table_cell_style)],
    [Paragraph('Backlinks', table_cell_style), Paragraph('20-50', table_cell_style), Paragraph('100-200', table_cell_style), Paragraph('500+', table_cell_style)],
    [Paragraph('Instagram Followers', table_cell_style), Paragraph('500-1,000', table_cell_style), Paragraph('3,000-5,000', table_cell_style), Paragraph('10,000-20,000', table_cell_style)],
    [Paragraph('Active Listings', table_cell_style), Paragraph('100-500', table_cell_style), Paragraph('1,000-3,000', table_cell_style), Paragraph('5,000+', table_cell_style)],
    [Paragraph('Registered Users', table_cell_style), Paragraph('200-500', table_cell_style), Paragraph('1,000-3,000', table_cell_style), Paragraph('5,000-10,000', table_cell_style)],
]

target_table = Table(target_data, colWidths=[120, 110, 110, 110], hAlign='CENTER')
target_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    *[('BACKGROUND', (0,i), (-1,i), BG_LIGHT if i%2==0 else WHITE) for i in range(1, len(target_data))],
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(target_table)

# Section 10: Google Search Console
story.append(Spacer(1, 12))
story.append(Paragraph('<b>10. Google Search Console Setup and Monitoring</b>', h1_style))
story.append(Paragraph(
    'Google Search Console (GSC) is the most important free tool for monitoring and improving search performance. The setup process involves several steps that should be completed within the first week of launch. '
    'First, verify domain ownership using the meta tag that has already been added to the website (the verification placeholder in the layout metadata). '
    'Replace the "PENDING" value with the actual verification code from Google Search Console. Submit the sitemap URL (https://campusnova-beta.vercel.app/sitemap.xml) to Google for crawling. '
    'Request indexing for all category pages and the homepage using the URL Inspection tool.',
    body_style
))
story.append(Paragraph(
    'Monitor GSC weekly for the following metrics: search impressions and clicks by query, average position for target keywords, crawl errors and coverage issues, '
    'Core Web Vitals reports (LCP, FID, CLS), mobile usability issues, and security problems. '
    'Set up email alerts for critical issues like malware detection, crawl spikes, or manual actions. '
    'Use the URL Inspection tool to check indexing status of new pages and request re-indexing after content updates. '
    'After 3 months of data, analyze the Search Analytics report to identify high-impression but low-click queries - these represent optimization opportunities where improved title tags or meta descriptions could significantly boost traffic.',
    body_style
))

# Section 11: Technical SEO Checklist
story.append(Paragraph('<b>11. Technical SEO Action Items</b>', h1_style))

checklist_items = [
    'Replace Google Search Console verification meta tag with actual verification code',
    'Submit sitemap.xml to Google Search Console and Bing Webmaster Tools',
    'Set up Google Analytics 4 (GA4) for detailed traffic analysis alongside Vercel Analytics',
    'Create a custom 404 page with suggested listings and search functionality (already done)',
    'Implement breadcrumb structured data on category and listing pages',
    'Add FAQ structured data to category pages (e.g., "Where to buy used NEET books?")',
    'Set up canonical URLs for all pages to prevent duplicate content issues',
    'Implement hreflang tags for multilingual pages (already partially done)',
    'Create an XML image sitemap for product images',
    'Set up automated broken link checking (weekly cron job)',
    'Minify and compress all CSS and JavaScript assets (already handled by Next.js)',
    'Implement lazy loading for below-the-fold images (already handled by Next.js Image component)',
    'Add alt text to all product images with keyword-rich descriptions',
    'Create a robots.txt test in Google Search Console to verify no important pages are blocked',
    'Set up schema markup for Product/Item availability on listing pages',
]

for item in checklist_items:
    story.append(Paragraph(f'&#8226;  {item}', bullet_style))

# Section 12: Social Media Integration
story.append(Spacer(1, 12))
story.append(Paragraph('<b>12. Website Social Media Integration</b>', h1_style))
story.append(Paragraph(
    'The website has been fully integrated with Instagram (@educampushubofficial) across multiple touchpoints. '
    'The footer contains a direct "Follow @educampushubofficial" gradient button linking to the Instagram profile, alongside social media icon links. '
    'A dedicated Instagram Feed section on the homepage displays a grid of recent post previews with hover effects, directly linking to the Instagram account. '
    'All social links open in new tabs with proper rel="noopener noreferrer" attributes for security. '
    'The structured data (JSON-LD) includes the Instagram profile in the Organization sameAs field, which helps Google associate the website with the social media account for knowledge panel purposes.',
    body_style
))

# Section 13: Conclusion
story.append(Paragraph('<b>13. Summary and Next Steps</b>', h1_style))
story.append(Paragraph(
    'EduCampusHub has a solid technical SEO foundation with structured data, optimized meta tags, dynamic sitemaps, multilingual support, and performance optimizations already in place. '
    'The immediate priorities are: (1) Complete Google Search Console verification and sitemap submission within the first 48 hours of launch. '
    '(2) Begin the Instagram content calendar with at least 3 posts per week starting immediately. '
    '(3) Create the first batch of blog content targeting 10-15 high-value long-tail keywords within the first month. '
    '(4) Reach out to 20 education websites for guest blogging and backlink opportunities within the first two weeks. '
    '(5) Set up Google Analytics 4 and configure conversion tracking for listings created and successful transactions. '
    'With consistent execution of this strategy, EduCampusHub can establish itself as the leading student marketplace in India within 12 months, '
    'capturing significant organic search traffic and building a loyal community of student buyers and sellers.',
    body_style
))

# Build
doc.build(story)
print(f"PDF generated: {output_path}")
