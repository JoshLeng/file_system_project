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
        // CARDS
        ////////////////////////////////////////////////////

        document.getElementById(
            "files-count"
        ).textContent =
            stats.total_files || 0;

        document.getElementById(
            "directories-count"
        ).textContent =
            stats.total_directories || 0;

        document.getElementById(
            "shared-files"
        ).textContent =
            stats.shared_files || 0;

        ////////////////////////////////////////////////////
        // STORAGE
        ////////////////////////////////////////////////////

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

        row.innerHTML = `
            <td>

                <div class="file-info">

                    <div class="file-icon">
                        <i class="fa-regular fa-folder"></i>
                    </div>

                    ${directory.name}

                </div>

            </td>

            <td>Directorio</td>

            <td>--</td>

            <td>--</td>

            <td>

                <button class="rename-directory-btn">
                    Renombrar
                </button>

                <button class="delete-directory-btn">
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

            <td>

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

        row.innerHTML = `
            <td>

                <div class="file-info">

                    <div class="file-icon">
                        <i class="fa-regular fa-folder"></i>
                    </div>

                    ${directory.name}

                </div>

            </td>

            <td>Directorio</td>

            <td>--</td>

            <td>--</td>

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
                    "Nombre del directorio"
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
        // FILES CARD
        ////////////////////////////////////////////////////

        document.getElementById(
            "files-card"
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
        // DIRECTORIES CARD
        ////////////////////////////////////////////////////

        document.getElementById(
            "directories-card"
        ).addEventListener(
            "click",
            async () => {

                currentView =
                    "directories";

                await loadDirectoryContent(
                    currentDirectory
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

    }
);