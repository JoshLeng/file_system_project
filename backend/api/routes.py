from fastapi import APIRouter

from backend.services.system_instance import fs


router = APIRouter()


@router.get("/directories")
def get_directories():

    directories = []

    for directory in fs.root.subdirectories:
        directories.append(directory.name)

    return directories
####################
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

    fs.create_directory(
        parent_directory,
        directory_name
    )

    return {
        "message": "Directory created successfully"
    }
###############################
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

    fs.create_file(directory, file_name)

    return {
        "message": "File created successfully"
    }
############
@router.get("/files")
def get_files(path: str):

    directory = fs.get_directory_by_path(path)

    if not directory:
        return {
            "error": "Directory not found"
        }

    files = []

    for file in directory.files:
        files.append(file.name)

    return files