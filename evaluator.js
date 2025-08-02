/**
 * Evaluador/Intérprete para MiniLang
 * Ejecuta el código intermedio de tres direcciones
 */

class Evaluador {
    constructor() {
        this.memoria = new Map(); // Almacena valores de variables
        this.pila = []; // Pila para operaciones
        this.pc = 0; // Contador de programa (Program Counter)
        this.ejecutando = true;
        this.salida = [];
        this.etiquetas = new Map(); // Mapea etiquetas a posiciones
    }

    // Ejecuta el código intermedio
    ejecutar(instrucciones, tablaSimbolos) {
        console.log('Ejecutando programa...');

        // Inicializa la memoria con variables de la tabla de símbolos
        this.inicializarMemoria(tablaSimbolos);

        // Encuentra todas las etiquetas primero
        this.mapearEtiquetas(instrucciones);

        this.pc = 0;
        this.ejecutando = true;

        while (this.ejecutando && this.pc < instrucciones.length) {
            const instruccion = instrucciones[this.pc];
            this.ejecutarInstruccion(instruccion);

            // Si no es un salto, avanza al siguiente
            if (this.ejecutando) {
                this.pc++;
            }
        }

        console.log('Programa ejecutado exitosamente');
        this.mostrarResultadoFinal();

        return {
            memoria: this.memoria,
            salida: this.salida,
            exito: true
        };
    }

    // Inicializa la memoria con variables conocidas
    inicializarMemoria(tablaSimbolos) {
        for (const [nombre, simbolo] of tablaSimbolos.simbolos) {
            if (simbolo.tipo === 'variable') {
                this.memoria.set(nombre, simbolo.valor || 0);
            } else if (simbolo.tipo === 'temporal') {
                this.memoria.set(nombre, 0);
            }
        }
    }

    // Mapea etiquetas a sus posiciones
    mapearEtiquetas(instrucciones) {
        for (let i = 0; i < instrucciones.length; i++) {
            const instruccion = instrucciones[i];
            if (instruccion.operacion === 'LABEL') {
                this.etiquetas.set(instruccion.arg1, i);
            }
        }
    }

    // Ejecuta una instrucción individual
    ejecutarInstruccion(instruccion) {
        // Solo muestra instrucciones importantes (no etiquetas ni temporales muy frecuentes)
        if (instruccion.operacion !== 'LABEL' && !this.esInstruccionTemporal(instruccion)) {
            console.log(`Ejecutando: ${instruccion.toString()}`);
        }

        switch (instruccion.operacion) {
            case 'ASSIGN':
                this.ejecutarAsignacion(instruccion);
                break;
            case 'ADD':
                this.ejecutarOperacion(instruccion, (a, b) => a + b);
                break;
            case 'SUB':
                this.ejecutarOperacion(instruccion, (a, b) => a - b);
                break;
            case 'MUL':
                this.ejecutarOperacion(instruccion, (a, b) => a * b);
                break;
            case 'DIV':
                this.ejecutarOperacion(instruccion, (a, b) => {
                    if (b === 0) {
                        throw new Error('División por cero detectada');
                    }
                    return Math.floor(a / b); // División entera
                });
                break;
            case 'EQ':
                this.ejecutarOperacion(instruccion, (a, b) => a === b ? 1 : 0);
                break;
            case 'NE':
                this.ejecutarOperacion(instruccion, (a, b) => a !== b ? 1 : 0);
                break;
            case 'LT':
                this.ejecutarOperacion(instruccion, (a, b) => a < b ? 1 : 0);
                break;
            case 'GT':
                this.ejecutarOperacion(instruccion, (a, b) => a > b ? 1 : 0);
                break;
            case 'LE':
                this.ejecutarOperacion(instruccion, (a, b) => a <= b ? 1 : 0);
                break;
            case 'GE':
                this.ejecutarOperacion(instruccion, (a, b) => a >= b ? 1 : 0);
                break;
            case 'LABEL':
                // Las etiquetas no hacen nada durante la ejecución
                break;
            case 'GOTO':
                this.ejecutarSalto(instruccion.arg1);
                break;
            case 'IF_FALSE':
                this.ejecutarSaltoCondicional(instruccion, false);
                break;
            case 'IF_TRUE':
                this.ejecutarSaltoCondicional(instruccion, true);
                break;
            default:
                throw new Error(`Operación no reconocida: ${instruccion.operacion}`);
        }

        // Solo muestra el estado para operaciones importantes
        if (this.esOperacionImportante(instruccion)) {
            this.mostrarEstado();
        }
    }

    // Verifica si es una instrucción temporal frecuente
    esInstruccionTemporal(instruccion) {
        return instruccion.resultado && instruccion.resultado.startsWith('t') && 
               ['ADD', 'SUB', 'MUL', 'DIV', 'EQ', 'NE', 'LT', 'GT', 'LE', 'GE'].includes(instruccion.operacion);
    }

    // Verifica si es una operación importante para mostrar estado
    esOperacionImportante(instruccion) {
        return instruccion.operacion === 'ASSIGN' && !instruccion.resultado.startsWith('t');
    }

    // Ejecuta asignación
    ejecutarAsignacion(instruccion) {
        const valor = this.obtenerValor(instruccion.arg1);
        this.memoria.set(instruccion.resultado, valor);
    }

    // Ejecuta operaciones binarias
    ejecutarOperacion(instruccion, operacion) {
        const val1 = this.obtenerValor(instruccion.arg1);
        const val2 = this.obtenerValor(instruccion.arg2);
        const resultado = operacion(val1, val2);
        this.memoria.set(instruccion.resultado, resultado);
    }

    // Ejecuta salto incondicional
    ejecutarSalto(etiqueta) {
        if (this.etiquetas.has(etiqueta)) {
            this.pc = this.etiquetas.get(etiqueta);
        } else {
            throw new Error(`Etiqueta no encontrada: ${etiqueta}`);
        }
    }

    // Ejecuta salto condicional
    ejecutarSaltoCondicional(instruccion, condicionEsperada) {
        const condicion = this.obtenerValor(instruccion.arg1);
        const esVerdadero = condicion !== 0;

        if (esVerdadero === condicionEsperada) {
            this.ejecutarSalto(instruccion.arg2);
        }
    }

    // Obtiene el valor de una variable o constante
    obtenerValor(operando) {
        // Si es un número, lo devuelve directamente
        if (!isNaN(operando)) {
            return parseInt(operando);
        }

        // Si es una variable, busca en memoria
        if (this.memoria.has(operando)) {
            return this.memoria.get(operando);
        }

        throw new Error(`Variable no definida: ${operando}`);
    }

    // Muestra el estado actual de las variables
    mostrarEstado() {
        const variablesUsuario = [];
        for (const [nombre, valor] of this.memoria) {
            if (!nombre.startsWith('t')) { // Solo variables del usuario
                variablesUsuario.push(`${nombre}=${valor}`);
            }
        }

        if (variablesUsuario.length > 0) {
            console.log(`State: [${variablesUsuario.join(', ')}]`);
        }
    }

    // Muestra el resultado final
    mostrarResultadoFinal() {
        console.log('RESULTADO DE EJECUCION');
        console.log('Final variables:');
        for (const [nombre, valor] of this.memoria) {
            if (!nombre.startsWith('t')) { // Solo variables del usuario
                console.log(`  ${nombre} = ${valor}`);
            }
        }
    }

    // Obtiene todas las variables del usuario y sus valores
    obtenerVariablesFinales() {
        const variables = {};
        for (const [nombre, valor] of this.memoria) {
            if (!nombre.startsWith('t')) {
                variables[nombre] = valor;
            }
        }
        return variables;
    }
}

module.exports = { Evaluador };
