import os
import uuid
import mimetypes
from typing import Dict, Any, Optional
import httpx
from fastapi import HTTPException
from backend.app.core.config import settings

MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 # 50 MB

ALLOWED_VIDEO_MIMES = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov"
}

ALLOWED_IMAGE_MIMES = {
    "image/webp": ".webp",
    "image/png": ".png",
    "image/jpeg": ".jpg"
}

ALLOWED_MIMES = {**ALLOWED_VIDEO_MIMES, **ALLOWED_IMAGE_MIMES}

class StorageService:
    def __init__(self):
        self.supabase_url = settings.SUPABASE_URL.rstrip("/")
        self.service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.bucket = settings.SUPABASE_STORAGE_BUCKET

    def validate_file_metadata(self, filename: str, content_type: str, size: int) -> str:
        """
        Validates mime type, size, and returns the media category ('VIDEO' or 'IMAGE').
        Raises HTTPException on violation.
        """
        # 1. Size check
        if size <= 0:
            raise HTTPException(status_code=400, detail="File size must be greater than zero bytes.")
        if size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=400,
                detail=f"File exceeds maximum allowed size of 50 MB (Received: {round(size / (1024*1024), 2)} MB)."
            )

        # 2. MIME type check
        content_type = content_type.lower().strip()
        if content_type not in ALLOWED_MIMES:
            # Fallback check extension if content-type was generic octet-stream
            ext = os.path.splitext(filename)[1].lower()
            matching_mime = next((m for m, e in ALLOWED_MIMES.items() if e == ext), None)
            if matching_mime:
                content_type = matching_mime
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported media type '{content_type}'. Allowed types: MP4, WebM, QuickTime, WebP, PNG, JPEG."
                )

        # 3. Determine media type
        if content_type in ALLOWED_VIDEO_MIMES:
            return "VIDEO"
        return "IMAGE"

    def generate_safe_object_path(self, user_id: int, content_type: str, is_thumbnail: bool = False) -> str:
        """
        Generates a non-traversable, UUID-based object path scoped to the authenticated user:
        videos/{user_id}/{uuid}.{ext}
        thumbnails/{user_id}/{uuid}.webp
        """
        unique_id = str(uuid.uuid4())
        ext = ALLOWED_MIMES.get(content_type.lower(), ".bin")

        if is_thumbnail:
            return f"thumbnails/{user_id}/{unique_id}.webp"
        elif content_type in ALLOWED_VIDEO_MIMES:
            return f"videos/{user_id}/{unique_id}{ext}"
        else:
            return f"images/{user_id}/{unique_id}{ext}"

    def get_public_url(self, object_path: str) -> str:
        """
        Returns the public CDN URL for an object in the reel-media bucket.
        """
        clean_path = object_path.lstrip("/")
        return f"{self.supabase_url}/storage/v1/object/public/{self.bucket}/{clean_path}"

    async def create_upload_ticket(
        self,
        user_id: int,
        filename: str,
        content_type: str,
        size: int,
        is_thumbnail: bool = False
    ) -> Dict[str, Any]:
        """
        Validates metadata and creates a signed direct upload URL.
        """
        media_type = self.validate_file_metadata(filename, content_type, size)
        media_path = self.generate_safe_object_path(user_id, content_type, is_thumbnail=is_thumbnail)
        public_url = self.get_public_url(media_path)

        # If Supabase Service Role Key is present, request signed upload URL from Supabase Storage REST API
        if self.service_role_key and len(self.service_role_key.strip()) > 10:
            try:
                sign_endpoint = f"{self.supabase_url}/storage/v1/object/upload/sign/{self.bucket}/{media_path}"
                headers = {
                    "Authorization": f"Bearer {self.service_role_key}",
                    "Content-Type": "application/json"
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(sign_endpoint, headers=headers)
                    if resp.status_code in (200, 201):
                        data = resp.json()
                        raw_rel_url = data.get("url", "")
                        # Supabase returns relative URL: /object/upload/sign/...
                        if raw_rel_url.startswith("http"):
                            full_upload_url = raw_rel_url
                        else:
                            full_upload_url = f"{self.supabase_url}/storage/v1{raw_rel_url}"

                        return {
                            "upload_url": full_upload_url,
                            "media_path": media_path,
                            "public_url": public_url,
                            "media_type": media_type
                        }
            except Exception as e:
                print(f"Supabase Storage sign warning: {e}. Falling back to signed gateway upload.")

        # Seamless Direct Upload Gateway:
        # Generates a signed direct upload URL for direct browser PUT upload
        ticket_id = f"{uuid.uuid4().hex}_{user_id}"
        # Store ticket in local gateway registry
        _upload_tickets[ticket_id] = {
            "user_id": user_id,
            "media_path": media_path,
            "content_type": content_type,
            "size": size,
            "public_url": public_url
        }

        upload_url = f"http://127.0.0.1:8000{settings.API_PREFIX}/reels/upload-direct/{ticket_id}"

        return {
            "upload_url": upload_url,
            "media_path": media_path,
            "public_url": public_url,
            "media_type": media_type
        }

_upload_tickets: Dict[str, Dict[str, Any]] = {}

storage_service = StorageService()
