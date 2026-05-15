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
file1 = fs.create_file(
    documents,
    "tarea.txt"
)

file1.add_tag("universidad")
file1.add_tag("python")