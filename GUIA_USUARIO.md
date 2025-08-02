# Mini Compilador MiniLang - Guía de Usuario

## Inicio Rápido

### Para usuarios sin Node.js
1. Descarga los ejecutables desde la carpeta `dist/`
2. Ejecuta directamente:
   ```cmd
   mini-compilador-minilang.exe mi_programa.minilang
   mini-compilador-interactivo.exe
   ```

### Para desarrolladores
1. Clona el repositorio
2. `npm install` (opcional - no hay dependencias externas)
3. `node compiler.js ejemplos/simple.minilang`

## Sintaxis del Lenguaje MiniLang

### Variables
```javascript
var x;           // Declaración
var y = 5;       // Declaración con inicialización
x = 10;          // Asignación
```

### Operadores Aritméticos
```javascript
suma = a + b;
resta = a - b;
producto = a * b;
division = a / b;
```

### Operadores de Comparación
```javascript
igual = (a == b);
diferente = (a != b);
menor = (a < b);
mayor = (a > b);
menor_igual = (a <= b);
mayor_igual = (a >= b);
```

### Estructuras de Control
```javascript
// Condicional
if (x > 5) {
    y = x * 2;
}

// Bucle
while (contador > 0) {
    contador = contador - 1;
}
```

### Comentarios
```javascript
// Este es un comentario de línea
var x = 5; // Comentario al final de línea
```

## Modo Interactivo

### Comandos Especiales
| Comando | Descripción |
|---------|-------------|
| `.help` | Muestra ayuda completa |
| `.ejemplo` | Muestra código de ejemplo |
| `.bloque` | Activa modo bloque |
| `.fin` | Ejecuta bloque de código |
| `.linea` | Activa modo línea por línea |
| `.clear` | Reinicia el compilador |
| `.salir` | Sale del programa |

### Ejemplo de Sesión Interactiva
```
MiniLang> var factorial;
MiniLang> factorial = 1;
MiniLang> var i;
MiniLang> i = 5;
MiniLang> while (i > 1) {
MiniLang>   factorial = factorial * i;
MiniLang>   i = i - 1;
MiniLang> }
```

## Archivos de Salida

El compilador genera automáticamente:

### `logs/programa_tabla_simbolos.txt`
```
TABLA DE SIMBOLOS
Nombre          Tipo            Valor           Linea
----------------------------------------
x               variable        10              1
y               variable        20              2
suma            variable        30              3
t0              temporal        30              -
```

### `logs/programa_codigo_intermedio.txt`
```
CODIGO INTERMEDIO (Codigo de Tres Direcciones)

1.      x = 10
2.      y = 20
3.      t0 = x + y
4.      suma = t0
```

### `logs/programa_resultado_ejecucion.txt`
```
RESULTADO DE EJECUCION

VARIABLES FINALES:
x = 10
y = 20
suma = 30
```

## Para Desarrolladores

### Crear Ejecutables
```bash
npm run build-win          # Windows
npm run build-linux        # Linux
npm run build-mac          # macOS
npm run build-interactivo  # Versión interactiva
npm run build-all          # Todas las plataformas
```

### Estructura del Código
- `lexer.js` - Análisis léxico (tokens)
- `parser.js` - Análisis sintáctico (AST)
- `symbolTable.js` - Gestión de variables
- `codeGenerator.js` - Código intermedio
- `evaluator.js` - Ejecución real
- `compiler.js` - Coordinador principal
- `interactivo.js` - Modo interactivo

## Manejo de Errores

El compilador detecta y reporta:
- Variables no declaradas
- Variables declaradas múltiples veces
- Errores de sintaxis
- Caracteres inválidos
- División por cero
- Paréntesis no balanceados
