import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { initialProjects } from "../data/projects";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowRight, BarChart3, PieChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

// Calculate project statistics
const calculateProjectsByStatus = () => {
  const statusCount = { active: 0, completed: 0, "on-hold": 0 };
  initialProjects.forEach(project => {
    statusCount[project.status] += 1;
  });
  return [
    { name: 'Active', value: statusCount.active },
    { name: 'Completed', value: statusCount.completed },
    { name: 'On Hold', value: statusCount['on-hold'] },
  ];
};

const calculateProgressByProject = () => {
  return initialProjects.map(project => ({
    name: project.title.length > 12 ? project.title.substring(0, 12) + '...' : project.title,
    progress: project.progress
  }));
};

const calculateTimelineData = () => {
  // Mock timeline data based on project start dates
  return [
    { name: 'Jan', projects: 2 },
    { name: 'Feb', projects: 3 },
    { name: 'Mar', projects: 5 },
    { name: 'Apr', projects: 4 },
    { name: 'May', projects: 6 },
    { name: 'Jun', projects: 8 },
  ];
};

const COLORS = ['#4A90E2', '#28C76F', '#FF6B6B', '#F4A261'];

export default function Insights() {
  const { isAuthenticated } = useAuth(); // Get authentication status
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');

  const projectsByStatus = calculateProjectsByStatus();
  const progressByProject = calculateProgressByProject();
  const timelineData = calculateTimelineData();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch data only if authenticated
      // Example: fetchInsightsData();
    }
  }, [isAuthenticated]);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Insights</h1>
          <p className="text-muted-foreground mt-2">Visual analytics of your project data</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
          >
            <PieChartIcon className="h-4 w-4 mr-2" />
            Distribution
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Progress
          </Button>
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            <LineChartIcon className="h-4 w-4 mr-2" />
            Timeline
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {chartType === 'pie' ? 'Project Status Distribution' :
               chartType === 'bar' ? 'Project Progress' :
               'Project Timeline'}
            </CardTitle>
            <CardDescription>
              {chartType === 'pie' ? 'Current status of all projects' :
               chartType === 'bar' ? 'Completion percentage by project' :
               'Projects created over time'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={projectsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : chartType === 'bar' ? (
                <BarChart
                  data={progressByProject}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progress" fill="#4A90E2" name="Completion %" />
                </BarChart>
              ) : (
                <LineChart
                  data={timelineData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="projects" stroke="#4A90E2" activeDot={{ r: 8 }} name="Projects Created" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Summary of project performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Projects</p>
                  <p className="text-xl font-bold">{initialProjects.length}</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Completion Rate</p>
                  <p className="text-xl font-bold">
                    {Math.round((initialProjects.filter(p => p.status === 'completed').length / initialProjects.length) * 100)}%
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success"
                    style={{
                      width: `${Math.round((initialProjects.filter(p => p.status === 'completed').length / initialProjects.length) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Average Progress</p>
                  <p className="text-xl font-bold">
                    {Math.round(initialProjects.reduce((acc, p) => acc + p.progress, 0) / initialProjects.length)}%
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning"
                    style={{
                      width: `${Math.round(initialProjects.reduce((acc, p) => acc + p.progress, 0) / initialProjects.length)}%`
                    }}
                  ></div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                View Detailed Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
