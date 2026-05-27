Algoritmo gestióncaja
	definir respuesta Como Entero
	definir libros como caracter
	respuesta<-0
	contador<-0
	
	dimension libros[100,4]
	
	mientras respuesta<>5 Hacer
		escribir "presione 1 para agregar un libro"
		escribir "presione 2 para prestar un libro"
		escribir "presione 3 para devolver un libro"
		escribir "presione 4 para ver la lista de libros disponibles"
		escribir "presione 5 para salir del sistema"
		leer respuesta
		
		segun respuesta Hacer
			caso 1: //agregar un libro
				agregar_libro(libros, contador)
			caso 2://prestar un libro
				prestar_libro(libros, contador)
			caso 3: //devolver un libro
				devolver_libro(libros, contador)
			caso 4: //ver la lista de libros
				ver_libros(libros, contador)
			caso 5: //salir del sistema
				escribir "Gracias por utilizar el sistema"
				escribir "saliendo..."
			De Otro Modo:
				escribir "por favor ingrese una opción válida"
		FinSegun
		
	FinMientras
FinAlgoritmo
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
SubAlgoritmo agregar_libro(libros Por Referencia,contador por referencia)
	
	si contador<100 entonces
		escribir "por favor ingrese el nombre del libro que desea agregar: "
		leer libros[contador,0]
		escribir "ingrese el autor del libro que desea agregar: "
		leer libros[contador,1]
		escribir "ingrese la fecha de publicación: "
		leer libros[contador,2]
		libros[contador,3]<-"disponible"
		contador<-contador+1
		
	SiNo
		escribir "no hay espacio suficiente para agregar otro libro"
	FinSi
FinSubAlgoritmo
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
SubAlgoritmo prestar_libro(libros Por Referencia, contador)
	definir título_buscado como caracter
	
	escribir "ingrese el nombre del libro que desea prestar: "
	leer título_buscado
	
	para i<-0 hasta contador-1 con paso 1 hacer
		si libros[i,0]=título_buscado Entonces
						si libros[i,3]="disponible" Entonces
							libros[i,3]<-"prestado"
						FinSi
				FinSi
			finpara
	
FinSubAlgoritmo
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
SubAlgoritmo devolver_libro(libros Por Referencia, contador)
	definir titulo_regresado Como Caracter
	
	escribir "escriba el nombre del libro que desea devolver: "
	leer título_regresado
	para i<-0 hasta contador-1 con paso 1 hacer 
		si título_regresado=libros[i,0] Entonces
			si libros[i,3]="prestado" Entonces
				libros[i,3]<-"disponible"
			FinSi
		FinSi
	FinPara
FinSubAlgoritmo
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
SubAlgoritmo ver_libros(libros Por Referencia, contador)
	si contador=0 Entonces
		escribir "no hay libros disponibles"
		sino
	
	escribir "NOMBRE  | AUTOR  |  FECHA DE PUBLI| ESTADO    |"
	
	para i<-0 hasta contador-1 con paso 1 Hacer
		Escribir Sin Saltar libros[i,0] "| "
		Escribir Sin Saltar libros[i,1] "| "
		Escribir Sin Saltar libros[i,2] "| "
		Escribir Sin Saltar libros[i,3] "| "
		escribir ""
	FinPara
FinSi
FinSubAlgoritmo


