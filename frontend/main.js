const archivos = [

    {
        nombre: "Dashboard.fig",
        tipo: "Diseño UI",
        fecha: "Hace 2 horas",
        tamaño: "12.4 MB",
        icono: "fa-brands fa-figma"
    },

    {
        nombre: "Backend_API.js",
        tipo: "JavaScript",
        fecha: "Hace 5 horas",
        tamaño: "320 KB",
        icono: "fa-brands fa-js"
    },

    {
        nombre: "Reporte_Final.pdf",
        tipo: "PDF",
        fecha: "Ayer",
        tamaño: "2.1 MB",
        icono: "fa-solid fa-file-pdf"
    }

];

const tableBody = document.getElementById("table-body");

function cargarArchivos(){

    archivos.forEach(archivo => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>
                <div class="file-info">

                    <div class="file-icon">
                        <i class="${archivo.icono}"></i>
                    </div>

                    ${archivo.nombre}

                </div>
            </td>

            <td>${archivo.tipo}</td>

            <td>${archivo.fecha}</td>

            <td>${archivo.tamaño}</td>

            <td>
                <i class="fa-solid fa-ellipsis"></i>
            </td>
        `;

        tableBody.appendChild(fila);

    });

}

cargarArchivos();