
import React, { useState, useEffect, useRef } from "react";
import { FileText, Users, UserPlus, FolderPlus, CheckSquare, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- Reusable Components ---
function Section({ title, children, id, icon: Icon }) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        {Icon && <Icon className="w-8 h-8 text-blue-600" />}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ language, children }) {
  return (
    <div className="my-6">
      <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center justify-between">
        <span className="text-gray-300 text-sm font-medium">{language}</span>
        <Badge variant="secondary" className="text-xs">Code</Badge>
      </div>
      <pre className="bg-gray-900 rounded-b-lg p-4 overflow-x-auto border-t border-gray-700">
        <code className={`language-${language} text-green-400 text-sm`}>
          {children.trim()}
        </code>
      </pre>
    </div>
  );
}

function StepCard({ number, title, children, image }) {
  return (
    <Card className="mb-8 border-l-4 border-l-blue-600 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {number}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {title}
            </h4>
            <div className="text-gray-600 dark:text-gray-300 space-y-4">
              {children}
            </div>
            {image && (
              <div className="mt-6">
                <img
                  src={image}
                  alt={`${title} example`}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-md max-w-full hover:scale-105 transition-transform cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactCard({ icon: Icon, title, value, link, color }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
        <a
          href={link}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium break-all"
        >
          {value}
        </a>
      </CardContent>
    </Card>
  );
}

// --- Main Documentation Page ---
function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const sectionsRef = useRef([]);

  const sections = [
    { id: "introduction", title: "Introduction", icon: FileText },
    { id: "setup", title: "Setup Guide", icon: null },
    { id: "teams", title: "Teams", icon: Users },
    { id: "users", title: "Users", icon: UserPlus },
    { id: "project-creation", title: "Project Creation", icon: FolderPlus },
    { id: "task-creation", title: "Task Creation", icon: CheckSquare },
    { id: "faq", title: "FAQ", icon: HelpCircle },
    { id: "contact", title: "Contact", icon: null },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    const currentRefs = sectionsRef.current;
    currentRefs.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      currentRefs.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full mb-6">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400 font-medium">Documentation</span>
          </div>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            TaskWave Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your comprehensive guide to setting up and mastering the TaskWave platform for seamless project management.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="w-full lg:w-3/4">
            <div ref={(el) => (sectionsRef.current[0] = el)}>
              <Section title="Introduction" id="introduction" icon={FileText}>
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-8">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      TaskWave is a cutting-edge, full-stack project management application engineered to revolutionize your workflow.
                      It empowers users to seamlessly manage projects, assign tasks with precision, and receive real-time WhatsApp notifications,
                      fostering a collaborative and highly efficient work environment.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FolderPlus className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Project Management</h4>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                          <CheckSquare className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Task Assignment</h4>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                          <MessageCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">WhatsApp Integration</h4>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Section>
            </div>

            <div ref={(el) => (sectionsRef.current[1] = el)}>
              <Section title="How to Setup TaskWave" id="setup" icon={null}>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Follow these comprehensive steps to get your TaskWave application up and running seamlessly.
                </p>

                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      Prerequisites
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Internet Connection</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Stable internet for API communications</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Meta Business Account</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Approved business account required</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">WhatsApp API Access</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Meta for Developers API credentials</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <StepCard
                  number="1"
                  title="WhatsApp API Setup"
                  image="../public/TaskWave Docs/whatsapp-Management.png"
                >
                  <p>
                    Configure your WhatsApp Business API credentials to enable seamless task notifications.
                    You'll need to obtain a Phone Number ID and permanent Access Token from Meta for Developers.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm">
                      <strong>Quick Guide:</strong> Follow our recommended tutorial for WhatsApp API setup:
                      <br />
                      <a
                        href="https://respond.io/blog/how-to-get-whatsapp-api"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How to get WhatsApp API →
                      </a>
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    After obtaining your credentials, navigate to Settings → WhatsApp Management and update your information.
                  </p>
                </StepCard>
              </Section>
            </div>

            <div ref={(el) => (sectionsRef.current[2] = el)}>
              <Section title="Teams Management" id="teams" icon={Users}>
                <StepCard
                  number="2"
                  title="Create Teams"
                  image="../public/TaskWave Docs/Team.png"
                >
                  <p>
                    Organize your workforce by creating dedicated teams for different departments or project types.
                    Teams help streamline task assignment and improve collaboration efficiency.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary">Development</Badge>
                    <Badge variant="secondary">Design</Badge>
                    <Badge variant="secondary">Marketing</Badge>
                    <Badge variant="secondary">Management</Badge>
                  </div>
                </StepCard>
              </Section>
            </div>

            <div ref={(el) => (sectionsRef.current[3] = el)}>
              <Section title="User Management" id="users" icon={UserPlus}>
                <StepCard
                  number="3"
                  title="Add Team Members"
                  image="../public/TaskWave Docs/user.png"
                >
                  <p>
                    Add your team members with their complete details. Ensure all phone numbers are registered
                    on WhatsApp to receive task notifications seamlessly.
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 mt-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Important:</strong> Verify that all phone numbers are active WhatsApp accounts
                      before adding users to ensure successful notification delivery.
                    </p>
                  </div>
                </StepCard>
              </Section>
            </div>

            <div ref={(el) => (sectionsRef.current[4] = el)}>
              <Section title="Project Creation" id="project-creation" icon={FolderPlus}>
                <StepCard
                  number="4"
                  title="Create Your First Project"
                  image="../public/TaskWave Docs/new-project.png"
                >
                  <p>
                    Set up your projects with clear objectives, deadlines, and team assignments.
                    Each project serves as a container for related tasks and activities.
                  </p>
                </StepCard>

                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Project Overview</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Once created, your projects will appear in the main dashboard with status indicators and progress tracking.
                    </p>
                    <img
                      src="../public/TaskWave Docs/project-index.png"
                      alt="Project overview"
                      className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-md max-w-full"
                    />
                  </CardContent>
                </Card>
              </Section>
            </div>

            <div ref={(el) => (sectionsRef.current[5] = el)}>
              <Section title="Task Management" id="task-creation" icon={CheckSquare}>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500 mb-6">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    <strong>Before creating tasks:</strong> Ensure your WhatsApp API is properly configured
                    in Settings → WhatsApp Management for automatic notifications.
                  </p>
                </div>

                <StepCard
                  number="5"
                  title="Create and Assign Tasks"
                  image="../public/TaskWave Docs/task.png"
                >
                  <p>
                    Create detailed tasks with clear descriptions, deadlines, and priority levels.
                    Assign tasks to specific team members who will receive instant WhatsApp notifications.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">Low Priority</span>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                      <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Medium Priority</span>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2"></div>
                      <span className="text-xs font-medium text-orange-700 dark:text-orange-300">High Priority</span>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2"></div>
                      <span className="text-xs font-medium text-red-700 dark:text-red-300">Urgent</span>
                    </div>
                  </div>
                </StepCard>

                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Task Management Dashboard</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Monitor all tasks within your projects through an intuitive interface with real-time status updates.
                    </p>
                    <img
                      src="../public/TaskWave Docs/task-list.png"
                      alt="Task management dashboard"
                      className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-md max-w-full"
                    />
                  </CardContent>
                </Card>
              </Section>
            </div>

            <div ref={(el) => (sectionsRef.current[6] = el)}>
              <Section title="Frequently Asked Questions" id="faq" icon={HelpCircle}>
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Why is my WhatsApp API not sending messages?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Ensure your access token is valid and your phone number is correctly linked to your Meta developer app.
                        Also, confirm the recipient's phone number is registered on WhatsApp and properly formatted.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Do users need to approve the app to receive messages?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        No approval needed! As long as your app is approved in Meta Business and you have a valid sender number,
                        messages will be delivered directly to users' WhatsApp accounts.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Can I reassign teams after creating a project?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Absolutely! You can reassign teams within the project settings or during individual task assignment.
                        The system is designed for maximum flexibility in team management.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </Section>
            </div>

            <div ref={(el) => (sectionsRef.current[7] = el)}>
              <Section title="Get Help & Support" id="contact" icon={null}>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  Need assistance? Our support team is here to help you succeed with TaskWave.
                  Choose your preferred contact method below.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ContactCard
                    icon={Mail}
                    title="Email Support"
                    value="taskwaveinfo@gmail.com"
                    link="mailto:taskwaveinfo@gmail.com"
                    color="bg-blue-500"
                  />
                  <ContactCard
                    icon={Phone}
                    title="Phone Support"
                    value="+254 798 718 682"
                    link="tel:+254798718682"
                    color="bg-green-500"
                  />
                  <ContactCard
                    icon={MessageCircle}
                    title="WhatsApp Chat"
                    value="Quick Response"
                    link="https://wa.me/254798718682"
                    color="bg-green-600"
                  />
                </div>
              </Section>
            </div>
          </main>

          {/* Enhanced Sidebar Navigation */}
          <aside className="w-full lg:w-1/4 lg:sticky top-24 self-start">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Table of Contents
                </h3>
                <ul className="space-y-3">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          activeSection === section.id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {section.icon && <section.icon className="w-4 h-4 flex-shrink-0" />}
                        <span className="font-medium">{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default DocumentationPage;
