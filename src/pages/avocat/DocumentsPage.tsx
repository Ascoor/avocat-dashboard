import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Folder, Upload, Grid3X3, List, Search,
  Download, Eye, MoreVertical, Shield, Lock, Users,
  FileSpreadsheet, File
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mockDocuments, type DocumentData } from "@/data/avocat-mock-data";

type ViewMode = "grid" | "list";
type SecurityLevel = "confidential" | "internal" | "client-ready";

const DocumentsPage: React.FC = () => {
  const { direction, language, isRTL } = useLanguage();
  
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSecurity, setFilterSecurity] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");

  const labels = {
    title: isRTL ? "إدارة المستندات" : "Documents Management",
    subtitle: isRTL ? "تصفح وإدارة جميع المستندات القانونية" : "Browse and manage all legal documents",
    upload: isRTL ? "رفع مستند" : "Upload Document",
    search: isRTL ? "بحث في المستندات..." : "Search documents...",
    allSecurity: isRTL ? "جميع المستويات" : "All Security Levels",
    allFolders: isRTL ? "جميع المجلدات" : "All Folders",
    gridView: isRTL ? "عرض شبكي" : "Grid View",
    listView: isRTL ? "عرض قائمة" : "List View",
    download: isRTL ? "تحميل" : "Download",
    preview: isRTL ? "معاينة" : "Preview",
    noDocuments: isRTL ? "لا توجد مستندات" : "No documents found",
    size: isRTL ? "الحجم" : "Size",
    uploadDate: isRTL ? "تاريخ الرفع" : "Upload Date",
    security: {
      confidential: isRTL ? "سري" : "Confidential",
      internal: isRTL ? "داخلي" : "Internal",
      "client-ready": isRTL ? "جاهز للعميل" : "Client Ready"
    },
    types: {
      contract: isRTL ? "عقد" : "Contract",
      brief: isRTL ? "مذكرة" : "Brief",
      evidence: isRTL ? "دليل" : "Evidence",
      correspondence: isRTL ? "مراسلات" : "Correspondence",
      court_filing: isRTL ? "ملف محكمة" : "Court Filing"
    }
  };

  const securityIcons: Record<SecurityLevel, React.ReactNode> = {
    confidential: <Lock className="h-3 w-3" />,
    internal: <Shield className="h-3 w-3" />,
    "client-ready": <Users className="h-3 w-3" />
  };

  const securityColors: Record<SecurityLevel, string> = {
    confidential: "bg-destructive/10 text-destructive border-destructive/20",
    internal: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "client-ready": "bg-green-500/10 text-green-600 border-green-500/20"
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "xlsx":
      case "xls":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const folders = useMemo(() => {
    const folderSet = new Set(mockDocuments.map(d => d.caseName).filter(Boolean));
    return Array.from(folderSet) as string[];
  }, []);

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => {
      const docName = isRTL ? doc.nameAr : doc.name;
      const matchesSearch = docName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSecurity = filterSecurity === "all" || doc.securityLevel === filterSecurity;
      const matchesFolder = selectedFolder === "all" || doc.caseName === selectedFolder;
      return matchesSearch && matchesSecurity && matchesFolder;
    });
  }, [searchTerm, filterSecurity, selectedFolder, isRTL]);

  const DocumentCard: React.FC<{ doc: DocumentData }> = ({ doc }) => {
    const docName = isRTL ? doc.nameAr : doc.name;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        className="group"
      >
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-200 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-3">
              {/* File Icon */}
              <div className="relative p-4 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
                {getFileIcon(doc.type)}
                <div className="absolute -bottom-1 -right-1">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase">
                    {doc.type}
                  </Badge>
                </div>
              </div>
              
              {/* File Name */}
              <div className="space-y-1 w-full">
                <h4 className="font-medium text-sm text-foreground leading-tight line-clamp-2">
                  {docName}
                </h4>
                {doc.caseName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {doc.caseName}
                  </p>
                )}
              </div>
              
              {/* Security Badge */}
              <Badge 
                variant="outline" 
                className={cn("text-xs gap-1", securityColors[doc.securityLevel])}
              >
                {securityIcons[doc.securityLevel]}
                {labels.security[doc.securityLevel]}
              </Badge>
              
              {/* Meta Info */}
              <div className="flex items-center justify-between w-full text-xs text-muted-foreground pt-2 border-t border-border/50">
                <span>{doc.size}</span>
                <span>{new Date(doc.uploadedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}</span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 w-full pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Eye className="h-3 w-3" />
                  {labels.preview}
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Download className="h-3 w-3" />
                  {labels.download}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const ListView: React.FC = () => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {isRTL ? "المستند" : "Document"}
                </th>
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {isRTL ? "النوع" : "Type"}
                </th>
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {isRTL ? "المستوى" : "Security"}
                </th>
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {labels.size}
                </th>
                <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {labels.uploadDate}
                </th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredDocuments.map((doc, index) => {
                  const docName = isRTL ? doc.nameAr : doc.name;
                  
                  return (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <p className="font-medium text-foreground">{docName}</p>
                            {doc.caseName && (
                              <p className="text-xs text-muted-foreground">{doc.caseName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">
                          {doc.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs gap-1", securityColors[doc.securityLevel])}
                        >
                          {securityIcons[doc.securityLevel]}
                          {labels.security[doc.securityLevel]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {doc.size}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(doc.uploadedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRTL ? "start" : "end"}>
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" />
                              {labels.preview}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" />
                              {labels.download}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          <Upload className="h-4 w-4" />
          {labels.upload}
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isRTL ? "اسحب وأفلت الملفات هنا" : "Drag and drop files here"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "أو انقر للاختيار من جهازك" : "or click to browse from your device"}
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              {isRTL ? "اختر ملفات" : "Choose Files"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters & View Toggle */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 flex-1">
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
            
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-[160px]">
                <Folder className="h-4 w-4 me-2" />
                <SelectValue placeholder={labels.allFolders} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{labels.allFolders}</SelectItem>
                {folders.map(folder => (
                  <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterSecurity} onValueChange={setFilterSecurity}>
              <SelectTrigger className="w-[160px]">
                <Shield className="h-4 w-4 me-2" />
                <SelectValue placeholder={labels.allSecurity} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{labels.allSecurity}</SelectItem>
                <SelectItem value="confidential">{labels.security.confidential}</SelectItem>
                <SelectItem value="internal">{labels.security.internal}</SelectItem>
                <SelectItem value="client-ready">{labels.security["client-ready"]}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.gridView}</span>
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
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDocuments.map(doc => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </AnimatePresence>
          
          {filteredDocuments.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {labels.noDocuments}
            </div>
          )}
        </div>
      ) : (
        <ListView />
      )}
    </motion.div>
  );
};

export default DocumentsPage;
