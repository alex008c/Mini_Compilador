/**
 * Analizador Sintáctico para MiniLang
 * Genera un Árbol de Sintaxis Abstracta (AST)
 */

const { TipoToken } = require('./lexer');

// Nodos del AST
class NodoAST {
    constructor(tipo) {
        this.tipo = tipo;
    }
}

class NodoPrograma extends NodoAST {
    constructor(sentencias) {
        super('Programa');
        this.sentencias = sentencias;
    }
}

class NodoDeclaracion extends NodoAST {
    constructor(nombre, expresion, linea) {
        super('Declaracion');
        this.nombre = nombre;
        this.expresion = expresion;
        this.linea = linea;
    }
}

class NodoAsignacion extends NodoAST {
    constructor(nombre, expresion, linea) {
        super('Asignacion');
        this.nombre = nombre;
        this.expresion = expresion;
        this.linea = linea;
    }
}

class NodoIf extends NodoAST {
    constructor(condicion, bloqueIf, bloqueElse = null, linea) {
        super('If');
        this.condicion = condicion;
        this.bloqueIf = bloqueIf;
        this.bloqueElse = bloqueElse;
        this.linea = linea;
    }
}

class NodoWhile extends NodoAST {
    constructor(condicion, bloque, linea) {
        super('While');
        this.condicion = condicion;
        this.bloque = bloque;
        this.linea = linea;
    }
}

class NodoBloque extends NodoAST {
    constructor(sentencias) {
        super('Bloque');
        this.sentencias = sentencias;
    }
}

class NodoExpresionBinaria extends NodoAST {
    constructor(izquierda, operador, derecha) {
        super('ExpresionBinaria');
        this.izquierda = izquierda;
        this.operador = operador;
        this.derecha = derecha;
    }
}

class NodoNumero extends NodoAST {
    constructor(valor) {
        super('Numero');
        this.valor = valor;
    }
}

class NodoIdentificador extends NodoAST {
    constructor(nombre) {
        super('Identificador');
        this.nombre = nombre;
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.posicion = 0;
        this.tokenActual = this.tokens[0];
    }

    // Obtiene el token actual
    token() {
        return this.tokenActual;
    }

    // Avanza al siguiente token
    avanzar() {
        this.posicion++;
        if (this.posicion < this.tokens.length) {
            this.tokenActual = this.tokens[this.posicion];
        }
    }

    // Verifica si el token actual es del tipo esperado
    coincidir(tipoToken) {
        if (this.token().tipo === tipoToken) {
            const token = this.token();
            this.avanzar();
            return token;
        } else {
            throw new Error(`Se esperaba ${tipoToken}, pero se encontró ${this.token().tipo} en línea ${this.token().linea}`);
        }
    }

    // Parsea el programa completo
    parsearPrograma() {
        const sentencias = [];

        while (this.token().tipo !== TipoToken.EOF) {
            const sentencia = this.parsearSentencia();
            if (sentencia) {
                sentencias.push(sentencia);
            }
        }

        return new NodoPrograma(sentencias);
    }

    // Parsea una sentencia
    parsearSentencia() {
        switch (this.token().tipo) {
            case TipoToken.VAR:
                return this.parsearDeclaracion();
            case TipoToken.IDENTIFICADOR:
                return this.parsearAsignacion();
            case TipoToken.IF:
                return this.parsearIf();
            case TipoToken.WHILE:
                return this.parsearWhile();
            case TipoToken.LLAVE_IZQ:
                return this.parsearBloque();
            default:
                throw new Error(`Sentencia inesperada: ${this.token().tipo} en línea ${this.token().linea}`);
        }
    }

    // Parsea declaración de variable: var x = expresion;
    parsearDeclaracion() {
        this.coincidir(TipoToken.VAR);
        const nombre = this.coincidir(TipoToken.IDENTIFICADOR);
        this.coincidir(TipoToken.ASIGNACION);
        const expresion = this.parsearExpresion();
        this.coincidir(TipoToken.PUNTO_COMA);

        return new NodoDeclaracion(nombre.valor, expresion, nombre.linea);
    }

    // Parsea asignación: x = expresion;
    parsearAsignacion() {
        const nombre = this.coincidir(TipoToken.IDENTIFICADOR);
        this.coincidir(TipoToken.ASIGNACION);
        const expresion = this.parsearExpresion();
        this.coincidir(TipoToken.PUNTO_COMA);

        return new NodoAsignacion(nombre.valor, expresion, nombre.linea);
    }

    // Parsea estructura if
    parsearIf() {
        const tokenIf = this.coincidir(TipoToken.IF);
        this.coincidir(TipoToken.PARENTESIS_IZQ);
        const condicion = this.parsearExpresion();
        this.coincidir(TipoToken.PARENTESIS_DER);
        const bloqueIf = this.parsearSentencia();

        let bloqueElse = null;
        if (this.token().tipo === TipoToken.ELSE) {
            this.coincidir(TipoToken.ELSE);
            bloqueElse = this.parsearSentencia();
        }

        return new NodoIf(condicion, bloqueIf, bloqueElse, tokenIf.linea);
    }

    // Parsea estructura while
    parsearWhile() {
        const tokenWhile = this.coincidir(TipoToken.WHILE);
        this.coincidir(TipoToken.PARENTESIS_IZQ);
        const condicion = this.parsearExpresion();
        this.coincidir(TipoToken.PARENTESIS_DER);
        const bloque = this.parsearSentencia();

        return new NodoWhile(condicion, bloque, tokenWhile.linea);
    }

    // Parsea un bloque de código: { sentencias }
    parsearBloque() {
        this.coincidir(TipoToken.LLAVE_IZQ);
        const sentencias = [];

        while (this.token().tipo !== TipoToken.LLAVE_DER && this.token().tipo !== TipoToken.EOF) {
            const sentencia = this.parsearSentencia();
            if (sentencia) {
                sentencias.push(sentencia);
            }
        }

        this.coincidir(TipoToken.LLAVE_DER);
        return new NodoBloque(sentencias);
    }

    // Parsea expresiones con precedencia de operadores
    parsearExpresion() {
        return this.parsearComparacion();
    }

    // Parsea operadores de comparación (==, !=, <, >, <=, >=)
    parsearComparacion() {
        let nodo = this.parsearTermino();

        while ([TipoToken.IGUAL, TipoToken.DIFERENTE, TipoToken.MENOR,
                TipoToken.MAYOR, TipoToken.MENOR_IGUAL, TipoToken.MAYOR_IGUAL].includes(this.token().tipo)) {
            const operador = this.token();
            this.avanzar();
            const derecha = this.parsearTermino();
            nodo = new NodoExpresionBinaria(nodo, operador, derecha);
        }

        return nodo;
    }

    // Parsea términos (+ y -)
    parsearTermino() {
        let nodo = this.parsearFactor();

        while ([TipoToken.SUMA, TipoToken.RESTA].includes(this.token().tipo)) {
            const operador = this.token();
            this.avanzar();
            const derecha = this.parsearFactor();
            nodo = new NodoExpresionBinaria(nodo, operador, derecha);
        }

        return nodo;
    }

    // Parsea factores (* y /)
    parsearFactor() {
        let nodo = this.parsearPrimario();

        while ([TipoToken.MULTIPLICACION, TipoToken.DIVISION].includes(this.token().tipo)) {
            const operador = this.token();
            this.avanzar();
            const derecha = this.parsearPrimario();
            nodo = new NodoExpresionBinaria(nodo, operador, derecha);
        }

        return nodo;
    }

    // Parsea elementos primarios (números, identificadores, paréntesis)
    parsearPrimario() {
        if (this.token().tipo === TipoToken.NUMERO) {
            const token = this.token();
            this.avanzar();
            return new NodoNumero(token.valor);
        }

        if (this.token().tipo === TipoToken.IDENTIFICADOR) {
            const token = this.token();
            this.avanzar();
            return new NodoIdentificador(token.valor);
        }

        if (this.token().tipo === TipoToken.PARENTESIS_IZQ) {
            this.coincidir(TipoToken.PARENTESIS_IZQ);
            const expresion = this.parsearExpresion();
            this.coincidir(TipoToken.PARENTESIS_DER);
            return expresion;
        }

        throw new Error(`Token inesperado: ${this.token().tipo} en línea ${this.token().linea}`);
    }
}

module.exports = {
    Parser,
    NodoPrograma,
    NodoDeclaracion,
    NodoAsignacion,
    NodoIf,
    NodoWhile,
    NodoBloque,
    NodoExpresionBinaria,
    NodoNumero,
    NodoIdentificador
};
