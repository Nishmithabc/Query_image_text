from fastapi import APIRouter, UploadFile, File
from fastapi.concurrency import run_in_threadpool
from utils.index_build import build_index
from paddleocr import PaddleOCR
import uuid
import numpy as np
import cv2
import os

router = APIRouter()

# Ensure data folder exists
os.makedirs("data", exist_ok=True)

# Load OCR model once (only when server starts)
ocr_model = PaddleOCR(use_angle_cls=True, lang='en')


def extract_text_from_bytes(image_bytes: bytes) -> str:
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        result = ocr_model.ocr(img)

        if not result or not result[0]:
            return ""

        text = " ".join([line[1][0] for line in result[0]])
        return text.lower().strip()

    except Exception:
        return ""


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):

    # Read image directly (no saving to disk)
    image_bytes = await file.read()

    # Run OCR in threadpool (CPU heavy task)
    extracted_text = await run_in_threadpool(
        extract_text_from_bytes, image_bytes
    )

    if not extracted_text:
        return {"error": "No text found in image."}

    # Generate unique document ID
    doc_id = str(uuid.uuid4())

    # Build FAISS index in threadpool (heavy embedding task)
    await run_in_threadpool(build_index, extracted_text, doc_id)

    return {
        "message": "Image processed successfully.",
        "document_id": doc_id,
        "extracted_text": extracted_text[:200] + "..."
    }
