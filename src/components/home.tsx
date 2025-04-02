import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Menu } from "lucide-react";
import PDFViewer from "./PDFViewer";
import DocumentList from "./DocumentList";
import TriviaSection from "./TriviaSection";

const Home = () => {
  const [activeTab, setActiveTab] = useState("pdf-viewer");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock documents for demonstration
  const mockDocuments = [
    { id: "1", title: "Pest Management Guide", dateAdded: "2023-05-15" },
    { id: "2", title: "BIOCON Handbook", dateAdded: "2023-06-22" },
    { id: "3", title: "Integrated Pest Management", dateAdded: "2023-07-10" },
    { id: "4", title: "Pest Control Best Practices", dateAdded: "2023-08-05" },
    { id: "5", title: "BIOCON Field Manual", dateAdded: "2023-09-18" },
  ];

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocument(documentId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold md:text-2xl">Pest Management App</h1>

          <div className="hidden md:flex items-center space-x-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="pdf-viewer">PDF Viewer</TabsTrigger>
                <TabsTrigger value="pest-trivia">Pest Trivia</TabsTrigger>
                <TabsTrigger value="biocon-trivia">BIOCON Trivia</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background p-4 shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setIsMobileMenuOpen(false);
            }}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="pdf-viewer" className="flex-1">
                PDF Viewer
              </TabsTrigger>
              <TabsTrigger value="pest-trivia" className="flex-1">
                Pest Trivia
              </TabsTrigger>
              <TabsTrigger value="biocon-trivia" className="flex-1">
                BIOCON Trivia
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="pdf-viewer" className="mt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Document List Section */}
              <Card className="md:col-span-1 h-[calc(100vh-12rem)] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Documents</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documents..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                    <Button size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <DocumentList
                    documents={mockDocuments.filter((doc) =>
                      doc.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    )}
                    onSelectDocument={handleDocumentSelect}
                    selectedDocumentId={selectedDocument}
                  />
                </CardContent>
              </Card>

              {/* PDF Viewer Section */}
              <Card className="md:col-span-3 h-[calc(100vh-12rem)] overflow-hidden">
                <CardContent className="p-0 h-full">
                  <PDFViewer documentId={selectedDocument} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pest-trivia" className="mt-0">
            <Card className="h-[calc(100vh-12rem)] overflow-hidden">
              <CardHeader>
                <CardTitle>Pest Trivia</CardTitle>
              </CardHeader>
              <CardContent>
                <TriviaSection type="pest" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biocon-trivia" className="mt-0">
            <Card className="h-[calc(100vh-12rem)] overflow-hidden">
              <CardHeader>
                <CardTitle>BIOCON Trivia</CardTitle>
              </CardHeader>
              <CardContent>
                <TriviaSection type="biocon" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
        <p>© 2023 Pest Management App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
