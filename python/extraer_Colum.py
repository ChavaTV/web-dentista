import pandas as pd
# Ruta al archivo Excel
# articulos diti
#ruta_excel = 'catalogo.xlsx'
# artculos papeleria
ruta_excel = 'no_DITI.xls'

# Leer el archivo Excel
df = pd.read_excel(ruta_excel)

# Eliminar espacios en blanco de los nombres de las columnas
df.columns = df.columns.str.strip()
# Extraer la columna "Clave" y convertirla en una tupla
claves = tuple(df['Clave'].dropna().astype(str).str.strip())

# Mostrar el resultado
print(claves)