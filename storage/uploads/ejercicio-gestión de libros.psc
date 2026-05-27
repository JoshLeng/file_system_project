Algoritmo biblioteca
	definir respuesta como entero
	definir libros Como Caracter
	////libros: título, autor, año de publicación, estado (diponible/prestado)
	Dimension libros[100,4]
	respuesta<-0
	contador<-0
	
	
	mientras respuesta <> 5 hacer
		Escribir "-----------------MENÚ----------------"
		Escribir "---Por favor marque una opción de las siguientes---"
		escribir "1- Añadir nuevos libros"
		escribir "2- Prestar libros"
		escribir "3- Devolver libros"
		escribir "4- mostrar todos los libros disponibles"
		escribir "5- salir"
		leer respuesta
	

		según respuesta hacer
		caso 1: //añadir libros
		añadir_libros(libros, contador)
		caso 2: // prestar libros
		prestar_libros(libros,contador)
		caso 3: // devolver libros
		devolver_libros(libros,contador)
		caso 4: //mostrar libros disponibles
		mostrar_libros(libros,contador)
		caso 5: escribir "gracias por utilizar el sistema"
		de otro modo:
		escribir "opción no valida, inténtelo de nuevo"
		FinSegun
fin mientras
FinAlgoritmo


/////////////////////////////////////////////////////////////////////////////////////////////////7
SubAlgoritmo añadir_libros(libros Por Referencia, contador Por Referencia)
	Limpiar Pantalla
	si contador<100 entonces
		escribir "ingrese el nombre del libro que desea añadir: "
		leer libros[contador, 0]
		escribir "ingrese el autor del libro: "
		leer libros[contador, 1]
		escribir "ingrese el año de publicación del libro: "
		leer libros[contador, 2]
		libros[contador, 3]<-"disponible"
		contador<-contador+1
		escribir "libro añadido con éxito"
	SiNo
		escribir "la biblioteca está llena, No se pueden añadir más libros"
		
	FinSi
FinSubAlgoritmo
/////////////////////////////////////////////////////////////////////////////////////////////////////
SubAlgoritmo prestar_libros(libros Por Referencia, contador)
	limpiar pantalla 
	definir título_buscado como cadena
	definir encontrado como lógico
	definir i como entero
	
	escribir "ingrese el título del libro que desea prestar: "
	leer título_buscado
	encontrado<-falso
	
	para i<-0 hasta contador-1 con paso 1 hacer
		si libros[i,0]=título_buscado entonces
			si libros[i,3]="disponible" entonces
				libros[i,3]<-"prestado"
				escribir "el libro: ¨", título_buscado, "¨ ha sido prestado correctamente"
			FinSi
			encontrado<-verdadero
			i<-contador
		FinSi
	FinPara
	si no encontrado entonces
		escribir" el libro: ", título_buscado, " no se encuentra en la biblioteca"
	FinSi
FinSubAlgoritmo
////////////////////////////////////////////////////////////////////////////////////////////////////////
SubAlgoritmo devolver_libros(libros Por Referencia, contador)
	Limpiar Pantalla
	definir título_buscado Como Caracter
	definir encontrado Como Logico
	definir i como entero
	encontrado<-falso
	
	escribir "ingrese el nombre del título que desea devolver: "
	leer título_buscado
	
	para i<-0 hasta contador-1 con paso 1 hacer
		si libros[i,0]=título_buscado entonces
			si libros[i,3]="prestado" entonces
				libros[i,3]<- "disponible"
				escribir "el libro: ",título_buscado," ha sido devuelto correctamente"
				encontrado<-verdadero
				i<-contador
			FinSi
		FinSi
	FinPara
	si no encontrado Entonces
		escribir "el libro: ",título_buscado," no se encuentra en la biblioteca"
	FinSi
FinSubAlgoritmo
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
SubAlgoritmo mostrar_libros(libros Por Referencia, contador)
	Limpiar Pantalla
	si contador=0 Entonces
		escribir "no hay libros disponibles"
	sino
		escribir "TÍTULO      |AUTOR       |FECHA DE PUBL   |   ESTADO      |" 
	para i<-0 hasta contador-1 con paso 1 Hacer
		escribir Sin saltar libros[i,0] " | "
		escribir Sin Saltar libros[i,1] " | "
		escribir sin saltar libros[i,2] " | "
		escribir Sin Saltar libros[i,3] " | "
		escribir ""
		
	FinPara
	escribir "----------------------------------------------"
	escribir "El número total de libros es: ", contador
FinSi
	
FinSubAlgoritmo
