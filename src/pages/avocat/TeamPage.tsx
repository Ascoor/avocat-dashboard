import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users, UserPlus, Mail, Phone, Briefcase, Shield,
  Search, MoreVertical, Edit, Trash2, Eye, Settings
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { mockTeamMembers, type TeamMember } from "@/data/avocat-mock-data";

type Role = "admin" | "partner" | "associate" | "paralegal" | "client-viewer";

const TeamPage: React.FC = () => {
  const { isRTL } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("members");

  const labels = {
    title: isRTL ? "إدارة الفريق" : "Team Management",
    subtitle: isRTL ? "إدارة أعضاء الفريق والأدوار والصلاحيات" : "Manage team members, roles, and permissions",
    addMember: isRTL ? "إضافة عضو" : "Add Member",
    search: isRTL ? "بحث في الفريق..." : "Search team...",
    allRoles: isRTL ? "جميع الأدوار" : "All Roles",
    tabs: {
      members: isRTL ? "الأعضاء" : "Members",
      roles: isRTL ? "الأدوار" : "Roles",
      permissions: isRTL ? "الصلاحيات" : "Permissions"
    },
    roles: {
      admin: isRTL ? "مدير" : "Admin",
      partner: isRTL ? "شريك" : "Partner",
      associate: isRTL ? "محامي" : "Associate",
      paralegal: isRTL ? "مساعد قانوني" : "Paralegal",
      "client-viewer": isRTL ? "عميل" : "Client Viewer"
    },
    stats: {
      activeCases: isRTL ? "القضايا النشطة" : "Active Cases",
      completedTasks: isRTL ? "المهام المكتملة" : "Completed Tasks"
    },
    actions: {
      view: isRTL ? "عرض" : "View",
      edit: isRTL ? "تعديل" : "Edit",
      delete: isRTL ? "حذف" : "Delete",
      permissions: isRTL ? "الصلاحيات" : "Permissions"
    },
    permissionsMatrix: {
      title: isRTL ? "مصفوفة الصلاحيات" : "Permissions Matrix",
      modules: {
        cases: isRTL ? "القضايا" : "Cases",
        clients: isRTL ? "العملاء" : "Clients",
        documents: isRTL ? "المستندات" : "Documents",
        billing: isRTL ? "الفواتير" : "Billing",
        reports: isRTL ? "التقارير" : "Reports",
        settings: isRTL ? "الإعدادات" : "Settings"
      },
      access: {
        full: isRTL ? "كامل" : "Full",
        read: isRTL ? "قراءة" : "Read",
        write: isRTL ? "كتابة" : "Write",
        none: isRTL ? "لا يوجد" : "None"
      }
    }
  };

  const roleColors: Record<Role, string> = {
    admin: "bg-destructive/10 text-destructive border-destructive/20",
    partner: "bg-gold/10 text-gold-600 border-gold/20",
    associate: "bg-primary/10 text-primary border-primary/20",
    paralegal: "bg-accent/10 text-accent-foreground border-accent/20",
    "client-viewer": "bg-muted text-muted-foreground border-border"
  };

  const roleIcons: Record<Role, React.ReactNode> = {
    admin: <Shield className="h-3 w-3" />,
    partner: <Briefcase className="h-3 w-3" />,
    associate: <Users className="h-3 w-3" />,
    paralegal: <Users className="h-3 w-3" />,
    "client-viewer": <Eye className="h-3 w-3" />
  };

  const filteredMembers = useMemo(() => {
    return mockTeamMembers.filter(member => {
      const memberName = isRTL ? member.nameAr : member.name;
      const matchesSearch = memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || member.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, filterRole, isRTL]);

  const membersByRole = useMemo(() => {
    const grouped: Record<Role, TeamMember[]> = {
      admin: [],
      partner: [],
      associate: [],
      paralegal: [],
      "client-viewer": []
    };
    
    mockTeamMembers.forEach(member => {
      const role = member.role as Role;
      if (grouped[role]) {
        grouped[role].push(member);
      }
    });
    
    return grouped;
  }, []);

  const permissionsMatrix: Record<Role, Record<string, string>> = {
    admin: { cases: "full", clients: "full", documents: "full", billing: "full", reports: "full", settings: "full" },
    partner: { cases: "full", clients: "full", documents: "full", billing: "full", reports: "full", settings: "read" },
    associate: { cases: "write", clients: "write", documents: "write", billing: "read", reports: "read", settings: "none" },
    paralegal: { cases: "read", clients: "read", documents: "write", billing: "none", reports: "none", settings: "none" },
    "client-viewer": { cases: "read", clients: "read", documents: "read", billing: "read", reports: "none", settings: "none" }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const MemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
    const memberName = isRTL ? member.nameAr : member.name;
    const department = isRTL ? member.departmentAr : member.department;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        className="group"
      >
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(memberName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground">{memberName}</h4>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs gap-1 mt-1", roleColors[member.role as Role])}
                  >
                    {roleIcons[member.role as Role]}
                    {labels.roles[member.role as Role]}
                  </Badge>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"}>
                  <DropdownMenuItem className="gap-2">
                    <Eye className="h-4 w-4" />
                    {labels.actions.view}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Edit className="h-4 w-4" />
                    {labels.actions.edit}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Settings className="h-4 w-4" />
                    {labels.actions.permissions}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    {labels.actions.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{department}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{member.caseCount}</p>
                <p className="text-xs text-muted-foreground">{labels.stats.activeCases}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{member.taskCount}</p>
                <p className="text-xs text-muted-foreground">{labels.stats.completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const RolesOverview: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(Object.keys(membersByRole) as Role[]).map((role, index) => {
        const roleLabel = labels.roles[role];
        
        return (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={cn("text-sm gap-1", roleColors[role])}
                  >
                    {roleIcons[role]}
                    {roleLabel}
                  </Badge>
                  <span className="text-2xl font-bold text-foreground">
                    {membersByRole[role].length}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {membersByRole[role].slice(0, 5).map((member) => {
                    const memberName = isRTL ? member.nameAr : member.name;
                    return (
                      <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(memberName)}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                  {membersByRole[role].length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                      +{membersByRole[role].length - 5}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  const PermissionsMatrixView: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle>{labels.permissionsMatrix.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {isRTL ? "الوحدة" : "Module"}
                </th>
                {(Object.keys(labels.roles) as Role[]).map(role => (
                  <th key={role} className="px-4 py-3 text-sm font-medium text-muted-foreground text-center">
                    {labels.roles[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(labels.permissionsMatrix.modules).map(([module, moduleName]) => (
                <tr key={module} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{moduleName}</td>
                  {(Object.keys(permissionsMatrix) as Role[]).map(role => {
                    const access = permissionsMatrix[role][module];
                    const accessColors: Record<string, string> = {
                      full: "bg-green-500/20 text-green-600",
                      write: "bg-primary/20 text-primary",
                      read: "bg-amber-500/20 text-amber-600",
                      none: "bg-muted text-muted-foreground"
                    };
                    return (
                      <td key={`${role}-${module}`} className="px-4 py-3 text-center">
                        <Badge variant="outline" className={cn("text-xs", accessColors[access])}>
                          {labels.permissionsMatrix.access[access as keyof typeof labels.permissionsMatrix.access]}
                        </Badge>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{labels.title}</h1>
          <p className="text-muted-foreground">{labels.subtitle}</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          {labels.addMember}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            {labels.tabs.members}
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Briefcase className="h-4 w-4" />
            {labels.tabs.roles}
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Shield className="h-4 w-4" />
            {labels.tabs.permissions}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Input
                  placeholder={labels.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(isRTL ? "pr-10" : "pl-10")}
                />
                <Search className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                  isRTL ? "right-3" : "left-3"
                )} />
              </div>
              
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={labels.allRoles} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{labels.allRoles}</SelectItem>
                  {Object.entries(labels.roles).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles">
          <RolesOverview />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsMatrixView />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TeamPage;
