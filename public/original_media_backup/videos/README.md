# Video Greetings Directory

Place video message files here (exported from WhatsApp).

## Export from WhatsApp
1. Open the video message in WhatsApp
2. Tap and hold > Share/Forward > Save to Files
3. Rename and place here

## Naming Convention
- Use lowercase with hyphens: `mom-dad.mp4`, `sarah.mp4`
- Reference in `data/dedications.json` as `video_message`

## Supported Formats
- MP4 (recommended - best compatibility)
- WebM
- MOV (may need conversion for web)

## Example JSON Entry
```json
{
    "id": 1,
    "name": "Sarah",
    "video_message": "assets/videos/sarah.mp4",
    "voice_message": null,
    ...
}
```

**Note:** If both `video_message` and `voice_message` are provided, the video takes priority.
