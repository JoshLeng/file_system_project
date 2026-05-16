# 📁 FLIEDRIVE - Gestor de Archivos Local (Web)

Un gestor de archivos local basado en **FastAPI** que permite crear, organizar y gestionar archivos y carpetas con soporte para versionado y búsqueda por etiquetas. **Ahora con interfaz web integrada (HTML, CSS, JavaScript)**.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Novedades - Mayo 2026](#novedades---mayo-2026)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Próximas Mejoras](#próximas-mejoras)

---

## 🎯 Características

- ✅ Crear carpetas y archivos jerárquicamente
- ✅ Listar contenido de directorios
- ✅ Versionado de archivos (historial de cambios)
- ✅ Sistema de etiquetas para búsqueda
- ✅ Búsqueda recursiva de archivos y carpetas
- ✅ API REST con FastAPI
- ✅ **Interfaz Web (Frontend integrado)** - HTML, CSS, JavaScript
- ✅ **Búsqueda Avanzada** - Filtros por nombre y etiquetas
- 🔜 Compartir archivos con links
- 🔜 Persistencia en base de datos

---

## 🆕 Novedades - Mayo 2026

### ✨ Últimos Cambios (15/05/2026)

#### Backend
- ✅ **Unificación completada:** Se han integrado todos los cambios finales antes de la unificación con Frontend
- ✅ **Sistema de etiquetas mejorado:** Funcionamiento optimizado y búsqueda por tags
- ✅ **Búsqueda avanzada:** Implementada con filtros dinámicos
- ✅ **Endpoints API finalizados:** Todos los endpoints REST están funcionales y documentados

#### Frontend  
- ✅ **Interfaz web completa:** Interfaz HTML, CSS y JavaScript integrada
- ✅ **Comunicación con API:** Integración exitosa entre Frontend y Backend
- ✅ **Búsqueda avanzada en UI:** Interfaz visual para búsqueda y filtrado
- ✅ **Gestión visual de archivos:** Visualización y manipulación de estructura de directorios
- ✅ **Sistema de etiquetas visual:** Interfaz para agregar y filtrar etiquetas

#### Composición del Proyecto
- 🎨 CSS: 37.5%
- 🐍 Python: 36%
- 📄 HTML: 20.9%
- ✨ JavaScript: 5.6%

---

## 🏗️ Arquitectura

El proyecto sigue un patrón de **arquitectura en capas**:

```
┌──────────────────────────────────────┐
│    HTTP Client / Frontend (Web)      │
│  (HTML, CSS, JavaScript)             │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼──────────────────────┐
│   FastAPI Router (API Endpoints)      │
│      backend/api/routes.py            │
└────────────────┬──────────────────────┘
                 │
┌────────────────▼──────────────────────┐
│   FileSystem Service (Lógica)         │
│   backend/services/file_system.py     │
└────────────────┬──────────────────────┘
                 │
┌────────────────▼──────────────────────┐
│  Data Models (Estructura de datos)    │
│  backend/models/{directory,file}      │
└──────────────────────────────────────┘
```

---

## 📦 Instalación

### Requisitos Previos
- Python 3.8+
- pip

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/JoshLeng/file_system_project.git
cd file_system_project

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Iniciar el servidor FastAPI
uvicorn backend.main:app --reload

# 4. Acceder a la interfaz web
# Abrir en navegador: http://localhost:8000
```

---

## 💻 Uso

### Iniciar el servidor

```bash
uvicorn backend.main:app --reload
```

El servidor estará disponible en `http://localhost:8000`

### Interfaz Web

Una vez que el servidor está corriendo, accede a:
- **Frontend:** http://localhost:8000/ (Interfaz visual completa)
- **API Docs:** http://localhost:8000/docs (Documentación interactiva)
- **OpenAPI Schema:** http://localhost:8000/openapi.json

### Probar endpoints mediante CLI

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

#### 6. Buscar por etiquetas
```bash
curl http://localhost:8000/search?tag=importante&path=/root
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
├── frontend/
│   ├── index.html                 # Interfaz principal
│   ├── styles.css                 # Estilos de la UI
│   ├── script.js                  # Lógica del Frontend
│   └── assets/                    # Recursos estáticos
├── README.md                      # Este archivo
└── requirements.txt               # Dependencias Python
```

---

## 🔌 API Endpoints

### 1. **GET `/` - Health Check**
Verifica que el servidor esté funcionando y sirve la interfaz web.

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

### 6. **GET `/search?tag=...&path=...` - Búsqueda Avanzada**
Busca archivos por etiquetas en una ruta específica.

**Query Parameters:**
- `tag` (required): Etiqueta a buscar
- `path` (optional): Ruta donde buscar (por defecto `/root`)

**Respuesta:**
```json
["archivo1.txt", "archivo2.txt"]
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
- `get_versions()`: Obtiene el historial de versiones

**Propósito:** Representa un archivo lógico con capacidad de versionado y búsqueda por etiquetas.

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

## 📊 Flujo de Datos

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

## ✅ Estado del Proyecto

### ✅ Completado
- ✅ Estructura base del backend (Python + FastAPI)
- ✅ Modelos de datos (Directory, File, Version)
- ✅ Lógica principal del FileSystem
- ✅ Endpoints API REST básicos y avanzados
- ✅ Sistema de búsqueda recursiva
- ✅ Sistema de etiquetas funcional
- ✅ Versionado de archivos
- ✅ **Interfaz Frontend (HTML, CSS, JavaScript)**
- ✅ **Integración Frontend-Backend**
- ✅ **Búsqueda Avanzada en UI**

### 🔄 En Progreso
- Optimización de rendimiento
- Validación de entrada mejorada
- Tests unitarios

### 🔜 Próximas Mejoras
- **Persistencia en BD:** SQLite, PostgreSQL o MongoDB
- **Autenticación:** Sistema de usuarios y permisos
- **Compartición:** Generar y gestionar links de compartición
- **Operaciones en lote:** Mover/copiar/eliminar múltiples archivos
- **Sincronización en tiempo real:** WebSockets para actualizaciones en vivo
- **Exportación de datos:** Descarga de archivos y directorios
- **Temas personalizables:** Modo oscuro/claro en el frontend

---

## 🔧 Ejemplo de Uso Completo

### Con Python

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
new_file.add_tag("2026")

# 6. Buscar por etiqueta
resultados = fs.search_by_tag(fs.root, "importante")
# Retorna: [new_file]
```

### Con la Interfaz Web

1. Abre `http://localhost:8000` en tu navegador
2. Usa la interfaz visual para:
   - Crear nuevas carpetas y archivos
   - Navegar por la estructura de directorios
   - Agregar etiquetas a archivos
   - Buscar archivos por nombre o etiqueta
   - Ver el historial de versiones

---

## 📝 Licencia

Este proyecto está bajo licencia de **FLIE DRIVE™**

---

## 👥 Autores

- **Kevin Xulú** - Desarrollo Backend
- **Josué Godínez** - Desarrollo Backend
- **JoshLeng** ([@JoshLeng](https://github.com/JoshLeng)) - Coordinación y Frontend

---

## 📅 Historial de Cambios

| Fecha | Versión | Cambio |
|-------|---------|--------|
| 2026-05-15 | 2.0 | ✨ Unificación completada: Frontend integrado con Backend |
| 2026-05-09 | 1.5 | 🎨 Mejora de estructura y documentación |
| 2026-05-08 | 1.0 | 🚀 Lanzamiento inicial con API REST |

---

**Última actualización:** 2026-05-16

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores, abre un issue primero para discutir los cambios propuestos.

---

## ❓ Soporte

Si encuentras problemas o tienes preguntas, abre un [issue en GitHub](https://github.com/JoshLeng/file_system_project/issues).
