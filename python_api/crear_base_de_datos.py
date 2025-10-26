import requests
import json
import sqlite3 # 1. Importamos la biblioteca para la base de datos

# --- CONFIGURACIÓN ---
API_KEY = '1c6deb4b1d193e6db2b2791d2d866e2a'
URL_BASE = 'http://api.nessieisreal.com'
params_llave = {'key': API_KEY}
# --- FIN CONFIGURACIÓN ---

def configurar_base_de_datos():
    """Crea (si no existen) las tablas en nuestra base de datos local."""
    # 2. Conectamos (o creamos) el archivo de la base de datos
    conn = sqlite3.connect('hackmty.db')
    cursor = conn.cursor()

    # 3. Definimos las tablas que queremos crear
    # Tabla para Clientes
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS clientes (
        customer_id TEXT PRIMARY KEY,
        first_name TEXT,
        last_name TEXT
    )
    ''')
    
    # Tabla para Cuentas
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS cuentas (
        account_id TEXT PRIMARY KEY,
        customer_id TEXT,
        nickname TEXT,
        balance REAL,
        FOREIGN KEY (customer_id) REFERENCES clientes (customer_id)
    )
    ''')

    # Tabla para Transferencias
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transferencias (
        transfer_id TEXT PRIMARY KEY,
        from_account_id TEXT,
        to_account_id TEXT,
        amount REAL,
        description TEXT,
        status TEXT,
        FOREIGN KEY (from_account_id) REFERENCES cuentas (account_id),
        FOREIGN KEY (to_account_id) REFERENCES cuentas (account_id)
    )
    ''')
    
    # 4. Guardamos los cambios y cerramos la conexión por ahora
    conn.commit()
    conn.close()
    print("Base de datos 'hackmty.db' configurada.")

def crear_cliente_y_cuenta(first_name, last_name, nickname, balance):
    """Función para crear un cliente y su primera cuenta."""
    
    # --- Crear Cliente ---
    endpoint_cliente = f"{URL_BASE}/customers"
    datos_cliente = {
        "first_name": first_name, "last_name": last_name,
        "address": {"street_number": "123", "street_name": "Calle API", "city": "HACKMTY", "state": "NL", "zip": "64000"}
    }
    response_cliente = requests.post(endpoint_cliente, params=params_llave, json=datos_cliente)
    if response_cliente.status_code != 201:
        print(f"Error creando cliente {first_name}: {response_cliente.text}")
        return None, None
    
    cliente = response_cliente.json()['objectCreated']
    customer_id = cliente['_id']
    print(f"Cliente creado: {first_name} (ID: {customer_id})")
    
    # --- Crear Cuenta ---
    endpoint_cuenta = f"{URL_BASE}/customers/{customer_id}/accounts"
    datos_cuenta = {"type": "Checking", "nickname": nickname, "rewards": 0, "balance": balance}
    
    response_cuenta = requests.post(endpoint_cuenta, params=params_llave, json=datos_cuenta)
    if response_cuenta.status_code != 201:
        print(f"Error creando cuenta para {first_name}: {response_cuenta.text}")
        return customer_id, None
        
    cuenta = response_cuenta.json()['objectCreated']
    account_id = cuenta['_id']
    print(f"Cuenta creada: {nickname} (ID: {account_id})")
    
    return customer_id, account_id

# --- INICIA EL SCRIPT PRINCIPAL ---

print("--- PASO 1: Configurando la base de datos... ---")
configurar_base_de_datos()

print("\n--- PASO 2: Creando Clientes y Cuentas... ---")
# Creamos el primer cliente y su cuenta (el que paga)
cliente_A_id, cuenta_A_id = crear_cliente_y_cuenta("Fernando", "Patricio", "Mi Cuenta Principal", 10000)

# Creamos el segundo cliente y su cuenta (el que recibe)
cliente_B_id, cuenta_B_id = crear_cliente_y_cuenta("Mi", "Pana", "Cuenta de mi Pana", 500)

if not (cliente_A_id and cuenta_A_id and cliente_B_id and cuenta_B_id):
    print("Error crítico al crear clientes o cuentas. Abortando.")
    exit()

print("\n--- PASO 3: Creando la Transferencia... ---")
# ¡Esta es la parte nueva que tú querías!
# Usamos POST a /accounts/{ID_DE_QUIEN_PAGA}/transfers
endpoint_transfer = f"{URL_BASE}/accounts/{cuenta_A_id}/transfers"

monto_transferencia = 750
datos_transferencia = {
    "medium": "balance",         # El dinero sale del 'balance'
    "payee_id": cuenta_B_id,     # El ID de la cuenta que RECIBE
    "amount": monto_transferencia,
    "transaction_date": "2025-10-25", # Usando la fecha de hoy
    "description": "Prueba de pago para HackMTY"
}

response_transfer = requests.post(endpoint_transfer, params=params_llave, json=datos_transferencia)

if response_transfer.status_code == 201: # 201 = "Creado"
    transferencia = response_transfer.json()['objectCreated']
    transfer_id = transferencia['_id']
    status = transferencia['status']
    print(f"¡Transferencia creada con ID: {transfer_id} y estado: {status}!")
    
    print("\n--- PASO 4: Guardando todo en la base de datos local... ---")
    
    # 5. Volvemos a conectar y guardamos TODO en el archivo hackmty.db
    conn = sqlite3.connect('hackmty.db')
    cursor = conn.cursor()
    
    try:
        # Guardar clientes
        cursor.execute("INSERT INTO clientes (customer_id, first_name, last_name) VALUES (?, ?, ?)",
                       (cliente_A_id, "Fernando", "Patricio"))
        cursor.execute("INSERT INTO clientes (customer_id, first_name, last_name) VALUES (?, ?, ?)",
                       (cliente_B_id, "Mi", "Pana"))
                       
        # Guardar cuentas
        cursor.execute("INSERT INTO cuentas (account_id, customer_id, nickname, balance) VALUES (?, ?, ?, ?)",
                       (cuenta_A_id, cliente_A_id, "Mi Cuenta Principal", 10000))
        cursor.execute("INSERT INTO cuentas (account_id, customer_id, nickname, balance) VALUES (?, ?, ?, ?)",
                       (cuenta_B_id, cliente_B_id, "Cuenta de mi Pana", 500))

        # Guardar la transferencia
        cursor.execute("INSERT INTO transferencias (transfer_id, from_account_id, to_account_id, amount, description, status) VALUES (?, ?, ?, ?, ?, ?)",
                       (transfer_id, cuenta_A_id, cuenta_B_id, monto_transferencia, "Prueba de pago para HackMTY", status))
        
        conn.commit() # ¡Guardar todos los cambios!
        print("¡Éxito! Todos los datos fueron guardados en 'hackmty.db'.")
        
    except sqlite3.Error as e:
        print(f"Error al guardar en la base de datos: {e}")
    finally:
        conn.close() # Siempre cerrar la conexión

else:
    print(f"Error al crear la transferencia: {response_transfer.text}")