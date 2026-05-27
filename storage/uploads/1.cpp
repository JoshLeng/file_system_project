#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
using namespace std;

int main(){
    const int num_max=100;
    vector<string> nombres(num_max);
    vector<vector<double>> detalles(num_max, vector<double>(3));
    char respuesta;
    int contador=0;


    do{
        cout<<"------------MENÚ DE CAJA REGISTRADORA-----------"<<endl;
        cout<<"presione 1 para agregar un producto: "<<endl;
        cout<<"presione 2 para listar los productos registrados: "<<endl;
        cout<<"presione 3 para cerrar el programa: "<<endl;
        cin>>respuesta;

        switch (respuesta){
            case '1':
                if(contador<num_max){
                cout<<"ingrese el nombre del producto que desea registrar: "<<endl;
                cin>>nombres[contador];
                cout<<"ingrese el precio unitario del producto que desea registrar: "<<endl;
                cin>>detalles[contador][0];
                cout<<"ingrese la cantidad de productos que desea registrar: "<<endl;
                cin>>detalles[contador][1];
                detalles[contador][2]=detalles[contador][0]*detalles[contador][1];
                contador++;
                cout<<"¡producto registrado correctamente!";}
            else{
                cout<<"No se puede registrar el producto, límite alcanzado"<<endl;
            }
            break;
            
        case '2':
        {   double total=0  ;
            cout<<"PRODUCTO    |  VALOR |  CANTIDAD| TOTAL|"<<endl;

            for (int i= 0; i<contador; i++)
            {
                cout<< nombres[i]<<" | ";
                cout<< detalles[i][0]<<" | ";
                cout<< detalles[i][1]<<" | ";
                cout<< detalles[i][2]<<" | "<<endl;
                total+=detalles[i][2];
                 }
            cout<<"el total a pagar es de: "<<total<<endl;
            }
            break;
            case '3': 
            cout<<"gracias por utilizar el sistema!";
            break;

        
         default: cout<<"ingrese un valor correcto: "<<endl;
        }
    } while(respuesta!='3');
    
return 0;
}
 