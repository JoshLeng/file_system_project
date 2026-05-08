#directorio general (root)
from backend.models.directory import Directory
from backend.models.file import File    


class FileSystem:

    def __init__(self):
        self.root = Directory("root")
        
        
    #####################################    
    def create_directory(self, parent_directory, directory_name):

        new_directory = Directory(directory_name)

        parent_directory.subdirectories.append(new_directory)

        return new_directory
############################################################
    def create_file(self, directory, file_name):

        new_file = File(file_name)

        directory.files.append(new_file)

        return new_file
###########################################################
    def find_directory(self, current_directory, directory_name):

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
    