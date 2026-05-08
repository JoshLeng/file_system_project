##archivo lógico
from backend.models.version import Version


class File:
    def __init__(self, name):
        self.name = name
        self.tags = []
        self.versions = []
        self.shared_link = None

    def add_version(self, content):
        version_number = len(self.versions) + 1
        version = Version(version_number, content)
        self.versions.append(version)