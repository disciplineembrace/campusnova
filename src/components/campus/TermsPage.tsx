'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, FileText } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  const { setCurrentPage } = useAppStore()

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentPage('home')} className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Terms & Conditions</h1>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-xs">Last updated: January 2025</p>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h3>
              <p>By accessing and using CampusBazaar, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">2. Eligibility</h3>
              <p>You must be at least 16 years old and a current or former student of a recognized educational institution in India to use CampusBazaar. By using this platform, you represent that you meet these eligibility requirements.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">3. User Accounts</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating your account. You must notify us immediately of any unauthorized use of your account.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">4. Listings & Transactions</h3>
              <p>CampusBazaar is a platform that connects buyers and sellers. We do not participate in the actual transaction between buyers and sellers. All transactions are conducted directly between users via WhatsApp or other communication channels. CampusBazaar is not responsible for the quality, safety, or legality of the items listed, the accuracy of listings, or the ability of sellers to sell items or buyers to pay for items.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">5. Prohibited Items</h3>
              <p>You may not list items that are illegal, stolen, counterfeit, or otherwise prohibited by law. This includes but is not limited to: illegal drugs, weapons, counterfeit goods, pirated content, and items that violate intellectual property rights.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">6. User Conduct</h3>
              <p>You agree not to: harass or intimidate other users, post false or misleading information, impersonate any person or entity, interfere with the proper functioning of the platform, or use the platform for any unlawful purpose.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">7. Liability</h3>
              <p>CampusBazaar provides the platform &ldquo;as is&rdquo; without any warranties. We are not liable for any damages arising from your use of the platform or from any transactions conducted through the platform. Users engage in transactions at their own risk.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">8. Modifications</h3>
              <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">9. Contact</h3>
              <p>For questions about these Terms, please contact us at support@campusbazaar.in</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
