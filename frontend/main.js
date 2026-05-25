console.log("MAIN JS CARGADO");

////////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////////

const API_URL = "http://127.0.0.1:8000";

////////////////////////////////////////////////////////////
// GLOBAL STATE
////////////////////////////////////////////////////////////

let currentDirectory = "root";

let directoryTree = null;

let currentView = "dashboard";

let currentEditingFile = null;

let currentEditingTags = [];

////////////////////////////////////////////////////////////
// LOAD TREE
////////////////////////////////////////////////////////////

async function loadTree() {

    try {

        const response =
            await fetch(
                `${API_URL}/tree`
            );

        directoryTree =
            await response.json();

        renderSidebar(
            directoryTree
        );

    } catch (error) {

        console.error(
            "Error loading tree:",
            error
        );
    }
}

////////////////////////////////////////////////////////////
// LOAD TRASH COUNT
////////////////////////////////////////////////////////////

async function loadTrashCount() {

    try {

        const response =
            await fetch(
                `${API_URL}/trash`
            );

        const data =
            await response.json();

        document.getElementById(
            "trash-count"
        ).textContent = data.count || 0;

    } catch (error) {

        console.error(
            "Error loading trash:",
            error
        );
    }
}

////////////////////////////////////////////////////////////
// LOAD STATS
////////////////////////////////////////////////////////////

async function loadStats() {

    try {

        const response =
            await fetch(
                `${API_URL}/stats`
            );

        const stats =
            await response.json();

        ////////////////////////////////////////////////////
        // SAFE VALUES
        ////////////////////////////////////////////////////

        const usedGB =
            Number(stats.used_gb) || 0;

        const maxGB =
            Number(stats.max_gb) || 10;

        const percent =
            maxGB > 0
                ? (usedGB / maxGB) * 100
                : 0;

        ////////////////////////////////////////////////////
        // RECENT FILES (últimos 5)
        ////////////////////////////////////////////////////

        document.getElementById(
            "recent-files-count"
        ).textContent = Math.min(
            stats.total_files,
            5
        );

        ////////////////////////////////////////////////////
        // TRASH (placeholder for now)
        ////////////////////////////////////////////////////

        document.getElementById(
            "trash-count"
        ).textContent = 0;

        ////////////////////////////////////////////////////
        // STORAGE
        ////////////////////////////////////////////////////

        document.getElementById(
            "storage-used-gb"
        ).textContent =
            `${usedGB.toFixed(2)} GB`;

        document.getElementById(
            "storage-percent"
        ).textContent =
            `${percent.toFixed(1)}%`;

        document.getElementById(
            "storage-text"
        ).textContent =
            `${usedGB.toFixed(2)} GB de ${maxGB} GB utilizados`;

        document.getElementById(
            "storage-fill"
        ).style.width =
            `${percent}%`;

    } catch (error) {

        console.error(
            "Error loading stats:",
            error
        );
    }
}
////////////////////////////////////////////////////////////
// RENDER SIDEBAR
////////////////////////////////////////////////////////////

function renderSidebar(
    directory,
    container = null
) {

    if (!container) {

        container =
            document.getElementById(
                "directory-tree"
            );

        container.innerHTML = "";
    }

    ////////////////////////////////////////////////////////

    const item =
        document.createElement("div");

    item.className =
        "directory-item";

    item.textContent =
        directory.name;

    item.style.padding =
        "10px";

    item.style.cursor =
        "pointer";

    ////////////////////////////////////////////////////////

    item.onclick = async () => {

        currentDirectory =
            directory.path;

        await loadDirectoryContent(
            currentDirectory
        );

        renderBreadcrumbs(
            currentDirectory
        );
    };

    ////////////////////////////////////////////////////////

    container.appendChild(item);

    ////////////////////////////////////////////////////////

    if (
        directory.subdirectories.length > 0
    ) {

        const childrenContainer =
            document.createElement("div");

        childrenContainer.style.marginLeft =
            "20px";

        container.appendChild(
            childrenContainer
        );

        ////////////////////////////////////////////////////

        directory.subdirectories.forEach(
            subdirectory => {

                renderSidebar(
                    subdirectory,
                    childrenContainer
                );
            }
        );
    }
}

////////////////////////////////////////////////////////////
// LOAD DIRECTORY CONTENT
////////////////////////////////////////////////////////////

async function loadDirectoryContent(
    path
) {

    try {

        const response =
            await fetch(
                `${API_URL}/directory/content?path=${path}`
            );

        const data =
            await response.json();

        renderDirectoryContent(
            data
        );

    } catch (error) {

        console.error(
            "Error loading content:",
            error
        );
    }
}

////////////////////////////////////////////////////////////
// SEARCH
////////////////////////////////////////////////////////////

async function searchFiles(query) {

    try {

        ////////////////////////////////////////////////////
        // SEARCH BY TAG
        ////////////////////////////////////////////////////

        if (query.startsWith("#")) {

            const tag =
                query.replace("#", "");

            const response =
                await fetch(
                    `${API_URL}/search/tag?tag=${tag}`
                );

            const results =
                await response.json();

            renderSearchResults(
                results
            );

            return;
        }

        ////////////////////////////////////////////////////
        // SEARCH BY FILE NAME
        ////////////////////////////////////////////////////

        const response =
            await fetch(
                `${API_URL}/search/file?name=${query}`
            );

        const data =
            await response.json();

        ////////////////////////////////////////////////////

        if (data.error) {

            renderSearchResults([]);

            return;
        }

        renderSearchResults([
            data.file
        ]);

    } catch (error) {

        console.error(
            "Error searching:",
            error
        );
    }
}

////////////////////////////////////////////////////////////
// RENDER SEARCH RESULTS
////////////////////////////////////////////////////////////

function renderSearchResults(files) {

    const tableBody =
        document.getElementById(
            "table-body"
        );

    tableBody.innerHTML = "";

    ////////////////////////////////////////////////////////

    if (files.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Sin resultados
                </td>
            </tr>
        `;

        return;
    }

    ////////////////////////////////////////////////////////

    files.forEach(file => {

        const row =
            document.createElement("tr");

        ////////////////////////////////////////////////////

        const tagsHTML =
            (file.tags || [])
                .map(tag => `
                    <span class="tag-badge">
                        #${tag}
                    </span>
                `)
                .join("");

        ////////////////////////////////////////////////////

        row.innerHTML = `
            <td>

                <div class="file-info-column">

                    <div class="file-info">

                        <div class="file-icon">
                            <i class="fa-regular fa-file"></i>
                        </div>

                        ${file.name}

                    </div>

                    <div class="tags-container">

                        ${tagsHTML}

                    </div>

                </div>

            </td>

            <td>Archivo</td>

            <td>
                ${file.uploaded_at || "--"}
            </td>

            <td>
                ${
                    file.size
                        ? (file.size / 1024).toFixed(2) + " KB"
                        : "--"
                }
            </td>

            <td>Resultado</td>
        `;

        ////////////////////////////////////////////////////

        tableBody.appendChild(row);
    });
}

////////////////////////////////////////////////////////////
// RENDER DIRECTORY CONTENT
////////////////////////////////////////////////////////////

function renderDirectoryContent(data) {

    const tableBody =
        document.getElementById(
            "table-body"
        );

    tableBody.innerHTML = "";

    ////////////////////////////////////////////////////////
    // DIRECTORIES VIEW
    ////////////////////////////////////////////////////////

    if (currentView === "directories") {

        renderOnlyDirectories(
            data.directories
        );

        return;
    }

    ////////////////////////////////////////////////////////
    // EMPTY STATE
    ////////////////////////////////////////////////////////

    if (
        data.directories.length === 0 &&
        data.files.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Directorio vacío
                </td>
            </tr>
        `;

        return;
    }

    ////////////////////////////////////////////////////////
    // DIRECTORIES
    ////////////////////////////////////////////////////////

    data.directories.forEach(directory => {

        const row =
            document.createElement("tr");

        row.style.cursor =
            "pointer";

        ////////////////////////////////////////////////////

        const createdDate = new Date(
            directory.created_at
        ).toLocaleDateString("es-ES");

        const sizeKB = (
            directory.size / 1024
        ).toFixed(2);

        ////////////////////////////////////////////////////

        row.innerHTML = `
            <td>

                <div class="file-info">

                    <div class="file-icon">
                        <i class="fa-regular fa-folder"></i>
                    </div>

                    ${directory.name}

                </div>

            </td>

            <td>Carpeta</td>

            <td>
                ${createdDate}
            </td>

            <td>
                ${sizeKB} KB
            </td>

            <td>

                <button class="rename-directory-btn">
                    Renombrar
                </button>

                <button class="rename-directory-btn" data-dir-name="${directory.name}">
                    Renombrar
                </button>

                <button class="delete-directory-btn" data-dir-name="${directory.name}">
                    Eliminar
                </button>

            </td>
        `;

        ////////////////////////////////////////////////////

        row.onclick = async () => {

            currentDirectory =
                directory.path;

            await loadDirectoryContent(
                currentDirectory
            );

            renderBreadcrumbs(
                currentDirectory
            );
        };

        ////////////////////////////////////////////////////

        tableBody.appendChild(row);
    });

    ////////////////////////////////////////////////////////
    // FILES
    ////////////////////////////////////////////////////////

    data.files.forEach(file => {

        const row =
            document.createElement("tr");

        ////////////////////////////////////////////////////

        const tagsHTML =
            (file.tags || [])
                .map(tag => `
                    <span class="tag-badge">
                        #${tag}
                    </span>
                `)
                .join("");

        ////////////////////////////////////////////////////

        const uploadedDate = new Date(
            file.uploaded_at
        ).toLocaleDateString("es-ES");

        ////////////////////////////////////////////////////

        row.innerHTML = `
            <td>

                <div class="file-info-column">

                    <div class="file-info">

                        <div class="file-icon">
                            <i class="fa-regular fa-file"></i>
                        </div>

                        ${file.name}

                    </div>

                    <div class="tags-container">

                        ${tagsHTML}

                    </div>

                </div>

            </td>

            <td>Archivo</td>

            <td>
                ${uploadedDate}
            </td>

            <td>
                ${
                    file.size
                        ? (file.size / 1024).toFixed(2) + " KB"
                        : "--"
                }
            </td>

            <td>

                <button class="edit-tags-btn" data-file-name="${file.name}">
                    Tags
                </button>

                <button class="rename-file-btn">
                    Renombrar
                </button>

                <button class="delete-file-btn">
                    Eliminar
                </button>

            </td>
        `;

        ////////////////////////////////////////////////////

        tableBody.appendChild(row);
    });
}

////////////////////////////////////////////////////////////
// RENDER ONLY DIRECTORIES
////////////////////////////////////////////////////////////

function renderOnlyDirectories(
    directories
) {

    const tableBody =
        document.getElementById(
            "table-body"
        );

    tableBody.innerHTML = "";

    ////////////////////////////////////////////////////////

    if (directories.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No hay directorios
                </td>
            </tr>
        `;

        return;
    }

    ////////////////////////////////////////////////////////

    directories.forEach(directory => {

        const row =
            document.createElement("tr");

        row.style.cursor =
            "pointer";

        ////////////////////////////////////////////////////

        const createdDate = new Date(
            directory.created_at
        ).toLocaleDateString("es-ES");

        const sizeKB = (
            directory.size / 1024
        ).toFixed(2);

        ////////////////////////////////////////////////////

        row.innerHTML = `
            <td>

                <div class="file-info">

                    <div class="file-icon">
                        <i class="fa-regular fa-folder"></i>
                    </div>

                    ${directory.name}

                </div>

            </td>

            <td>Carpeta</td>

            <td>
                ${createdDate}
            </td>

            <td>
                ${sizeKB} KB
            </td>

            <td>Carpeta</td>
        `;

        ////////////////////////////////////////////////////

        row.onclick = async () => {

            currentDirectory =
                directory.path;

            currentView =
                "dashboard";

            await loadDirectoryContent(
                currentDirectory
            );

            renderBreadcrumbs(
                currentDirectory
            );
        };

        ////////////////////////////////////////////////////

        tableBody.appendChild(row);
    });
}

////////////////////////////////////////////////////////////
// BREADCRUMBS
////////////////////////////////////////////////////////////

function renderBreadcrumbs(path) {

    const container =
        document.getElementById(
            "breadcrumbs"
        );

    container.innerHTML = "";

    ////////////////////////////////////////////////////////

    const parts =
        path.split("/");

    ////////////////////////////////////////////////////////

    parts.forEach((part, index) => {

        const pathParts =
            parts.slice(0, index + 1);

        const breadcrumbPath =
            pathParts.join("/");

        ////////////////////////////////////////////////////

        const crumb =
            document.createElement("span");

        crumb.textContent =
            part;

        crumb.style.cursor =
            "pointer";

        crumb.style.fontWeight =
            "600";

        crumb.style.marginRight =
            "8px";

        ////////////////////////////////////////////////////

        crumb.onclick = async () => {

            currentDirectory =
                breadcrumbPath;

            await loadDirectoryContent(
                currentDirectory
            );

            renderBreadcrumbs(
                currentDirectory
            );
        };

        ////////////////////////////////////////////////////

        container.appendChild(crumb);

        ////////////////////////////////////////////////////

        if (
            index < parts.length - 1
        ) {

            const separator =
                document.createElement("span");

            separator.textContent =
                "/";

            separator.style.marginRight =
                "8px";

            container.appendChild(
                separator
            );
        }
    });
}
////////////////////////////////////////////////////////////
// UPLOAD REAL FILE
////////////////////////////////////////////////////////////

async function uploadFile(file) {

    const tagsInput = prompt(
        "Tags separadas por coma\nEjemplo: urgente,imagen,trabajo"
    );

    try {

        const formData =
            new FormData();

        formData.append(
            "uploaded_file",
            file
        );

        ////////////////////////////////////////////////////

        const response =
            await fetch(
                `${API_URL}/upload?path=${currentDirectory}&tags=${tagsInput || ""}`,
                {
                    method: "POST",
                    body: formData
                }
            );

        ////////////////////////////////////////////////////

        const result =
            await response.json();

        console.log(result);

        ////////////////////////////////////////////////////

        await loadDirectoryContent(
            currentDirectory
        );

        await loadStats();

    } catch (error) {

        console.error(
            "Error uploading file:",
            error
        );
    }
}
/////////////////////////////////////////////////////////////
// CRUD OPERATIONS
////////////////////////////////////////////////////////////

async function createDirectory(name) {

    try {

        const response =
            await fetch(
                `${API_URL}/directory`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        parent: currentDirectory,

                        name: name
                    })
                }
            );

        ////////////////////////////////////////////////////

        const result =
            await response.json();

        if (result.message) {

            await loadDirectoryContent(
                currentDirectory
            );

            await loadTree();

            await loadStats();
        }

    } catch (error) {

        console.error(
            "Error creating directory:",
            error
        );

        alert(
            "Error al crear la carpeta"
        );
    }
}

async function createFile(name) {

    try {

        const response =
            await fetch(
                `${API_URL}/file`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        directory:
                            currentDirectory,

                        name: name,

                        tags: []
                    })
                }
            );

        ////////////////////////////////////////////////////

        const result =
            await response.json();

        if (result.message) {

            await loadDirectoryContent(
                currentDirectory
            );

            await loadStats();
        }

    } catch (error) {

        console.error(
            "Error creating file:",
            error
        );

        alert(
            "Error al crear el archivo"
        );
    }
}

async function renameDirectory(
    oldName,
    newName
) {

    try {

        console.log('renameDirectory called', { oldName, newName, currentDirectory });

        const response =
            await fetch(
                `${API_URL}/directory/rename`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        path: currentDirectory,

                        old_name: oldName,

                        new_name: newName
                    })
                }
            );

        ////////////////////////////////////////////////////

        const result =
            await response.json();

        console.log('renameDirectory response', result);

        if (result.success) {

            await loadDirectoryContent(
                currentDirectory
            );

            await loadTree();
        }

    } catch (error) {

        console.error(
            "Error renaming directory:",
            error
        );

        alert(
            "Error al renombrar la carpeta"
        );
    }
}

async function renameFile(
    oldName,
    newName
) {

    try {

        const response =
            await fetch(
                `${API_URL}/file/rename`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        path: currentDirectory,

                        old_name: oldName,

                        new_name: newName
                    })
                }
            );

        ////////////////////////////////////////////////////

        const result =
            await response.json();

        if (result.success) {

            await loadDirectoryContent(
                currentDirectory
            );
        }

    } catch (error) {

        console.error(
            "Error renaming file:",
            error
        );

        alert(
            "Error al renombrar el archivo"
        );
    }
}

async function deleteDirectory(name) {

    if (!confirm(
        `¿Eliminar carpeta "${name}"?`
    )) return;

    try {

        const response =
            await fetch(
                `${API_URL}/directory?path=${currentDirectory}&name=${name}`,
                {
                    method: "DELETE"
                }
            );

        ////////////////////////////////////////////////////

        const result =
            await response.json();

        if (result.success) {

            await loadDirectoryContent(
                currentDirectory
            );

            await loadTree();

            await loadStats();

            await loadTrashCount();
        }

    } catch (error) {

        console.error(
            "Error deleting directory:",
            error
        );

        alert(
            "Error al eliminar la carpeta"
        );
    }
}

async function deleteFile(name) {

    if (!confirm(
        `¿Eliminar archivo "${name}"?`
    )) return;

    try {

        const response =
            await fetch(
                `${API_URL}/file?path=${currentDirectory}&name=${name}`,
                {
                    method: "DELETE"
                }
            );

        ////////////////////////////////////////////////////

        const result =
            await response.json();

        if (result.success) {

            await loadDirectoryContent(
                currentDirectory
            );

            await loadStats();

            await loadTrashCount();
        }

    } catch (error) {

        console.error(
            "Error deleting file:",
            error
        );

        alert(
            "Error al eliminar el archivo"
        );
    }
}

/////////////////////////////////////////////////////////////
// TAGS MODAL
////////////////////////////////////////////////////////////

function openTagsModal(fileName, tags) {

    currentEditingFile = fileName;

    currentEditingTags = [...tags];

    const tagsList =
        document.getElementById("tags-list");

    tagsList.innerHTML = "";

    ////////////////////////////////////////////////////////

    currentEditingTags.forEach(tag => {

        const tagItem =
            document.createElement("div");

        tagItem.className = "tag-item";

        tagItem.innerHTML = `
            ${tag}
            <button
                class="tag-remove-btn"
                data-tag="${tag}"
            >
                ×
            </button>
        `;

        tagsList.appendChild(tagItem);

        ////////////////////////////////////////////////////

        const removeBtn = tagItem.querySelector(
            ".tag-remove-btn"
        );

        removeBtn.addEventListener(
            "click",
            () => {

                currentEditingTags =
                    currentEditingTags.filter(
                        t => t !== tag
                    );

                openTagsModal(
                    fileName,
                    currentEditingTags
                );
            }
        );
    });

    ////////////////////////////////////////////////////////

    document.getElementById(
        "tags-modal"
    ).classList.add("show");

    document.getElementById(
        "tag-input"
    ).focus();
}

function closeTagsModal() {

    document.getElementById(
        "tags-modal"
    ).classList.remove("show");

    currentEditingFile = null;

    currentEditingTags = [];
}

async function saveFileTags() {

    if (!currentEditingFile) return;

    try {

        const response =
            await fetch(
                `${API_URL}/file/tags`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        path: currentDirectory,

                        file_name:
                            currentEditingFile,

                        tags:
                            currentEditingTags
                    })
                }
            );

        ////////////////////////////////////////////////////

        const result =
            await response.json();

        if (result.success) {

            closeTagsModal();

            await loadDirectoryContent(
                currentDirectory
            );
        }

    } catch (error) {

        console.error(
            "Error saving tags:",
            error
        );
    }
}

/////////////////////////////////////////////////////////////
// INIT
////////////////////////////////////////////////////////////

document.addEventListener(
    "DOMContentLoaded",
    () => {

        ////////////////////////////////////////////////////
        // INITIAL LOAD
        ////////////////////////////////////////////////////

        loadTree();

        loadDirectoryContent(
            currentDirectory
        );

        loadStats();

        loadTrashCount();

        renderBreadcrumbs(
            currentDirectory
        );

        ////////////////////////////////////////////////////
        // CREATE DIRECTORY
        ////////////////////////////////////////////////////

        const newFolderButton =
            document.getElementById(
                "new-folder-btn"
            );

        newFolderButton.addEventListener(
            "click",
            async () => {

                const name = prompt(
                    "Nombre de la carpeta"
                );

                if (!name) return;

                await createDirectory(
                    name
                );
            }
        );

        ////////////////////////////////////////////////////
        // CREATE FILE
        ////////////////////////////////////////////////////

        const createFileButton =
            document.getElementById(
                "create-file-btn"
            );

        createFileButton.addEventListener(
            "click",
            async () => {

                const name = prompt(
                    "Nombre del archivo"
                );

                if (!name) return;

                await createFile(
                    name
                );
            }
        );

        ////////////////////////////////////////////////////
        // UPLOAD
        ////////////////////////////////////////////////////

        const uploadInput =
            document.getElementById(
                "file-input"
            );

        uploadInput.addEventListener(
            "change",
            async (event) => {

                const file =
                    event.target.files[0];

                if (!file) return;

                await uploadFile(file);
            }
        );

        ////////////////////////////////////////////////////
        // SEARCH
        ////////////////////////////////////////////////////

        const searchInput =
            document.querySelector(
                ".search-box input"
            );

        searchInput.addEventListener(
            "keydown",
            async (event) => {

                if (event.key !== "Enter")
                    return;

                const query =
                    searchInput.value.trim();

                ////////////////////////////////////////////////////

                if (!query) {

                    await loadDirectoryContent(
                        currentDirectory
                    );

                    return;
                }

                ////////////////////////////////////////////////////

                await searchFiles(
                    query
                );
            }
        );

        ////////////////////////////////////////////////////
        // RECENT FILES CARD
        ////////////////////////////////////////////////////

        document.getElementById(
            "recent-files-card"
        ).addEventListener(
            "click",
            async () => {

                currentView =
                    "dashboard";

                await loadDirectoryContent(
                    currentDirectory
                );
            }
        );

        ////////////////////////////////////////////////////
        // TRASH CARD
        ////////////////////////////////////////////////////

        document.getElementById(
            "trash-card"
        ).addEventListener(
            "click",
            async () => {

                alert(
                    "Papelera en desarrollo"
                );
            }
        );

        ////////////////////////////////////////////////////
        // SIDEBAR BUTTONS
        ////////////////////////////////////////////////////

        const dashboardButton =
            document.getElementById(
                "dashboard-view-btn"
            );

        const directoriesButton =
            document.getElementById(
                "directories-view-btn"
            );

        ////////////////////////////////////////////////////
        // DASHBOARD VIEW
        ////////////////////////////////////////////////////

        dashboardButton.addEventListener(
            "click",
            async () => {

                currentView =
                    "dashboard";

                dashboardButton.classList.add(
                    "active"
                );

                directoriesButton.classList.remove(
                    "active"
                );

                await loadDirectoryContent(
                    currentDirectory
                );
            }
        );

        ////////////////////////////////////////////////////
        // DIRECTORIES VIEW
        ////////////////////////////////////////////////////

        directoriesButton.addEventListener(
            "click",
            async () => {

                currentView =
                    "directories";

                directoriesButton.classList.add(
                    "active"
                );

                dashboardButton.classList.remove(
                    "active"
                );

                await loadDirectoryContent(
                    currentDirectory
                );
            }
        );

        ////////////////////////////////////////////////////
        // TAGS MODAL
        ////////////////////////////////////////////////////

        document.getElementById(
            "close-tags-modal"
        ).addEventListener(
            "click",
            closeTagsModal
        );

        document.getElementById(
            "cancel-tags-btn"
        ).addEventListener(
            "click",
            closeTagsModal
        );

        document.getElementById(
            "save-tags-btn"
        ).addEventListener(
            "click",
            saveFileTags
        );

        document.getElementById(
            "tag-input"
        ).addEventListener(
            "keydown",
            (event) => {

                if (event.key !== "Enter")
                    return;

                const input =
                    document.getElementById(
                        "tag-input"
                    );

                const tag =
                    input.value.trim()
                        .toLowerCase();

                if (!tag) return;

                if (!currentEditingTags
                    .includes(tag)) {

                    currentEditingTags.push(
                        tag
                    );
                }

                input.value = "";

                openTagsModal(
                    currentEditingFile,
                    currentEditingTags
                );
            }
        );

        ////////////////////////////////////////////////////
        // TABLE DELEGATION - EDIT TAGS
        ////////////////////////////////////////////////////

        document.getElementById(
            "table-body"
        ).addEventListener(
            "click",
            async (event) => {

                const editTagsBtn =
                    event.target.closest(
                        ".edit-tags-btn"
                    );

                if (editTagsBtn) {

                    const fileName =
                        editTagsBtn.dataset
                            .fileName;

                    const row = editTagsBtn
                        .closest("tr");

                    const tagsSpans =
                        row.querySelectorAll(
                            ".tag-badge"
                        );

                    const tags = Array.from(
                        tagsSpans
                    ).map(span => {

                        const text =
                            span.textContent;

                        return text.replace(
                            "#",
                            ""
                        );
                    });

                    openTagsModal(
                        fileName,
                        tags
                    );
                }

                ////////////////////////////////////////////////////
                // RENAME DIRECTORY
                ////////////////////////////////////////////////////

                // DESPUÉS — rename directory
const renameDirectoryBtn =
    event.target.closest(
        ".rename-directory-btn"
    );

    if (renameDirectoryBtn) {

    event.stopPropagation(); // ← evita navegar al directorio

    const row = renameDirectoryBtn
        .closest("tr");

    // Preferir el nombre en el dataset (más fiable)
    const dirName = renameDirectoryBtn.dataset.dirName || (function(){
        const fileInfo = row.querySelector(".file-info");
        return Array.from(fileInfo.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent.trim())
            .filter(Boolean)
            .join("").trim();
    })();

    console.log('renameDirectoryBtn clicked', { dirName, currentDirectory });

    const newName = prompt(
        "Nuevo nombre de la carpeta:",
        dirName
    );

    if (newName && newName !== dirName) {
        await renameDirectory(dirName, newName);
    }
}

                ////////////////////////////////////////////////////
                // DELETE DIRECTORY
                ////////////////////////////////////////////////////

                const deleteDirectoryBtn =
                    event.target.closest(
                        ".delete-directory-btn"
                    );

                if (deleteDirectoryBtn) {
                    event.stopPropagation();
                    const row = deleteDirectoryBtn
                        .closest("tr");

                    const dirName = deleteDirectoryBtn.dataset.dirName || row.querySelector('.file-info').textContent.trim();

                    await deleteDirectory(
                        dirName
                    );
                }

                ////////////////////////////////////////////////////
                // RENAME FILE
                ////////////////////////////////////////////////////

                // DESPUÉS — rename file
const renameFileBtn =
    event.target.closest(".rename-file-btn");

if (renameFileBtn) {

    event.stopPropagation(); // ← añadir esto

    const row = renameFileBtn.closest("tr");
    const fileInfo = row.querySelector(".file-info");
    const fileName = Array.from(fileInfo.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .filter(Boolean)
        .join("").trim();

    const newName = prompt("Nuevo nombre del archivo:", fileName);

    if (newName && newName !== fileName) {
        await renameFile(fileName, newName);
    }
}

                ////////////////////////////////////////////////////
                // DELETE FILE
                ////////////////////////////////////////////////////

                const deleteFileBtn =
                    event.target.closest(
                        ".delete-file-btn"
                    );

                if (deleteFileBtn) {
                    event.stopPropagation();
                    const row = deleteFileBtn
                        .closest("tr");

                    const fileInfo =
                        row.querySelector(
                            ".file-info"
                        );

                    const fileName =
                        fileInfo.textContent
                            .trim();

                    await deleteFile(
                        fileName
                    );
                }
            }
        );

    }
);