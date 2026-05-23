class File:

    def __init__(
        self,
        name,
        real_path="",
        size=0,
        tags=None
    ):

        self.name = name

        self.real_path = real_path

        self.size = size

        self.tags = tags if tags else []

    ####################################################

    def add_tag(
        self,
        tag
    ):

        clean_tag = tag.strip().lower()

        if clean_tag and clean_tag not in self.tags:

            self.tags.append(clean_tag)

    ####################################################

    def set_tags(
        self,
        tags
    ):

        self.tags = []

        for tag in tags:

            self.add_tag(tag)

    ####################################################

    def to_dict(self):

        return {

            "name": self.name,

            "real_path": self.real_path,

            "size": self.size,

            "tags": self.tags
        }