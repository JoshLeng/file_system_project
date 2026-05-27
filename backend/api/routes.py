from backend.services.system_instance import fs, trash

import os
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File
)

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
    
    # Obtener el item de la papelera
    item = trash.restore(name)
    
    if not item:
        return {"error": "Item not found in trash"}
    
    # Obtener el directorio padre desde original_path
    original_path = item.original_path
    if not original_path:
        return {"error": "Original path not found"}
    
    # Extraer el directorio padre (quitar el nombre del archivo/carpeta)
    path_parts = original_path.split('/')
    parent_path = '/'.join(path_parts[:-1]) if len(path_parts) > 1 else "root"
    
    parent_directory = fs.get_directory_by_path(parent_path)
    
    # Si el directorio padre no existe, usar root
    if not parent_directory:
        parent_directory = fs.root
    
    # Recrear el archivo o carpeta
    if item.item_type == "file":
        # Verificar si el archivo ya existe
        existing_file = next((f for f in parent_directory.files if f.name == item.name), None)
        if not existing_file:
            new_file = fs.create_file(parent_directory, item.name, tags=[])
            # Si había tamaño guardado, asignarlo
            if hasattr(item, 'size') and item.size:
                new_file.size = item.size
    else:
        # Verificar si la carpeta ya existe
        existing_dir = next((d for d in parent_directory.subdirectories if d.name == item.name), None)
        if not existing_dir:
            fs.create_directory(parent_directory, item.name)
    
    fs.save()
    
    return {
        "success": True,
        "message": f"Item '{name}' restored successfully",
        "item": item.to_dict()
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