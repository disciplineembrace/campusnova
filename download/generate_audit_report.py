#!/usr/bin/env python3
"""EduCampusHub Comprehensive Website Audit Report - PDF Generator"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib.units import inch, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# ━━ Color Palette ━━
ACCENT       = colors.HexColor('#4e23ce')
TEXT_PRIMARY  = colors.HexColor('#18191a')
TEXT_MUTED    = colors.HexColor('#747b81')
BG_SURFACE   = colors.HexColor('#dde2e6')
BG_PAGE      = colors.HexColor('#e8ebed')

TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = BG_SURFACE

# Severity colors
SEV_CRITICAL = colors.HexColor('#dc2626')
SEV_HIGH     = colors.HexColor('#ea580c')
SEV_MEDIUM   = colors.HexColor('#ca8a04')
SEV_LOW      = colors.HexColor('#2563eb')
SEV_PASS     = colors.HexColor('#16a34a')

# ━━ Font Registration ━━
pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuBold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
# Carlito skipped
# CarlitoBold skipped
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))
registerFontFamily('DejaVu', normal='DejaVu', bold='DejaVuBold')
# Carlito family skipped

# ━━ Page Setup ━━
PAGE_W, PAGE_H = A4
LEFT_M = 1.0 * inch
RIGHT_M = 1.0 * inch
TOP_M = 0.8 * inch
BOTTOM_M = 0.8 * inch
AVAILABLE_W = PAGE_W - LEFT_M - RIGHT_M

OUTPUT_PATH = '/home/z/my-project/download/EduCampusHub_Website_Audit_Report.pdf'

# ━━ Styles ━━
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'CustomTitle', fontName='DejaVu', fontSize=28, leading=34,
    alignment=TA_LEFT, textColor=ACCENT, spaceAfter=12
)

h1_style = ParagraphStyle(
    'H1', fontName='DejaVu', fontSize=18, leading=24,
    textColor=ACCENT, spaceBefore=18, spaceAfter=10
)

h2_style = ParagraphStyle(
    'H2', fontName='DejaVu', fontSize=14, leading=20,
    textColor=TEXT_PRIMARY, spaceBefore=14, spaceAfter=8
)

h3_style = ParagraphStyle(
    'H3', fontName='DejaVu', fontSize=12, leading=17,
    textColor=TEXT_PRIMARY, spaceBefore=10, spaceAfter=6
)

body_style = ParagraphStyle(
    'Body', fontName='DejaVu', fontSize=10.5, leading=16,
    alignment=TA_JUSTIFY, textColor=TEXT_PRIMARY, spaceAfter=6
)

bullet_style = ParagraphStyle(
    'Bullet', fontName='DejaVu', fontSize=10.5, leading=16,
    alignment=TA_LEFT, textColor=TEXT_PRIMARY, spaceAfter=4,
    leftIndent=18, bulletIndent=6
)

muted_style = ParagraphStyle(
    'Muted', fontName='DejaVu', fontSize=9.5, leading=14,
    textColor=TEXT_MUTED, spaceAfter=4
)

header_cell_style = ParagraphStyle(
    'HeaderCell', fontName='DejaVu', fontSize=10,
    textColor=colors.white, alignment=TA_CENTER
)

cell_style = ParagraphStyle(
    'Cell', fontName='DejaVu', fontSize=9.5,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, leading=13
)

cell_center_style = ParagraphStyle(
    'CellCenter', fontName='DejaVu', fontSize=9.5,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER, leading=13
)

sev_cell_style = ParagraphStyle(
    'SevCell', fontName='DejaVu', fontSize=9.5,
    textColor=colors.white, alignment=TA_CENTER, leading=13
)


def make_table(data, col_widths, has_severity=False):
    """Create a styled table."""
    t = Table(data, colWidths=col_widths, hAlign='CENTER')
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]
    for i in range(1, len(data)):
        bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
        style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t


def severity_color(sev):
    if sev == 'CRITICAL': return SEV_CRITICAL
    if sev == 'HIGH': return SEV_HIGH
    if sev == 'MEDIUM': return SEV_MEDIUM
    if sev == 'LOW': return SEV_LOW
    return SEV_PASS


def sev_para(sev):
    c = severity_color(sev)
    return Paragraph(f'<b>{sev}</b>', ParagraphStyle(
        'SevP', fontName='DejaVu', fontSize=9, textColor=c, alignment=TA_CENTER
    ))


# ━━ Build Document ━━
doc = SimpleDocTemplate(
    OUTPUT_PATH, pagesize=A4,
    leftMargin=LEFT_M, rightMargin=RIGHT_M,
    topMargin=TOP_M, bottomMargin=BOTTOM_M,
    title='EduCampusHub Website Audit Report',
    author='Z.ai', creator='Z.ai'
)

story = []

# ━━ COVER PAGE ━━
story.append(Spacer(1, 80))
story.append(HRFlowable(width='100%', thickness=3, color=ACCENT, spaceAfter=20))
story.append(Paragraph('EduCampusHub', title_style))
story.append(Paragraph('Comprehensive Website Audit Report', ParagraphStyle(
    'Subtitle', fontName='DejaVu', fontSize=18, leading=24,
    textColor=TEXT_PRIMARY, spaceAfter=8
)))
story.append(Spacer(1, 12))
story.append(HRFlowable(width='40%', thickness=1.5, color=ACCENT, spaceAfter=20))
story.append(Paragraph('Website: https://educampushub-beta.vercel.app', muted_style))
story.append(Paragraph('Framework: Next.js 16 (App Router) + React + Tailwind CSS', muted_style))
story.append(Paragraph('Database: Neon PostgreSQL with Prisma ORM', muted_style))
story.append(Paragraph('Deployment: Vercel', muted_style))
story.append(Paragraph('Date: May 30, 2026', muted_style))
story.append(Spacer(1, 40))

# Executive Summary Box
story.append(Paragraph('<b>Executive Summary</b>', h2_style))
story.append(Paragraph(
    'This audit identified 27 issues across the EduCampusHub platform: 7 Critical, 8 High, 7 Medium, and 5 Low severity. '
    'The most impactful findings are: (1) the entire site is built as a Single-Page Application using client-side state routing, '
    'making all pages except the homepage return HTTP 404 from the server, which completely blocks Google indexing; '
    '(2) the Google OAuth system is completely non-functional due to placeholder credentials; '
    '(3) session tokens are never verified on protected API routes, enabling full authentication bypass; '
    'and (4) multiple unauthenticated API endpoints allow unauthorized listing creation, modification, and deletion. '
    'The site is currently not indexed by Google, has zero search visibility, and has significant security vulnerabilities '
    'that must be addressed before public launch.',
    body_style
))
story.append(Spacer(1, 20))

# Score table
score_data = [
    [Paragraph('<b>Category</b>', header_cell_style), Paragraph('<b>Score</b>', header_cell_style), Paragraph('<b>Grade</b>', header_cell_style)],
    [Paragraph('Google Indexing', cell_style), Paragraph('0/10', cell_center_style), Paragraph('F', cell_center_style)],
    [Paragraph('Site Architecture', cell_style), Paragraph('1/10', cell_center_style), Paragraph('F', cell_center_style)],
    [Paragraph('Security', cell_style), Paragraph('2/10', cell_center_style), Paragraph('F', cell_center_style)],
    [Paragraph('Authentication', cell_style), Paragraph('2/10', cell_center_style), Paragraph('F', cell_center_style)],
    [Paragraph('SEO Configuration', cell_style), Paragraph('8/10', cell_center_style), Paragraph('B', cell_center_style)],
    [Paragraph('Performance', cell_style), Paragraph('7/10', cell_center_style), Paragraph('B-', cell_center_style)],
    [Paragraph('Mobile Responsiveness', cell_style), Paragraph('9/10', cell_center_style), Paragraph('A', cell_center_style)],
    [Paragraph('PWA / Manifest', cell_style), Paragraph('8/10', cell_center_style), Paragraph('B', cell_center_style)],
    [Paragraph('robots.txt', cell_style), Paragraph('9/10', cell_center_style), Paragraph('A', cell_center_style)],
]
story.append(make_table(score_data, [AVAILABLE_W * 0.5, AVAILABLE_W * 0.25, AVAILABLE_W * 0.25]))
story.append(Spacer(1, 12))
story.append(Paragraph('<b>Overall Score: 5/100 (F)</b>', ParagraphStyle(
    'OverallScore', fontName='DejaVu', fontSize=14, textColor=SEV_CRITICAL,
    alignment=TA_CENTER, spaceBefore=12
)))

story.append(PageBreak())

# ━━ SECTION 1: GOOGLE INDEXING ━━
story.append(Paragraph('1. Google Indexing Status', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

story.append(Paragraph(
    'The website has zero presence on Google. When searching for "site:educampushub-beta.vercel.app", Google returns 0 results. '
    'A brand name search for "EduCampusHub" does not find the website either. Only competitors like e-campushub.com, campushub.io, '
    'and campusswap.in appear in search results. The Google Search Console verification tag is set to "PENDING", meaning the site '
    'has never been verified with Google, and no sitemap has been submitted.',
    body_style
))
story.append(Spacer(1, 8))

index_data = [
    [Paragraph('<b>Check</b>', header_cell_style), Paragraph('<b>Result</b>', header_cell_style)],
    [Paragraph('site:educampushub-beta.vercel.app', cell_style), Paragraph('0 results - NOT INDEXED', cell_style)],
    [Paragraph('"EduCampusHub" brand search', cell_style), Paragraph('Not found', cell_style)],
    [Paragraph('Google Site Verification', cell_style), Paragraph('PENDING - Not configured', cell_style)],
    [Paragraph('Sitemap submitted to GSC', cell_style), Paragraph('No', cell_style)],
]
story.append(make_table(index_data, [AVAILABLE_W * 0.5, AVAILABLE_W * 0.5]))

# ━━ SECTION 2: SITE ARCHITECTURE ━━
story.append(Spacer(1, 18))
story.append(Paragraph('2. Site Architecture - Critical SPA Routing Issue', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

story.append(Paragraph(
    'This is the single most critical issue affecting the entire platform. The application is built as a Single-Page Application '
    '(SPA) using Zustand client-side state routing. All navigation is handled through button click handlers that update a React '
    'state variable called "currentPage". The URL in the browser address bar NEVER changes from "/" during navigation. This means '
    'that every page except the homepage returns HTTP 404 when accessed directly by URL, which completely prevents Google from '
    'crawling or indexing any page beyond the homepage.',
    body_style
))
story.append(Spacer(1, 6))

story.append(Paragraph(
    'When a user navigates to "Explore" or "Categories", the page content changes but the URL remains as "/". If someone tries '
    'to share a link to a specific page, bookmark a page, or use the browser back/forward buttons, none of these work correctly. '
    'This also means that all 28 URLs listed in the sitemap.xml are dead links from Google\'s perspective, which wastes crawl '
    'budget and signals low quality to Google\'s algorithms.',
    body_style
))
story.append(Spacer(1, 8))

route_data = [
    [Paragraph('<b>URL</b>', header_cell_style), Paragraph('<b>Server Status</b>', header_cell_style), Paragraph('<b>Google Can Index?</b>', header_cell_style)],
    [Paragraph('/', cell_style), Paragraph('200', cell_center_style), Paragraph('Yes', cell_center_style)],
    [Paragraph('/explore', cell_style), Paragraph('404', cell_center_style), Paragraph('No', cell_center_style)],
    [Paragraph('/categories', cell_style), Paragraph('404', cell_center_style), Paragraph('No', cell_center_style)],
    [Paragraph('/sell', cell_style), Paragraph('404', cell_center_style), Paragraph('No', cell_center_style)],
    [Paragraph('/login', cell_style), Paragraph('404', cell_center_style), Paragraph('No', cell_center_style)],
    [Paragraph('/privacy', cell_style), Paragraph('404', cell_center_style), Paragraph('No', cell_center_style)],
    [Paragraph('/terms', cell_style), Paragraph('404', cell_center_style), Paragraph('No', cell_center_style)],
    [Paragraph('/category/*', cell_style), Paragraph('404', cell_center_style), Paragraph('No', cell_center_style)],
]
story.append(make_table(route_data, [AVAILABLE_W * 0.4, AVAILABLE_W * 0.3, AVAILABLE_W * 0.3]))
story.append(Spacer(1, 8))
story.append(Paragraph(
    '<b>Recommended Fix:</b> Convert to Next.js file-based routing by creating actual route files: app/explore/page.tsx, '
    'app/categories/page.tsx, app/sell/page.tsx, app/login/page.tsx, app/terms/page.tsx, app/privacy/page.tsx, '
    'and app/category/[slug]/page.tsx. Replace button click handlers with Next.js Link components.',
    body_style
))

# ━━ SECTION 3: AUTHENTICATION ━━
story.append(Spacer(1, 18))
story.append(Paragraph('3. Authentication System Audit', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

story.append(Paragraph(
    'The authentication system has multiple critical vulnerabilities that make it unsuitable for production use. '
    'While the login and registration forms render correctly in the UI and accept user input, the backend implementation '
    'has fundamental security flaws that would allow any attacker to bypass authentication, impersonate users, and perform '
    'unauthorized actions.',
    body_style
))

story.append(Paragraph('3.1 Google OAuth - Completely Non-Functional', h2_style))
story.append(Paragraph(
    'The Google Sign-In button is visible in the login UI but will always fail because the OAuth credentials are placeholders. '
    'The .env file contains "GOOGLE_CLIENT_ID=your-google-client-id-here" and a matching placeholder for the client secret. '
    'Additionally, the client-side Google sign-in button points to "/api/auth/google", but NextAuth expects the route to be '
    '"/api/auth/signin/google". Even if the credentials were correct, clicking the button would hit a 404.',
    body_style
))
story.append(Spacer(1, 6))
story.append(Paragraph(
    '<b>Fix:</b> Register the application at Google Cloud Console, create OAuth 2.0 credentials, set the redirect URI to '
    'https://educampushub-beta.vercel.app/api/auth/callback/google, update the .env file with real credentials, and fix the '
    'client-side URL to "/api/auth/signin/google".',
    body_style
))

story.append(Paragraph('3.2 Passwordless Signup Backdoor', h2_style))
story.append(Paragraph(
    'A critical vulnerability exists in the authentication route handler (src/app/api/auth/route.ts, lines 232-268). When the '
    '"action" parameter is not "register", "login", or "logout", the handler falls through to a legacy backward-compatibility '
    'flow that creates a user account with just an email address and no password. This allows anyone to create accounts under '
    'any email address without authentication, providing full platform access with zero verification.',
    body_style
))
story.append(Paragraph(
    '<b>Fix:</b> Remove lines 231-268 entirely from the auth route handler. This legacy code serves no legitimate purpose.',
    body_style
))

story.append(Paragraph('3.3 Session Tokens Never Verified', h2_style))
story.append(Paragraph(
    'The session_token httpOnly cookie is set upon successful login or registration, but no protected API route ever reads or '
    'verifies this token. Instead, all protected endpoints accept a "userId" parameter directly from the request body or query '
    'string. This means any client can impersonate any user by simply passing a different userId value. There is no server-side '
    'mechanism equivalent to the getAdminFromCookies() helper that exists for admin routes.',
    body_style
))
story.append(Paragraph(
    '<b>Fix:</b> Create a getUserFromCookies() helper function that extracts and verifies the session token, and use it in all '
    'protected API routes. Replace all instances of userId from request body with userId from the verified session.',
    body_style
))

story.append(Paragraph('3.4 Weak JWT Secret', h2_style))
story.append(Paragraph(
    'The JWT secret in production is "educampushub-jwt-secret-2024-secure-prod", a human-readable string that can be easily '
    'guessed. Additionally, the auth route has a hardcoded fallback secret "educampushub-insecure-dev-secret-change-me" that '
    'activates if the environment variable is missing. An attacker who guesses or obtains this secret can forge any session '
    'token and impersonate any user including administrators.',
    body_style
))
story.append(Paragraph(
    '<b>Fix:</b> Generate a cryptographically random secret using "openssl rand -base64 64", set it as the JWT_SECRET environment '
    'variable in Vercel, and remove the hardcoded fallback from the source code, replacing it with a startup crash if the '
    'variable is not set.',
    body_style
))

story.append(Paragraph('3.5 Forgot Password - Non-Functional', h2_style))
story.append(Paragraph(
    'The "Forgot Password?" link in the login form has no onClick handler and does nothing when clicked. There is no password '
    'reset flow implemented anywhere in the codebase. Users who forget their passwords have no recovery path.',
    body_style
))

story.append(Paragraph('3.6 No Email Verification', h2_style))
story.append(Paragraph(
    'Users register with isVerified: false but there is no mechanism to verify email addresses. No verification email is sent, '
    'no verification token is generated, and no verification endpoint exists. This allows spam accounts and fake emails.',
    body_style
))

# ━━ SECTION 4: SECURITY VULNERABILITIES ━━
story.append(Spacer(1, 18))
story.append(Paragraph('4. Security Vulnerabilities', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

security_issues = [
    ['C-1', 'CRITICAL', 'Database credentials exposed in .env file with plaintext password', 'Full database compromise'],
    ['C-2', 'CRITICAL', 'Unauthenticated listing PATCH and DELETE - no authorization checks', 'Listing vandalism, data loss'],
    ['C-3', 'CRITICAL', 'Mass assignment vulnerability in users API - no field whitelist', 'Privilege escalation'],
    ['C-4', 'CRITICAL', 'Mass assignment vulnerability in listings API - no field whitelist', 'Fake verification, impersonation'],
    ['H-1', 'HIGH', 'Payment endpoints have no authentication - userId from request body', 'Payment fraud'],
    ['H-2', 'HIGH', 'Hardcoded personal UPI ID as fallback in payment route', 'Financial misdirection'],
    ['H-3', 'HIGH', 'NODE_ENV=development in production .env file', 'Insecure cookies, info leaks'],
    ['H-4', 'HIGH', 'User data persisted unencrypted in localStorage including isAdmin', 'Client-side privilege escalation'],
    ['M-1', 'MEDIUM', 'CSP allows unsafe-inline and unsafe-eval in script-src', 'XSS attack risk'],
    ['M-2', 'MEDIUM', 'In-memory rate limiting broken in serverless (Vercel)', 'No effective rate limiting'],
    ['M-3', 'MEDIUM', 'Unbounded pagination limit allows ?limit=999999 DoS', 'Database overload'],
    ['L-1', 'LOW', 'Case-sensitive search in listings API', 'Poor search UX'],
]

sec_data = [
    [Paragraph('<b>ID</b>', header_cell_style), Paragraph('<b>Severity</b>', header_cell_style),
     Paragraph('<b>Issue</b>', header_cell_style), Paragraph('<b>Impact</b>', header_cell_style)]
]
for row in security_issues:
    sec_data.append([
        Paragraph(row[0], cell_center_style),
        sev_para(row[1]),
        Paragraph(row[2], cell_style),
        Paragraph(row[3], cell_style)
    ])

story.append(make_table(sec_data, [AVAILABLE_W * 0.08, AVAILABLE_W * 0.12, AVAILABLE_W * 0.50, AVAILABLE_W * 0.30]))

# ━━ SECTION 5: SEO CONFIGURATION ━━
story.append(Spacer(1, 18))
story.append(Paragraph('5. SEO Configuration Analysis', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

story.append(Paragraph('5.1 What Is Working Well', h2_style))
story.append(Paragraph(
    'The on-page SEO implementation is actually quite good. The homepage has comprehensive meta tags including title (48 characters), '
    'description (156 characters), keywords (24 terms), robots directives, canonical URL, and author information. Open Graph tags '
    'are present for social sharing with correct og:title, og:description, og:url, og:site_name, og:locale (en_IN), og:type, '
    'and og:image with proper dimensions. Three JSON-LD structured data schemas are included: Organization, WebSite (with '
    'SearchAction for sitelinks search box), and a WebPage schema. The PWA manifest is correctly configured with icons at '
    '192x192 and 512x512 sizes. The robots.txt is well-structured, properly blocking admin and API paths while allowing '
    'search engine crawlers.',
    body_style
))

story.append(Paragraph('5.2 Critical SEO Issues', h2_style))

seo_issues = [
    ['SPA routing makes all pages 404', 'CRITICAL', 'Only homepage is crawlable by Google'],
    ['Sitemap lists 28 URLs that all return 404', 'CRITICAL', 'Wastes crawl budget, signals low quality'],
    ['Google Search Console not verified (PENDING)', 'HIGH', 'Cannot submit sitemap or monitor indexing'],
    ['cache-control: no-store on all pages', 'HIGH', 'Prevents CDN caching, hurts crawl efficiency'],
    ['No product/listing pages in sitemap', 'MEDIUM', 'DB query may be failing, 0 product URLs'],
    ['No per-page metadata', 'MEDIUM', 'All pages share homepage title/description'],
    ['Missing twitter:site and twitter:creator', 'LOW', 'Incomplete Twitter card'],
    ['OG image inconsistency between og:image and twitter:image', 'LOW', 'Confusing for social crawlers'],
]

seo_data = [
    [Paragraph('<b>Issue</b>', header_cell_style), Paragraph('<b>Severity</b>', header_cell_style),
     Paragraph('<b>Impact</b>', header_cell_style)]
]
for row in seo_issues:
    seo_data.append([
        Paragraph(row[0], cell_style),
        sev_para(row[1]),
        Paragraph(row[2], cell_style)
    ])
story.append(make_table(seo_data, [AVAILABLE_W * 0.45, AVAILABLE_W * 0.15, AVAILABLE_W * 0.40]))

# ━━ SECTION 6: API ENDPOINTS ━━
story.append(Spacer(1, 18))
story.append(Paragraph('6. API Endpoints & Database', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

story.append(Paragraph(
    'All API endpoints are accessible and respond correctly in terms of HTTP status codes. The database connection is functional '
    'with 7 registered users but 0 listings, 0 colleges, and 0 active listings, which is expected for a beta site. Rate limiting '
    'is implemented but uses in-memory storage which does not work in Vercel\'s serverless environment, making it effectively '
    'non-functional.',
    body_style
))
story.append(Spacer(1, 8))

api_data = [
    [Paragraph('<b>Endpoint</b>', header_cell_style), Paragraph('<b>Status</b>', header_cell_style),
     Paragraph('<b>Response Time</b>', header_cell_style), Paragraph('<b>Notes</b>', header_cell_style)],
    [Paragraph('GET /api/listings', cell_style), Paragraph('200', cell_center_style), Paragraph('2.15s', cell_center_style), Paragraph('Slow for empty result', cell_style)],
    [Paragraph('GET /api/auth', cell_style), Paragraph('405', cell_center_style), Paragraph('0.57s', cell_center_style), Paragraph('POST-only, expected', cell_style)],
    [Paragraph('GET /api/stats', cell_style), Paragraph('200', cell_center_style), Paragraph('5.52s', cell_center_style), Paragraph('Very slow, cold start', cell_style)],
    [Paragraph('GET /api/users', cell_style), Paragraph('401', cell_center_style), Paragraph('0.59s', cell_center_style), Paragraph('Properly protected', cell_style)],
    [Paragraph('GET /sitemap.xml', cell_style), Paragraph('200', cell_center_style), Paragraph('0.74s', cell_center_style), Paragraph('Valid XML, 28 URLs', cell_style)],
    [Paragraph('GET /robots.txt', cell_style), Paragraph('200', cell_center_style), Paragraph('0.12s', cell_center_style), Paragraph('Well-structured', cell_style)],
]
story.append(make_table(api_data, [AVAILABLE_W * 0.28, AVAILABLE_W * 0.12, AVAILABLE_W * 0.20, AVAILABLE_W * 0.40]))

story.append(Spacer(1, 10))
story.append(Paragraph(
    '<b>Database Performance Concern:</b> The /api/stats endpoint takes 5.52 seconds to respond, likely due to Neon PostgreSQL '
    'cold starts. The NextAuth session callback also queries the database on every session token validation, which severely '
    'degrades performance. Consider implementing connection pooling and caching session data in the JWT token rather than '
    'querying the database on every request.',
    body_style
))

# ━━ SECTION 7: PERFORMANCE & RESPONSIVENESS ━━
story.append(Spacer(1, 18))
story.append(Paragraph('7. Performance & Responsiveness', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

perf_data = [
    [Paragraph('<b>Metric</b>', header_cell_style), Paragraph('<b>Value</b>', header_cell_style), Paragraph('<b>Assessment</b>', header_cell_style)],
    [Paragraph('Homepage TTFB', cell_style), Paragraph('324ms', cell_center_style), Paragraph('Good', cell_center_style)],
    [Paragraph('Homepage total load', cell_style), Paragraph('528ms', cell_center_style), Paragraph('Good', cell_center_style)],
    [Paragraph('HTML transfer size', cell_style), Paragraph('13.7 KB', cell_center_style), Paragraph('Lightweight', cell_center_style)],
    [Paragraph('Font preload', cell_style), Paragraph('6 files', cell_center_style), Paragraph('Optimized', cell_center_style)],
    [Paragraph('Mobile viewport', cell_style), Paragraph('Correct', cell_center_style), Paragraph('Responsive', cell_center_style)],
    [Paragraph('PWA manifest', cell_style), Paragraph('Valid', cell_center_style), Paragraph('Configured', cell_center_style)],
    [Paragraph('Security headers', cell_style), Paragraph('6/7 present', cell_center_style), Paragraph('Good', cell_center_style)],
    [Paragraph('HTTPS redirect', cell_style), Paragraph('308 redirect', cell_center_style), Paragraph('Working', cell_center_style)],
    [Paragraph('API /stats response', cell_style), Paragraph('5.52s', cell_center_style), Paragraph('Very slow', cell_center_style)],
]
story.append(make_table(perf_data, [AVAILABLE_W * 0.35, AVAILABLE_W * 0.25, AVAILABLE_W * 0.40]))

# ━━ SECTION 8: COMPLETE ISSUE LIST ━━
story.append(Spacer(1, 18))
story.append(Paragraph('8. Complete Issue List (27 Issues)', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

all_issues = [
    ['1', 'CRITICAL', 'SPA routing - all pages except / return 404', 'Convert to Next.js file-based routing'],
    ['2', 'CRITICAL', 'Google OAuth credentials are placeholders', 'Configure real Google Cloud Console credentials'],
    ['3', 'CRITICAL', 'Passwordless signup backdoor in auth handler', 'Remove lines 231-268 from auth route'],
    ['4', 'CRITICAL', 'Session tokens never verified on protected routes', 'Create getUserFromCookies() helper'],
    ['5', 'CRITICAL', 'Unauthenticated listing PATCH/DELETE', 'Add auth + ownership verification'],
    ['6', 'CRITICAL', 'Mass assignment in users API', 'Whitelist allowed update fields'],
    ['7', 'CRITICAL', 'Mass assignment in listings API', 'Whitelist allowed update fields'],
    ['8', 'HIGH', 'Google Sign-In URL incorrect (/api/auth/google)', 'Change to /api/auth/signin/google'],
    ['9', 'HIGH', 'Weak/predictable JWT secret in production', 'Generate with openssl rand -base64 64'],
    ['10', 'HIGH', 'Hardcoded fallback JWT secret in source', 'Replace with startup crash if missing'],
    ['11', 'HIGH', 'Payment endpoints have no authentication', 'Verify session, extract userId from token'],
    ['12', 'HIGH', 'Hardcoded personal UPI ID as fallback', 'Remove fallback, crash if UPI_ID missing'],
    ['13', 'HIGH', 'NODE_ENV=development in production .env', 'Remove from .env, Vercel sets automatically'],
    ['14', 'HIGH', 'User data in localStorage includes isAdmin', 'Remove sensitive fields from persisted state'],
    ['15', 'HIGH', 'Google Search Console not verified', 'Replace PENDING with real verification code'],
    ['16', 'MEDIUM', 'Dual rate limiting implementations', 'Consolidate into single implementation'],
    ['17', 'MEDIUM', 'In-memory rate limiting broken in serverless', 'Use Upstash Redis for serverless'],
    ['18', 'MEDIUM', 'NextAuth session callback DB query on every access', 'Cache in JWT token instead'],
    ['19', 'MEDIUM', 'CSP allows unsafe-inline and unsafe-eval', 'Use nonce-based CSP for production'],
    ['20', 'MEDIUM', 'No email verification flow', 'Implement verification email + endpoint'],
    ['21', 'MEDIUM', 'Forgot Password button non-functional', 'Implement password reset flow'],
    ['22', 'MEDIUM', 'Unbounded pagination limit', 'Cap at maximum 100 results'],
    ['23', 'LOW', 'Duplicate FREE_UPLOAD_LIMIT constant', 'Extract to shared constants file'],
    ['24', 'LOW', 'NextAuth uses non-standard secret env var', 'Use NEXTAUTH_SECRET convention'],
    ['25', 'LOW', 'Case-sensitive search in listings', 'Add mode: insensitive to Prisma query'],
    ['26', 'LOW', 'Logout does not clear client store', 'Call setCurrentUser(null) on logout'],
    ['27', 'LOW', 'Sitemap lastmod always = new Date()', 'Use actual content modification dates'],
]

issues_data = [
    [Paragraph('<b>#</b>', header_cell_style), Paragraph('<b>Severity</b>', header_cell_style),
     Paragraph('<b>Issue</b>', header_cell_style), Paragraph('<b>Recommended Fix</b>', header_cell_style)]
]
for row in all_issues:
    issues_data.append([
        Paragraph(row[0], cell_center_style),
        sev_para(row[1]),
        Paragraph(row[2], cell_style),
        Paragraph(row[3], cell_style)
    ])

story.append(make_table(issues_data, [AVAILABLE_W * 0.05, AVAILABLE_W * 0.12, AVAILABLE_W * 0.45, AVAILABLE_W * 0.38]))

# ━━ SECTION 9: PRIORITY ACTION PLAN ━━
story.append(Spacer(1, 18))
story.append(Paragraph('9. Priority Action Plan', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

story.append(Paragraph('Phase 1: Critical Security Fixes (Immediate - Before Any Public Launch)', h2_style))
story.append(Paragraph(
    'These fixes must be implemented before the website is accessible to any real users. They address authentication bypass, '
    'data exposure, and unauthorized access vulnerabilities that could result in data breaches, financial fraud, and complete '
    'platform compromise.',
    body_style
))
phase1 = [
    'Rotate ALL secrets: database password, JWT secret (generate with openssl rand -base64 64), admin credentials',
    'Remove the passwordless signup backdoor (lines 231-268 from auth/route.ts)',
    'Add session verification to ALL protected API routes using a new getUserFromCookies() helper',
    'Add field whitelisting to PATCH endpoints for both users and listings APIs',
    'Add authentication and authorization to listing PATCH/DELETE endpoints',
    'Remove hardcoded fallback secrets and UPI IDs; crash on missing environment variables instead',
    'Remove currentUser from localStorage persistence or strip isAdmin/adminRole/isBanned fields',
    'Remove NODE_ENV=development from .env file',
]
for item in phase1:
    story.append(Paragraph(f'<bullet>&bull;</bullet> {item}', bullet_style))

story.append(Spacer(1, 12))
story.append(Paragraph('Phase 2: Core Functionality Fixes (Within 1 Week)', h2_style))
story.append(Paragraph(
    'These fixes address the fundamental architectural and functional issues that prevent the site from being usable '
    'as a real product. Without these, users cannot properly navigate, authenticate via Google, or recover their accounts.',
    body_style
))
phase2 = [
    'Convert SPA routing to Next.js file-based routing (the single most impactful fix)',
    'Configure real Google OAuth credentials and fix the sign-in URL',
    'Implement email verification flow for new registrations',
    'Implement password reset flow (currently the Forgot Password button does nothing)',
    'Verify Google Search Console and submit sitemap after routing fix',
    'Fix cache-control headers to allow CDN caching for public pages',
    'Create proper /privacy and /terms pages for legal compliance',
]
for item in phase2:
    story.append(Paragraph(f'<bullet>&bull;</bullet> {item}', bullet_style))

story.append(Spacer(1, 12))
story.append(Paragraph('Phase 3: SEO & Performance Optimization (Within 1 Month)', h2_style))
phase3 = [
    'Add per-page metadata with generateMetadata() for each route',
    'Add BreadcrumbList and Product structured data schemas',
    'Fix sitemap to use actual content modification dates',
    'Implement serverless-compatible rate limiting with Upstash Redis',
    'Optimize /api/stats response time (currently 5.52s)',
    'Tighten CSP by removing unsafe-inline and unsafe-eval',
    'Consider path-based internationalization (/en/, /hi/, /gu/) instead of query parameters',
    'Add pagination limits and case-insensitive search to listings API',
]
for item in phase3:
    story.append(Paragraph(f'<bullet>&bull;</bullet> {item}', bullet_style))

# ━━ SECTION 10: WHAT IS WORKING WELL ━━
story.append(Spacer(1, 18))
story.append(Paragraph('10. What Is Working Well', h1_style))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=12))

working_items = [
    'Homepage renders fully with all sections and no JavaScript errors',
    'Security headers are comprehensive (HSTS, X-Frame-Options, CSP, Permissions-Policy, Referrer-Policy)',
    'HTTP to HTTPS redirect works correctly with 308 status code',
    'Login and registration forms are complete and functional with proper validation',
    'Mobile responsive design works well with proper viewport and bottom navigation',
    'Custom 404 page with proper noindex meta tag',
    'robots.txt properly blocks admin and API paths while allowing search crawlers',
    'PWA manifest correctly configured with proper icons and metadata',
    'Brand logo and color scheme correctly updated to match official design',
    'Instagram integration with @educampushubofficial in hero section and footer',
    'Multi-language support (English, Hindi, Gujarati) with language switcher',
    'Dark mode implementation with proper theme switching',
]
for item in working_items:
    story.append(Paragraph(f'<bullet>&bull;</bullet> {item}', bullet_style))

# ━━ Build ━━
doc.build(story)
print(f'PDF generated: {OUTPUT_PATH}')

import os
size = os.path.getsize(OUTPUT_PATH)
print(f'File size: {size / 1024:.1f} KB')
