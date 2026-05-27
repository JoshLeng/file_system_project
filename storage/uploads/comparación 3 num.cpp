#include <iostream>
using namespace std;
int main(){
    int a,b,c;
    cout<<"Ingrese el primer numero";
    cin>>a;
    cout<<"Ingrese el segundo numero";
    cin>>b;
    cout<<"Ingrese el tercer numero";
    cin>>c;

    if (a>b){
        cout<<"El numero mayor es: "<<a;
    }
    else if(c>a){
        cout<<"El numero mayor es: "<<c;
    }
    else{
        cout<<"El numero mayor es: "<<b;
    }

    return 0;
}