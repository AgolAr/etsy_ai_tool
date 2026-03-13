
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  FileText,
  BookOpen,
  FileEdit,
  TrendingUp,
  Download,
  Calendar,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const quickActions = [
    {
      icon: Sparkles,
      title: 'Generate Idea',
      description: 'AI product suggestions',
      color: 'bg-primary/10 text-primary',
      action: () => navigate('/dashboard/idea-lab')
    },
    {
      icon: FileText,
      title: 'Create Planner',
      description: 'Design custom planner',
      color: 'bg-secondary/20 text-secondary-foreground',
      action: () => navigate('/dashboard/product-generator')
    },
    {
      icon: BookOpen,
      title: 'Create Workbook',
      description: 'Interactive workbook',
      color: 'bg-accent text-accent-foreground',
      action: () => navigate('/dashboard/product-generator')
    },
    {
      icon: TrendingUp,
      title: 'Optimize Listing',
      description: 'Improve SEO visibility',
      color: 'bg-primary/10 text-primary',
      action: () => navigate('/dashboard/listing-optimizer')
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'ADHD Productivity Planner',
      date: '2026-03-08',
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Wedding Planning Workbook',
      date: '2026-03-07',
      status: 'in-progress',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Budget Binder Printable',
      date: '2026-03-06',
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Kids Summer Activity Pack',
      date: '2026-03-05',
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop'
    }
  ];

  const exportHistory = [
    { id: 1, name: 'ADHD Planner - Final.pdf', date: '2026-03-08', type: 'PDF' },
    { id: 2, name: 'Wedding Workbook - Draft.pdf', date: '2026-03-07', type: 'PDF' },
    { id: 3, name: 'Budget Binder - Print Ready.pdf', date: '2026-03-06', type: 'PDF' }
  ];

  const handleProjectClick = (project) => {
    toast({
      title: '🚧 Feature Coming Soon',
      description: `Opening "${project.title}" will be available in the next update!`
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - EtsyForge AI</title>
        <meta name="description" content="Your EtsyForge AI dashboard - manage projects, generate products, and track your digital product creation" />
      </Helmet>

      <DashboardLayout>
        <div className="p-6 lg:p-10 space-y-10">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-2 tracking-tight">
                Welcome back, {currentUser?.name || 'Creator'}! 👋
              </h1>
              <p className="text-muted-foreground text-lg font-medium">
                Ready to create amazing digital products today?
              </p>
            </div>
            
            {/* Credits Display Mini */}
            <div className="flex items-center gap-4 bg-white dark:bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Credits</p>
                <p className="text-xl font-bold text-foreground">45 <span className="text-sm text-muted-foreground font-medium">/ 100</span></p>
              </div>
              <Button onClick={() => navigate('/dashboard/pricing')} variant="outline" size="sm" className="ml-2 rounded-lg font-semibold">
                Upgrade
              </Button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                  >
                    <Card
                      className="fintech-card cursor-pointer group"
                      onClick={action.action}
                    >
                      <CardContent className="p-6">
                        <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{action.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Recent Projects</h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard/asset-library')}
                className="text-primary hover:text-primary/80 font-semibold"
              >
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                >
                  <Card
                    className="fintech-card cursor-pointer overflow-hidden group p-0"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-foreground mb-3 line-clamp-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(project.date).toLocaleDateString()}
                        </div>
                        <Badge
                          variant={project.status === 'completed' ? 'default' : 'secondary'}
                          className={`text-xs font-semibold ${project.status === 'completed' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}`}
                        >
                          {project.status === 'completed' ? 'Done' : 'In Progress'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Export History & Upgrade */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Export History</h2>
              </div>
              <Card className="fintech-card">
                <CardContent className="p-0">
                  <div className="divide-y divide-border/60">
                    {exportHistory.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                        className="p-5 hover:bg-muted/30 transition-colors cursor-pointer flex items-center justify-between group"
                        onClick={() => toast({
                          title: '🚧 Feature Coming Soon',
                          description: 'Download functionality will be available soon!'
                        })}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors shadow-sm">
                            <Download className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{item.name}</p>
                            <p className="text-sm font-medium text-muted-foreground">
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-semibold border-border">{item.type}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="h-full"
              >
                <Card className="fintech-card h-full bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 relative overflow-hidden">
                  <CardContent className="p-8 flex flex-col h-full justify-center relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-foreground mb-3 tracking-tight">
                      Unlock Pro Power
                    </h3>
                    <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                      Get 100 generations per month, premium templates, and priority support to scale your shop.
                    </p>
                    <Button
                      onClick={() => navigate('/dashboard/pricing')}
                      className="fintech-button-primary w-full h-12 text-base mt-auto"
                    >
                      Upgrade to Pro
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardHome;
