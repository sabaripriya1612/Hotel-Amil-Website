Hotel Amil — 360° panoramas
===========================

Put your 360° (equirectangular) room photo in THIS folder using exactly:

    room-360.jpg

As soon as that file exists, every room page automatically shows the
spherical 360° viewer (drag to look around incl. up/down, scroll or
pinch to zoom, arrow keys when focused). Until then, the rooms keep
using the regular photo viewer — nothing breaks.

Tips for best results
---------------------
1. Export the FULL panoramic / equirectangular image from your 360
   camera app (it must be 2:1 width:height, e.g. 4096x2048) — NOT the
   "tiny planet", flat, or re-framed export.
2. Recommended size: about 4096x2048 (max 8192x4096). Very large files
   work but load slower on mobile.
3. Save as JPEG around quality 75-85 to keep the file under ~4 MB.
4. Keep the filename "room-360.jpg" for the shared panorama. When you
   shoot a separate panorama per room, give each a distinct name
   (e.g. deluxe-360.jpg) and update the `panorama360` value for that
   room in src/lib/rooms.ts.
