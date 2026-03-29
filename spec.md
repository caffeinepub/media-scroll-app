# Media Scroll App

## Current State
New project. Backend has an empty Motoko actor. No frontend exists yet.

## Requested Changes (Diff)

### Add
- Scrollable media feed (photos + videos) with smooth vertical scroll
- Media upload & management panel (upload, replace, delete, reorder)
- App customization settings panel (app name, theme selection)
- Inline video playback with play/pause controls
- Responsive grid/card layout for photos
- Role-based access: owner can manage, guests can only view

### Modify
- Backend actor: add media metadata storage, app settings storage

### Remove
- Nothing

## Implementation Plan

### Backend (Motoko)
- Use `authorization` component for owner vs. guest roles
- Use `blob-storage` component for actual file storage
- Store media metadata: id, title, description, mediaType (photo/video), blobId, order, createdAt
- Store app settings: appName, theme (light/dark/accent options)
- APIs: CRUD for media items, reorder media, get/set app settings

### Frontend (React/TypeScript/Tailwind)
- Public feed page: vertically scrolling grid/card layout of all media items in order
- Photos: displayed as full-width or grid cards
- Videos: inline player with play/pause, displayed as cards
- Admin panel (owner only): media management with upload, replace, delete, drag-to-reorder
- Settings panel (owner only): app name input, theme picker (light, dark, blue, purple, green accents)
- Theme applied globally via CSS variables / Tailwind classes
- Responsive: mobile-first design
