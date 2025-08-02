# Documentación Técnica - Mini Compilador MiniLang

## Arquitectura del Compilador

### Fases de Compilación

1. **Análisis Léxico (lexer.js)**
   - Convierte caracteres en tokens
   - Identifica palabras reservadas, operadores, números e identificadores
   - Maneja comentarios de línea (`//`)
   - Reporta errores léxicos con posición

2. **Análisis Sintáctico (parser.js)**
   - Implementa parser recursivo descendente
   - Genera Árbol de Sintaxis Abstracta (AST)
   - Maneja precedencia de operadores
   - Reporta errores sintácticos

3. **Tabla de Símbolos (symbolTable.js)**
   - Almacena información de variables
   - Genera variables temporales
   - Verifica declaraciones y uso de variables

4. **Generación de Código Intermedio (codeGenerator.js)**
   - Genera código de tres direcciones
   - Recorre el AST y emite instrucciones
   - Maneja estructuras de control con etiquetas

## Gramática de MiniLang

```
programa → sentencia*

sentencia → declaracion
          | asignacion
          | if_stmt
          | while_stmt
          | bloque

declaracion → 'var' ID '=' expresion ';'

asignacion → ID '=' expresion ';'

if_stmt → 'if' '(' expresion ')' sentencia ('else' sentencia)?

while_stmt → 'while' '(' expresion ')' sentencia

bloque → '{' sentencia* '}'

expresion → comparacion

comparacion → termino (('==' | '!=' | '<' | '>' | '<=' | '>=') termino)*

termino → factor (('+' | '-') factor)*

factor → primario (('*' | '/') primario)*

primario → NUMERO
         | ID
         | '(' expresion ')'
```

## Tipos de Tokens

- **Literales**: NUMERO, IDENTIFICADOR
- **Palabras clave**: VAR, IF, ELSE, WHILE
- **Operadores**: +, -, *, /, =
- **Comparadores**: ==, !=, <, >, <=, >=
- **Delimitadores**: ;, (, ), {, }

## Código Intermedio

El compilador genera código de tres direcciones con las siguientes instrucciones:

- `ASSIGN`: Asignación simple
- `ADD, SUB, MUL, DIV`: Operaciones aritméticas
- `EQ, NE, LT, GT, LE, GE`: Comparaciones
- `LABEL`: Etiquetas para saltos
- `GOTO`: Salto incondicional
- `IF_FALSE, IF_TRUE`: Saltos condicionales

### Ejemplo de Salida

Para el código:
```
var x = 5;
if (x > 3) {
    x = x + 1;
}
```

Se genera:
```
1. x = 5
2. t0 = x > 3
3. if_false t0 goto L1
4. t1 = x + 1
5. x = t1
6. L1:
```

## Manejo de Errores

El compilador detecta y reporta:
- Errores léxicos (caracteres inválidos)
- Errores sintácticos (sintaxis incorrecta)
- Errores semánticos básicos (variables no declaradas)

## Archivos de Salida

Para cada compilación se generan:
- `archivo_tabla_simbolos.txt`: Tabla de símbolos completa
- `archivo_codigo_intermedio.txt`: Código de tres direcciones

## Limitaciones Actuales

- Solo maneja enteros
- No hay funciones ni procedimientos
- Scope global únicamente
- Sin optimizaciones de código
