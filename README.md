# Mini Compilador + Intérprete - MiniLang
Semana 7 | Compiladores | minilang
## Descripción
Este es un compilador completo para el lenguaje de programación "MiniLang" que no solo traduce código fuente a código intermedio de tres direcciones, sino que también **ejecuta el programa** y muestra los resultados. Incluye **modo interactivo** y **ejecutables portables**.

## Características
- Ejecutables portables (no requiere Node.js)
- Modo interactivo para escribir código en tiempo real
- Interfaz en español para presentación académica
- Archivos de salida organizados en carpeta `logs/`

## Características del Lenguaje MiniLang

### Sintaxis Básica:
- Declaración de variables: `var nombre = valor;`
- Asignaciones: `nombre = expresion;`
- Operaciones aritméticas: `+`, `-`, `*`, `/`
- Comparaciones: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Estructuras de control: `if`, `while`
- Bloques: `{ ... }`
- Comentarios: `// comentario`

### Ejemplo de Código MiniLang:
```
// Ejemplo simple
var a = 5;
var b = 3;
var suma = a + b;

if (suma > 7) {
    suma = suma * 2;
}

var contador = 2;
while (contador > 0) {
    contador = contador - 1;
}
```

## Componentes del Compilador

1. **Analizador Léxico** (`lexer.js`): Convierte el código fuente en tokens
2. **Analizador Sintáctico** (`parser.js`): Analiza la estructura gramatical y genera AST
3. **Tabla de Símbolos** (`symbolTable.js`): Maneja variables y su información
4. **Generador de Código Intermedio** (`codeGenerator.js`): Genera código de tres direcciones
5. **Evaluador/Intérprete** (`evaluator.js`): **EJECUTA** el código intermedio
6. **Compilador Principal** (`compiler.js`): Coordina todos los componentes

## Requisitos
- **Para ejecutar código fuente**: Node.js (versión 14 o superior)
- **Para ejecutables**: ¡Ninguno! Los ejecutables son portables

## Formas de Uso

### 1. Compilar archivos (con Node.js)
```bash
node compiler.js ejemplos/simple.minilang
```

### 2. Compilar archivos (ejecutable)
```bash
# Windows
.\dist\mini-compilador-minilang.exe ejemplos\simple.minilang
```

### 3. Modo interactivo (con Node.js)
```bash
node interactivo.js
```

### 4. Modo interactivo (ejecutable)
```bash
# Windows
.\dist\mini-compilador-interactivo.exe
```

## Comandos del Modo Interactivo
- `.help` - Muestra ayuda completa
- `.ejemplo` - Código de ejemplo
- `.bloque` - Modo bloque (múltiples líneas)
- `.fin` - Ejecuta el bloque de código
- `.linea` - Modo línea por línea
- `.clear` - Reinicia el compilador
- `.salir` - Sale del programa

## Salida
El compilador genera (en español):
- Ejecución real del programa paso a paso
- Valores finales de todas las variables
- Tabla de símbolos completa
- Código intermedio de tres direcciones
- Archivos de salida organizados en carpeta `logs/`
- Reportes de errores detallados (si los hay)

## Ejemplos de Salida
```
Fase 1: Tokenizacion...
Tokens: 50 generados
Fase 2: Analizando AST...
AST analizado: completado
Fase 3: Transformando AST...
AST transformado: tabla de simbolos y codigo intermedio listos
Fase 4: Generando codigo...
Ejecutando programa...
Programa ejecutado exitosamente
```

## Archivos Generados
- `logs/programa_tabla_simbolos.txt` - Tabla de símbolos
- `logs/programa_codigo_intermedio.txt` - Código intermedio
- `logs/programa_resultado_ejecucion.txt` - Resultado final

## Crear Ejecutables
```bash
npm run build-win          # Windows x64
npm run build-interactivo  # Versión interactiva
npm run build-all          # Todas las plataformas
```

## Ejemplos de Prueba
- `ejemplos/simple.minilang` - Programa básico completo

## Estructura del Proyecto
```
Mini_Compilador/
├── lexer.js              # Analizador léxico
├── parser.js             # Analizador sintáctico
├── symbolTable.js        # Tabla de símbolos
├── codeGenerator.js      # Generador de código
├── evaluator.js          # Intérprete/Evaluador
├── compiler.js           # Compilador principal
├── interactivo.js        # Modo interactivo
├── package.json          # Configuración del proyecto
├── ejemplos/             # Archivos de prueba
├── logs/                 # Archivos de salida
└── dist/                 # Ejecutables generados
    ├── mini-compilador-minilang.exe
    └── mini-compilador-interactivo.exe
```

---
**Proyecto Universitario - Compiladores**
**2025 - Mini Compilador con Intérprete Real**
