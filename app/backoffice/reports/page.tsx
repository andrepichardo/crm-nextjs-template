"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Building2, Target } from "lucide-react"

const salesData = [
  { month: "Jan", revenue: 45000, deals: 12 },
  { month: "Feb", revenue: 52000, deals: 15 },
  { month: "Mar", revenue: 48000, deals: 13 },
  { month: "Apr", revenue: 61000, deals: 18 },
  { month: "May", revenue: 55000, deals: 16 },
  { month: "Jun", revenue: 67000, deals: 20 },
]

const dealsByStage = [
  { name: "Lead", value: 35, color: "#3b82f6" },
  { name: "Qualified", value: 28, color: "#06b6d4" },
  { name: "Proposal", value: 18, color: "#8b5cf6" },
  { name: "Negotiation", value: 12, color: "#f59e0b" },
  { name: "Closed Won", value: 7, color: "#10b981" },
]

const topPerformers = [
  { name: "Sarah Johnson", deals: 24, revenue: 145000 },
  { name: "Michael Chen", deals: 21, revenue: 132000 },
  { name: "Emily Davis", deals: 19, revenue: 118000 },
  { name: "James Wilson", deals: 17, revenue: 105000 },
  { name: "Lisa Anderson", deals: 15, revenue: 98000 },
]

const industryData = [
  { industry: "Technology", count: 45 },
  { industry: "Healthcare", count: 32 },
  { industry: "Finance", count: 28 },
  { industry: "Retail", count: 24 },
  { industry: "Manufacturing", count: 18 },
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into your sales performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$328,000</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+8.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+15.3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-red-500">-2.1%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="industry">Industry Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Deals Over Time</CardTitle>
              <CardDescription>Monthly revenue and deal closure trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="deals"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    name="Deals Closed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Deals by Stage</CardTitle>
                <CardDescription>Distribution of deals across pipeline stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dealsByStage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dealsByStage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pipeline Health</CardTitle>
                <CardDescription>Key pipeline metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Deal Size</span>
                  <span className="text-2xl font-bold">$3,489</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Win Rate</span>
                  <span className="text-2xl font-bold">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg. Sales Cycle</span>
                  <span className="text-2xl font-bold">45 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pipeline Value</span>
                  <span className="text-2xl font-bold">$847K</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Sales team leaderboard for this quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{performer.name}</p>
                        <p className="text-sm text-muted-foreground">{performer.deals} deals closed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${performer.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Companies by Industry</CardTitle>
              <CardDescription>Distribution of companies across industries</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={industryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="industry" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Number of Companies" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
