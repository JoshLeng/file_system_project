##version del archivofrom datetime import datetime

from datetime import datetime
class Version:
    def __init__(self, version_number, content):
        self.version_number = version_number
        self.content = content
        self.timestamp = datetime.now()