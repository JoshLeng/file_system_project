from backend.services.system_instance import fs
from backend.models.file import File as FileModel

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

    ###################################################
    # TAGS
    ###################################################

    tags = data.get("tags", [])

    ###################################################

    fs.create_file(
        directory,
        file_name,
        tags=tags
    )

    ###################################################

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

    ###################################################

    directories = []

    for subdirectory in directory.subdirectories:

        directories.append({

            "name": subdirectory.name,

            "path": subdirectory.path
        })

    ###################################################

    files = []

    for file in directory.files:

        files.append({

            "name": file.name,

            "size": file.size,

            "real_path": file.real_path,

            "tags": file.tags
        })

    ###################################################

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
# REAL FILE UPLOAD
#######################################################

@router.post("/upload")
async def upload_file(
    path: str,
    tags: str = "",
    uploaded_file: UploadFile = File(...)
):

    directory = fs.get_directory_by_path(path)

    if not directory:

        return {
            "error": "Directory not found"
        }

    ###################################################
    # STORAGE
    ###################################################

    storage_path = "storage/uploads"

    os.makedirs(
        storage_path,
        exist_ok=True
    )

    ###################################################
    # SAVE FILE
    ###################################################

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

    ###################################################
    # FILE SIZE
    ###################################################

    size = os.path.getsize(
        file_location
    )

    ###################################################
    # TAGS
    ###################################################

    parsed_tags = []

    if tags:

        parsed_tags = [

            tag.strip().lower()

            for tag in tags.split(",")

            if tag.strip()
        ]

    ###################################################
    # CREATE LOGICAL FILE
    ###################################################

    fs.create_file(

        directory,

        uploaded_file.filename,

        real_path=file_location,

        size=size,

        tags=parsed_tags
    )

    ###################################################

    return {
        "message": "File uploaded successfully"
    }
    #######################################################
# STATS
#######################################################

@router.get("/stats")
def get_stats():

    total_files = 0

    used_storage = 0

    ###################################################
    # RECURSIVE SCAN
    ###################################################

    def scan_directory(directory):

        nonlocal total_files
        nonlocal used_storage

        #################################################

        total_files += len(directory.files)

        #################################################

        for file in directory.files:

            used_storage += file.size or 0

        #################################################

        for subdirectory in directory.subdirectories:

            scan_directory(subdirectory)

    ###################################################

    scan_directory(fs.root)

    ###################################################

    return {

        "total_files": total_files,

        "used_storage": used_storage
    }
#######################################################
# STATS
#######################################################

@router.get("/stats")
def get_stats():

    total_files = 0

    total_directories = 0

    total_size = 0

    ###################################################

    def traverse(directory):

        nonlocal total_files
        nonlocal total_directories
        nonlocal total_size

        ################################################

        total_directories += len(
            directory.subdirectories
        )

        ################################################

        total_files += len(
            directory.files
        )

        ################################################

        for file in directory.files:

            total_size += file.size

        ################################################

        for subdirectory in directory.subdirectories:

            traverse(subdirectory)

    ###################################################

    traverse(fs.root)

    ###################################################

    size_gb = (
        total_size /
        (1024 * 1024 * 1024)
    )

    ###################################################

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