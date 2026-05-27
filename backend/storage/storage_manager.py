import json
import os


class StorageManager:

    @staticmethod
    def save(data, filename="storage/filesystem.json"):

        os.makedirs(
            os.path.dirname(filename),
            exist_ok=True
        )

        with open(
            filename,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                data,
                file,
                indent=4
            )

    @staticmethod
    def load(filename="storage/filesystem.json"):

        if not os.path.exists(filename):

            return None

        with open(
            filename,
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)