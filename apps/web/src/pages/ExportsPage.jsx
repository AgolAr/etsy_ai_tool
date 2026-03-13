
import React from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const ExportsPage = () => {
  return (
    <>
      <Helmet>
        <title>Exports - EtsyForge AI</title>
        <meta name="description" content="Download and manage your exported files" />
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
                <Download className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Exports</h1>
                <p className="text-muted-foreground font-medium">Download your completed products</p>
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
                    <Download className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">Coming Soon</h2>
                  <p className="text-lg text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed">
                    The Exports page will provide access to all your downloaded files and export history with easy re-download options.
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

export default ExportsPage;
