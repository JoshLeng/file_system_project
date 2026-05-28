from datetime import datetime, timedelta


class TrashItem:

    def __init__(
        self,
        name,
        item_type,
        original_path="",
        size=0,
        deleted_at=None
    ):

        self.name = name
        self.item_type = item_type
        self.original_path = original_path
        self.size = size
        self.deleted_at = deleted_at or datetime.now().isoformat()

    def is_expired(self, days=30):
        """Verifica si el item lleva más de 'days' días en la papelera"""
        try:
            deleted_time = datetime.fromisoformat(self.deleted_at)
            expiration_time = deleted_time + timedelta(days=days)
            return datetime.now() > expiration_time
        except (ValueError, TypeError):
            return False

    def to_dict(self):
        return {
            "name": self.name,
            "item_type": self.item_type,
            "original_path": self.original_path,
            "size": self.size,
            "deleted_at": self.deleted_at,
            "is_expired": self.is_expired()
        }


class TrashSystem:

    def __init__(self):
        self.items = []

    def add(self, name, item_type, original_path="", size=0):
        trash_item = TrashItem(name, item_type, original_path, size)
        self.items.append(trash_item)

    def get_all(self):
        self.clean_expired()
        # Ordenar por fecha descendente (más reciente primero)
        return sorted(self.items, key=lambda x: x.deleted_at, reverse=True)

    def restore(self, name):
        for i, item in enumerate(self.items):
            if item.name == name:
                return self.items.pop(i)
        return None

    def delete_permanent(self, name):
        for i, item in enumerate(self.items):
            if item.name == name:
                self.items.pop(i)
                return True
        return False

    def clean_expired(self, days=30):
        self.items = [
            item for item in self.items
            if not item.is_expired(days)
        ]

    def to_dict(self):
        return [
            item.to_dict()
            for item in self.items
        ]