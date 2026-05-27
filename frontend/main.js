console.log("MAIN JS CARGADO");

////////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////////

const API_URL = "http://127.0.0.1:8000";

////////////////////////////////////////////////////////////
// GLOBAL STATE
////////////////////////////////////////////////////////////

let currentDirectory = "root";
let lastDirectory = "root";
let directoryTree = null;
let currentView = "dashboard";
let currentEditingFile = null;
let currentEditingTags = [];
let originalTableHeaders = null;
let pendingLoad = null;

////////////////////////////////////////////////////////////
// LOAD TREE
////////////////////////////////////////////////////////////

async function loadTree() {
    try {
        const response = await fetch(`${API_URL}/tree`);
        directoryTree = await response.json();
        renderSidebar(directoryTree);
    } catch (error) {
        console.error("Error loading tree:", error);
    }
}

////////////////////////////////////////////////////////////
// REFRESH SIDEBAR
////////////////////////////////////////////////////////////

async function refreshSidebar() {
    try {
        const response = await fetch(`${API_URL}/tree`);
        directoryTree = await response.json();
        renderSidebar(directoryTree);
    } catch (error) {
        console.error("Error refreshing sidebar:", error);
    }
}

////////////////////////////////////////////////////////////
// RENDER SIDEBAR
////////////////////////////////////////////////////////////

function renderSidebar(directory, container = null) {
    if (!container) {
        container = document.getElementById("directory-tree");
        container.innerHTML = "";
    }

    const item = document.createElement("div");
    item.className = "directory-item";
    item.textContent = directory.name;
    item.style.padding = "10px";
    item.style.cursor = "pointer";

    item.onclick = async () => {
        currentDirectory = directory.path;
        lastDirectory = currentDirectory;
        currentView = "dashboard";
        const tableBody = document.getElementById("table-body");
        if (tableBody) tableBody.innerHTML = "";
        await loadDirectoryContent(currentDirectory);
        renderBreadcrumbs(currentDirectory);
        
        document.getElementById("dashboard-view-btn").classList.add("active");
        document.getElementById("directories-view-btn").classList.remove("active");
        setTableHeaders("dashboard");
    };

    container.appendChild(item);

    if (directory.subdirectories && directory.subdirectories.length > 0) {
        const childrenContainer = document.createElement("div");
        childrenContainer.style.marginLeft = "20px";
        container.appendChild(childrenContainer);
        directory.subdirectories.forEach(subdirectory => {
            renderSidebar(subdirectory, childrenContainer);
        });
    }
}

////////////////////////////////////////////////////////////
// LOAD DIRECTORY CONTENT
////////////////////////////////////////////////////////////

async function loadDirectoryContent(path) {
    if (pendingLoad) {
        console.log("Cancelando carga anterior");
        return;
    }

    if (path && path !== currentDirectory) {
        currentDirectory = path;
        lastDirectory = path;
    }

    const tableBody = document.getElementById("table-body");
    if (tableBody) tableBody.innerHTML = "";

    pendingLoad = true;

    try {
        const response = await fetch(`${API_URL}/directory/content?path=${currentDirectory}`);
        const data = await response.json();

        if (data.error) {
            console.error("Error del servidor:", data.error);
            return;
        }

        renderDirectoryContent(data);
    } catch (error) {
        console.error("Error loading content:", error);
    } finally {
        pendingLoad = false;
    }
}

////////////////////////////////////////////////////////////
// LOAD TRASH COUNT
////////////////////////////////////////////////////////////

async function loadTrashCount() {
    try {
        const response = await fetch(`${API_URL}/trash`);
        const data = await response.json();
        document.getElementById("trash-count").textContent = data.count || 0;
    } catch (error) {
        console.error("Error loading trash count:", error);
    }
}

////////////////////////////////////////////////////////////
// LOAD RECENT COUNT
////////////////////////////////////////////////////////////

async function loadRecentCount() {
    try {
        const response = await fetch(`${API_URL}/recent/files`);
        const data = await response.json();
        document.getElementById("recent-files-count").textContent = data.count || 0;
    } catch (error) {
        console.error("Error loading recent count:", error);
    }
}

////////////////////////////////////////////////////////////
// LOAD STATS
////////////////////////////////////////////////////////////

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();

        const usedGB = Number(stats.used_gb) || 0;
        const maxGB = Number(stats.max_gb) || 10;
        const percent = maxGB > 0 ? (usedGB / maxGB) * 100 : 0;

        document.getElementById("storage-used-gb").textContent = `${usedGB.toFixed(2)} GB`;
        document.getElementById("storage-percent").textContent = `${percent.toFixed(1)}%`;
        document.getElementById("storage-text").textContent = `${usedGB.toFixed(2)} GB de ${maxGB} GB utilizados`;
        document.getElementById("storage-fill").style.width = `${percent}%`;
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

////////////////////////////////////////////////////////////
// SET TABLE HEADERS
////////////////////////////////////////////////////////////

function setTableHeaders(viewType) {
    const thead = document.querySelector('.table-section thead tr');
    
    if (viewType === "recent") {
        thead.innerHTML = `
            <th>Archivo</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Acción</th>
            <th>Acciones</th>
        `;
    } else if (viewType === "trash") {
        thead.innerHTML = `
            <th>Archivo</th>
            <th>Tipo</th>
            <th>Fecha eliminación</th>
            <th>Tamaño</th>
            <th>Acciones</th>
        `;
    } else {
        thead.innerHTML = `
            <th>Archivo</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Tamaño</th>
            <th>Acciones</th>
        `;
    }
}

////////////////////////////////////////////////////////////
// SHOW TRASH VIEW
////////////////////////////////////////////////////////////

async function showTrashView() {
    lastDirectory = currentDirectory;
    
    try {
        setTableHeaders("trash");

        const response = await fetch(`${API_URL}/trash`);
        const data = await response.json();
        const items = data.items || [];

        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";

        if (items.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5">Papelera vacía</td></tr>`;
            return;
        }

        items.forEach(item => {
            const row = document.createElement("tr");
            const deletedDate = new Date(item.deleted_at).toLocaleString("es-ES");
            const sizeText = item.size ? `${(item.size / 1024).toFixed(2)} KB` : "--";

            row.innerHTML = `
                <td>
                    <div class="file-info">
                        <div class="file-icon"><i class="fa-regular ${item.item_type === "file" ? "fa-file" : "fa-folder"}"></i></div>
                        ${item.name}
                    </div>
                </td>
                <td>${item.item_type === "file" ? "Archivo" : "Carpeta"}</td>
                <td>${deletedDate}</td>
                <td>${sizeText}</td>
                <td>
                    <button class="restore-trash-btn" data-name="${item.name}">Restaurar</button>
                    <button class="delete-permanent-btn" data-name="${item.name}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById("breadcrumbs").innerHTML = `<span style="font-weight:600">🗑️ Papelera (${items.length} items)</span>`;
    } catch (error) {
        console.error("Error loading trash view:", error);
    }
}

////////////////////////////////////////////////////////////
// SHOW RECENT FILES VIEW
////////////////////////////////////////////////////////////

async function showRecentFilesView() {
    lastDirectory = currentDirectory;
    
    try {
        setTableHeaders("recent");

        const response = await fetch(`${API_URL}/recent/files`);
        const data = await response.json();
        const files = data.recent_files || [];

        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";

        if (files.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5">No hay archivos recientes</td></tr>`;
            return;
        }

        files.forEach(file => {
            const row = document.createElement("tr");

            const actionText = {
                "file_created": "Creado",
                "uploaded": "Subido",
                "renamed": "Renombrado",
                "deleted": "Eliminado"
            }[file.action] || file.action;

            const formattedDate = new Date(file.timestamp).toLocaleString("es-ES");

            row.innerHTML = `
                <td>
                    <div class="file-info">
                        <div class="file-icon"><i class="fa-regular fa-file"></i></div>
                        ${file.name}
                    </div>
                </td>
                <td>Archivo</td>
                <td>${formattedDate}</td>
                <td>${actionText}</td>
                <td><button class="recent-view-btn" data-name="${file.name}">Ver</button></td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.recent-view-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                navigateToRecentFile(btn.dataset.name);
            });
        });

        document.getElementById("breadcrumbs").innerHTML = `<span style="font-weight:600">🕐 Archivos recientes (últimos ${files.length})</span>`;
    } catch (error) {
        console.error("Error loading recent view:", error);
    }
}

////////////////////////////////////////////////////////////
// RENDER DIRECTORY CONTENT
////////////////////////////////////////////////////////////

function renderDirectoryContent(data) {
    if (currentView === "dashboard" || currentView === "directories") {
        setTableHeaders("dashboard");
    }

    const tableBody = document.getElementById("table-body");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (currentView === "directories") {
        renderOnlyDirectories(data.directories);
        return;
    }
    
    if (currentView === "trash" || currentView === "recent") {
        return;
    }

    if (data.directories.length === 0 && data.files.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">Directorio vacío</td></tr>`;
        return;
    }

    // Directorios
    data.directories.forEach(directory => {
        const row = document.createElement("tr");
        row.style.cursor = "pointer";

        const createdDate = new Date(directory.created_at).toLocaleDateString("es-ES");
        const sizeKB = (directory.size / 1024).toFixed(2);

        row.innerHTML = `
            <td>
                <div class="file-info">
                    <div class="file-icon"><i class="fa-regular fa-folder"></i></div>
                    ${directory.name}
                </div>
            </td>
            <td>Carpeta</td>
            <td>${createdDate}</td>
            <td>${sizeKB} KB</td>
            <td>
                <button class="rename-directory-btn" data-dir-name="${directory.name}">Renombrar</button>
                <button class="delete-directory-btn" data-dir-name="${directory.name}">Eliminar</button>
            </td>
        `;

        row.onclick = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            currentDirectory = directory.path;
            lastDirectory = currentDirectory;
            currentView = "dashboard";
            loadDirectoryContent(currentDirectory);
            renderBreadcrumbs(currentDirectory);
        };

        tableBody.appendChild(row);
    });

    // Archivos
    data.files.forEach(file => {
        const row = document.createElement("tr");
        const tagsHTML = (file.tags || []).map(tag => `<span class="tag-badge">#${tag}</span>`).join("");
        const uploadedDate = new Date(file.uploaded_at).toLocaleDateString("es-ES");

        row.innerHTML = `
            <td>
                <div class="file-info-column">
                    <div class="file-info">
                        <div class="file-icon"><i class="fa-regular fa-file"></i></div>
                        ${file.name}
                    </div>
                    <div class="tags-container">${tagsHTML}</div>
                </div>
            </td>
            <td>Archivo</td>
            <td>${uploadedDate}</td>
            <td>${file.size ? (file.size / 1024).toFixed(2) + " KB" : "--"}</td>
            <td>
                <button class="edit-tags-btn" data-file-name="${file.name}">Tags</button>
                <button class="rename-file-btn" data-file-name="${file.name}">Renombrar</button>
                <button class="delete-file-btn" data-file-name="${file.name}">Eliminar</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

////////////////////////////////////////////////////////////
// RENDER ONLY DIRECTORIES
////////////////////////////////////////////////////////////

function renderOnlyDirectories(directories) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    if (directories.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No hay directorios</td></tr>`;
        return;
    }

    directories.forEach(directory => {
        const row = document.createElement("tr");
        row.style.cursor = "pointer";

        const createdDate = new Date(directory.created_at).toLocaleDateString("es-ES");
        const sizeKB = (directory.size / 1024).toFixed(2);

        row.innerHTML = `
            <td>
                <div class="file-info">
                    <div class="file-icon"><i class="fa-regular fa-folder"></i></div>
                    ${directory.name}
                </div>
            </td>
            <td>Carpeta</td>
            <td>${createdDate}</td>
            <td>${sizeKB} KB</td>
            <td>Carpeta</td>
        `;

        row.onclick = async () => {
            currentDirectory = directory.path;
            lastDirectory = currentDirectory;
            currentView = "dashboard";
            await loadDirectoryContent(currentDirectory);
            renderBreadcrumbs(currentDirectory);
        };

        tableBody.appendChild(row);
    });
}

////////////////////////////////////////////////////////////
// BREADCRUMBS
////////////////////////////////////////////////////////////

function renderBreadcrumbs(path) {
    const container = document.getElementById("breadcrumbs");
    container.innerHTML = "";

    const parts = path.split("/");

    parts.forEach((part, index) => {
        const pathParts = parts.slice(0, index + 1);
        const breadcrumbPath = pathParts.join("/");

        const crumb = document.createElement("span");
        crumb.textContent = part;
        crumb.style.cursor = "pointer";
        crumb.style.fontWeight = "600";
        crumb.style.marginRight = "8px";

        crumb.onclick = async () => {
            currentDirectory = breadcrumbPath;
            lastDirectory = currentDirectory;
            currentView = "dashboard";
            await loadDirectoryContent(currentDirectory);
            renderBreadcrumbs(currentDirectory);
        };

        container.appendChild(crumb);

        if (index < parts.length - 1) {
            const separator = document.createElement("span");
            separator.textContent = "/";
            separator.style.marginRight = "8px";
            container.appendChild(separator);
        }
    });
}

////////////////////////////////////////////////////////////
// SEARCH FILES
////////////////////////////////////////////////////////////

async function searchFiles(query) {
    try {
        if (query.startsWith("#")) {
            const tag = query.replace("#", "");
            const response = await fetch(`${API_URL}/search/tag?tag=${tag}`);
            const results = await response.json();
            renderSearchResults(results);
            return;
        }

        const response = await fetch(`${API_URL}/search/file?name=${query}`);
        const data = await response.json();

        if (data.error) {
            renderSearchResults([]);
            return;
        }

        renderSearchResults([data.file]);
    } catch (error) {
        console.error("Error searching:", error);
    }
}

////////////////////////////////////////////////////////////
// RENDER SEARCH RESULTS
////////////////////////////////////////////////////////////

function renderSearchResults(files) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    if (files.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">Sin resultados</td></tr>`;
        return;
    }

    files.forEach(file => {
        const row = document.createElement("tr");
        const tagsHTML = (file.tags || []).map(tag => `<span class="tag-badge">#${tag}</span>`).join("");

        row.innerHTML = `
            <td>
                <div class="file-info-column">
                    <div class="file-info">
                        <div class="file-icon"><i class="fa-regular fa-file"></i></div>
                        ${file.name}
                    </div>
                    <div class="tags-container">${tagsHTML}</div>
                </div>
            </td>
            <td>Archivo</td>
            <td>${file.uploaded_at || "--"}</td>
            <td>${file.size ? (file.size / 1024).toFixed(2) + " KB" : "--"}</td>
            <td>Resultado</td>
        `;
        tableBody.appendChild(row);
    });
}

////////////////////////////////////////////////////////////
// UPLOAD FILE
////////////////////////////////////////////////////////////

async function uploadFile(file) {
    // Guardar la carpeta actual ANTES de cualquier cosa
    const savedDirectory = currentDirectory;
    console.log("📁 Carpeta actual guardada:", savedDirectory);
    
    const tagsInput = prompt("Tags separadas por coma\nEjemplo: urgente,imagen,trabajo");

    try {
        const formData = new FormData();
        formData.append("uploaded_file", file);

        const response = await fetch(`${API_URL}/upload?path=${encodeURIComponent(savedDirectory)}&tags=${encodeURIComponent(tagsInput || "")}`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Subida exitosa:", result);

        // IMPORTANTE: Prevenir cualquier recarga
        event?.preventDefault?.();
        
        // Restaurar carpeta
        currentDirectory = savedDirectory;
        lastDirectory = savedDirectory;
        
        // Recargar contenido SIN recargar página
        await loadDirectoryContent(currentDirectory);
        await loadStats();
        await loadRecentCount();
        
        console.log("✅ Todo actualizado - Carpeta:", currentDirectory);
        
    } catch (error) {
        console.error("❌ Error en upload:", error);
        alert("Error al subir el archivo: " + error.message);
    }
}
////////////////////////////////////////////////////////////
// CRUD OPERATIONS
////////////////////////////////////////////////////////////

async function createDirectory(name) {
    const savedDirectory = currentDirectory;
    
    try {
        const response = await fetch(`${API_URL}/directory`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parent: savedDirectory, name: name })
        });

        const result = await response.json();
        if (result.message) {
            currentDirectory = savedDirectory;
            lastDirectory = savedDirectory;
            await loadDirectoryContent(currentDirectory);
            await refreshSidebar();
            await loadStats();
        }
    } catch (error) {
        console.error("Error creating directory:", error);
        alert("Error al crear la carpeta");
    }
}

async function createFile(name) {
    const savedDirectory = currentDirectory;

    try {
        const response = await fetch(`${API_URL}/file`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ directory: savedDirectory, name: name, tags: [] })
        });

        const result = await response.json();
        if (result.message) {
            currentDirectory = savedDirectory;
            lastDirectory = savedDirectory;
            await loadDirectoryContent(currentDirectory);
            await loadStats();
            await loadRecentCount();
            console.log("Archivo creado correctamente - Carpeta:", currentDirectory);
        }
    } catch (error) {
        console.error("Error creating file:", error);
        alert("Error al crear el archivo");
    }
}

async function renameDirectory(oldName, newName) {
    const savedDirectory = currentDirectory;

    try {
        const response = await fetch(`${API_URL}/directory/rename`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: savedDirectory, old_name: oldName, new_name: newName })
        });

        const result = await response.json();
        if (result.success) {
            currentDirectory = savedDirectory;
            lastDirectory = savedDirectory;
            await loadDirectoryContent(currentDirectory);
            await refreshSidebar();
            await loadStats();
        }
    } catch (error) {
        console.error("Error renaming directory:", error);
        alert("Error al renombrar la carpeta");
    }
}

async function renameFile(oldName, newName) {
    const savedDirectory = currentDirectory;

    try {
        const response = await fetch(`${API_URL}/file/rename`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: savedDirectory, old_name: oldName, new_name: newName })
        });

        const result = await response.json();
        if (result.success) {
            currentDirectory = savedDirectory;
            lastDirectory = savedDirectory;
            await loadDirectoryContent(currentDirectory);
            await loadStats();
            await loadRecentCount();
        }
    } catch (error) {
        console.error("Error renaming file:", error);
        alert("Error al renombrar el archivo");
    }
}

async function deleteDirectory(name) {
    if (!confirm(`¿Eliminar carpeta "${name}"?`)) return;

    const savedDirectory = currentDirectory;

    try {
        const response = await fetch(`${API_URL}/directory?path=${savedDirectory}&name=${name}`, {
            method: "DELETE"
        });

        const result = await response.json();
        if (result.success) {
            currentDirectory = savedDirectory;
            lastDirectory = savedDirectory;
            await loadDirectoryContent(currentDirectory);
            await refreshSidebar();
            await loadStats();
            await loadTrashCount();
            console.log("Carpeta eliminada");
        }
    } catch (error) {
        console.error("Error deleting directory:", error);
        alert("Error al eliminar la carpeta");
    }
}

async function deleteFile(name) {
    if (!confirm(`¿Eliminar archivo "${name}"?`)) return;

    const savedDirectory = currentDirectory;

    try {
        const response = await fetch(`${API_URL}/file?path=${savedDirectory}&name=${name}`, {
            method: "DELETE"
        });

        const result = await response.json();
        if (result.success) {
            currentDirectory = savedDirectory;
            lastDirectory = savedDirectory;
            await loadDirectoryContent(currentDirectory);
            await loadStats();
            await loadTrashCount();
            await loadRecentCount();
            console.log("Archivo eliminado");
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        alert("Error al eliminar el archivo");
    }
}

////////////////////////////////////////////////////////////
// NAVIGATE TO RECENT FILE
////////////////////////////////////////////////////////////

async function navigateToRecentFile(fileName) {
    try {
        const btn = event?.target;
        const originalText = btn?.textContent;
        if (btn) btn.textContent = "🔍 Buscando...";

        const searchResponse = await fetch(`${API_URL}/search/file?name=${encodeURIComponent(fileName)}`);
        const searchData = await searchResponse.json();

        if (searchData.error || !searchData.file) {
            alert(`❌ Archivo "${fileName}" no encontrado`);
            if (btn) btn.textContent = originalText;
            return;
        }

        const location = await findFileLocation(fileName);

        if (location) {
            currentDirectory = location;
            lastDirectory = location;
            currentView = "dashboard";
            setTableHeaders("dashboard");
            await loadDirectoryContent(currentDirectory);
            renderBreadcrumbs(currentDirectory);

            setTimeout(() => highlightFileInTable(fileName), 500);
            alert(`✅ Archivo encontrado en: ${location}`);
        } else {
            currentDirectory = "root";
            lastDirectory = "root";
            await loadDirectoryContent("root");
            renderBreadcrumbs("root");
            alert(`⚠️ Archivo encontrado en la raíz`);
        }

        if (btn) btn.textContent = originalText;
    } catch (error) {
        console.error("Error navigating to file:", error);
        alert("❌ Error al navegar al archivo");
    }
}

async function findFileLocation(fileName, node = null, currentPath = "root") {
    if (!node) {
        const treeResponse = await fetch(`${API_URL}/tree`);
        node = await treeResponse.json();
    }

    if (node.files_data) {
        for (const file of node.files_data) {
            if (file.name === fileName) return currentPath;
        }
    }

    if (node.subdirectories) {
        for (const subdir of node.subdirectories) {
            const newPath = currentPath === "root" ? `root/${subdir.name}` : `${currentPath}/${subdir.name}`;
            const result = await findFileLocation(fileName, subdir, newPath);
            if (result) return result;
        }
    }

    return null;
}

function highlightFileInTable(fileName) {
    const rows = document.querySelectorAll('#table-body tr');
    for (const row of rows) {
        if (row.textContent.includes(fileName)) {
            row.style.transition = "background-color 0.3s";
            row.style.backgroundColor = "#3b82f633";
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => row.style.backgroundColor = "", 3000);
            break;
        }
    }
}

////////////////////////////////////////////////////////////
// TAGS MODAL
////////////////////////////////////////////////////////////

function openTagsModal(fileName, tags) {
    currentEditingFile = fileName;
    currentEditingTags = [...tags];

    const tagsList = document.getElementById("tags-list");
    tagsList.innerHTML = "";

    currentEditingTags.forEach(tag => {
        const tagItem = document.createElement("div");
        tagItem.className = "tag-item";
        tagItem.innerHTML = `${tag}<button class="tag-remove-btn" data-tag="${tag}">×</button>`;
        tagsList.appendChild(tagItem);

        const removeBtn = tagItem.querySelector(".tag-remove-btn");
        removeBtn.addEventListener("click", () => {
            currentEditingTags = currentEditingTags.filter(t => t !== tag);
            openTagsModal(fileName, currentEditingTags);
        });
    });

    document.getElementById("tags-modal").classList.add("show");
    document.getElementById("tag-input").focus();
}

function closeTagsModal() {
    document.getElementById("tags-modal").classList.remove("show");
    currentEditingFile = null;
    currentEditingTags = [];
}

async function saveFileTags() {
    if (!currentEditingFile) return;

    const savedDirectory = currentDirectory;

    try {
        const response = await fetch(`${API_URL}/file/tags`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: savedDirectory,
                file_name: currentEditingFile,
                tags: currentEditingTags
            })
        });

        const result = await response.json();
        if (result.success) {
            closeTagsModal();
            currentDirectory = savedDirectory;
            lastDirectory = savedDirectory;
            await loadDirectoryContent(currentDirectory);
            await loadStats();
        }
    } catch (error) {
        console.error("Error saving tags:", error);
        alert("Error al guardar etiquetas");
    }
}

////////////////////////////////////////////////////////////
// INIT
////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    loadTree();
    loadDirectoryContent(currentDirectory);
    loadStats();
    loadTrashCount();
    loadRecentCount();
    renderBreadcrumbs(currentDirectory);

    // Botones
    document.getElementById("new-folder-btn").addEventListener("click", async () => {
        const name = prompt("Nombre de la carpeta");
        if (name) await createDirectory(name);
    });

    document.getElementById("create-file-btn").addEventListener("click", async () => {
        const name = prompt("Nombre del archivo");
        if (name) await createFile(name);
    });

    document.getElementById("file-input").addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) await uploadFile(file);
    });

    document.querySelector(".search-box input").addEventListener("keydown", async (event) => {
        if (event.key !== "Enter") return;
        const query = event.target.value.trim();
        if (!query) {
            await loadDirectoryContent(currentDirectory);
            return;
        }
        await searchFiles(query);
    });

    document.getElementById("recent-files-card").addEventListener("click", async () => {
        currentView = "recent";
        await showRecentFilesView();
    });

    document.getElementById("trash-card").addEventListener("click", async () => {
        currentView = "trash";
        await showTrashView();
    });

    document.getElementById("dashboard-view-btn").addEventListener("click", async () => {
        currentView = "dashboard";
        currentDirectory = lastDirectory;
        
        document.getElementById("dashboard-view-btn").classList.add("active");
        document.getElementById("directories-view-btn").classList.remove("active");
        
        setTableHeaders("dashboard");
        await loadDirectoryContent(currentDirectory);
        renderBreadcrumbs(currentDirectory);
    });

    document.getElementById("directories-view-btn").addEventListener("click", async () => {
        currentView = "directories";
        currentDirectory = lastDirectory;
        
        document.getElementById("directories-view-btn").classList.add("active");
        document.getElementById("dashboard-view-btn").classList.remove("active");
        
        setTableHeaders("dashboard");
        await loadDirectoryContent(currentDirectory);
    });

    // Modales
    document.getElementById("close-tags-modal").addEventListener("click", closeTagsModal);
    document.getElementById("cancel-tags-btn").addEventListener("click", closeTagsModal);
    document.getElementById("save-tags-btn").addEventListener("click", saveFileTags);

    document.getElementById("tag-input").addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        const input = document.getElementById("tag-input");
        const tag = input.value.trim().toLowerCase();
        if (!tag) return;
        if (!currentEditingTags.includes(tag)) currentEditingTags.push(tag);
        input.value = "";
        openTagsModal(currentEditingFile, currentEditingTags);
    });

    // Delegación de eventos
    document.getElementById("table-body").addEventListener("click", async (event) => {
        // Restaurar desde papelera
        const restoreBtn = event.target.closest(".restore-trash-btn");
        if (restoreBtn && currentView === "trash") {
            const name = restoreBtn.dataset.name;
            if (confirm(`¿Restaurar "${name}"?`)) {
                const response = await fetch(`${API_URL}/trash/restore`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: name })
                });
                const result = await response.json();
                if (result.success) {
                    await loadDirectoryContent(currentDirectory);
                    await refreshSidebar();
                    await loadTrashCount();
                }
            }
        }

        // Eliminar permanentemente
        const deletePermBtn = event.target.closest(".delete-permanent-btn");
        if (deletePermBtn && currentView === "trash") {
            const name = deletePermBtn.dataset.name;
            if (confirm(`¿Eliminar permanentemente "${name}"?`)) {
                const response = await fetch(`${API_URL}/trash/permanent?name=${name}`, { method: "DELETE" });
                const result = await response.json();
                if (result.success) {
                    await showTrashView();
                    await loadTrashCount();
                }
            }
        }

        // Editar tags
        const editTagsBtn = event.target.closest(".edit-tags-btn");
        if (editTagsBtn) {
            const fileName = editTagsBtn.dataset.fileName;
            const row = editTagsBtn.closest("tr");
            const tagsSpans = row.querySelectorAll(".tag-badge");
            const tags = Array.from(tagsSpans).map(span => span.textContent.replace("#", ""));
            openTagsModal(fileName, tags);
        }

        // Renombrar directorio
        const renameDirectoryBtn = event.target.closest(".rename-directory-btn");
        if (renameDirectoryBtn) {
            event.stopPropagation();
            const dirName = renameDirectoryBtn.dataset.dirName;
            const newName = prompt("Nuevo nombre de la carpeta:", dirName);
            if (newName && newName !== dirName) await renameDirectory(dirName, newName);
        }

        // Eliminar directorio
        const deleteDirectoryBtn = event.target.closest(".delete-directory-btn");
        if (deleteDirectoryBtn) {
            event.stopPropagation();
            const dirName = deleteDirectoryBtn.dataset.dirName;
            await deleteDirectory(dirName);
        }

        // Renombrar archivo
        const renameFileBtn = event.target.closest(".rename-file-btn");
        if (renameFileBtn) {
            event.stopPropagation();
            const fileName = renameFileBtn.dataset.fileName;
            const newName = prompt("Nuevo nombre del archivo:", fileName);
            if (newName && newName !== fileName) await renameFile(fileName, newName);
        }

        // Eliminar archivo
        const deleteFileBtn = event.target.closest(".delete-file-btn");
        if (deleteFileBtn) {
            event.stopPropagation();
            const fileName = deleteFileBtn.dataset.fileName;
            await deleteFile(fileName);
        }
    });
});