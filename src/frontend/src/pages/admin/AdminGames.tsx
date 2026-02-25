import { useState, useRef } from "react";
import { Pencil, Trash2, Plus, Gamepad2, Upload, Sparkles, Link as LinkIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useListGames } from "@/hooks/useQueries";
import { useAddGame, useUpdateGame, useDeleteGame } from "@/hooks/useMutations";
import type { Game, ExternalBlob } from "@/backend";
import { Link } from "@tanstack/react-router";

export function AdminGames() {
  const { data: games = [], isLoading } = useListGames();
  const addGame = useAddGame();
  const updateGame = useUpdateGame();
  const deleteGame = useDeleteGame();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    gameType: "",
    imageUrl: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      gameType: "",
      imageUrl: "",
    });
    setEditingGame(null);
    setIsFormOpen(false);
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      gameType: game.gameType,
      imageUrl: "",
    });
    // Set preview from existing image
    if (game.image) {
      setImagePreview(game.image.getDirectURL());
    }
    setIsFormOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      setFormData({ ...formData, imageUrl: "" });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.title) {
      toast.error("Please enter a game title first");
      return;
    }

    toast.info("💡 Tip: Ask the AI assistant in chat to generate an image for your game! Say: 'Generate an image for my game about [topic]'", {
      duration: 6000,
    });
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, imageUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.gameType) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      let image: ExternalBlob | null = null;

      // Handle image upload
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const { ExternalBlob } = await import("@/backend");
        
        image = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (formData.imageUrl) {
        // Handle external URL
        const { ExternalBlob } = await import("@/backend");
        image = ExternalBlob.fromURL(formData.imageUrl);
      } else if (editingGame?.image) {
        // Keep existing image if editing and no new image provided
        image = editingGame.image;
      }

      if (editingGame) {
        await updateGame.mutateAsync({
          id: editingGame.id,
          title: formData.title,
          description: formData.description,
          gameType: formData.gameType,
          image,
        });
        toast.success("Game updated successfully!");
      } else {
        await addGame.mutateAsync({
          title: formData.title,
          description: formData.description,
          gameType: formData.gameType,
          image,
        });
        toast.success("Game added successfully!");
      }
      resetForm();
    } catch (error) {
      toast.error(
        editingGame ? "Failed to update game" : "Failed to add game"
      );
      console.error(error);
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteGame.mutateAsync(id);
      toast.success("Game deleted successfully!");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete game");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading games...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground">
              <Gamepad2 className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-fredoka font-bold text-games">
              Manage Games
            </h1>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            size="lg"
            className="bg-games hover:bg-games/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Game
          </Button>
        </div>
        <p className="text-muted-foreground">
          Total: {games.length} games
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Game Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No games yet. Click "Add New Game" to create one.
                </TableCell>
              </TableRow>
            ) : (
              games.map((game) => (
                <TableRow key={game.id.toString()}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell>{game.gameType}</TableCell>
                  <TableCell className="max-w-md truncate">{game.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(game)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteConfirm(game.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-fredoka">
              {editingGame ? "Edit Game" : "Add New Game"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below. All fields except image URL are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter game title"
                required
              />
            </div>

            <div>
              <Label htmlFor="gameType">Game Type *</Label>
              <Input
                id="gameType"
                value={formData.gameType}
                onChange={(e) =>
                  setFormData({ ...formData, gameType: e.target.value })
                }
                placeholder="e.g., Memory, Puzzle, Quiz"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the game..."
                rows={6}
                required
              />
            </div>

            {/* Game Image Upload Section */}
            <div className="space-y-4 border-2 border-dashed border-games/30 rounded-lg p-4 bg-games/5">
              <Label className="text-base font-semibold">Game Image (Optional)</Label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-games/40"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Upload Options */}
              {!imagePreview && (
                <div className="space-y-3">
                  {/* File Upload */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image from Device
                    </Button>
                  </div>

                  {/* AI Generation */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !formData.title}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>

                  {/* External URL */}
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder="Or paste image URL"
                    />
                  </div>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-games h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addGame.isPending || updateGame.isPending}
                className="bg-games hover:bg-games/90"
              >
                {addGame.isPending || updateGame.isPending
                  ? "Saving..."
                  : editingGame
                  ? "Update Game"
                  : "Add Game"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
