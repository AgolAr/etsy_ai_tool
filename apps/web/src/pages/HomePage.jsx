
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  Wand2,
  TrendingUp,
  Check,
  Zap,
  Palette,
  Layers,
  Box,
  Download,
  ArrowRight,
  ShieldCheck,
  Star,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Wand2, title: 'AI Product Generator', description: 'Create complete planners and workbooks instantly.' },
    { icon: TrendingUp, title: 'Etsy Listing Optimizer', description: 'SEO-optimized titles, tags, and descriptions.' },
    { icon: Layers, title: 'Template Library', description: 'Access hundreds of premium, customizable templates.' },
    { icon: Box, title: 'Bundle Generator', description: 'Combine products into high-value Etsy bundles.' },
    { icon: Palette, title: 'Brand Kit', description: 'Maintain consistent colors and fonts across products.' },
    { icon: Zap, title: 'Asset Library', description: 'Organize all your digital assets in one secure place.' },
    { icon: Sparkles, title: 'Design Studio', description: 'Fine-tune layouts with our intuitive drag-and-drop editor.' },
    { icon: Download, title: 'Export Tools', description: 'Download print-ready PDFs and editable source files.' }
  ];

  const workflowSteps = [
    { title: 'Idea', desc: 'Describe your niche', icon: LightbulbIcon },
    { title: 'Product', desc: 'AI generates content', icon: Wand2 },
    { title: 'Listing', desc: 'Optimize for SEO', icon: TrendingUp },
    { title: 'Export', desc: 'Ready to sell', icon: Download }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      description: 'Perfect for exploring the platform.',
      features: ['5 AI generations/mo', 'Basic templates', 'Standard export', 'Community support'],
      cta: 'Start Free',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/mo',
      description: 'For serious Etsy sellers scaling up.',
      features: ['100 AI generations/mo', 'Premium templates', 'Advanced SEO tools', 'Priority support'],
      cta: 'Start Pro Trial',
      highlighted: true
    },
    {
      name: 'Studio',
      price: '$79',
      period: '/mo',
      description: 'For power users and agencies.',
      features: ['Unlimited generations', 'Commercial license', 'API access', 'Dedicated manager'],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>EtsyForge AI - Create Etsy Digital Products in Minutes</title>
        <meta name="description" content="Generate professional planners, workbooks, and digital guides for Etsy using AI." />
      </Helmet>

      <div className="min-h-screen bg-background overflow-hidden">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight">
                  Create Etsy Digital Products <span className="text-primary relative whitespace-nowrap">
                    With AI
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                    </svg>
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                  Generate professional planners, workbooks, and guides instantly. No design skills needed—just describe your idea and let our AI engine do the heavy lifting.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button
                    size="lg"
                    onClick={() => navigate('/signup')}
                    className="fintech-button-primary text-lg px-8 py-7 h-auto w-full sm:w-auto"
                  >
                    Start Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-7 h-auto w-full sm:w-auto rounded-xl border-2 border-border hover:bg-white hover:border-primary/30 transition-all duration-300 font-semibold shadow-sm"
                  >
                    Explore Features
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-secondary fill-secondary" />
                    Trusted by 10k+ sellers
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Visuals */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative lg:h-[600px] flex items-center justify-center"
              >
                {/* Main Image Container */}
                <div className="relative w-full max-w-lg aspect-square rounded-[40px] overflow-hidden shadow-2xl border-8 border-white z-10">
                  <img 
                    src="https://horizons-cdn.hostinger.com/2bafa71c-7ec8-449c-9d85-187e8155ba79/0eef500966864d5afc9d5c19986abd69.png" 
                    alt="Productivity Planner" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
                Everything you need to scale your Etsy shop
              </h2>
              <p className="text-xl text-muted-foreground">
                A complete suite of AI-powered tools designed specifically for digital product creators.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="fintech-card h-full group relative overflow-hidden border-border/60">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <CardHeader>
                        <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300 shadow-sm">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
                From idea to listing in minutes
              </h2>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-white border-4 border-background shadow-xl flex items-center justify-center mb-6 relative group">
                        <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
                        <Icon className="w-8 h-8 text-primary relative z-10" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-muted-foreground">
                Start for free, upgrade when you need more power.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`relative ${plan.highlighted ? 'z-10' : 'z-0'}`}
                >
                  <Card className={`fintech-card h-full flex flex-col ${
                    plan.highlighted 
                      ? 'border-2 border-primary bg-[#E8E0FF]/30 shadow-2xl scale-105 md:-my-4' 
                      : 'border-border/60'
                  }`}>
                    {plan.highlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                        Most Popular
                      </div>
                    )}
                    <CardHeader className="text-center pb-8 pt-10">
                      <CardTitle className="text-2xl font-bold text-foreground mb-2">{plan.name}</CardTitle>
                      <div className="flex items-baseline justify-center gap-1 mb-4">
                        <span className="text-5xl font-extrabold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground font-medium">{plan.period}</span>
                      </div>
                      <CardDescription className="text-base">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <ul className="space-y-4 mb-8 flex-1">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlighted ? 'bg-primary/20' : 'bg-muted'}`}>
                              <Check className={`w-4 h-4 ${plan.highlighted ? 'text-primary' : 'text-foreground'}`} />
                            </div>
                            <span className="text-foreground/80 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full h-14 text-lg rounded-xl font-bold ${
                          plan.highlighted
                            ? 'fintech-button-primary'
                            : 'bg-white border-2 border-border text-foreground hover:bg-background hover:border-primary/30 transition-all'
                        }`}
                        onClick={() => navigate('/signup')}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0E0E0E] text-white pt-20 pb-10 relative overflow-hidden">
          {/* Pixel decorations */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiM4QTZDRkYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-50"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
              
              <div className="lg:col-span-2">
                <Link to="/" className="flex items-center mb-6">
                  <img 
                    src="https://horizons-cdn.hostinger.com/2bafa71c-7ec8-449c-9d85-187e8155ba79/d17d85d9e8a2b816f5a3a7ec9570866a.png" 
                    alt="Logo" 
                    className="h-10 w-auto brightness-0 invert"
                  />
                </Link>
                <p className="text-white/60 mb-8 max-w-sm leading-relaxed">
                  The ultimate AI-powered platform for creating, optimizing, and scaling your digital product business on Etsy.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">Product</h4>
                <ul className="space-y-4">
                  <li><a href="#features" className="text-white/60 hover:text-primary transition-colors font-medium">Features</a></li>
                  <li><a href="#pricing" className="text-white/60 hover:text-primary transition-colors font-medium">Pricing</a></li>
                  <li><a href="#" className="text-white/60 hover:text-primary transition-colors font-medium">Templates</a></li>
                  <li><a href="#" className="text-white/60 hover:text-primary transition-colors font-medium">API Docs</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">Resources</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-white/60 hover:text-primary transition-colors font-medium">Blog</a></li>
                  <li><a href="#" className="text-white/60 hover:text-primary transition-colors font-medium">Community</a></li>
                  <li><a href="#" className="text-white/60 hover:text-primary transition-colors font-medium">Help Center</a></li>
                  <li><a href="#" className="text-white/60 hover:text-primary transition-colors font-medium">Etsy Guide</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">Stay Updated</h4>
                <p className="text-white/60 mb-4 text-sm">Get the latest tips and product updates.</p>
                <div className="flex flex-col gap-3">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl focus-visible:ring-primary"
                  />
                  <Button className="fintech-button-primary h-12 w-full">
                    Subscribe
                  </Button>
                </div>
              </div>

            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/40 text-sm font-medium">
                © 2026 EtsyForge AI. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm font-medium text-white/40">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

// Helper component for Lightbulb icon since it wasn't imported from lucide-react in the original list
const LightbulbIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

export default HomePage;
