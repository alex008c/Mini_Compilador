class Simbolo {
    constructor(nombre, tipo, valor = null, linea = null) {
        this.nombre = nombre;
        this.tipo = tipo; // 'variable', 'temporal'
        this.valor = valor;
        this.linea = linea; // Línea donde se declaró
        this.inicializado = valor !== null;
    }
}

class TablaSimbolos {
    constructor() {
        this.simbolos = new Map();
        this.contadorTemporales = 0;
    }

    // Inserta un nuevo símbolo
    insertar(nombre, tipo, valor = null, linea = null) {
        if (this.simbolos.has(nombre)) {
            throw new Error(`Variable '${nombre}' ya está declarada (línea ${linea})`);
        }

        const simbolo = new Simbolo(nombre, tipo, valor, linea);
        this.simbolos.set(nombre, simbolo);
        return simbolo;
    }

    // Busca un símbolo
    buscar(nombre) {
        return this.simbolos.get(nombre) || null;
    }

    // Actualiza el valor de un símbolo existente
    actualizar(nombre, valor) {
        const simbolo = this.simbolos.get(nombre);
        if (!simbolo) {
            throw new Error(`Variable '${nombre}' no está declarada`);
        }
        simbolo.valor = valor;
        simbolo.inicializado = true;
        return simbolo;
    }

    // Genera una variable temporal única
    generarTemporal() {
        const nombre = `t${this.contadorTemporales++}`;
        const simbolo = new Simbolo(nombre, 'temporal');
        this.simbolos.set(nombre, simbolo);
        return simbolo;
    }

    // Verifica si una variable está declarada
    existe(nombre) {
        return this.simbolos.has(nombre);
    }

    // Obtiene todas las variables declaradas por el usuario
    obtenerVariables() {
        const variables = [];
        for (const [nombre, simbolo] of this.simbolos) {
            if (simbolo.tipo === 'variable') {
                variables.push(simbolo);
            }
        }
        return variables;
    }

    // Obtiene todas las variables temporales
    obtenerTemporales() {
        const temporales = [];
        for (const [nombre, simbolo] of this.simbolos) {
            if (simbolo.tipo === 'temporal') {
                temporales.push(simbolo);
            }
        }
        return temporales;
    }

    // Imprime la tabla de símbolos
    imprimir() {
        console.log('TABLA DE SIMBOLOS');
        console.log('Name\t\tType\t\tValue\t\tLine');
        console.log('----------------------------------------');

        for (const [nombre, simbolo] of this.simbolos) {
            const valor = simbolo.valor !== null ? simbolo.valor : 'indefinido';
            const linea = simbolo.linea !== null ? simbolo.linea : '-';
            console.log(`${nombre}\t\t${simbolo.tipo}\t\t${valor}\t\t${linea}`);
        }
    }

    // Obtiene estadísticas de la tabla
    obtenerEstadisticas() {
        const variables = this.obtenerVariables();
        const temporales = this.obtenerTemporales();

        return {
            totalSimbolos: this.simbolos.size,
            variables: variables.length,
            temporales: temporales.length,
            variablesInicializadas: variables.filter(v => v.inicializado).length
        };
    }
}

module.exports = { TablaSimbolos, Simbolo };
