# Mini Compilador MiniLang - Ejecutables

## Descripción
Compilador completo para el lenguaje MiniLang que incluye:
- Analizador léxico (Lexer)
- Analizador sintáctico (Parser)
- Tabla de símbolos
- Generador de código intermedio
- Intérprete/Evaluador para ejecución real
- **Modo interactivo** para escribir código en tiempo real

## Archivos del Ejecutable

### `dist/mini-compilador-minilang.exe` (37.7 MB)
- **Ejecutable para compilar archivos** que no requiere Node.js instalado
- Incluye todo el runtime de Node.js y las dependencias
- Funciona en cualquier Windows x64

### `dist/mini-compilador-interactivo.exe` (37.7 MB)  
- **Ejecutable interactivo** para escribir código en tiempo real
- Modo consola interactiva con comandos especiales
- Perfecto para experimentación y aprendizaje

## Uso de los Ejecutables

### Compilador de Archivos
```bash
# Ejecutar desde cualquier ubicación
.\mini-compilador-minilang.exe archivo.minilang

# Ejemplo con el archivo incluido
.\mini-compilador-minilang.exe ejemplos\simple.minilang
```

### Compilador Interactivo
```bash
# Ejecutar modo interactivo
.\mini-compilador-interactivo.exe

# Luego escribes código directamente:
MiniLang> var x;
MiniLang> x = 5;
MiniLang> var y;
MiniLang> y = x * 2;
```

## Características del Ejecutable
- **Portable**: No requiere instalación de Node.js
- **Completo**: Incluye todos los archivos de ejemplo
- **Salidas en español**: Interfaz en español para presentación académica
- **Archivos de log**: Genera automáticamente archivos en carpeta `logs/`

## Estructura de Salida
El ejecutable genera automáticamente:
- `logs/archivo_tabla_simbolos.txt` - Tabla de símbolos
- `logs/archivo_codigo_intermedio.txt` - Código intermedio generado
- `logs/archivo_resultado_ejecucion.txt` - Resultado de la ejecución

## Ventajas del Ejecutable
1. **Distribución fácil**: Un solo archivo .exe
2. **Sin dependencias**: No necesita Node.js en la máquina destino
3. **Presentación profesional**: Para entregas universitarias
4. **Cross-platform**: Se pueden generar ejecutables para Linux y macOS

## Comandos de Build Disponibles
```bash
npm run build-win    # Windows x64
npm run build-linux  # Linux x64  
npm run build-mac    # macOS x64
npm run build-all    # Todos los sistemas
```
