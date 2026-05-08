from backend.services.file_system import FileSystem


fs = FileSystem()  
documents = fs.create_directory(
    fs.root,
    "documents"
)

images = fs.create_directory(
    fs.root,
    "images"
)