'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Shield } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
  const { setCurrentPage } = useAppStore()

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentPage('home')} className="gap-2 -ml-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-heading">Privacy <span className="gradient-text">Policy</span></h1>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-xs">Last updated: January 2025</p>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h3>
              <p>We collect information you provide directly to us, including your name, email address, phone number, college name, city, and WhatsApp number. We also collect information about your listings and transactions on EduCampusHub.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h3>
              <p>We use your information to: provide and improve our services, facilitate transactions between buyers and sellers, send you important updates about your listings, respond to your inquiries, and ensure the safety and security of our platform.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">3. Information Sharing</h3>
              <p>We do not sell your personal information. We share your WhatsApp number with potential buyers only when you list an item on our platform. We may share information with law enforcement when required by law or to protect the rights and safety of our users.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">4. Data Security</h3>
              <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security of your data.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">5. Cookies</h3>
              <p>We use cookies and similar technologies to improve your experience on EduCampusHub. These help us remember your preferences, keep you logged in, and understand how you use our platform.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">6. Your Rights</h3>
              <p>You have the right to access, update, or delete your personal information at any time. You can manage your profile settings or contact us to exercise these rights. You may also opt out of promotional communications at any time.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">7. Children&apos;s Privacy</h3>
              <p>EduCampusHub is not intended for children under 16. We do not knowingly collect personal information from children under 16. If we learn that we have collected information from a child under 16, we will take steps to delete it.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">8. Changes to This Policy</h3>
              <p>We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the &ldquo;last updated&rdquo; date.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">9. Contact</h3>
              <p>If you have questions about this Privacy Policy, please contact us at privacy@educampushub.in</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
