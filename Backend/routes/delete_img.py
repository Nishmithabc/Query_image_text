from fastapi import APIRouter
import os   

router = APIRouter()    
@router.delete("/delete/{doc_id}")
async def delete_document(doc_id: str):

    index_path = f"data/{doc_id}.faiss"
    chunk_path = f"data/{doc_id}.pkl"

    try:
        deleted = False

        # Delete FAISS index file
        if os.path.exists(index_path):
            os.remove(index_path)
            deleted = True

        # Delete chunk file
        if os.path.exists(chunk_path):
            os.remove(chunk_path)
            deleted = True

        if not deleted:
            return {"error": "Document not found."}

        return {"message": "Document deleted successfully."}

    except Exception as e:
        return {"error": str(e)}
