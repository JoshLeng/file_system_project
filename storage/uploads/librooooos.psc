Algoritmo librooooos
	definir respuesta como entero
	definir libros Como Caracter
		Dimension libros[100,4]
	contador<-0
	respuesta<-0
	
	mientras respuesta<>5 Hacer
		escribir "para agregar un libro presione 1"
		escribir "para prestar un libro presione 2"
		escribir "para devolver un libro presione 3"
		escribir "para ver la lista de libros presione 4"
		escribir "para cerrar el sistema presione 5"
		leer respuesta
		
		según respuesta hacer
	caso 1: 
		agregar_libro(libros, contador)
	caso 2: 
		prestar_libro(libros, contador)
	caso 3: 
		devolver_libro(libros, contador)
	caso 4:
		ver_lista(libros, contador)
	caso 5: 
		escribir "gracias por utilizar el sistema de biblioteca"
		escribir "cerrando el sistema..."
	de otro modo: 
		escribir "ingrese una opción válida, inténtelo de nuevo" 
FinSegun
	FinMientras
FinAlgoritmo
//////////////////////////////
SubAlgoritmo agregar_libro(libros Por Referencia, contador Por Referencia)
	
	si contador<100 Entonces
		
		escribir "ingrese el nombre del libro que desea registrar: "
		leer libros[contador, 0]
		escribir "ingrese el autor del libro: "
		leer libros[contador, 1]
		escribir "ingrese la fecha de publicación: "
		leer libros[contador, 2]
		libros[contador,3]<-"disponible"
		contador<-contador+1
	SiNo
		escribir "no hay suficiente espacio para almacenar más libros"
	FinSi
FinSubAlgoritmo
////////////////////////////////////////
SubAlgoritmo prestar_libro(libros Por Referencia, contador)
	definir título_buscado como caracter
	para i<-0 hasta contador-1 con paso 1 Hacer
		escribir "ingrese el título del libro que desea buscar: "
		leer título_buscado
		si libros[i,0]=título_buscado Entonces
			si libros[i,3]="disponible" Entonces
				libros[i,3]<-"prestado"
			sino 
				escribir "El libro no se encuentra registrado"
			FinSi
		FinSi
	FinPara
FinSubAlgoritmo
////////////////////////////
SubAlgoritmo devolver_libro(libros Por Referencia, contador)
	definir título_devuelto Como Caracter
	
	para i<-0 hasta contador-1 con paso 1 hacer
		escribir "Ingrese el nombre del libro que desea devolver: "
		leer título_devuelto
		si libros[i,0]=título_devuelto Entonces
			si libros[i,3]="prestado" Entonces
				libros[i,3]="disponible"
			sino
				escribir "el título que desea devolver no se encuentre en los sistemas"
			FinSi
		FinSi
	FinPara
FinSubAlgoritmo
///////////////////////////////
SubAlgoritmo ver_lista(libros Por Referencia, contador)
	Si contador=0 entonces
		escribir "no hay libros registrados en el sistema"
		sino 
	Escribir "NOMBRE  |  AUTOR   |   FECHA DE PUBLI   |  ESTADO  |"
	PARA i<-0 hasta contador-1 con paso 1 hacer
		escribir Sin Saltar libros[i, 0] " |"
		escribir Sin Saltar libros[i, 1] " |"
		escribir Sin Saltar libros[i, 2] " |"
		escribir Sin Saltar libros[i, 3] " |"
		escribir ""
	FinPara
FinSi
	
	FinSubAlgoritmo


