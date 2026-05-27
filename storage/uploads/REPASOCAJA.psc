Algoritmo REPASOCAJA
	/////////////////el uso de arreglos lo tengo configurado para que inicie con valor 0////////////////////////////// gracias:)
	definir respuesta Como Entero
	definir nombres Como Caracter
	definir detalles como real
	dimension nombres[100]
	dimension detalles[100,5]
	contador<-0
	respuesta<-0
	
	mientras respuesta <>3 hacer
		escribir "--------------CAJA REGISTRADORA------------"
		escribir "ingrese la opción que desea ejecutar: "
		escribir "presione 1 para agregar un nuevo producto: "
		escribir "presione 2 para listar todos los productos: "
		escribir "presione 3 para cerrar el sistema: "
		leer respuesta
		
		según respuesta hacer
	caso 1:
		leer_producto(nombres, detalles, contador)
	caso 2:
		Limpiar Pantalla
		escribir "gracias por utilizar el sistema"
		mostrar_lista(nombres, detalles, contador)
	caso 3: 
		escribir "GRACIAS POR UTILIZAR EL SISTEMA "
	
		
	De Otro Modo:
		escribir "por favor ingrese un valor correcto, inténtelo de nuevo"
		fin según
	FinMientras
	
	
FinAlgoritmo

//////////////////
SubAlgoritmo leer_producto(nombres Por Referencia, detalles Por Referencia, contador por referencia)
	escribir "ingrese el nombre del producto que desea registrar: "
	leer nombres[contador]
	repetir
	escribir "ingrese el valor del producto que desea registrar: "
	leer detalles[contador, 0]
	si detalles[contador,0]=0 Entonces
		escribir "ingrese un valor: "
	FinSi
hasta que detalles[contador,0]>0
repetir
	escribir "ingrese la cantidad de productos que desea registrar: "
	leer detalles[contador, 1]
	si detalles[contador,1]=0 Entonces
		escribir "ingrese un valor : "
	FinSi
	hasta que detalles[contador,1]>0
	detalles[contador,2]<-detalles[contador,0]*detalles[contador,1]
	detalles[contador,3]<-detalles[contador,2]/1.12
	detalles[contador,4]<-detalles[contador,3]*0.05
	
	contador<-contador+1
	escribir "producto registrado correctamente"
FinSubAlgoritmo
////////////////77
SubAlgoritmo mostrar_lista(nombres Por Referencia, detalles Por Referencia, contador)
	Limpiar Pantalla
	
	escribir "----------------TOTAL DE PRODUCTOS--------------"
	escribir " PRODUCTO |PRECIO|CANTIDAD|TOTAL | IVA | ISR |"
	para i<-0 hasta contador-1 con paso 1 hacer
		escribir Sin Saltar nombres[i],"| "
		escribir Sin Saltar detalles[i,0],"| "
		escribir Sin Saltar detalles[i,1],"| "
		escribir Sin Saltar detalles[i,2],"| "
		Escribir sin saltar detalles[i,3],"| "
		escribir sin saltar detalles[i,4],"| "
		escribir ""
		
	FinPara
	
	escribir "gracias por su compra"
	
FinSubAlgoritmo