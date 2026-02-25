import { useState, useRef } from "react";
import { Pencil, Trash2, Plus, BookMarked, Upload, Sparkles, Link as LinkIcon, X, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useListPoems } from "@/hooks/useQueries";
import { useAddPoem, useUpdatePoem, useDeletePoem } from "@/hooks/useMutations";
import type { Poem, AgeGroup, ExternalBlob } from "@/backend";
import { Link } from "@tanstack/react-router";

const AGE_GROUPS = ["3-5", "6-8", "9-12", "All Ages"];

// Helper to convert UI age group strings to backend AgeGroup enum
function convertAgeGroupToEnum(ageGroup: string): AgeGroup {
  switch (ageGroup) {
    case "3-5": return "ages3to5" as AgeGroup;
    case "6-8": return "ages6to8" as AgeGroup;
    case "9-12": return "ages9to12" as AgeGroup;
    case "All Ages": return "allAges" as AgeGroup;
    default: return "allAges" as AgeGroup;
  }
}

// Helper to convert backend AgeGroup enum to UI strings
function convertEnumToAgeGroup(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case "ages3to5": return "3-5";
    case "ages6to8": return "6-8";
    case "ages9to12": return "9-12";
    case "allAges": return "All Ages";
    default: return "All Ages";
  }
}

export function AdminPoems() {
  const { data: poems = [], isLoading } = useListPoems();
  const addPoem = useAddPoem();
  const updatePoem = useUpdatePoem();
  const deletePoem = useDeletePoem();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    ageGroup: "All Ages",
    imageUrl: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      author: "",
      ageGroup: "All Ages",
      imageUrl: "",
    });
    setEditingPoem(null);
    setIsFormOpen(false);
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);
  };

  const handleEdit = (poem: Poem) => {
    setEditingPoem(poem);
    setFormData({
      title: poem.title,
      content: poem.content,
      author: poem.author,
      ageGroup: convertEnumToAgeGroup(poem.ageGroup),
      imageUrl: "",
    });
    // Set preview from existing image
    if (poem.image) {
      setImagePreview(poem.image.getDirectURL());
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
      toast.error("Please enter a poem title first");
      return;
    }

    toast.info("💡 Tip: Ask the AI assistant in chat to generate an image for your poem! Say: 'Generate an image for my poem about [topic]'", {
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

    if (!formData.title || !formData.content || !formData.author) {
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
      } else if (editingPoem?.image) {
        // Keep existing image if editing and no new image provided
        image = editingPoem.image;
      }

      const ageGroup = convertAgeGroupToEnum(formData.ageGroup);

      if (editingPoem) {
        await updatePoem.mutateAsync({
          id: editingPoem.id,
          title: formData.title,
          content: formData.content,
          author: formData.author,
          ageGroup,
          image,
        });
        toast.success("Poem updated successfully!");
      } else {
        await addPoem.mutateAsync({
          title: formData.title,
          content: formData.content,
          author: formData.author,
          ageGroup,
          image,
        });
        toast.success("Poem added successfully!");
      }
      resetForm();
    } catch (error) {
      toast.error(
        editingPoem ? "Failed to update poem" : "Failed to add poem"
      );
      console.error(error);
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePoem.mutateAsync(id);
      toast.success("Poem deleted successfully!");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete poem");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading poems...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground">
              <BookMarked className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-fredoka font-bold text-poems">
              Manage Poems
            </h1>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            size="lg"
            className="bg-poems hover:bg-poems/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Poem
          </Button>
        </div>
        <p className="text-muted-foreground">
          Total: {poems.length} poems
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Age Group</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {poems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No poems yet. Click "Add New Poem" to create one.
                </TableCell>
              </TableRow>
            ) : (
              poems.map((poem) => (
                <TableRow key={poem.id.toString()}>
                  <TableCell className="font-medium">{poem.title}</TableCell>
                  <TableCell>{poem.author}</TableCell>
                  <TableCell>{poem.ageGroup}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(poem)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteConfirm(poem.id)}
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
              {editingPoem ? "Edit Poem" : "Add New Poem"}
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
                placeholder="Enter poem title"
                required
              />
            </div>

            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Enter author name"
                required
              />
            </div>

            <div>
              <Label htmlFor="ageGroup">Age Group *</Label>
              <Select
                value={formData.ageGroup}
                onValueChange={(value) =>
                  setFormData({ ...formData, ageGroup: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map((age) => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Poem Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter the poem text..."
                rows={10}
                required
                className="font-comic"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4 border-2 border-dashed border-poems/30 rounded-lg p-4 bg-poems/5">
              <Label className="text-base font-semibold">Poem Image (Optional)</Label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-poems/40"
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
                      className="bg-poems h-full transition-all duration-300"
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
                disabled={addPoem.isPending || updatePoem.isPending}
                className="bg-poems hover:bg-poems/90"
              >
                {addPoem.isPending || updatePoem.isPending
                  ? "Saving..."
                  : editingPoem
                  ? "Update Poem"
                  : "Add Poem"}
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
              This action cannot be undone. This will permanently delete the poem.
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
