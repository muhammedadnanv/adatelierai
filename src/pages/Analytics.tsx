import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Users, Monitor, Smartphone, Tablet, ArrowLeft, Sparkles, RefreshCw, TrendingUp, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface PageView {
  id: string;
  page_path: string;
  device_type: string;
  session_id: string;
  screen_width: number;
  screen_height: number;
  created_at: string;
}

interface Stats {
  totalViews: number;
  uniqueSessions: number;
  topPages: { path: string; views: number }[];
  deviceBreakdown: { name: string; value: number; color: string }[];
  viewsByDay: { date: string; views: number }[];
  viewsByHour: { hour: string; views: number }[];
}

const DEVICE_COLORS: Record<string, string> = {
  desktop: 'hsl(var(--primary))',
  mobile: 'hsl(142, 71%, 45%)',
  tablet: 'hsl(38, 92%, 50%)',
};

const DEVICE_ICONS: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const Analytics = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let query = supabase.from('page_views').select('*').order('created_at', { ascending: false });

      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : 30;
        const since = new Date(Date.now() - days * 86400000).toISOString();
        query = query.gte('created_at', since);
      }

      const { data, error } = await query.limit(1000);
      if (error) throw error;

      const views = (data || []) as PageView[];
      processStats(views);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const processStats = (views: PageView[]) => {
    const totalViews = views.length;
    const uniqueSessions = new Set(views.map(v => v.session_id)).size;

    // Top pages
    const pageCounts: Record<string, number> = {};
    views.forEach(v => { pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1; });
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, views: count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    // Device breakdown
    const deviceCounts: Record<string, number> = {};
    views.forEach(v => { deviceCounts[v.device_type || 'desktop'] = (deviceCounts[v.device_type || 'desktop'] || 0) + 1; });
    const deviceBreakdown = Object.entries(deviceCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: DEVICE_COLORS[name] || 'hsl(var(--muted-foreground))',
    }));

    // Views by day
    const dayCounts: Record<string, number> = {};
    views.forEach(v => {
      const day = new Date(v.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const viewsByDay = Object.entries(dayCounts)
      .map(([date, views]) => ({ date, views }))
      .reverse();

    // Views by hour
    const hourCounts: Record<string, number> = {};
    views.forEach(v => {
      const hour = new Date(v.created_at).getHours();
      const label = `${hour.toString().padStart(2, '0')}:00`;
      hourCounts[label] = (hourCounts[label] || 0) + 1;
    });
    const viewsByHour = Array.from({ length: 24 }, (_, i) => {
      const label = `${i.toString().padStart(2, '0')}:00`;
      return { hour: label, views: hourCounts[label] || 0 };
    });

    setStats({ totalViews, uniqueSessions, topPages, deviceBreakdown, viewsByDay, viewsByHour });
  };

  useEffect(() => { fetchAnalytics(); }, [timeRange]);

  const pageNameMap: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/subscription': 'Subscription',
    '/creators': 'Creator Portal',
    '/analytics': 'Analytics',
    '/privacy': 'Privacy',
    '/terms': 'Terms',
    '/security': 'Security',
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="Analytics Dashboard — Ad Atelier AI"
        description="Monitor user engagement, page views, and device breakdown across Ad Atelier AI."
        canonical="https://adatelierai.lovable.app/analytics"
      />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-border/30 glass-overlay sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-primary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-heading font-extrabold text-gradient-brand">
                Ad Atelier AI
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="dropdown" />
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-[2]">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-primary">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading font-extrabold">
                Analytics <span className="text-gradient-brand">Dashboard</span>
              </h1>
              <p className="text-muted-foreground text-sm">Real-time engagement metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(['7d', '30d', 'all'] as const).map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'bg-gradient-hero shadow-primary' : ''}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
              </Button>
            ))}
            <Button variant="ghost" size="icon" onClick={fetchAnalytics} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </motion.div>

        {loading && !stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="glass-card animate-pulse h-32" />
            ))}
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Page Views', value: stats.totalViews, icon: Eye, gradient: 'from-primary to-purple-500' },
                { label: 'Unique Sessions', value: stats.uniqueSessions, icon: Users, gradient: 'from-emerald-500 to-teal-500' },
                { label: 'Top Pages Tracked', value: stats.topPages.length, icon: Globe, gradient: 'from-blue-500 to-cyan-400' },
                { label: 'Avg Views/Session', value: stats.uniqueSessions ? (stats.totalViews / stats.uniqueSessions).toFixed(1) : '0', icon: TrendingUp, gradient: 'from-amber-500 to-orange-500' },
              ].map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="glass-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center`}>
                          <kpi.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Page Views Over Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Page Views Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {stats.viewsByDay.length > 0 ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={stats.viewsByDay}>
                          <defs>
                            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                          <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="url(#viewsGradient)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted-foreground text-center py-12">No data yet</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Device Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass-card h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-primary" />
                      Device Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col items-center">
                    {stats.deviceBreakdown.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie
                              data={stats.deviceBreakdown}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {stats.deviceBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex gap-4 mt-2">
                          {stats.deviceBreakdown.map(d => {
                            const Icon = DEVICE_ICONS[d.name.toLowerCase()] || Monitor;
                            return (
                              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Icon className="w-3.5 h-3.5" style={{ color: d.color }} />
                                <span>{d.name}</span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{d.value}</Badge>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground text-center py-12">No data yet</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Top Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {stats.topPages.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topPages.map((page, i) => {
                          const maxViews = stats.topPages[0].views;
                          const pct = (page.views / maxViews) * 100;
                          return (
                            <div key={page.path} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-foreground truncate">
                                  {pageNameMap[page.path] || page.path}
                                </span>
                                <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                                  {page.views} {page.views === 1 ? 'view' : 'views'}
                                </Badge>
                              </div>
                              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-12">No data yet</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Hourly Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Hourly Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={stats.viewsByHour}>
                        <XAxis
                          dataKey="hour"
                          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                          interval={3}
                        />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                        />
                        <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
