/**
 * Analizador Léxico para MiniLang
 * Convierte el código fuente en una secuencia de tokens
 */

class Token {
    constructor(tipo, valor, linea, columna) {
        this.tipo = tipo;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
}

// Tipos de tokens
const TipoToken = {
    // Literales
    NUMERO: 'NUMERO',
    IDENTIFICADOR: 'IDENTIFICADOR',

    // Palabras clave
    VAR: 'VAR',
    IF: 'IF',
    ELSE: 'ELSE',
    WHILE: 'WHILE',

    // Operadores
    SUMA: 'SUMA',
    RESTA: 'RESTA',
    MULTIPLICACION: 'MULTIPLICACION',
    DIVISION: 'DIVISION',
    ASIGNACION: 'ASIGNACION',

    // Comparadores
    IGUAL: 'IGUAL',
    DIFERENTE: 'DIFERENTE',
    MENOR: 'MENOR',
    MAYOR: 'MAYOR',
    MENOR_IGUAL: 'MENOR_IGUAL',
    MAYOR_IGUAL: 'MAYOR_IGUAL',

    // Delimitadores
    PUNTO_COMA: 'PUNTO_COMA',
    PARENTESIS_IZQ: 'PARENTESIS_IZQ',
    PARENTESIS_DER: 'PARENTESIS_DER',
    LLAVE_IZQ: 'LLAVE_IZQ',
    LLAVE_DER: 'LLAVE_DER',

    // Especiales
    EOF: 'EOF',
    COMENTARIO: 'COMENTARIO'
};

class Lexer {
    constructor(codigo) {
        this.codigo = codigo;
        this.posicion = 0;
        this.linea = 1;
        this.columna = 1;
        this.tokens = [];

        // Palabras reservadas
        this.palabrasReservadas = {
            'var': TipoToken.VAR,
            'if': TipoToken.IF,
            'else': TipoToken.ELSE,
            'while': TipoToken.WHILE
        };
    }

    // Obtiene el caracter actual
    caracterActual() {
        if (this.posicion >= this.codigo.length) {
            return null;
        }
        return this.codigo[this.posicion];
    }

    // Avanza a la siguiente posición
    avanzar() {
        if (this.caracterActual() === '\n') {
            this.linea++;
            this.columna = 1;
        } else {
            this.columna++;
        }
        this.posicion++;
    }

    // Salta espacios en blanco
    saltarEspacios() {
        while (this.caracterActual() && /\s/.test(this.caracterActual())) {
            this.avanzar();
        }
    }

    // Lee un número
    leerNumero() {
        let numero = '';
        while (this.caracterActual() && /\d/.test(this.caracterActual())) {
            numero += this.caracterActual();
            this.avanzar();
        }
        return parseInt(numero);
    }

    // Lee un identificador o palabra reservada
    leerIdentificador() {
        let identificador = '';
        while (this.caracterActual() && /[a-zA-Z_]\w*/.test(this.caracterActual())) {
            identificador += this.caracterActual();
            this.avanzar();
        }
        return identificador;
    }

    // Lee un comentario
    leerComentario() {
        let comentario = '';
        this.avanzar(); // Salta el primer /
        this.avanzar(); // Salta el segundo /

        while (this.caracterActual() && this.caracterActual() !== '\n') {
            comentario += this.caracterActual();
            this.avanzar();
        }
        return comentario;
    }

    // Analiza el código y genera tokens
    analizar() {
        while (this.posicion < this.codigo.length) {
            this.saltarEspacios();

            if (!this.caracterActual()) {
                break;
            }

            const caracter = this.caracterActual();
            const linea = this.linea;
            const columna = this.columna;

            // Números
            if (/\d/.test(caracter)) {
                const numero = this.leerNumero();
                this.tokens.push(new Token(TipoToken.NUMERO, numero, linea, columna));
            }
            // Identificadores y palabras reservadas
            else if (/[a-zA-Z_]/.test(caracter)) {
                const identificador = this.leerIdentificador();
                const tipo = this.palabrasReservadas[identificador] || TipoToken.IDENTIFICADOR;
                this.tokens.push(new Token(tipo, identificador, linea, columna));
            }
            // Comentarios
            else if (caracter === '/' && this.codigo[this.posicion + 1] === '/') {
                const comentario = this.leerComentario();
                // Los comentarios se ignoran en el análisis
            }
            // Operadores de dos caracteres
            else if (caracter === '=' && this.codigo[this.posicion + 1] === '=') {
                this.tokens.push(new Token(TipoToken.IGUAL, '==', linea, columna));
                this.avanzar();
                this.avanzar();
            }
            else if (caracter === '!' && this.codigo[this.posicion + 1] === '=') {
                this.tokens.push(new Token(TipoToken.DIFERENTE, '!=', linea, columna));
                this.avanzar();
                this.avanzar();
            }
            else if (caracter === '<' && this.codigo[this.posicion + 1] === '=') {
                this.tokens.push(new Token(TipoToken.MENOR_IGUAL, '<=', linea, columna));
                this.avanzar();
                this.avanzar();
            }
            else if (caracter === '>' && this.codigo[this.posicion + 1] === '=') {
                this.tokens.push(new Token(TipoToken.MAYOR_IGUAL, '>=', linea, columna));
                this.avanzar();
                this.avanzar();
            }
            // Operadores de un caracter
            else {
                switch (caracter) {
                    case '+':
                        this.tokens.push(new Token(TipoToken.SUMA, caracter, linea, columna));
                        break;
                    case '-':
                        this.tokens.push(new Token(TipoToken.RESTA, caracter, linea, columna));
                        break;
                    case '*':
                        this.tokens.push(new Token(TipoToken.MULTIPLICACION, caracter, linea, columna));
                        break;
                    case '/':
                        this.tokens.push(new Token(TipoToken.DIVISION, caracter, linea, columna));
                        break;
                    case '=':
                        this.tokens.push(new Token(TipoToken.ASIGNACION, caracter, linea, columna));
                        break;
                    case '<':
                        this.tokens.push(new Token(TipoToken.MENOR, caracter, linea, columna));
                        break;
                    case '>':
                        this.tokens.push(new Token(TipoToken.MAYOR, caracter, linea, columna));
                        break;
                    case ';':
                        this.tokens.push(new Token(TipoToken.PUNTO_COMA, caracter, linea, columna));
                        break;
                    case '(':
                        this.tokens.push(new Token(TipoToken.PARENTESIS_IZQ, caracter, linea, columna));
                        break;
                    case ')':
                        this.tokens.push(new Token(TipoToken.PARENTESIS_DER, caracter, linea, columna));
                        break;
                    case '{':
                        this.tokens.push(new Token(TipoToken.LLAVE_IZQ, caracter, linea, columna));
                        break;
                    case '}':
                        this.tokens.push(new Token(TipoToken.LLAVE_DER, caracter, linea, columna));
                        break;
                    default:
                        throw new Error(`Caracter inesperado '${caracter}' en línea ${linea}, columna ${columna}`);
                }
                this.avanzar();
            }
        }

        // Token EOF
        this.tokens.push(new Token(TipoToken.EOF, null, this.linea, this.columna));
        return this.tokens;
    }
}

module.exports = { Lexer, Token, TipoToken };
