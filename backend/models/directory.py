import uuid


class Directory:

    def __init__(self, name, parent=None):

        self.id = str(uuid.uuid4())

        self.name = name

        self.parent = parent

        self.subdirectories = []

        self.files = []

    @property
    def path(self):

        if self.parent is None:
            return self.name

        return f"{self.parent.path}/{self.name}"

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "path": self.path,
            "subdirectories": [
                subdirectory.to_dict()
                for subdirectory in self.subdirectories
            ],
            "files": [
                file.name
                for file in self.files
            ]
        }