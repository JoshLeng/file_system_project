# 📁 FLIEDRIVE - Gestor de Archivos Local (Web)

Un gestor de archivos local basado en **FastAPI** que permite crear, organizar y gestionar archivos y carpetas con soporte para versionado y búsqueda por etiquetas.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#crquitectura)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Próximas Mejoras](#próximas-mejoras)

---

## ✨ Características

- ✅ Crear carpetas y archivos jerárquicamente
- ✅ Listar contenido de directorios
- ✅ Versionado de archivos (historial de cambios)
- ✅ Sistema de etiquetas para búsqueda
- ✅ Búsqueda recursiva de archivos y carpetas
- ✅ API REST con FastAPI
- 🔜 Compartir archivos con links
- 🔜 Persistencia en base de datos

---

## 🏗️ Arquitectura

El proyecto sigue un patrón de **arquitectura en capas**:

```
┌─────────────────────────────────────┐
│       HTTP Client / Frontend        │
└────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│   FastAPI Router (API Endpoints)     │
│      backend/api/routes.py           │
└─────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│   FileSystem Service (Lógica)        │
│   backend/services/file_system.py    │
└─────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│   Data Models (Estructura de datos)  │
│   backend/models/{directory,file}    │
└─────────────────────────────────────┘
```

---


## �� Uso

### Iniciar el servidor

```bash
uvicorn backend.main:app --reload
```

### Probar endpoints

#### 1. Health Check
```bash
curl http://localhost:8000/
```
**Respuesta:**
```json
{"message": "Servidor funcionando"}
```

#### 2. Listar directorios raíz
```bash
curl http://localhost:8000/directories
```
**Respuesta:**
```json
["documents", "images"]
```

#### 3. Crear una carpeta
```bash
curl -X POST http://localhost:8000/directory \
  -H "Content-Type: application/json" \
  -d '{"parent": "/root", "name": "proyecto"}'
```

#### 4. Crear un archivo
```bash
curl -X POST http://localhost:8000/file \
  -H "Content-Type: application/json" \
  -d '{"directory": "/root/documents", "name": "readme.txt"}'
```

#### 5. Listar archivos en un directorio
```bash
curl http://localhost:8000/files?path=/root/documents
```

---

## 📁 Estructura del Proyecto

```
file_system_project/
├── backend/
│   ├── __init__.py
│   ├── main.py                    # Punto de entrada FastAPI
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py              # Definición de endpoints
│   ├── models/
│   │   ├── __init__.py
│   │   ├── directory.py           # Modelo Directory
│   │   ├── file.py                # Modelo File
│   │   └── version.py             # Modelo Version
│   └── services/
│       ├── __init__.py
│       ├── file_system.py         # Lógica principal
│       └── system_instance.py     # Instancia global
├── README.md                      # Este archivo
└── requirements.txt               # Dependencias
```

---

## 🔌 API Endpoints

### 1. **GET `/` - Health Check**
Verifica que el servidor esté funcionando.

**Respuesta:**
```json
{"message": "Servidor funcionando"}
```

---

### 2. **GET `/directories` - Listar Directorios Raíz**
Obtiene todos los directorios en la raíz del sistema.

**Respuesta:**
```json
["documents", "images"]
```

---

### 3. **POST `/directory` - Crear Directorio**
Crea un nuevo directorio dentro de un directorio padre.

**Body:**
```json
{
  "parent": "/root",
  "name": "nuevo_proyecto"
}
```

**Respuesta (éxito):**
```json
{"message": "Directory created successfully"}
```

**Respuesta (error):**
```json
{"error": "Parent directory not found"}
```

---

### 4. **POST `/file` - Crear Archivo**
Crea un nuevo archivo dentro de un directorio.

**Body:**
```json
{
  "directory": "/root/documents",
  "name": "documento.txt"
}
```

**Respuesta (éxito):**
```json
{"message": "File created successfully"}
```

**Respuesta (error):**
```json
{"error": "Directory not found"}
```

---

### 5. **GET `/files?path=...` - Listar Archivos**
Obtiene todos los archivos dentro de un directorio específico.

**Query Parameters:**
- `path` (required): Ruta del directorio (ej: `/root/documents`)

**Respuesta:**
```json
["documento.txt", "imagen.jpg", "video.mp4"]
```

---

## 📊 Modelos de Datos

### **Directory (Directorio)**

```python
class Directory:
    name: str                    # Nombre del directorio
    subdirectories: List[Directory]  # Directorios anidados
    files: List[File]           # Archivos contenidos
```

**Propósito:** Representa la estructura jerárquica del sistema de archivos usando un **árbol n-ario**.

---

### **File (Archivo)**

```python
class File:
    name: str                   # Nombre del archivo
    tags: List[str]            # Etiquetas para búsqueda
    versions: List[Version]    # Historial de versiones
    shared_link: str | None    # Link de compartición (futuro)
```

**Métodos:**
- `add_version(content)`: Agrega una nueva versión
- `add_tag(tag)`: Agrega una etiqueta

**Propósito:** Representa un archivo lógico con capacidad de versionado.

---

### **Version (Versión)**

```python
class Version:
    version_number: int    # Número secuencial (1, 2, 3...)
    content: str          # Contenido del archivo
    timestamp: datetime   # Marca de tiempo de creación
```

**Propósito:** Almacena cada versión de un archivo con su contenido y timestamp.

---

## 🔄 Flujo de Datos

### Crear un Archivo

```
Cliente                    API                FileSystem              Models
  │                        │                      │                    │
  ├─ POST /file ──────────>│                      │                    │
  │                        │                      │                    │
  │                        ├─ get_directory ─────>│                    │
  │                        │                      │ (busca por ruta)   │
  │                        │<─ Directory ────────|                    │
  │                        │                      │                    │
  │                        ├─ create_file ──────>│                    │
  │                        │                      ├──> File()         │
  │                        │                      │    (nuevo)        │
  │                        │                      │                    │
  │<─ {"message": "..."} ──┤                      │                    │
```

---

---

## 🎯 Estado Actual

### ✅ Completado
- Estructura base del backend
- Modelos de datos (Directory, File, Version)
- Lógica principal del FileSystem
- Endpoints API básicos
- Sistema de búsqueda recursiva
- Sistema de etiquetas
- Versionado de archivos

### 🔄 En Progreso
-SISTEMA DE ETIQUETAS
- BUSQUEDA AVANZADA
- UNIFICACIÓN CON FRONTEND

### 🔜 Próximas Mejoras
- **Persistencia en BD:** Guardar en SQLite, PostgreSQL o MongoDB
- **Autenticación:** Sistema de usuarios y permisos
- **Compartición:** Generar y gestionar links de compartición
- **Interfaz Frontend:** Web HTML, CSS, JS.
- **Búsqueda avanzada:** Filtros por nombre, etiquetas
- **Operaciones en lote:** Mover/copiar/eliminar múltiples archivos


---

## 💡 Ejemplo de Uso Completo

```python
# 1. El sistema se inicializa automáticamente
from backend.services.system_instance import fs

# Estructura inicial:
# root/
#  ├── documents
#  └── images

# 2. Buscar un directorio
docs_dir = fs.get_directory_by_path("/root/documents")

# 3. Crear un archivo
new_file = fs.create_file(docs_dir, "reporte.txt")

# 4. Agregar versiones
new_file.add_version("Contenido inicial")
new_file.add_version("Contenido actualizado")

# 5. Agregar etiquetas
new_file.add_tag("importante")
new_file.add_tag("2024")

# 6. Buscar por etiqueta
resultados = fs.search_by_tag(fs.root, "importante")
# Retorna: [new_file]
```

---


Este proyecto está bajo licencia de FLIE DRIVE^tm

---

## 👤 Autores
-kevin Xulú
-Josue Godínez

**JoshLeng** - [@JoshLeng](https://github.com/JoshLeng)

---

**Última actualización:** 2026-05-09
