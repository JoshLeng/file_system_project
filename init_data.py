"""
Script de inicialización de datos de ejemplo.
Ejecutar SOLO UNA VEZ manualmente con:
python init_data.py
"""

from backend.services.system_instance import fs

def init_data():
    """Crea directorios y archivos de ejemplo si no existen"""
    
    # Crear directorios si no existen
    if not any(d.name == "documents" for d in fs.root.subdirectories):
        documents = fs.create_directory(fs.root, "documents")
        print("✅ Directorio 'documents' creado")
    else:
        documents = next(d for d in fs.root.subdirectories if d.name == "documents")
        print("📁 Directorio 'documents' ya existe")
    
    if not any(d.name == "images" for d in fs.root.subdirectories):
        images = fs.create_directory(fs.root, "images")
        print("✅ Directorio 'images' creado")
    else:
        images = next(d for d in fs.root.subdirectories if d.name == "images")
        print("📁 Directorio 'images' ya existe")
    
    # Crear archivo de ejemplo si no existe
    if not any(f.name == "tarea.txt" for f in documents.files):
        file1 = fs.create_file(documents, "tarea.txt")
        file1.add_tag("universidad")
        file1.add_tag("python")
        print("✅ Archivo 'tarea.txt' creado con tags")
    else:
        file1 = next(f for f in documents.files if f.name == "tarea.txt")
        print("📄 Archivo 'tarea.txt' ya existe")
    
    # Guardar cambios
    fs.save()
    print("\n🎉 Datos iniciales guardados correctamente")

if __name__ == "__main__":
    init_data()