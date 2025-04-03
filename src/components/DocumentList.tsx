import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";

interface Document {
  id: string;
  title: string;
  dateAdded: string;
  fileUrl: string;
}

interface DocumentListProps {
  documents?: Document[];
  onViewDocument?: (document: Document) => void;
  onAddDocument?: (document: Partial<Document>) => void;
  onEditDocument?: (document: Document) => void;
  onDeleteDocument?: (documentId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents = [
    {
      id: "1",
      title: "Pest Management Guide 2023",
      dateAdded: "2023-05-15",
      fileUrl: "/documents/pest-guide-2023.pdf",
    },
    {
      id: "2",
      title: "BIOCON Handbook",
      dateAdded: "2023-06-22",
      fileUrl: "/documents/biocon-handbook.pdf",
    },
    {
      id: "3",
      title: "Integrated Pest Management",
      dateAdded: "2023-07-10",
      fileUrl: "/documents/integrated-pest-management.pdf",
    },
    {
      id: "4",
      title: "Organic Pest Control Methods",
      dateAdded: "2023-08-05",
      fileUrl: "/documents/organic-pest-control.pdf",
    },
    {
      id: "5",
      title: "Biological Control Agents",
      dateAdded: "2023-09-18",
      fileUrl: "/documents/biological-control-agents.pdf",
    },
  ],
  onViewDocument = () => {},
  onAddDocument = () => {},
  onEditDocument = () => {},
  onDeleteDocument = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: "",
  });
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [deleteDocumentId, setDeleteDocumentId] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddDocument = () => {
    onAddDocument(newDocument);
    setNewDocument({ title: "" });
  };

  const handleEditDocument = () => {
    if (editingDocument) {
      onEditDocument(editingDocument);
      setEditingDocument(null);
    }
  };

  const handleDeleteDocument = () => {
    if (deleteDocumentId) {
      onDeleteDocument(deleteDocumentId);
      setDeleteDocumentId(null);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background border rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Document List</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add New Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={newDocument.title}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, title: e.target.value })
                  }
                  placeholder="Enter document title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">Upload PDF</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    // In a real implementation, you would handle file upload here
                    console.log("File selected:", e.target.files?.[0]);
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDocument}>Add Document</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="hover:bg-accent/10 transition-colors"
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Added: {doc.dateAdded}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDocument(doc)}
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingDocument(doc)}
                          title="Edit Document"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Document</DialogTitle>
                        </DialogHeader>
                        {editingDocument && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-title">Document Title</Label>
                              <Input
                                id="edit-title"
                                value={editingDocument.title}
                                onChange={(e) =>
                                  setEditingDocument({
                                    ...editingDocument,
                                    title: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-file">
                                Replace PDF (Optional)
                              </Label>
                              <Input id="edit-file" type="file" accept=".pdf" />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleEditDocument}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {isAdmin() && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteDocumentId(doc.id)}
                            title="Delete Document"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the document "
                              {doc.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteDocument}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No documents match your search"
                : "No documents available"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentList;
