import pyodbc, requests, json, time, os
from google import genai
from google.genai import types
import pandas as pd

# Get environment variables (passed from Node.js or from .env)
API_KEY = os.getenv('GEMINI_API_KEY') or os.getenv('VITE_GEMINI_API_KEY') or ''
cliente = genai.Client(api_key=API_KEY)
SERVIDOR = os.getenv('SERVER') or ''
USERNAME = os.getenv('UID') or ''
PASSWORD = os.getenv('PWD') or ''
NEWS_API_KEY = os.getenv('NEWS_API_KEY') or os.getenv('VITE_NEWS_API_KEY') or ''

def connect(SERVIDOR, DB, USERNAME, PASSWORD):
    conn = pyodbc.connect(f"""
        DRIVER=SQL Server;
        SERVER={SERVIDOR};
        DATABASE={DB};
        UID={USERNAME};
        PWD={PASSWORD};
        TrustServerCertificate=yes;
    """)
    cursor = conn.cursor()
    return conn, cursor

def getNewsAPI():
    try:
        url = f'https://gnews.io/api/v4/search?q="Finanzas"&lang=es&max=10&apikey={NEWS_API_KEY}'
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            # Imprimir el código de error si la API falla
            print(f"Error HTTP de GNews: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error al obtener las noticias: {str(e)}")
        return None

def getNewsDB():
    """
    Obtiene noticias de la API, las filtra contra la DB y trae todas las noticias (viejas) de la DB.
    Devuelve siempre una tupla (articulos_nuevos_unicos, noticias_viejas_db).
    """
    try:
        conn, cursor = connect(f'{SERVIDOR}', 'fincoach', f'{USERNAME}', f'{PASSWORD}')
        if not (conn and cursor):
            return [], [] # Si falla la conexión a la DB

        # 1. Obtener todas las noticias existentes en la DB para el cálculo final
        cursor.execute('SELECT Titulo, Resumen, Sentimiento FROM dbo.Noticias')
        NoticiasDBA = cursor.fetchall()

        news_data = getNewsAPI()
        ArticulosUnicos = [] # Lista para los artículos nuevos

        if news_data and news_data.get('articles'):
            # 2. Obtener solo los títulos para el filtrado rápido
            cursor.execute('SELECT Titulo FROM dbo.Noticias')
            TitulosDB = {noticia[0] for noticia in cursor.fetchall()}

            # 3. Filtrar artículos nuevos
            for articulo in news_data['articles']:
                titulo = articulo.get('title')
                if titulo not in TitulosDB:
                    ArticulosUnicos.append(articulo)

        # 4. Devuelve siempre 2 elementos: la lista de los artículos nuevos y la lista completa de la DB
        return ArticulosUnicos, NoticiasDBA

    except Exception as e:
        print(f"Error en getNewsDB: {str(e)}")
        # Devuelve listas vacías en caso de excepción de conexión
        return [], []

def getGEMINIlabels():
    """
    Analiza las noticias únicas con Gemini. Devuelve 3 valores:
    respuestas_gemini, noticias_viejas_db, y la lista de artículos nuevos originales.
    """
    # news ahora se llama new_articles (ArticulosUnicos)
    new_articles, NoticiasDBA = getNewsDB()
    responses = []
    _to_gemini = {}

    prompt = """Analiza el sentimiento de las siguientes noticias y devuelve la respuesta como una lista JSON.
    Cada elemento debe tener el título, un resumen corto (si es posible),
    y un campo 'sentimiento' que indique si es positivo o negativo. Absolutamente todo es en finanzas, pero solo dame el JSON,
    no me devuelvas nada más de texto, solo el JSON con tu predicción, el cual debe contener titulo, resumen y el sentimiento que le determines (se preciso por favor).\n"""

    # 💡 Se usa el cliente definido globalmente, no se redefine aquí

    if new_articles: # Solo procede si hay artículos nuevos
        for noticia in new_articles:
            titulo = noticia['title']
            contenido = noticia['description']
            _to_gemini[titulo] = contenido

        for titulo, resumen in _to_gemini.items():
            respuesta = cliente.models.generate_content(
                model="gemini-2.5-flash",
                config = types.GenerateContentConfig(
                    system_instruction='Eres un analista de sentimientos de noticias sobre finanzas y en base al sentimiento que predomina en la noticia, decir si esa noticia, puede o no afectar a las finanzas de un usuario',
                    temperature=0.1
                ),
                contents=f"{prompt}Titulo: {titulo}\nResumen: {resumen}"
            )
            responses.append(respuesta)

        print(f"Respuestas de Gemini: {len(responses)}, Noticias de DB: {len(NoticiasDBA)}")
        # Devuelve 3 elementos: respuestas de Gemini, noticias viejas de DB, artículos nuevos (para la inserción)
        return responses, NoticiasDBA, new_articles
    else:
        # 💡 Solución al TypeError: Devuelve siempre los 3 elementos, vacíos si no hay noticias nuevas
        print(f"No hay noticias nuevas para analizar. Noticias de DB: {len(NoticiasDBA)}")
        return [], NoticiasDBA, []

def updateNews(articles, contenido, sentimiento):
    """Inserta las noticias que fueron analizadas por Gemini."""
    if not articles:
        print("No hay noticias nuevas para insertar en la base de datos.")
        return

    aux=0
    conn, cursor = connect(f'{SERVIDOR}', 'fincoach', f'{USERNAME}', f'{PASSWORD}')

    if not (conn and cursor):
        print("Error: Falló la conexión a la base de datos para la inserción.")
        return

    for article in articles:
        # Usamos los datos originales de la API (URL, Fecha, Fuente)
        title = article['title']
        url = article['url']
        fecha = article['publishedAt']
        fuente = article['source']['name']

        # Usamos los datos analizados por Gemini (Resumen, Sentimiento)
        resumen = contenido[aux]
        emocion = sentimiento[aux]

        cursor.execute("INSERT INTO dbo.Noticias (Titulo, Resumen, URL, FechaPublicacion, Fuente, Sentimiento) VALUES (?, ?, ?, ?, ?, ?)", (title, resumen, url, fecha, fuente, emocion))
        aux += 1

    cursor.commit()
    conn.close()
    print(f"✅ {aux} noticias nuevas han sido insertadas y la conexión se ha cerrado.")

def getMercadoStress():
    tic = time.time()
    # 🚨 Se desempaquetan 3 valores:
    responses, NoticiasDBA, articulos_nuevos = getGEMINIlabels()

    respuestas_nuevas = []

    if responses:
        # 1. Parsear las respuestas de Gemini (solo las noticias NUEVAS)
        for response in responses:
            response_text = response.candidates[0].content.parts[0].text
            # Intento robusto de extraer JSON
            try:
                # Busca el bloque JSON
                start = response_text.find("```json")
                end = response_text.find("```", start + 1)

                if start != -1 and end != -1:
                    json_data = response_text[start + len("```json"):end].strip()
                    respuestas_nuevas.extend(json.loads(json_data))
                else:
                    # En caso de que Gemini no use el formato ```json
                    respuestas_nuevas.extend(json.loads(response_text.strip()))
            except Exception as e:
                 print(f"⚠️ Error al parsear JSON de Gemini: {e}. Respuesta cruda: {response_text[:100]}...")
                 continue

    # --- 2. Preparar los datos para el cálculo (combinando nuevos y viejos) ---
    noticias, contenido, sentimiento = [], [], []

    # Añadir las noticias nuevas (analizadas por Gemini)
    for respuesta in respuestas_nuevas:
        noticias.append(respuesta['titulo'])
        contenido.append(respuesta['resumen'])
        sentimiento.append(respuesta['sentimiento'])

    # Añadir las noticias viejas (de la DB)
    for noticia in NoticiasDBA:
        noticias.append(noticia[0])
        contenido.append(noticia[1])
        sentimiento.append(noticia[2])

    df = pd.DataFrame({'Titulo': noticias, 'Resumen': contenido, 'Sentimiento': sentimiento})
    total = len(df)

    if total == 0:
        print("No hay datos históricos ni nuevos para calcular el estrés del mercado.")
        return 0, 0, 0 # Retorna neutro si no hay datos

    mapeo = {'positivo': 1, 'negativo': 0}
    df['Sentimiento'] = df['Sentimiento'].map(mapeo)
    print("\n--- DataFrame Completo ---")
    print(df)

    P = df[df['Sentimiento'] == 1]
    N = df[df['Sentimiento'] == 0]
    promP = len(P)/total
    promN = len(N)/total

    if promP > promN:
        mercado = 1 # Positivo/Optimista
    else:
        mercado = 0 # Negativo/Estresado

    # --- 3. Actualización de la DB (Solo las noticias nuevas analizadas) ---

    #Solo se insertan los nuevos artículos y sus resúmenes/sentimientos.
    num_nuevas_analizadas = len(respuestas_nuevas)

    if num_nuevas_analizadas > 0:
        # 'articulos_nuevos' contiene la URL, Fecha, etc. (lo que necesita updateNews)
        # 'contenido' y 'sentimiento' son listas que tienen los resultados de Gemini al inicio.
        updateNews(
            articulos_nuevos,
            contenido[:num_nuevas_analizadas],
            sentimiento[:num_nuevas_analizadas]
        )
    else:
        print("El cálculo se hizo solo con noticias históricas. No se requirió actualizar la DB.")

    toc = time.time()
    print(f'\nTiempo de ejecución total: {toc - tic} segundos')
    return mercado, promP, promN

getMercadoStress()
