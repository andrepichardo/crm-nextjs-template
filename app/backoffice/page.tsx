import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/backoffice/stat-card';
import { RecentActivities } from '@/components/backoffice/recent-activities';
import { Users, Building2, Briefcase, CheckSquare } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function BackofficeDashboard() {
  const supabase = await createClient();

  // Fetch statistics
  const [
    { count: contactsCount },
    { count: companiesCount },
    { count: dealsCount },
    { count: tasksCount },
    { data: recentActivities },
    { data: deals },
  ] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('deals').select('*', { count: 'exact', head: true }),
    supabase.from('tasks').select('*', { count: 'exact', head: true }),
    supabase
      .from('activities')
      .select(
        `
        *,
        created_by:profiles!activities_created_by_fkey(full_name, email)
      `
      )
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('deals').select('value, stage').limit(100),
  ]);

  // Calculate deal statistics
  const totalDealValue =
    deals?.reduce((sum, deal) => sum + Number(deal.value), 0) || 0;
  const wonDeals = deals?.filter((d) => d.stage === 'closed_won') || [];
  const wonDealValue = wonDeals.reduce(
    (sum, deal) => sum + Number(deal.value),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your CRM.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value={contactsCount || 0}
          icon={Users}
          description="Active contacts"
        />
        <StatCard
          title="Companies"
          value={companiesCount || 0}
          icon={Building2}
          description="Registered companies"
        />
        <StatCard
          title="Active Deals"
          value={dealsCount || 0}
          icon={Briefcase}
          description={`$${totalDealValue.toLocaleString()} total value`}
        />
        <StatCard
          title="Open Tasks"
          value={tasksCount || 0}
          icon={CheckSquare}
          description="Pending tasks"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Deal Pipeline Overview</CardTitle>
            <CardDescription>Current deals by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: 'lead', label: 'Lead', color: 'bg-gray-500' },
                {
                  stage: 'qualified',
                  label: 'Qualified',
                  color: 'bg-blue-500',
                },
                {
                  stage: 'proposal',
                  label: 'Proposal',
                  color: 'bg-yellow-500',
                },
                {
                  stage: 'negotiation',
                  label: 'Negotiation',
                  color: 'bg-orange-500',
                },
                {
                  stage: 'closed_won',
                  label: 'Closed Won',
                  color: 'bg-green-500',
                },
                {
                  stage: 'closed_lost',
                  label: 'Closed Lost',
                  color: 'bg-red-500',
                },
              ].map(({ stage, label, color }) => {
                const stageDeals =
                  deals?.filter((d) => d.stage === stage) || [];
                const stageValue = stageDeals.reduce(
                  (sum, deal) => sum + Number(deal.value),
                  0
                );
                const percentage =
                  totalDealValue > 0 ? (stageValue / totalDealValue) * 100 : 0;

                return (
                  <div key={stage} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground">
                        {stageDeals.length} deals • $
                        {stageValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full ${color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 h-full">
          <RecentActivities activities={recentActivities || []} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Win Rate</span>
              <span className="text-sm text-muted-foreground">
                {deals && deals.length > 0
                  ? ((wonDeals.length / deals.length) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Won Value</span>
              <span className="text-sm text-muted-foreground">
                ${wonDealValue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Deal Size</span>
              <span className="text-sm text-muted-foreground">
                $
                {deals && deals.length > 0
                  ? (totalDealValue / deals.length).toFixed(0)
                  : 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Database and system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Status</span>
              <span className="text-sm text-green-600">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication</span>
              <span className="text-sm text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Status</span>
              <span className="text-sm text-green-600">Operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
