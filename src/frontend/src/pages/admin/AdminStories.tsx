import { useState, useRef } from "react";
import { Pencil, Trash2, Plus, BookOpen, Upload, Sparkles, Link as LinkIcon, X, Loader2 } from "lucide-react";
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
import { useListStories } from "@/hooks/useQueries";
import { useAddStory, useUpdateStory, useDeleteStory } from "@/hooks/useMutations";
import type { Story, AgeGroup, ExternalBlob } from "@/backend";
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

export function AdminStories() {
  const { data: stories = [], isLoading } = useListStories();
  const addStory = useAddStory();
  const updateStory = useUpdateStory();
  const deleteStory = useDeleteStory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
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
    readingTime: "5",
    coverImageUrl: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      author: "",
      ageGroup: "All Ages",
      readingTime: "5",
      coverImageUrl: "",
    });
    setEditingStory(null);
    setIsFormOpen(false);
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      content: story.content,
      author: story.author,
      ageGroup: convertEnumToAgeGroup(story.ageGroup),
      readingTime: story.readingTime.toString(),
      coverImageUrl: "",
    });
    // Set preview from existing image
    if (story.coverImage) {
      setImagePreview(story.coverImage.getDirectURL());
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
      setFormData({ ...formData, coverImageUrl: "" });
      
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
      toast.error("Please enter a story title first");
      return;
    }

    toast.info("💡 Tip: Ask the AI assistant in chat to generate an image for your story! Say: 'Generate a cover image for my story about [topic]'", {
      duration: 6000,
    });
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, coverImageUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.author || !formData.readingTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const readingTime = parseInt(formData.readingTime);
    if (isNaN(readingTime) || readingTime <= 0) {
      toast.error("Reading time must be a positive number");
      return;
    }

    try {
      let coverImage: ExternalBlob | null = null;

      // Handle image upload
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const { ExternalBlob } = await import("@/backend");
        
        coverImage = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (formData.coverImageUrl) {
        // Handle external URL
        const { ExternalBlob } = await import("@/backend");
        coverImage = ExternalBlob.fromURL(formData.coverImageUrl);
      } else if (editingStory?.coverImage) {
        // Keep existing image if editing and no new image provided
        coverImage = editingStory.coverImage;
      }

      const ageGroup = convertAgeGroupToEnum(formData.ageGroup);

      if (editingStory) {
        await updateStory.mutateAsync({
          id: editingStory.id,
          title: formData.title,
          content: formData.content,
          author: formData.author,
          ageGroup,
          readingTime: BigInt(readingTime),
          coverImage,
        });
        toast.success("Story updated successfully!");
      } else {
        await addStory.mutateAsync({
          title: formData.title,
          content: formData.content,
          author: formData.author,
          ageGroup,
          readingTime: BigInt(readingTime),
          coverImage,
        });
        toast.success("Story added successfully!");
      }
      resetForm();
    } catch (error) {
      toast.error(
        editingStory ? "Failed to update story" : "Failed to add story"
      );
      console.error(error);
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteStory.mutateAsync(id);
      toast.success("Story deleted successfully!");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete story");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground">
              <BookOpen className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-fredoka font-bold text-stories">
              Manage Stories
            </h1>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            size="lg"
            className="bg-stories hover:bg-stories/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Story
          </Button>
        </div>
        <p className="text-muted-foreground">
          Total: {stories.length} stories
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Age Group</TableHead>
              <TableHead>Reading Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No stories yet. Click "Add New Story" to create one.
                </TableCell>
              </TableRow>
            ) : (
              stories.map((story) => (
                <TableRow key={story.id.toString()}>
                  <TableCell className="font-medium">{story.title}</TableCell>
                  <TableCell>{story.author}</TableCell>
                  <TableCell>{story.ageGroup}</TableCell>
                  <TableCell>{story.readingTime.toString()} min</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(story)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteConfirm(story.id)}
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
              {editingStory ? "Edit Story" : "Add New Story"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below. All fields except cover image URL are required.
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
                placeholder="Enter story title"
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

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="readingTime">Reading Time (minutes) *</Label>
                <Input
                  id="readingTime"
                  type="number"
                  min="1"
                  value={formData.readingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readingTime: e.target.value })
                  }
                  placeholder="5"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">Story Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter the story text..."
                rows={12}
                required
                className="font-comic"
              />
            </div>

            {/* Cover Image Upload Section */}
            <div className="space-y-4 border-2 border-dashed border-stories/30 rounded-lg p-4 bg-stories/5">
              <Label className="text-base font-semibold">Cover Image (Optional)</Label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-stories/40"
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
                      id="coverImageUrl"
                      value={formData.coverImageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, coverImageUrl: e.target.value })
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
                      className="bg-stories h-full transition-all duration-300"
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
                disabled={addStory.isPending || updateStory.isPending}
                className="bg-stories hover:bg-stories/90"
              >
                {addStory.isPending || updateStory.isPending
                  ? "Saving..."
                  : editingStory
                  ? "Update Story"
                  : "Add Story"}
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
              This action cannot be undone. This will permanently delete the story.
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
