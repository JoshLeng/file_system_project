from backend.services.system_instance import fs, trash


import os
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File
)
from fastapi.responses import FileResponse

router = APIRouter()

#######################################################
# DIRECTORIES
#######################################################

@router.get("/directories")
def get_directories():

    directories = []

    for directory in fs.root.subdirectories:

        directories.append(directory.name)

    return directories

#######################################################

@router.post("/directory")
def create_directory(data: dict):

    parent_path = data["parent"]

    directory_name = data["name"]

    parent_directory = fs.get_directory_by_path(
        parent_path
    )

    if not parent_directory:

        return {
            "error": "Parent directory not found"
        }

    new_directory = fs.create_directory(
        parent_directory,
        directory_name
    )

    return {
        "message": "Directory created successfully",
        "directory": new_directory.to_dict()
    }

#######################################################
# FILES
#######################################################

@router.post("/file")
def create_file(data: dict):

    directory_path = data["directory"]

    file_name = data["name"]

    directory = fs.get_directory_by_path(
        directory_path
    )

    if not directory:

        return {
            "error": "Directory not found"
        }

    tags = data.get("tags", [])

    fs.create_file(
        directory,
        file_name,
        tags=tags
    )

    return {
        "message": "File created successfully"
    }

#######################################################

@router.get("/files")
def get_files(path: str):

    directory = fs.get_directory_by_path(path)

    if not directory:

        return {
            "error": "Directory not found"
        }

    files = []

    for file in directory.files:

        files.append(file.to_dict())

    return files

#######################################################
# SEARCH
#######################################################

@router.get("/search/file")
def search_file(name: str):

    file = fs.find_file_by_name(
        fs.root,
        name
    )

    if not file:

        return {
            "error": "File not found"
        }

    return {
        "file": file.to_dict()
    }

#######################################################

@router.get("/search/tag")
def search_tag(tag: str):

    results = fs.search_by_tag(
        fs.root,
        tag
    )

    response = []

    for file in results:

        response.append(
            file.to_dict()
        )

    return response

#######################################################
# TREE
#######################################################

@router.get("/tree")
def get_tree():

    return fs.root.to_dict()

#######################################################
# DIRECTORY CONTENT
#######################################################

@router.get("/directory/content")
def get_directory_content(path: str):

    directory = fs.get_directory_by_path(path)

    if not directory:

        return {
            "error": "Directory not found"
        }

    directories = []

    for subdirectory in directory.subdirectories:

        directories.append({

            "name": subdirectory.name,

            "path": subdirectory.path,

            "created_at": subdirectory.created_at,

            "updated_at": subdirectory.updated_at,

            "size": subdirectory.get_total_size()
        })

    files = []

    for file in directory.files:

        files.append({

            "name": file.name,

            "size": file.size,

            "real_path": file.real_path,

            "tags": file.tags,

            "uploaded_at": file.uploaded_at
        })

    return {

        "directories": directories,

        "files": files
    }

#######################################################
# DELETE FILE
#######################################################

@router.delete("/file")
def delete_file(path: str, name: str):

    directory = fs.get_directory_by_path(path)

    if not directory:

        return {
            "error": "Directory not found"
        }

    deleted = fs.delete_file(
        directory,
        name
    )

    return {
        "success": deleted
    }

#######################################################
# DELETE DIRECTORY
#######################################################

@router.delete("/directory")
def delete_directory(
    path: str,
    name: str
):

    parent_directory = fs.get_directory_by_path(path)

    if not parent_directory:

        return {
            "error":
                "Parent directory not found"
        }

    deleted = fs.delete_directory(
        parent_directory,
        name
    )

    return {
        "success": deleted
    }

#######################################################
# RENAME DIRECTORY
#######################################################

@router.put("/directory/rename")
def rename_directory(data: dict):

    path = data["path"]

    old_name = data["old_name"]

    new_name = data["new_name"]

    parent_directory = fs.get_directory_by_path(
        path
    )

    if not parent_directory:

        return {
            "error":
                "Parent directory not found"
        }

    renamed = fs.rename_directory(
        parent_directory,
        old_name,
        new_name
    )

    return {
        "success": renamed
    }

#######################################################
# RENAME FILE
#######################################################

@router.put("/file/rename")
def rename_file(data: dict):

    path = data["path"]

    old_name = data["old_name"]

    new_name = data["new_name"]

    directory = fs.get_directory_by_path(
        path
    )

    if not directory:

        return {
            "error":
                "Directory not found"
        }

    renamed = fs.rename_file(
        directory,
        old_name,
        new_name
    )

    return {
        "success": renamed
    }

#######################################################
# UPDATE FILE TAGS
#######################################################

@router.put("/file/tags")
def update_file_tags(data: dict):

    path = data["path"]

    file_name = data["file_name"]

    tags = data.get("tags", [])

    directory = fs.get_directory_by_path(path)

    if not directory:

        return {
            "error": "Directory not found"
        }

    for file in directory.files:

        if file.name == file_name:

            file.set_tags(tags)

            fs.save()

            return {
                "success": True,
                "message": "Tags updated successfully"
            }

    return {
        "error": "File not found"
    }

#######################################################
# REAL FILE UPLOAD
#######################################################

@router.post("/upload")
def upload_file(
    path: str,
    tags: str = "",
    uploaded_file: UploadFile = File(...)
):

    directory = fs.get_directory_by_path(path)

    if not directory:

        return {
            "error": "Directory not found"
        }

    storage_path = "storage/uploads"

    os.makedirs(
        storage_path,
        exist_ok=True
    )

    file_location = os.path.join(
        storage_path,
        uploaded_file.filename
    )

    with open(
        file_location,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            uploaded_file.file,
            buffer
        )

    size = os.path.getsize(
        file_location
    )

    parsed_tags = []

    if tags:

        parsed_tags = [

            tag.strip().lower()

            for tag in tags.split(",")

            if tag.strip()
        ]

    fs.create_file(

        directory,

        uploaded_file.filename,

        real_path=file_location,

        size=size,

        tags=parsed_tags,
        action="uploaded"
    )


    return {
        "message": "File uploaded successfully"
    }

#######################################################
# STATS
#######################################################

@router.get("/stats")
def get_stats():

    total_files = 0

    total_directories = 0

    total_size = 0

    def traverse(directory):

        nonlocal total_files
        nonlocal total_directories
        nonlocal total_size

        total_directories += len(
            directory.subdirectories
        )

        total_files += len(
            directory.files
        )

        for file in directory.files:

            total_size += file.size or 0

        for subdirectory in directory.subdirectories:

            traverse(subdirectory)

    traverse(fs.root)

    size_gb = (
        total_size /
        (1024 * 1024 * 1024)
    )

    return {

        "total_files":
            total_files,

        "total_directories":
            total_directories,

        "shared_files":
            0,

        "used_gb":
            round(size_gb, 4),

        "max_gb":
            10
    }

#######################################################
# TRASH
#######################################################

@router.get("/trash")
def get_trash():

    items = trash.get_all()

    return {
        "items": [
            item.to_dict()
            for item in items
        ],
        "count": len(items)
    }

#######################################################

@router.put("/trash/restore")
def restore_from_trash(data: dict):
    name = data["name"]
    
    item = trash.restore(name)
    
    if not item:
        return {"error": "Item not found in trash"}
    
    original_path = item.original_path
    if not original_path:
        return {"error": "Original path not found"}
    
    path_parts = original_path.split('/')
    parent_path = '/'.join(path_parts[:-1]) if len(path_parts) > 1 else "root"
    
    parent_directory = fs.get_directory_by_path(parent_path)
    
    if not parent_directory:
        parent_directory = fs.root
    
    if item.item_type == "file":
        existing_file = next((f for f in parent_directory.files if f.name == item.name), None)
        if not existing_file:
            fs.create_file(parent_directory, item.name, tags=[])
    else:
        existing_dir = next((d for d in parent_directory.subdirectories if d.name == item.name), None)
        if not existing_dir:
            fs.create_directory(parent_directory, item.name)
    
    fs.save()
    
    # Agregar a recientes
    fs.add_recent(item.name, "restored")
    fs.save()
    
    return {
        "success": True,
        "message": f"Item '{name}' restored successfully",
        "item": item.to_dict(),
        "restored_path": parent_path
    }
#######################################################

@router.delete("/trash/permanent")
def delete_permanent(name: str):

    deleted = trash.delete_permanent(name)

    if deleted:

        return {
            "success": True,
            "message": f"Item '{name}' permanently deleted"
        }

    return {
        "error": "Item not found in trash"
    }

#######################################################
# RECENT ITEMS
#######################################################

@router.get("/recent")
def get_recent_items():

    return fs.get_recent_items()

#######################################################
# RECENT FILES ONLY (para tarjeta recientes)
#######################################################

@router.get("/recent/files")
def get_recent_files():

    recent_files = fs.get_recent_files_only()

    return {
        "recent_files": recent_files,
        "count": len(recent_files)
    }

#######################################################
# TRASH DETAIL (para vista de papelera)
#######################################################

@router.get("/trash/detail")
def get_trash_detail():

    items = trash.get_all()

    return {
        "items": [item.to_dict() for item in items],
        "count": len(items)
    }
#######################################################
# LOGIN
#######################################################

import json
from datetime import datetime

# Cargar usuarios desde archivo JSON
def load_users():
    try:
        with open("storage/users.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return {"admin": "admin123"}

@router.post("/login")
def login(data: dict):
    username = data.get("username")
    password = data.get("password")
    
    users = load_users()
    
    if username in users and users[username] == password:
        return {
            "success": True,
            "user": username,
            "isAdmin": username == "admin"
        }
    
    return {"success": False, "error": "Credenciales inválidas"}

#######################################################
# ACTIVITY LOG
#######################################################

LOG_FILE = "storage/activity_log.json"

def save_log(log_entry):
    try:
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            logs = json.load(f)
    except:
        logs = []
    
    logs.append(log_entry)
    
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(logs, f, indent=4, ensure_ascii=False)

@router.post("/log-activity")
def log_activity(data: dict):
    """Registrar una actividad de usuario"""
    log_entry = {
        "user": data.get("user", "desconocido"),
        "action": data.get("action"),
        "item": data.get("item"),
        "timestamp": datetime.now().isoformat()
    }
    save_log(log_entry)
    return {"success": True}

@router.get("/admin/logs")
def get_logs():
    """Obtener todos los logs (solo admin debería acceder)"""
    try:
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            logs = json.load(f)
        return logs
    except:
        return []

@router.delete("/admin/clear-logs")
def clear_logs():
    """Limpiar todos los logs"""
    try:
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)
        return {"success": True}
    except:
        return {"success": False, "error": "Error al limpiar logs"}
#######################################################
# DOWNLOAD FILE
#######################################################

@router.get("/download/{filename}")
def download_file(filename: str):
    """Descargar un archivo por su nombre"""
    file_path = f"storage/uploads/{filename}"
    
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )
    
#######################################################
# SHARE FILE (HASH)
#######################################################

@router.post("/create-share-link")
def create_share_link(data: dict):
    file_name = data.get("file_name")
    user = data.get("user", "desconocido")
    
    # Buscar el archivo y su ruta de directorio
    file_found = None
    file_path = None
    directory_path = None
    
    def search_file(directory, current_path="root"):
        nonlocal file_found, file_path, directory_path
        for file in directory.files:
            if file.name == file_name:
                file_found = file
                file_path = file.real_path
                directory_path = current_path
                return True
        for subdir in directory.subdirectories:
            new_path = f"{current_path}/{subdir.name}"
            if search_file(subdir, new_path):
                return True
        return False
    
    search_file(fs.root)
    
    if not file_found:
        return {"error": "Archivo no encontrado"}
    
    hash_id = fs.create_share_link(file_name, file_path, directory_path, user)
    
    return {
        "success": True,
        "hash": hash_id,
        "link": f"/share/{hash_id}",
        "file_name": file_name
    }
@router.get("/share/{hash_id}")
def get_shared_file(hash_id: str):
    """Redirige al directorio donde está el archivo compartido"""
    from fastapi.responses import RedirectResponse
    
    file_info = fs.get_shared_file(hash_id)
    
    if not file_info:
        return {"error": "Enlace inválido o archivo no encontrado"}
    
    file_name = file_info.get("file_name")
    
    # Buscar la ruta del directorio donde está el archivo
    directory_path = None
    
    def search_directory(directory, current_path="root"):
        nonlocal directory_path
        for file in directory.files:
            if file.name == file_name:
                directory_path = current_path
                return True
        for subdir in directory.subdirectories:
            new_path = f"{current_path}/{subdir.name}"
            if search_directory(subdir, new_path):
                return True
        return False
    
    search_directory(fs.root)
    
    if not directory_path:
        return {"error": "No se encontró la ubicación del archivo"}
    
    # Redirigir al frontend con la ruta y el nombre del archivo
    redirect_url = f"/frontend/index.html?path={directory_path}&highlight={file_name}"
    
    return RedirectResponse(url=redirect_url)
@router.post("/add-recent")
def add_recent(data: dict):
    name = data.get("name")
    action = data.get("action")
    fs.add_recent(name, action)
    fs.save()
    return {"success": True}

@router.get("/share-links")
def get_all_share_links():
    """Obtener todos los enlaces compartidos (solo admin)"""
    return {"links": fs.share_links}