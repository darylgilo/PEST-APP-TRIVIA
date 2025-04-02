import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";

interface TriviaItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface TriviaSectionProps {
  type: "pest" | "biocon";
  onBack?: () => void;
}

const TriviaSection = ({ type = "pest", onBack }: TriviaSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrivia, setSelectedTrivia] = useState<TriviaItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTriviaTitle, setNewTriviaTitle] = useState("");
  const [newTriviaContent, setNewTriviaContent] = useState("");

  // Mock data for demonstration
  const [triviaItems, setTriviaItems] = useState<TriviaItem[]>([
    {
      id: "1",
      title:
        type === "pest" ? "Common House Fly Facts" : "Beneficial Nematodes",
      content:
        type === "pest"
          ? "House flies can carry over 100 different pathogens that cause disease in humans and animals."
          : "Beneficial nematodes are microscopic, non-segmented roundworms that occur naturally in soil throughout the world.",
      date: "2023-05-15",
    },
    {
      id: "2",
      title: type === "pest" ? "Mosquito Lifecycle" : "Ladybugs as Predators",
      content:
        type === "pest"
          ? "Mosquitoes have a four-stage lifecycle: egg, larva, pupa, and adult. The first three stages occur in water."
          : "Ladybugs are voracious predators and can consume up to 5,000 aphids in their lifetime, making them excellent for biological control.",
      date: "2023-06-22",
    },
    {
      id: "3",
      title: type === "pest" ? "Termite Colonies" : "Parasitic Wasps",
      content:
        type === "pest"
          ? "A single termite colony can contain up to 1 million termites and can consume up to 16 grams of wood per day."
          : "Parasitic wasps lay their eggs inside or on host insects. When the eggs hatch, the larvae feed on the host, eventually killing it.",
      date: "2023-07-10",
    },
  ]);

  const filteredTrivia = triviaItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddTrivia = () => {
    const newTrivia: TriviaItem = {
      id: Date.now().toString(),
      title: newTriviaTitle,
      content: newTriviaContent,
      date: new Date().toISOString().split("T")[0],
    };
    setTriviaItems([...triviaItems, newTrivia]);
    setNewTriviaTitle("");
    setNewTriviaContent("");
    setIsAddDialogOpen(false);
  };

  const handleEditTrivia = () => {
    if (!selectedTrivia) return;

    const updatedItems = triviaItems.map((item) => {
      if (item.id === selectedTrivia.id) {
        return {
          ...item,
          title: newTriviaTitle,
          content: newTriviaContent,
        };
      }
      return item;
    });

    setTriviaItems(updatedItems);
    setIsEditDialogOpen(false);
  };

  const handleDeleteTrivia = (id: string) => {
    const updatedItems = triviaItems.filter((item) => item.id !== id);
    setTriviaItems(updatedItems);
  };

  const openEditDialog = (trivia: TriviaItem) => {
    setSelectedTrivia(trivia);
    setNewTriviaTitle(trivia.title);
    setNewTriviaContent(trivia.content);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">
            {type === "pest" ? "Pest Trivia" : "BIOCON Trivia"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search trivia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Trivia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Trivia</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTriviaTitle}
                    onChange={(e) => setNewTriviaTitle(e.target.value)}
                    placeholder="Enter trivia title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newTriviaContent}
                    onChange={(e) => setNewTriviaContent(e.target.value)}
                    placeholder="Enter trivia content"
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTrivia}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrivia.length > 0 ? (
          filteredTrivia.map((trivia) => (
            <Card key={trivia.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{trivia.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Added: {trivia.date}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{trivia.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(trivia)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the trivia item.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTrivia(trivia.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center p-8">
            <p className="text-muted-foreground">
              No trivia items found. Try a different search or add new trivia.
            </p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trivia</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={newTriviaTitle}
                onChange={(e) => setNewTriviaTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={newTriviaContent}
                onChange={(e) => setNewTriviaContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTrivia}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TriviaSection;
