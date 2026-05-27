#include <iostream>
#include <fstream>
#include <string.h>
using namespace std;
//Declaración de funciones y variables a utilizar
///////Funciones//////
  void ingresarPaciente(string pacientes_registros[100][8], int &cont_pacientes);//Funcion de ingreso de pacientes
  void modificarPaciente();// Función de modificacion de pacientes
  void eliminarPaciente();//Función eliminar paciente
  void ReporteGeneral();// Función Reporte general
  void Generarprint();//Función generar archivo de impresión
  void buscarpaciente();//Función buscar paciente 

  /////////variables y matriz
  string pacientes_registros[100][7], dpi_buscado=0, dpi_porbuscar;
  int cont_pacientes=0;



int main()
{
  int opcion;
  do{
    
    cout<<"------------°|-MENÚ PRINCIPAL-|°-------------"<<endl;
    cout<<"---SISTEMA DE CONTROL HOSPITALARIO---"<<endl;
    cout<<""<<endl; 
    cout<<"1. Ingreso de Paciente"<<endl;
    cout<<"2. Modificación de datos del paciente"<<endl;
    cout<<"3. Generar informe general de pacientes"<<endl;
    cout<<"4. Generar arhivo de impresión"<<endl;
    cout<<"5. Busqueda de paciente"<<endl;
    cout<<"6. Eliminar paciente"<<endl;
    cout<<"7. Salir"<<endl;
    cout<<"Marque una opción para ejecutar"<<endl;
    cin>>opcion;
    switch(opcion){
      case 1: ingresarPaciente(pacientes_registros,cont_pacientes);
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
      case 7: cout<<"Gracias por usar el sistema"<<endl;
      break;
      default: cout<<"Opción no válida, inténtelo de nuevo"<<endl;
                  }
  } while(opcion != 7);

    return 0;
}

/////////////////////////FUNCIONES/////////////////////////////
void ingresarPaciente(string pacientes_registros[100][7], int cont_pacientes){
  for (int i = 0; i < cont_pacientes; i++) {
    cout<<"Ingrese el DPI del paciente a registrar: ";
    cin>>pacientes_registros[i][0];
    cout<<"Ingrese el nombre del paciente a registrar: ";
    cin>>pacientes_registros[i][1];
    cout<<"Ingrese la edad del paciente a registrar: ";
    cin>>pacientes_registros[i][2];
    cout<<"Ingrese el género del paciente a registrar: ";
    cin>>pacientes_registros[i][3];
    cout<<"Ingrese la dirección del paciente a registrar: ";
    cin>>pacientes_registros[i][4];
    cout<<"Ingrese el numero de teléfono del paciente a registrar: ";
    cin>>pacientes_registros[i][5];
    cout<<"Ingrese la fecha de ingreso del paciente: ";
    cin>>pacientes_registros[i][6];
    cout<<"¿Cuál es el padecimiento del paciente?: ";
    cin>>pacientes_registros[i][7];
  }
return;
}
//////////////////////////////////////////////////////////////////
void modificarPaciente(pacientes_registros){
  //////FUNCIÓN DE LUX
  cout<<"Ingrese el  DPI del paciente a modificar :";
  cin>>dpi_buscado;
  bool existente=false;

  for (int i = 0; i < cont_pacientes; i++){
    if (pacientes_registros[i][0]==dpi_buscado){
      existente=true;
      dpi_porbuscar=i;
            break;
            }
            }

if(existente) {
        int mod = 0;
        do {
            cout << "Paciente encontrado. ¿Qué desea modificar?" << endl;
            cout << "1. Nombre: "<<endl;
            cout << "2. Edad: "<< endl;
            cout << "3. Sexo: " <<endl;
            cout << "4. Dirección: " <<endl;
            cout << "5. Teléfono: " <<endl;
            cout << "6. Fecha de ingreso: " <<endl;
            cout << "7. Diagnóstico: " <<endl;
            cout << "Seleccione una opción para modificar: ";
            cin >> mod;

            
            
            switch (mod) {
                case 1:
                    cout << "Ingrese el nuevo nombre: ";
                    cin>>pacientes_registros[dpi_buscado][1];
                    break;
                case 2:
                    cout << "Ingrese la nueva edad: ";
                    getline(cin, nuevoDato);
                    pacientes_registros[indicePaciente][2] = nuevoDato;
                    break;
                case 3:
                    cout << "Ingrese el nuevo sexo: ";
                    getline(cin, nuevoDato);
                    pacientes_registros[indicePaciente][3] = nuevoDato;
                    break;
                case 4:
                    cout << "Ingrese la nueva dirección: ";
                    getline(cin, nuevoDato);
                    pacientes_registros[indicePaciente][4] = nuevoDato;
                    break;
                case 5:
                    cout << "Ingrese el nuevo teléfono: ";
                    getline(cin, nuevoDato);
                    pacientes_registros[indicePaciente][5] = nuevoDato;
                    break;
                case 6:
                    cout << "Ingrese la nueva fecha de ingreso: ";
                    getline(cin, nuevoDato);
                    pacientes_registros[indicePaciente][6] = nuevoDato;
                    break;
                case 7:
                    cout << "Ingrese el nuevo diagnóstico: ";
                    getline(cin, nuevoDato);
                    pacientes_registros[indicePaciente][7] = nuevoDato;
                    break;
                case 8:
                    cout << "Guardando cambios..." << endl;
                    break;
                default:
                    cout << "Opción no válida. Intente de nuevo." << endl;
            }
        } while (opcionModificacion != 8)

}}
    

////////////////////////////////////////////////////////////7///
void eliminarPaciente(){
  /////FUNCIÓN DE LUX


}
void buscarpaciente(){
  /////FUNCIÓN DE LUX
}
  
///////////////////////////////////////////////////////////////////
void ReporteGeneral(){
  
  ofstream archivoLectura("pacientes.csv");
  ///ADVERTENCIAS DE ERRORES///
  if (!archivoLectura.is_open()){
    cout<<"Error al abrir archivo de pacientes"<<endl;
    return;}
    
    else{
    string linea;
    cout<< "------------------------------" << endl;
    cout<<"       Registro de Pacientes      " << endl;
    cout<< "------------------------------" << endl;
    cout<<"     DPI     |  NOMBRE     |  EDAD  |  SEXO  |  DIRECCIÓN   | TELÉFONO |  FECHA DE INGRESO| DIAGNÓSTICO"<<endl; 
      while (getline(archivoLectura, linea)){
          cout<<linea<<endl;
          cout<<"--------------------------------"<<endl;
        }
      archivoLectura.close();
      
     }    
    
  }

  

//////////////////////////////////////////////////////////////////
void Generarprint(){ 
  ////Anteriormente, se creará la base de datos (.txt) con el nombre de "pacientes.txt", y en esta función se abrirá para lectura con ifstream, para posteriormente crear un archivo de texto (.txt) con el nombre de Informe_general_pacientes.txt", y este documento será dispuesto para imprimir////
  
  ifstream archivoLectura("pacientes.csv");
  ofstream archivo("C:/Users/josue/OneDrive/Desktop/Informe_general_pacientes.txt");
  ///ADVERTENCIAS DE ERRORES///
  if (!archivoLectura.is_open()){
    cout<<"Error al abrir archivo de pacientes"<<endl;
    return;
    }
  if (!archivo.is_open()){
    cout<<"Error al generar un archivo de reporte general"<<endl;
    return;
    }/////////////
////////IMPRESIÓN DE DATOS///////////
        //////////SE VERIFICA SI AMBOS ARCHIVOS ESTÁN ABIERTOS///////////
        /////////SE PROCEDE CON LA IMPRESIÓN DEL ENCABEZADO/////////
  if (archivoLectura.is_open() && archivo.is_open()) {
    string linea;
    archivo << "------------------------------" << endl;
    archivo << "       Registro de Pacientes      " << endl;
    archivo << "------------------------------" << endl;
    archivo <<"     DPI     |  NOMBRE     |  EDAD  |  SEXO  |  DIRECCIÓN   | TELÉFONO |  FECHA DE INGRESO| DIAGNÓSTICO"<<endl;
    ////////////////////////////////////////////////////////////////
    //////CICLO WHILE PARA OBTENER LOS DATOS DE LA BASE DE DATOS "Pacientes.txt"///////"
    //////////  la función de getline es tanto la condición como el parámetro de acción, getline sabe cuando acaban las líneas, por lo que también terminará de realizar el proceso///////////

    while (getline(archivoLectura,linea)){
      archivo<<linea<<endl;
      archivo<<"--------------------------------"<<endl;
  }
  //////SE CIERRAN AMBOS ARCHIVOS//////
    archivoLectura.close();
    archivo.close();
      cout<<"Reporte generado exitosamente"<<endl;
      }}



  // Usar system() para abrir Word y enviar el comando de impresión, de esta manera se enviará el archivo de texto generado a la impresora de la computadora de manera automática (ya solo para presionar "imprimir" :)  //////