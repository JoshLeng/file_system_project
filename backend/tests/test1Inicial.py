#prueba de directorio y version 
from backend.models.directory import Directory
from backend.models.file import File


# Crear directorio raíz
root = Directory("root")

# Crear subdirectorio
documents = Directory("documents")

# Agregar subdirectorio al root
root.subdirectories.append(documents)

# Crear archivo
file1 = File("tarea.txt")

# Agregar versiones
file1.add_version("Contenido versión 1")
file1.add_version("Contenido versión 2")

# Agregar archivo al directorio
documents.files.append(file1)


# Mostrar estructura
print("Root:", root.name)

print("\nSubdirectorios:")
for directory in root.subdirectories:
    print("-", directory.name)

print("\nArchivos en documents:")
for file in documents.files:
    print("-", file.name)

    print("  Versiones:")
    for version in file.versions:
        print(
            f"    v{version.version_number}: "
            f"{version.content}"
        )