Algoritmo sin_titulo
	definir arregloint Como caracter
	
	definir arreglocar Como Caracter
	definir fila, columna como entero
	definir respuesta como entero
	Dimension arregloint[100,3]
	dimension arreglocar[100,1]
	
	
	respuesta<-1
	columna<-1
	fila<-1
	respuesta<-0
	escribir "si desea realizar un registro presione 1, presione 2 si desea cerrar la caja"
	leer respuesta
	
según respuesta
	1: repetir
		para fila<-1 hasta 100 con paso 1 hacer
			para columna<-1 hasta 3 con paso 1 hacer
			
				para fila<-1 hasta 100 con paso 1 hacer
					para columna<-1 hasta 1 con paso 1 hacer
					escribir "-------------CAJA REGISTRADORA-----------"	
					escribir "ingrese el nombre del producto: "
					leer arreglocar[fila,columna]
					escribir " ingrese el precio unitario del producto: "
					leer arregloint[fila,columna]
					escribir " ingrese la cantidad de productos a registrar"
					leer arregloint[fila,columna]
					FinPara
					escribir "¿desea realizar otra operación?, marque 1 si desea continuar, y marque 2 si desea cerrar la caja"
					leer respuesta

					
				fin para
			fin para
			FinPara
		hasta que respuesta<2
		
		
	2: 
		si respuesta=2
			entonces
			para fila<-1 hasta 100 con paso 1 hacer
				para columna<-1 hasta 3 con paso 1 hacer
					
					para fila<-1 hasta 100 con paso 1 hacer
						para columna<-1 hasta 3 con paso 1 hacer
							escribir sin saltar arreglocar[fila, columna], arregloint[fila, columna]
							
						fin para
						escribir " "
					FinPara
				fin para
			fin para
			
		finsi
	
FinSegun
FinAlgoritmo
