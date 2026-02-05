# Live Preview: Click in preview → focus field in admin

This project supports **Pattern 2**: when you have Live Preview open, clicking an editable area in the preview focuses the matching field in the admin form (same window).

## How to use it

### 1. Set the admin origin (required)

In your `.env`:

```env
NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN=http://localhost:3000
```

Use the URL where you open the Payload admin (e.g. `http://localhost:3000` if admin and site are on the same host). Restart the dev server after changing.

### 2. Open the admin and a Landing Page document

1. Go to **http://localhost:3000/admin** (or your admin URL).
2. Log in.
3. Open **Collections → Landing Page**.
4. Open an existing document or create one (with at least one block, e.g. Hero).

### 3. Open Live Preview

In the **Edit** view for that document:

- Use the **Live Preview** control (often a toggle or a “Preview” tab / split view next to the form).
- When Live Preview is enabled, you should see the frontend page (your home page) in a panel or iframe beside or below the form.

If you don’t see Live Preview, check that `livePreview.url` is set in `payload.config.ts` for the `landing-page` collection (it is in this project).

### 4. Click in the preview to focus the field

- In the **preview** (the embedded site), click on **editable text** (e.g. hero heading, subheading, CTA, about title/description).
- The **admin form** (left/top side) should scroll to and focus the field that controls that content (e.g. “Heading”, “Subheading”).

So: **click in preview → that field is focused in the form.**

- If you click a piece of content that belongs to **another document**, the admin will navigate to that document and then focus the field (you may see a short reload).

## What you should see

- **Preview**: Your frontend with editable areas. In preview mode they may show a subtle outline on hover and “Click to focus this field in the admin” on hover.
- **Admin**: Same window; the form scrolls and the input for the clicked content gets focus.

## If it doesn’t work

1. **Origin**
   - Ensure `NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN` in `.env` is exactly the URL you use to open the admin (scheme + host + port, no path).
   - Restart dev server after changing `.env`.

2. **Live Preview URL**
   - The preview iframe must load a page that includes the `Editable` components and `?livePreview=true` (your `livePreview.url` in `payload.config.ts` already does this).

3. **Same document**
   - Click-to-focus is wired for the **Landing Page** collection and for the **first** landing page document your frontend loads (e.g. `page?.docs?.[0]` on the home page). Other collections or documents need the same pattern (Editable + fieldPath + AdminInspectorBridge on that collection).

4. **Browser console**
   - In the **preview** (right-click inside preview → Inspect → Console), check for errors when you click.
   - In the **admin** tab/window, check the console for postMessage or focus-related errors.

## Summary

| Step | Where | Action |
|------|--------|--------|
| 1 | `.env` | Set `NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN=http://localhost:3000` |
| 2 | Admin | Collections → Landing Page → open a document |
| 3 | Edit view | Turn on / open **Live Preview** (iframe with your site) |
| 4 | Preview iframe | **Click** an editable text (heading, subheading, etc.) |
| 5 | Admin form | The matching field scrolls into view and is focused |

Nothing in the admin UI “looks different” except that when Live Preview is on and you click in the preview, the form responds by focusing the right field.
