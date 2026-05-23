#directorio general (root)

from backend.models.directory import Directory
from backend.models.file import File


class FileSystem:

    def __init__(self):

        self.root = Directory("root")

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

        parent_directory.subdirectories.append(
            new_directory
        )

        return new_directory

    ####################################################

    def create_file(
        self,
        directory,
        file_name,
        real_path="",
        size=0,
        tags=None
    ):

        new_file = File(
            file_name,
            real_path,
            size,
            tags
        )

        directory.files.append(new_file)

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

            result = self.find_directory(
                subdirectory,
                directory_name
            )

            if result:
                return result

        return None

    ####################################################

    def get_directory_by_path(
        self,
        path
    ):

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

            result = self.find_file_by_name(
                subdirectory,
                file_name
            )

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

            results.extend(
                self.search_by_tag(
                    subdirectory,
                    tag
                )
            )

        return results

    ####################################################

    def delete_file(
        self,
        directory,
        file_name
    ):

        for file in directory.files:

            if file.name == file_name:

                directory.files.remove(file)

                return True

        return False

    ####################################################

    def delete_directory(
        self,
        parent_directory,
        directory_name
    ):

        for directory in parent_directory.subdirectories:

            if directory.name == directory_name:

                parent_directory.subdirectories.remove(
                    directory
                )

                return True

        return False

    ####################################################

    def rename_directory(
        self,
        parent_directory,
        old_name,
        new_name
    ):

        for directory in parent_directory.subdirectories:

            if directory.name == old_name:

                directory.name = new_name

                return True

        return False

    ####################################################

    def rename_file(
        self,
        directory,
        old_name,
        new_name
    ):

        for file in directory.files:

            if file.name == old_name:

                file.name = new_name

                return True

        return False