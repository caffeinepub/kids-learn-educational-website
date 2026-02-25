# Kids Learn - Educational Website

## Current State

The website has an admin panel where users can add poems and stories through forms. The current implementation includes:

**Backend:**
- Poem data structure with `imageUrl` field (string)
- Story data structure with `coverImageUrl` field (string)
- CRUD operations for poems and stories (add, update, delete, list)
- Authorization system with admin roles

**Frontend:**
- Admin forms for adding/editing poems and stories
- Image URL input fields (text input for external URLs)
- Display pages showing poems and stories with images if URL is provided

**Current limitation:**
- Users must provide external image URLs (like from other websites)
- No built-in way to upload or generate images directly

## Requested Changes (Diff)

### Add
- Blob storage component to enable image uploads from user's device
- File upload UI in poem and story admin forms
- Image generation capability using AI for poems and stories
- Preview functionality for uploaded/generated images
- Image management (view, replace, delete) in admin forms

### Modify
- Admin poem form: Add file upload button and image generation option alongside URL input
- Admin story form: Add file upload button and image generation option alongside URL input
- Image URL fields: Make them work with both external URLs and uploaded blob storage URLs
- Form validation: Accept either uploaded files, generated images, or external URLs

### Remove
- None (external URL input will remain as an option)

## Implementation Plan

1. **Add blob-storage component** to enable file uploads and storage on the Internet Computer
2. **Update backend** (via generate_motoko_code) to integrate blob storage APIs for image management
3. **Update frontend admin forms** (delegate to frontend subagent):
   - Add file upload input with drag-and-drop support
   - Add "Generate Image with AI" button that creates images from poem/story titles or descriptions
   - Add image preview section showing current/uploaded/generated image
   - Support three image input methods: upload file, generate with AI, or paste external URL
   - Wire up blob storage hooks for uploading and retrieving images
4. **Update display pages** to properly render images from blob storage URLs
5. **Validate** (typecheck, lint, build) and fix any errors

## UX Notes

- Admins will have three convenient ways to add images:
  1. **Upload**: Click to browse or drag-and-drop image files from their device
  2. **Generate**: Click a button to AI-generate an image based on the poem/story content
  3. **URL**: Paste an external image URL (existing method)
- Image preview will show immediately after upload or generation
- Generated images will be colorful and kid-friendly, matching the educational theme
- The form will remain simple and intuitive for non-technical users
