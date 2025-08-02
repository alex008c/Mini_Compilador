/**
 * Generador de Código Intermedio para MiniLang
 * Genera código de tres direcciones a partir del AST
 */

const { TipoToken } = require('./lexer');

class Instruccion {
    constructor(operacion, arg1 = null, arg2 = null, resultado = null) {
        this.operacion = operacion;
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.resultado = resultado;
    }

    toString() {
        switch (this.operacion) {
            case 'ASSIGN':
                return `${this.resultado} = ${this.arg1}`;
            case 'ADD':
            case 'SUB':
            case 'MUL':
            case 'DIV':
            case 'EQ':
            case 'NE':
            case 'LT':
            case 'GT':
            case 'LE':
            case 'GE':
                const op = this.obtenerOperadorTexto();
                return `${this.resultado} = ${this.arg1} ${op} ${this.arg2}`;
            case 'LABEL':
                return `${this.arg1}:`;
            case 'GOTO':
                return `goto ${this.arg1}`;
            case 'IF_FALSE':
                return `if_false ${this.arg1} goto ${this.arg2}`;
            case 'IF_TRUE':
                return `if_true ${this.arg1} goto ${this.arg2}`;
            default:
                return `${this.operacion} ${this.arg1} ${this.arg2} ${this.resultado}`;
        }
    }

    obtenerOperadorTexto() {
        const operadores = {
            'ADD': '+',
            'SUB': '-',
            'MUL': '*',
            'DIV': '/',
            'EQ': '==',
            'NE': '!=',
            'LT': '<',
            'GT': '>',
            'LE': '<=',
            'GE': '>='
        };
        return operadores[this.operacion] || this.operacion;
    }
}

class GeneradorCodigo {
    constructor(tablaSimbolos) {
        this.tablaSimbolos = tablaSimbolos;
        this.instrucciones = [];
        this.contadorEtiquetas = 0;
    }

    // Genera una etiqueta única
    generarEtiqueta() {
        return `L${this.contadorEtiquetas++}`;
    }

    // Agrega una instrucción
    emitir(operacion, arg1 = null, arg2 = null, resultado = null) {
        const instruccion = new Instruccion(operacion, arg1, arg2, resultado);
        this.instrucciones.push(instruccion);
        return instruccion;
    }

    // Genera código para el programa completo
    generar(ast) {
        this.visitarNodo(ast);
        return this.instrucciones;
    }

    // Visitador de nodos del AST
    visitarNodo(nodo) {
        switch (nodo.tipo) {
            case 'Programa':
                return this.visitarPrograma(nodo);
            case 'Declaracion':
                return this.visitarDeclaracion(nodo);
            case 'Asignacion':
                return this.visitarAsignacion(nodo);
            case 'If':
                return this.visitarIf(nodo);
            case 'While':
                return this.visitarWhile(nodo);
            case 'Bloque':
                return this.visitarBloque(nodo);
            case 'ExpresionBinaria':
                return this.visitarExpresionBinaria(nodo);
            case 'Numero':
                return this.visitarNumero(nodo);
            case 'Identificador':
                return this.visitarIdentificador(nodo);
            default:
                throw new Error(`Tipo de nodo no reconocido: ${nodo.tipo}`);
        }
    }

    visitarPrograma(nodo) {
        for (const sentencia of nodo.sentencias) {
            this.visitarNodo(sentencia);
        }
    }

    visitarDeclaracion(nodo) {
        // Registra la variable en la tabla de símbolos
        this.tablaSimbolos.insertar(nodo.nombre, 'variable', null, nodo.linea);

        // Genera código para la expresión
        const expresionResult = this.visitarNodo(nodo.expresion);

        // Asigna el valor a la variable
        this.emitir('ASSIGN', expresionResult, null, nodo.nombre);

        return nodo.nombre;
    }

    visitarAsignacion(nodo) {
        // Verifica que la variable esté declarada
        if (!this.tablaSimbolos.existe(nodo.nombre)) {
            throw new Error(`Variable '${nodo.nombre}' no está declarada (línea ${nodo.linea})`);
        }

        // Genera código para la expresión
        const expresionResult = this.visitarNodo(nodo.expresion);

        // Asigna el valor a la variable
        this.emitir('ASSIGN', expresionResult, null, nodo.nombre);

        return nodo.nombre;
    }

    visitarIf(nodo) {
        // Genera código para la condición
        const condicion = this.visitarNodo(nodo.condicion);

        const etiquetaElse = this.generarEtiqueta();
        const etiquetaFin = this.generarEtiqueta();

        // Si la condición es falsa, salta al bloque else o al final
        this.emitir('IF_FALSE', condicion, etiquetaElse);

        // Genera código para el bloque if
        this.visitarNodo(nodo.bloqueIf);

        // Si hay bloque else, salta al final después del bloque if
        if (nodo.bloqueElse) {
            this.emitir('GOTO', etiquetaFin);
        }

        // Etiqueta del bloque else
        this.emitir('LABEL', etiquetaElse);

        // Genera código para el bloque else si existe
        if (nodo.bloqueElse) {
            this.visitarNodo(nodo.bloqueElse);
        }

        // Etiqueta del final
        if (nodo.bloqueElse) {
            this.emitir('LABEL', etiquetaFin);
        }
    }

    visitarWhile(nodo) {
        const etiquetaInicio = this.generarEtiqueta();
        const etiquetaFin = this.generarEtiqueta();

        // Etiqueta del inicio del bucle
        this.emitir('LABEL', etiquetaInicio);

        // Genera código para la condición
        const condicion = this.visitarNodo(nodo.condicion);

        // Si la condición es falsa, sale del bucle
        this.emitir('IF_FALSE', condicion, etiquetaFin);

        // Genera código para el cuerpo del bucle
        this.visitarNodo(nodo.bloque);

        // Salta al inicio del bucle
        this.emitir('GOTO', etiquetaInicio);

        // Etiqueta del final del bucle
        this.emitir('LABEL', etiquetaFin);
    }

    visitarBloque(nodo) {
        for (const sentencia of nodo.sentencias) {
            this.visitarNodo(sentencia);
        }
    }

    visitarExpresionBinaria(nodo) {
        // Genera código para los operandos
        const izquierda = this.visitarNodo(nodo.izquierda);
        const derecha = this.visitarNodo(nodo.derecha);

        // Genera una variable temporal para el resultado
        const temporal = this.tablaSimbolos.generarTemporal();

        // Mapea el token del operador a la operación
        const operacion = this.mapearOperacion(nodo.operador);

        // Emite la instrucción
        this.emitir(operacion, izquierda, derecha, temporal.nombre);

        return temporal.nombre;
    }

    visitarNumero(nodo) {
        return nodo.valor.toString();
    }

    visitarIdentificador(nodo) {
        // Verifica que la variable esté declarada
        if (!this.tablaSimbolos.existe(nodo.nombre)) {
            throw new Error(`Variable '${nodo.nombre}' no está declarada`);
        }

        return nodo.nombre;
    }

    // Mapea tokens de operadores a códigos de operación
    mapearOperacion(tokenOperador) {
        const operaciones = {
            [TipoToken.SUMA]: 'ADD',
            [TipoToken.RESTA]: 'SUB',
            [TipoToken.MULTIPLICACION]: 'MUL',
            [TipoToken.DIVISION]: 'DIV',
            [TipoToken.IGUAL]: 'EQ',
            [TipoToken.DIFERENTE]: 'NE',
            [TipoToken.MENOR]: 'LT',
            [TipoToken.MAYOR]: 'GT',
            [TipoToken.MENOR_IGUAL]: 'LE',
            [TipoToken.MAYOR_IGUAL]: 'GE'
        };

        return operaciones[tokenOperador.tipo] || 'UNKNOWN';
    }

    // Imprime el código intermedio generado
    imprimir() {
        console.log('CODIGO INTERMEDIO (Codigo de Tres Direcciones)');
        for (let i = 0; i < this.instrucciones.length; i++) {
            console.log(`${i + 1}.\t${this.instrucciones[i].toString()}`);
        }
    }
}

module.exports = { GeneradorCodigo, Instruccion };
