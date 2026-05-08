from backend.services.file_system import FileSystem


fs = FileSystem()

# Crear carpetas
documents = fs.create_directory(fs.root, "documents")
images = fs.create_directory(fs.root, "images")

# Crear archivo
file1 = fs.create_file(documents, "tarea.txt")

# Agregar versiones
file1.add_version("Primera versión")
file1.add_version("Segunda versión")


# Mostrar estructura
print("DIRECTORIOS ROOT:")

for directory in fs.root.subdirectories:
    print("-", directory.name)

print("\nARCHIVOS EN DOCUMENTS:")

for file in documents.files:
    print("-", file.name)

    for version in file.versions:
        print(
            f"   v{version.version_number}: "
            f"{version.content}"
        )
found = fs.find_directory(fs.root, "documents")

if found:
    print("\nDIRECTORIO ENCONTRADO:")
    print(found.name)