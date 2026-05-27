import uuid
from datetime import datetime


class Directory:

    def __init__(self, name, parent=None, created_at=None):

        self.id = str(uuid.uuid4())

        self.name = name

        self.parent = parent

        self.subdirectories = []

        self.files = []

        self.created_at = created_at or datetime.now().isoformat()

        self.updated_at = datetime.now().isoformat()

    @property
    def path(self):

        if self.parent is None:
            return self.name

        return f"{self.parent.path}/{self.name}"

    def get_total_size(self):

        total = 0

        for file in self.files:

            total += file.size or 0

        for subdirectory in self.subdirectories:

            total += subdirectory.get_total_size()

        return total

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "path": self.path,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "size": self.get_total_size(),
            "subdirectories": [
                subdirectory.to_dict()
                for subdirectory in self.subdirectories
            ],
            "files_data": [
                file.to_dict()
                for file in self.files
            ]
        }
    ############################
    @classmethod
    def from_dict(cls, data, parent=None):

        directory = cls(
            name=data["name"],
            parent=parent,
            created_at=data.get("created_at")
        )

        from backend.models.file import File

        directory.files = [
            File.from_dict(file_data)
            for file_data in data.get("files_data", [])
        ]

        directory.subdirectories = [
            cls.from_dict(sub, directory)
            for sub in data.get("subdirectories", [])
        ]

        return directory