from datetime import datetime, timedelta


class TrashItem:

    def __init__(
        self,
        name,
        item_type,
        original_path="",
        deleted_at=None
    ):

        self.name = name

        self.item_type = item_type

        self.original_path = original_path

        self.deleted_at = deleted_at or datetime.now().isoformat()

    def is_expired(self, days=30):

        deleted_time = datetime.fromisoformat(
            self.deleted_at
        )

        expiration_time = deleted_time + timedelta(
            days=days
        )

        return datetime.now() > expiration_time

    def to_dict(self):

        return {

            "name": self.name,

            "item_type": self.item_type,

            "original_path": self.original_path,

            "deleted_at": self.deleted_at,

            "is_expired": self.is_expired()
        }


class TrashSystem:

    def __init__(self):

        self.items = []

    def add(
        self,
        name,
        item_type,
        original_path=""
    ):

        trash_item = TrashItem(
            name,
            item_type,
            original_path
        )

        self.items.append(trash_item)

    def get_all(self):

        self.clean_expired()

        return self.items

    def restore(self, name):

        for i, item in enumerate(self.items):

            if item.name == name:

                self.items.pop(i)

                return item

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
