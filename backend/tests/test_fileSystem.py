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
university = fs.create_directory(
    documents,
    "university"
)
path_result = fs.get_directory_by_path(
    "/root/documents/university"
)

if path_result:
    print("\nRUTA ENCONTRADA:")
    print(path_result.name)
    
found_file = fs.find_file_by_name(
    fs.root,
    "tarea.txt"
)

if found_file:
    print("\nARCHIVO ENCONTRADO:")
    print(found_file.name)
    
file1.add_tag("universidad")
file1.add_tag("proyecto")

results = fs.search_by_tag(
    fs.root,
    "universidad"
)

print("\nRESULTADOS TAG:")

for file in results:
    print("-", file.name)