#!/usr/bin/env node

/**
 * Versión interactiva del compilador MiniLang
 * Permite escribir código directamente en la consola
 */

const readline = require('readline');
const { Compilador } = require('./compiler');

// Configura la interfaz de readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'MiniLang> '
});

let modo = 'linea'; // 'linea' o 'bloque'
let codigoAcumulado = '';
let compilador = new Compilador();

console.log('=== COMPILADOR MINILANG INTERACTIVO ===');
console.log('Comandos especiales:');
console.log('  .help    - Muestra esta ayuda');
console.log('  .ejemplo - Muestra un ejemplo de código');
console.log('  .clear   - Limpia el compilador');
console.log('  .bloque  - Modo bloque (escribe varias líneas, termina con .fin)');
console.log('  .linea   - Modo línea (ejecuta cada línea inmediatamente)');
console.log('  .salir   - Sale del programa');
console.log('');
console.log('Modo actual: línea por línea');
console.log('Escribe tu código MiniLang:');

rl.prompt();

rl.on('line', (input) => {
    const comando = input.trim();

    // Comandos especiales
    if (comando.startsWith('.')) {
        switch (comando) {
            case '.help':
                mostrarAyuda();
                break;
            case '.ejemplo':
                mostrarEjemplo();
                break;
            case '.clear':
                compilador = new Compilador();
                codigoAcumulado = '';
                console.log('Compilador reiniciado');
                break;
            case '.bloque':
                modo = 'bloque';
                codigoAcumulado = '';
                console.log('Modo bloque activado. Escribe tu código, termina con .fin');
                break;
            case '.linea':
                modo = 'linea';
                codigoAcumulado = '';
                console.log('Modo línea activado. Cada línea se ejecuta inmediatamente');
                break;
            case '.fin':
                if (modo === 'bloque') {
                    ejecutarCodigo(codigoAcumulado);
                    codigoAcumulado = '';
                } else {
                    console.log('.fin solo funciona en modo bloque');
                }
                break;
            case '.salir':
                console.log('¡Hasta luego!');
                process.exit(0);
                break;
            default:
                console.log(`Comando desconocido: ${comando}`);
                console.log('Usa .help para ver los comandos disponibles');
        }
    } else if (comando === '') {
        // Línea vacía, no hacer nada
    } else {
        // Código normal
        if (modo === 'bloque') {
            codigoAcumulado += comando + '\n';
            console.log(`  ${codigoAcumulado.split('\n').length - 1}: ${comando}`);
        } else {
            // Modo línea - ejecutar inmediatamente
            ejecutarCodigo(comando);
        }
    }

    rl.prompt();
});

rl.on('close', () => {
    console.log('\n¡Hasta luego!');
    process.exit(0);
});

function ejecutarCodigo(codigo) {
    if (!codigo.trim()) {
        console.log('No hay código para ejecutar');
        return;
    }

    console.log('\nEjecutando...');
    console.log('─'.repeat(50));

    try {
        const resultado = compilador.compilar(codigo);
        
        if (resultado && resultado.exito) {
            console.log('─'.repeat(50));
            console.log('Ejecución completada exitosamente');
        } else {
            console.log('─'.repeat(50));
            console.log('Error en la compilación');
        }
    } catch (error) {
        console.log('─'.repeat(50));
        console.error(`Error: ${error.message}`);
    }
    
    console.log('');
}

function mostrarAyuda() {
    console.log('\n=== AYUDA DEL COMPILADOR MINILANG ===');
    console.log('');
    console.log('SINTAXIS DEL LENGUAJE:');
    console.log('  var nombre;              - Declara una variable');
    console.log('  nombre = expresion;      - Asigna un valor');
    console.log('  if (condicion) { ... }   - Condicional');
    console.log('  while (condicion) { ... } - Bucle');
    console.log('  // comentario            - Comentarios');
    console.log('');
    console.log('OPERADORES:');
    console.log('  + - * /                  - Aritméticos');
    console.log('  == != < > <= >=         - Comparación');
    console.log('');
    console.log('COMANDOS ESPECIALES:');
    console.log('  .bloque   - Escribe múltiples líneas');
    console.log('  .fin      - Termina el bloque y ejecuta');
    console.log('  .linea    - Ejecuta línea por línea');
    console.log('  .clear    - Reinicia el compilador');
    console.log('  .ejemplo  - Muestra código de ejemplo');
    console.log('  .salir    - Sale del programa');
    console.log('');
}

function mostrarEjemplo() {
    console.log('\n=== EJEMPLO DE CÓDIGO MINILANG ===');
    console.log('');
    console.log('// Ejemplo simple:');
    console.log('var a;');
    console.log('var b;');
    console.log('a = 5;');
    console.log('b = 3;');
    console.log('var suma;');
    console.log('suma = a + b;');
    console.log('');
    console.log('// Con condicional:');
    console.log('if (suma > 7) {');
    console.log('  suma = suma * 2;');
    console.log('}');
    console.log('');
    console.log('// Con bucle:');
    console.log('var contador;');
    console.log('contador = 3;');
    console.log('while (contador > 0) {');
    console.log('  contador = contador - 1;');
    console.log('}');
    console.log('');
    console.log('Tip: Usa .bloque para escribir código de múltiples líneas');
    console.log('');
}
