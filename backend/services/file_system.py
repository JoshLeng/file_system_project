from backend.models.directory import Directory
from backend.models.file import File
from backend.models.trash import TrashSystem
from backend.storage.storage_manager import StorageManager
from datetime import datetime
import hashlib
import base64


class FileSystem:

    def __init__(self):

        self.root = Directory("root")

        # PILA (LIFO) para recientes - los últimos en llegar son los primeros en mostrar
        self.recent_stack = []

        # límite visual
        self.max_recent = 10
        
        self.trash = TrashSystem()
        self.share_links = {}  # Diccionario (tabla hash): hash -> info del archivo
        self.load_share_links()  # Cargar links guardados

        # Intentar cargar datos guardados
        self.load()

    ####################################################

    def create_directory(
        self,
        parent_directory,
        directory_name
    ):

        new_directory = Directory(
            directory_name,
            parent_directory
        )

        parent_directory.subdirectories.append(new_directory)
        self.add_recent(directory_name, "directory_created")
        self.save()

        return new_directory

    ####################################################

    def create_file(
        self,
        directory,
        file_name,
        real_path="",
        size=0,
        tags=None, action="file_created"
    ):

        new_file = File(
            file_name,
            real_path,
            size,
            tags
        )

        directory.files.append(new_file)
        self.add_recent(file_name, action)
        self.save()
        return new_file
    
    ####################################################

    def find_directory(
        self,
        current_directory,
        directory_name
    ):

        if current_directory.name == directory_name:
            return current_directory

        for subdirectory in current_directory.subdirectories:
            result = self.find_directory(subdirectory, directory_name)
            if result:
                return result

        return None

    ####################################################

    def get_directory_by_path(self, path):

        if not path or path == "root":
            return self.root

        parts = path.strip("/").split("/")

        if parts[0] != "root":
            return None

        current = self.root

        for part in parts[1:]:
            found = None
            for subdirectory in current.subdirectories:
                if subdirectory.name == part:
                    found = subdirectory
                    break
            if not found:
                return None
            current = found

        return current

    ####################################################

    def find_file_by_name(
        self,
        current_directory,
        file_name
    ):

        for file in current_directory.files:
            if file.name == file_name:
                return file

        for subdirectory in current_directory.subdirectories:
            result = self.find_file_by_name(subdirectory, file_name)
            if result:
                return result

        return None

    ####################################################

    def search_by_tag(
        self,
        current_directory,
        tag
    ):

        results = []

        for file in current_directory.files:
            if tag in file.tags:
                results.append(file)

        for subdirectory in current_directory.subdirectories:
            results.extend(self.search_by_tag(subdirectory, tag))

        return results

    ####################################################

    def delete_file(self, directory, file_name):
        for file in directory.files:
            if file.name == file_name:
                self.trash.add(
                    file.name, 
                    "file", 
                    f"{directory.path}/{file_name}",
                    file.size  # ← Pasar tamaño
                )
                directory.files.remove(file)
                self.add_recent(file_name, "deleted")
                self.save()
                return True
        return False

    ####################################################

    def delete_directory(self, parent_directory, directory_name):
        for directory in parent_directory.subdirectories:
            if directory.name == directory_name:
                existing = any(item.name == directory_name for item in self.trash.items)
                if not existing:
                    self.trash.add(directory.name, "directory", f"{parent_directory.path}/{directory_name}")
                parent_directory.subdirectories.remove(directory)
                self.add_recent(directory_name, "deleted")
                self.save()
                return True
        return False

    ####################################################

    def rename_directory(self, parent_directory, old_name, new_name):

        for directory in parent_directory.subdirectories:
            if directory.name == old_name:
                directory.name = new_name
                self.add_recent(new_name, "renamed")
                self.save()
                return True
        return False

    ####################################################

    def rename_file(self, directory, old_name, new_name):

        for file in directory.files:
            if file.name == old_name:
                file.name = new_name
                self.add_recent(new_name, "renamed")
                self.save()
                return True
        return False
    
    ####################################################

    def add_recent(self, item_name, action):
        """PILA (LIFO) - los más recientes se agregan al final"""
        recent_item = {
            "name": item_name,
            "action": action,
            "timestamp": datetime.now().isoformat()
        }

        self.recent_stack.append(recent_item)

        # Si excede el límite, eliminar el más ANTIGUO (FIFO para mantener solo los últimos N)
        if len(self.recent_stack) > self.max_recent:
            self.recent_stack.pop(0)

    ####################################################

    def get_recent_items(self):
        """Retorna los items en orden inverso (más reciente primero)"""
        return list(reversed(self.recent_stack))
    
    ####################################################
    
    def get_recent_files_only(self):
        """Filtra solo acciones relacionadas con archivos (para la tarjeta Recientes)"""
        file_actions = ["file_created", "uploaded", "renamed"]
        recent_files = [
            item for item in self.recent_stack 
            if item["action"] in file_actions
        ]
        return list(reversed(recent_files[:5]))
    
    ####################################################
    
    def get_trash_items(self):
        return self.trash.to_dict()
    
    ####################################################
    def generate_short_hash(self, filename):
        """Genera un hash corto único de 6 caracteres"""
        import time
        unique_string = f"{filename}{time.time()}{id(self)}"
        hash_bytes = hashlib.sha256(unique_string.encode()).digest()
        short_hash = base64.b64encode(hash_bytes).decode()[:6]
        # Reemplazar caracteres que puedan causar problemas en URL
        short_hash = short_hash.replace('/', '_').replace('+', '-')
        return short_hash

    def create_share_link(self, file_name, file_path, directory_path, created_by=""):
        """Crea un enlace compartible para un archivo"""
        # Verificar si ya existe un link para este archivo
        for existing_hash, info in self.share_links.items():
            if info.get("file_path") == file_path:
                return existing_hash
        
        # Generar nuevo hash único
        hash_id = self.generate_short_hash(file_name)
        while hash_id in self.share_links:
            hash_id = self.generate_short_hash(file_name + str(len(self.share_links)))
        
        self.share_links[hash_id] = {
            "file_name": file_name,
            "file_path": file_path,
            "directory_path": directory_path,
            "created_by": created_by,
            "created_at": datetime.now().isoformat()
        }
        
        self.save_share_links()
        return hash_id

    def get_shared_file(self, hash_id):
        """Obtiene la información de un archivo compartido por hash"""
        return self.share_links.get(hash_id)

    def save_share_links(self):
        """Guardar los enlaces compartidos en archivo JSON"""
        try:
            with open("storage/share_links.json", "w", encoding="utf-8") as f:
                json.dump(self.share_links, f, indent=4, ensure_ascii=False)
        except Exception as e:
            print(f"Error guardando share_links: {e}")

    def load_share_links(self):
        """Cargar los enlaces compartidos desde archivo JSON"""
        try:
            with open("storage/share_links.json", "r", encoding="utf-8") as f:
                self.share_links = json.load(f)
        except:
            self.share_links = {}
    ##############################################
    def save(self):
        data = {
            "root": self.root.to_dict(),
            "recent": self.recent_stack,
            "trash": self.trash.to_dict()
        }
        StorageManager.save(data)
    
    ####################################################

    def load(self):
        data = StorageManager.load()
        if data:
            try:
                # Reconstruir root desde dict
                self.root = Directory.from_dict(data["root"])
                self.recent_stack = data.get("recent", [])
                # Reconstruir trash
                for item_data in data.get("trash", []):
                    self.trash.add(
                        item_data["name"],
                        item_data["item_type"],
                        item_data["original_path"]
                    )
                    for item in self.trash.items:
                        if item.name == item_data["name"]:
                            item.deleted_at = item_data["deleted_at"]
                            break
                print("Sistema cargado correctamente")
            except Exception as e:
                print(f"Error al cargar datos: {e}")