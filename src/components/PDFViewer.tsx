import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Trash,
  Edit,
  Plus,
} from "lucide-react";

interface PDFViewerProps {
  documentUrl?: string;
  documentTitle?: string;
  onAddDocument?: () => void;
  onEditDocument?: () => void;
  onDeleteDocument?: () => void;
}

const PDFViewer = ({
  documentUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  documentTitle = "Sample Document",
  onAddDocument = () => {},
  onEditDocument = () => {},
  onDeleteDocument = () => {},
}: PDFViewerProps) => {
  const { user, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // This would be determined from the actual PDF
  const [zoomLevel, setZoomLevel] = useState([100]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editTitle, setEditTitle] = useState(documentTitle);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value);
  };

  const handleEditSave = () => {
    // Here you would implement the actual save logic
    onEditDocument();
    setShowEditDialog(false);
  };

  const handleDeleteConfirm = () => {
    // Here you would implement the actual delete logic
    onDeleteDocument();
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoomChange([Math.max(zoomLevel[0] - 10, 50)])}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-32">
            <Slider
              value={zoomLevel}
              min={50}
              max={200}
              step={10}
              onValueChange={handleZoomChange}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoomChange([Math.min(zoomLevel[0] + 10, 200)])}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-sm">{zoomLevel[0]}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RotateCw className="h-4 w-4" />
          </Button>
          {/* Download button only visible to logged in users */}
          {user && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Document Title and Actions */}
      <div className="flex justify-between items-center p-2 bg-muted/30">
        <h2 className="text-lg font-semibold">{documentTitle}</h2>
        {/* Admin-only actions */}
        {isAdmin() ? (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="h-4 w-4 mr-1" /> Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={onAddDocument}>
              <Plus className="h-4 w-4 mr-1" /> Add New
            </Button>
          </div>
        ) : (
          <div>{/* Non-admin users see no document management buttons */}</div>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-4 flex justify-center bg-muted/20">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardContent className="p-0 h-[600px] flex items-center justify-center">
            {documentUrl ? (
              <iframe
                src={`${documentUrl}#page=${currentPage}&zoom=${zoomLevel[0] / 100}`}
                className="w-full h-full"
                title={documentTitle}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <p>No document selected</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={onAddDocument}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Title
              </label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="file" className="text-right">
                Replace PDF
              </label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              document "{documentTitle}" from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PDFViewer;
