Algoritmo Cajaregistradora
	Dimension detalles[100, 3]
	Dimension names1[100]
	
	producto <- ""
	cantidad <- 0
	precio <- 0
	total <- 0
	option <- 0
	contador <- 0
	
	Escribir "-----------CAJA REGISTRADORA-----------"
	Escribir "Presione 1 para iniciar o 2 para cerrar la caja."
	Leer option
	
	Mientras option = 1 Hacer
		Si option = 1 Entonces
			Repetir
				Escribir "Ingrese el nombre del producto: "
				Leer names2
				Escribir "Ingrese la cantidad del producto: "
				Leer cantidad
				Escribir "Ingrese el precio unitario del producto: "
				Leer precio
				total <- cantidad * precio
				names1[contador] <- names2
				detalles[contador, 0] <- cantidad
				detalles[contador, 1] <- precio
				detalles[contador, 2] <- total
				
				contador <- contador + 1
				Escribir "Presione 1 para realizar otro registro, o presione 2 para cerrar la caja."
				Leer option
			Hasta Que option = 2
		FinSi
	FinMientras
	
	Limpiar Pantalla

	Escribir "----------LISTA DE PRODUCTOS REGISTRADOS-----------"
	Para i <- 0 Hasta contador - 1 Con Paso 1 Hacer
		Escribir "Producto: ", names1[i], " | Cantidad: ", detalles[i, 0], " | Precio: ", detalles[i, 1], " | Total: ", detalles[i, 2]
	Fin Para
	
	Escribir "CAJA CERRADA-------MUCHAS GRACIAS"
FinAlgoritmo
