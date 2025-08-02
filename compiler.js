/**
 * Compilador Principal para MiniLang
 * Coordina todos los componentes         } catch (error) {
            console.error(`Compilation phase error: ${error.message}`);
            this.errores.push(error.message);
            return {
                errores: this.errores,
                exito: false
            };
        }ilador
 */

const fs = require('fs');
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { TablaSimbolos } = require('./symbolTable');
const { GeneradorCodigo } = require('./codeGenerator');
const { Evaluador } = require('./evaluator');

class Compilador {
    constructor() {
        this.tablaSimbolos = new TablaSimbolos();
        this.errores = [];
    }

    // Compila un archivo fuente
    compilarArchivo(rutaArchivo) {
        try {
            console.log(`Compilando: ${rutaArchivo}`);

            // Lee el código fuente
            const codigo = fs.readFileSync(rutaArchivo, 'utf8');
            console.log('Codigo fuente cargado exitosamente');

            // Ejecuta las fases de compilación
            const resultado = this.compilar(codigo);

            // Guarda la salida
            this.guardarSalida(rutaArchivo, resultado);

            console.log('Compilacion y ejecucion completadas exitosamente');
            return resultado;

        } catch (error) {
            console.error(`Error de compilacion: ${error.message}`);
            this.errores.push(error.message);
            return null;
        }
    }    // Compila código fuente directamente
    compilar(codigo) {
        try {
            // Fase 1: Análisis Léxico
            console.log('Fase 1: Tokenizacion...');
            const lexer = new Lexer(codigo);
            const tokens = lexer.analizar();
            console.log(`Tokens: ${tokens.length - 1} generados`); // -1 por el EOF

            // Fase 2: Análisis Sintáctico
            console.log('Fase 2: Analizando AST...');
            const parser = new Parser(tokens);
            const ast = parser.parsearPrograma();
            console.log('AST analizado: completado');

            // Fase 3: Generación de Código Intermedio y Tabla de Símbolos
            console.log('Fase 3: Transformando AST...');
            const generador = new GeneradorCodigo(this.tablaSimbolos);
            const codigoIntermedio = generador.generar(ast);
            console.log('AST transformado: tabla de simbolos y codigo intermedio listos');

            // Fase 4: Ejecución del Código
            console.log('Fase 4: Generando codigo...');
            const evaluador = new Evaluador();
            const resultadoEjecucion = evaluador.ejecutar(codigoIntermedio, this.tablaSimbolos);
            console.log(`Codigo generado: ${codigoIntermedio.length} instrucciones ejecutadas`);            // Muestra los resultados
            this.mostrarResultados(tokens, ast, codigoIntermedio);

            return {
                tokens,
                ast,
                tablaSimbolos: this.tablaSimbolos,
                codigoIntermedio,
                resultadoEjecucion,
                exito: true
            };

        } catch (error) {
            console.error(`Error en fase de compilacion: ${error.message}`);
            this.errores.push(error.message);
            return {
                errores: this.errores,
                exito: false
            };
        }
    }

    // Muestra los resultados de la compilación
    mostrarResultados(tokens, ast, codigoIntermedio) {
        console.log('RESULTADOS DE COMPILACION');

        // Muestra tabla de símbolos
        this.tablaSimbolos.imprimir();

        // Muestra estadísticas
        const stats = this.tablaSimbolos.obtenerEstadisticas();
        console.log('ESTADISTICAS:');
        console.log(`Total simbolos: ${stats.totalSimbolos}`);
        console.log(`Variables de usuario: ${stats.variables}`);
        console.log(`Variables temporales: ${stats.temporales}`);
        console.log(`Variables inicializadas: ${stats.variablesInicializadas}`);

        // Muestra código intermedio
        const generador = new GeneradorCodigo(this.tablaSimbolos);
        generador.instrucciones = codigoIntermedio;
        generador.imprimir();
    }

    // Guarda la salida en archivos
    guardarSalida(rutaArchivo, resultado) {
        const path = require('path');
        const nombreArchivo = path.basename(rutaArchivo, path.extname(rutaArchivo));

        // Crea la carpeta logs si no existe
        const dirLogs = 'logs';
        if (!fs.existsSync(dirLogs)) {
            fs.mkdirSync(dirLogs);
        }

        try {
            // Guarda tabla de símbolos
            const archivoTabla = `${dirLogs}/${nombreArchivo}_tabla_simbolos.txt`;
            let contenidoTabla = 'TABLA DE SIMBOLOS\n';
            contenidoTabla += 'Nombre\t\tTipo\t\tValor\t\tLinea\n';
            contenidoTabla += '----------------------------------------\n';

            for (const [nombre, simbolo] of this.tablaSimbolos.simbolos) {
                const valor = simbolo.valor !== null ? simbolo.valor : 'indefinido';
                const linea = simbolo.linea !== null ? simbolo.linea : '-';
                contenidoTabla += `${nombre}\t\t${simbolo.tipo}\t\t${valor}\t\t${linea}\n`;
            }

            fs.writeFileSync(archivoTabla, contenidoTabla);
            console.log(`Tabla de simbolos guardada: ${archivoTabla}`);

            // Guarda código intermedio
            const archivoCodigo = `${dirLogs}/${nombreArchivo}_codigo_intermedio.txt`;
            let contenidoCodigo = 'CODIGO INTERMEDIO (Codigo de Tres Direcciones)\n\n';

            if (resultado.codigoIntermedio) {
                resultado.codigoIntermedio.forEach((instruccion, i) => {
                    contenidoCodigo += `${i + 1}.\t${instruccion.toString()}\n`;
                });
                fs.writeFileSync(archivoCodigo, contenidoCodigo);
                console.log(`Codigo intermedio guardado: ${archivoCodigo}`);
            }

            // Guarda resultado de ejecución si existe
            if (resultado.resultadoEjecucion) {
                const archivoEjecucion = `${dirLogs}/${nombreArchivo}_resultado_ejecucion.txt`;
                let contenidoEjecucion = 'RESULTADO DE EJECUCION\n\n';
                contenidoEjecucion += 'VARIABLES FINALES:\n';

                const variablesFinales = resultado.resultadoEjecucion.memoria;
                for (const [nombre, valor] of variablesFinales) {
                    if (!nombre.startsWith('t')) {
                        contenidoEjecucion += `${nombre} = ${valor}\n`;
                    }
                }

                fs.writeFileSync(archivoEjecucion, contenidoEjecucion);
                console.log(`Resultado de ejecucion guardado: ${archivoEjecucion}`);
            }

        } catch (error) {
            console.warn(`No se pudieron guardar los archivos de salida: ${error.message}`);
        }
    }

    // Obtiene estadísticas de compilación
    obtenerEstadisticas() {
        return {
            errores: this.errores.length,
            simbolos: this.tablaSimbolos.obtenerEstadisticas()
        };
    }
}

// Función principal para ejecutar desde línea de comandos
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Uso: node compiler.js <archivo.minilang>');
        console.log('\nEjemplo: node compiler.js ejemplos/programa.minilang');
        process.exit(1);
    }

    const rutaArchivo = args[0];

    // Verifica que el archivo existe
    if (!fs.existsSync(rutaArchivo)) {
        console.error(`Error: No se puede encontrar el archivo '${rutaArchivo}'`);
        process.exit(1);
    }

    // Crea y ejecuta el compilador
    const compilador = new Compilador();
    const resultado = compilador.compilarArchivo(rutaArchivo);

    if (resultado && resultado.exito) {
        const stats = compilador.obtenerEstadisticas();
        console.log(`Resumen: Compilacion y ejecucion exitosa con ${stats.simbolos.totalSimbolos} simbolos`);
        process.exit(0);
    } else {
        console.log('Compilacion fallida');
        process.exit(1);
    }
}

// Ejecuta si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { Compilador };
