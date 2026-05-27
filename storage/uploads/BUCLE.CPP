#include <iostream>
#include <fstream>
#include <string>
using namespace std;

//Declaración de funciones
void ingresarPaciente(); // Ahora pasando la matriz y el contador por referencia
void modificarPaciente(); // Recibe matriz y contador
void eliminarPaciente(); // Aún pendiente de implementar
void ReporteGeneral(); // Genera reporte general
void Generarprint(); 
void buscarpaciente(); 

//Variables globales
string pacientes_registros[100][8]; // Matriz con 8 columnas para cada dato
int cont_pacientes = 0; // Contador de pacientes

int main() {
    int opcion;
    do {
        cout << "------------°|-MENÚ PRINCIPAL-|°-------------" << endl;
        cout << "---SISTEMA DE CONTROL HOSPITALARIO---" << endl;
        cout << "1. Ingreso de Paciente" << endl;
        cout << "2. Modificación de datos del paciente" << endl;
        cout << "3. Generar informe general de pacientes" << endl;
        cout << "4. Generar archivo de impresión" << endl;
        cout << "5. Búsqueda de paciente" << endl;
        cout << "6. Eliminar paciente" << endl;
        cout << "7. Salir" << endl;
        cout << "Marque una opción para ejecutar: ";
        cin >> opcion;

        switch(opcion) {
            case 1: ingresarPaciente(); 
            break;
            case 2: modificarPaciente(); 
            break;
            case 3: ReporteGeneral(); 
            break;
            case 4: Generarprint(); 
            break;
            case 5: buscarpaciente(); 
            break;
            case 6: eliminarPaciente(); 
            break;
            case 7: cout << "Gracias por usar el sistema" << endl; 
            break;
            default: cout << "Opción no válida, inténtelo de nuevo" << endl;
        }
    } while(opcion != 7);

    return 0;
}


///////////FUNCIONES
void ingresarPaciente(){

}
void modificarPaciente(){

}
void eliminarPaciente(){

}
void ReporteGeneral(){

}
void Generarprint(){

}
void buscarpaciente(){

}