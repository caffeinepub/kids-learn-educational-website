import { useState } from "react";
import { Pencil, Trash2, Plus, GraduationCap, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useListEducationalModules } from "@/hooks/useQueries";
import {
  useAddEducationalModule,
  useUpdateEducationalModule,
  useDeleteEducationalModule,
} from "@/hooks/useMutations";
import type { EducationalModule } from "@/backend";
import { Link } from "@tanstack/react-router";

export function AdminModules() {
  const { data: modules = [], isLoading } = useListEducationalModules();
  const addModule = useAddEducationalModule();
  const updateModule = useUpdateEducationalModule();
  const deleteModule = useDeleteEducationalModule();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);
  const [editingModule, setEditingModule] = useState<EducationalModule | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "",
    learningItems: [] as string[],
    newItem: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      contentType: "",
      learningItems: [],
      newItem: "",
    });
    setEditingModule(null);
    setIsFormOpen(false);
  };

  const handleEdit = (module: EducationalModule) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      contentType: module.contentType,
      learningItems: [...module.learningItems],
      newItem: "",
    });
    setIsFormOpen(true);
  };

  const addLearningItem = () => {
    if (formData.newItem.trim()) {
      setFormData({
        ...formData,
        learningItems: [...formData.learningItems, formData.newItem.trim()],
        newItem: "",
      });
    }
  };

  const removeLearningItem = (index: number) => {
    setFormData({
      ...formData,
      learningItems: formData.learningItems.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.contentType) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.learningItems.length === 0) {
      toast.error("Please add at least one learning item");
      return;
    }

    try {
      if (editingModule) {
        await updateModule.mutateAsync({
          id: editingModule.id,
          title: formData.title,
          description: formData.description,
          contentType: formData.contentType,
          learningItems: formData.learningItems,
        });
        toast.success("Module updated successfully!");
      } else {
        await addModule.mutateAsync({
          title: formData.title,
          description: formData.description,
          contentType: formData.contentType,
          learningItems: formData.learningItems,
        });
        toast.success("Module added successfully!");
      }
      resetForm();
    } catch (error) {
      toast.error(
        editingModule ? "Failed to update module" : "Failed to add module"
      );
      console.error(error);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteModule.mutateAsync(id);
      toast.success("Module deleted successfully!");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete module");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading modules...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground">
              <GraduationCap className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-fredoka font-bold text-education">
              Manage Educational Modules
            </h1>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            size="lg"
            className="bg-education hover:bg-education/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Module
          </Button>
        </div>
        <p className="text-muted-foreground">
          Total: {modules.length} modules
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content Type</TableHead>
              <TableHead>Learning Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No modules yet. Click "Add New Module" to create one.
                </TableCell>
              </TableRow>
            ) : (
              modules.map((module) => (
                <TableRow key={module.id.toString()}>
                  <TableCell className="font-medium">{module.title}</TableCell>
                  <TableCell>{module.contentType}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{module.learningItems.length} items</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(module)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteConfirm(module.id)}
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
              {editingModule ? "Edit Module" : "Add New Module"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below and add learning items.
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
                placeholder="Enter module title"
                required
              />
            </div>

            <div>
              <Label htmlFor="contentType">Content Type *</Label>
              <Input
                id="contentType"
                value={formData.contentType}
                onChange={(e) =>
                  setFormData({ ...formData, contentType: e.target.value })
                }
                placeholder="e.g., Math, Science, Language"
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
                placeholder="Describe the module..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label>Learning Items *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={formData.newItem}
                  onChange={(e) =>
                    setFormData({ ...formData, newItem: e.target.value })
                  }
                  placeholder="Add a learning item..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLearningItem();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addLearningItem}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.learningItems.map((item, index) => (
                  <Badge key={index} variant="secondary" className="py-1 px-3">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeLearningItem(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {formData.learningItems.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No learning items added yet. Add at least one.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addModule.isPending || updateModule.isPending}
                className="bg-education hover:bg-education/90"
              >
                {addModule.isPending || updateModule.isPending
                  ? "Saving..."
                  : editingModule
                  ? "Update Module"
                  : "Add Module"}
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
              This action cannot be undone. This will permanently delete the module.
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
