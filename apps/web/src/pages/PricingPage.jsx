
import React from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingPage = () => {
  return (
    <>
      <Helmet>
        <title>Pricing - EtsyForge AI</title>
        <meta name="description" content="Upgrade your plan and manage billing" />
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <CreditCard className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Pricing & Billing</h1>
                <p className="text-muted-foreground font-medium">Manage your subscription and billing</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="fintech-card">
                <CardContent className="p-16 text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 relative">
                    <CreditCard className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">Coming Soon</h2>
                  <p className="text-lg text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed">
                    The Pricing page will allow you to upgrade your plan, manage billing, and view your subscription details.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default PricingPage;
