import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Clock, AlertCircle, ListTodo, 
  LayoutGrid, List, Plus, Calendar, User, Filter
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/avocat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockTasks, type TaskData } from "@/data/avocat-mock-data";

type ViewMode = "kanban" | "list";
type TaskStatus = "todo" | "in-progress" | "done" | "overdue";

const TasksPage: React.FC = () => {
  const { direction, language, isRTL } = useLanguage();
  
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");

  const labels = {
    title: isRTL ? "إدارة المهام" : "Tasks Management",
    subtitle: isRTL ? "تتبع وإدارة المهام والمواعيد النهائية" : "Track and manage tasks and deadlines",
    addTask: isRTL ? "إضافة مهمة" : "Add Task",
    search: isRTL ? "بحث في المهام..." : "Search tasks...",
    allPriorities: isRTL ? "جميع الأولويات" : "All Priorities",
    allAssignees: isRTL ? "جميع المكلفين" : "All Assignees",
    kanbanView: isRTL ? "عرض كانبان" : "Kanban View",
    listView: isRTL ? "عرض قائمة" : "List View",
    columns: {
      todo: isRTL ? "قيد الانتظار" : "To Do",
      "in-progress": isRTL ? "قيد التنفيذ" : "In Progress",
      done: isRTL ? "مكتمل" : "Completed",
      overdue: isRTL ? "متأخر" : "Overdue"
    },
    dueDate: isRTL ? "تاريخ الاستحقاق" : "Due Date",
    assignee: isRTL ? "المكلف" : "Assignee",
    case: isRTL ? "القضية" : "Case",
    noTasks: isRTL ? "لا توجد مهام" : "No tasks found"
  };

  const priorityLabels: Record<string, string> = {
    low: isRTL ? "منخفضة" : "Low",
    medium: isRTL ? "متوسطة" : "Medium",
    high: isRTL ? "عالية" : "High"
  };

  const filteredTasks = useMemo(() => {
    return mockTasks.filter(task => {
      const title = isRTL ? task.titleAr : task.title;
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      const assignee = isRTL ? task.assigneeAr : task.assignee;
      const matchesAssignee = filterAssignee === "all" || assignee === filterAssignee;
      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [searchTerm, filterPriority, filterAssignee, isRTL]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, TaskData[]> = {
      todo: [],
      "in-progress": [],
      done: [],
      overdue: []
    };
    
    filteredTasks.forEach(task => {
      const status = task.status as TaskStatus;
      if (grouped[status]) {
        grouped[status].push(task);
      }
    });
    
    return grouped;
  }, [filteredTasks]);

  const uniqueAssignees = useMemo(() => {
    return [...new Set(mockTasks.map(t => isRTL ? t.assigneeAr : t.assignee))];
  }, [isRTL]);

  const columnColors: Record<TaskStatus, string> = {
    todo: "border-t-muted-foreground",
    "in-progress": "border-t-primary",
    done: "border-t-green-500",
    overdue: "border-t-destructive"
  };

  const columnIcons: Record<TaskStatus, React.ReactNode> = {
    todo: <ListTodo className="h-4 w-4 text-muted-foreground" />,
    "in-progress": <Clock className="h-4 w-4 text-primary" />,
    done: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    overdue: <AlertCircle className="h-4 w-4 text-destructive" />
  };

  const TaskCard: React.FC<{ task: TaskData }> = ({ task }) => {
    const taskIsOverdue = new Date(task.dueDate) < new Date() && task.status !== "done";
    const title = isRTL ? task.titleAr : task.title;
    const caseName = isRTL ? task.caseNameAr : task.caseName;
    const assignee = isRTL ? task.assigneeAr : task.assignee;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm text-foreground leading-tight line-clamp-2">
                {title}
              </h4>
              <StatusBadge status={task.priority} size="sm" />
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className={cn(taskIsOverdue && "text-destructive font-medium")}>
                {new Date(task.dueDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {assignee}
                </span>
              </div>
              {caseName && (
                <Badge variant="outline" className="text-xs">
                  {caseName}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const KanbanColumn: React.FC<{ status: TaskStatus; tasks: TaskData[] }> = ({ status, tasks }) => (
    <div className="flex-1 min-w-[280px] max-w-[320px]">
      <div className={cn(
        "bg-muted/30 rounded-xl border-t-4 p-4",
        columnColors[status]
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {columnIcons[status]}
            <h3 className="font-semibold text-foreground">
              {labels.columns[status]}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
          
          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {labels.noTasks}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ListView: React.FC = () => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {isRTL ? "المهمة" : "Task"}
                </th>
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {labels.dueDate}
                </th>
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {labels.assignee}
                </th>
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {isRTL ? "الأولوية" : "Priority"}
                </th>
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {isRTL ? "الحالة" : "Status"}
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTasks.map((task, index) => {
                  const title = isRTL ? task.titleAr : task.title;
                  const caseName = isRTL ? task.caseNameAr : task.caseName;
                  const assignee = isRTL ? task.assigneeAr : task.assignee;
                  
                  return (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{title}</p>
                          {caseName && (
                            <p className="text-xs text-muted-foreground">{labels.case}: {caseName}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm">{assignee}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={task.priority} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={task.status} size="sm" />
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
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
          <Plus className="h-4 w-4" />
          {labels.addTask}
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Input
                placeholder={labels.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Filter className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                isRTL ? "right-3" : "left-3"
              )} />
            </div>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={labels.allPriorities} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{labels.allPriorities}</SelectItem>
                <SelectItem value="low">{priorityLabels.low}</SelectItem>
                <SelectItem value="medium">{priorityLabels.medium}</SelectItem>
                <SelectItem value="high">{priorityLabels.high}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={labels.allAssignees} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{labels.allAssignees}</SelectItem>
                {uniqueAssignees.map(assignee => (
                  <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.kanbanView}</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.listView}</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {viewMode === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {(Object.keys(tasksByStatus) as TaskStatus[]).map(status => (
            <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
          ))}
        </div>
      ) : (
        <ListView />
      )}
    </motion.div>
  );
};

export default TasksPage;
