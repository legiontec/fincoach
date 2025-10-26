import requests
from flask import Flask, jsonify, request
import pyodbc
import os 
app = Flask(__name__)
API_KEY = '1c6deb4b1d193e6db2b2791d2d866e2a'
URL_BASE = 'http://api.nessieisreal.com'
params_llave = {'key': API_KEY}

# A1. GET /api/accounts (Get all accounts)
@app.route("/api/accounts")
def get_all_accounts():
    """Obtiene TODAS las cuentas asociadas con la API Key."""
    print("Pidiendo TODAS las cuentas")
    try:
        endpoint = f"{URL_BASE}/accounts"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# A2. GET /api/accounts/<id> (Get account by id)
@app.route("/api/accounts/<string:account_id>")
def get_account_by_id(account_id):
    """Obtiene una cuenta específica por su ID."""
    print(f"Pidiendo la cuenta con ID: {account_id}")
    try:
        endpoint = f"{URL_BASE}/accounts/{account_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# A3. GET /api/customers/<id>/accounts (Get accounts by customer id)
@app.route("/api/customers/<string:customer_id>/accounts")
def get_accounts_for_customer(customer_id):
    """Obtiene todas las cuentas de un cliente específico."""
    print(f"Pidiendo cuentas para el cliente: {customer_id}")
    try:
        endpoint = f"{URL_BASE}/customers/{customer_id}/accounts"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# A4. POST /api/customers/<id>/accounts (Create an account)
@app.route("/api/customers/<string:customer_id>/accounts", methods=['POST'])
def create_account_for_customer(customer_id):
    """Crea una cuenta "inventada" para un cliente."""
    print(f"Creando cuenta para el cliente: {customer_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/customers/{customer_id}/accounts"
        response_capital_one = requests.post(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 201:
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora guardamos en NUESTRA BD
        try:
            nuevo_objeto = datos_respuesta['objectCreated']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para insertar en la tabla Cuentas
            sql_query = """
                INSERT INTO Cuentas (account_id, customer_id, nickname, balance) 
                VALUES (?, ?, ?, ?)
            """
            
            # Ejecutamos el comando
            cursor.execute(
                sql_query, 
                nuevo_objeto['_id'],
                nuevo_objeto['customer_id'],
                nuevo_objeto['nickname'],
                nuevo_objeto['balance']
            )
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Cuenta {nuevo_objeto['_id']} guardada en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL GUARDAR EN BD!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# A5. PUT /api/accounts/<id> (Update a specific existing account)
@app.route("/api/accounts/<string:account_id>", methods=['PUT'])
def update_account_by_id(account_id):
    """Actualiza una cuenta (ej. cambiar el 'nickname')."""
    print(f"Actualizando la cuenta con ID: {account_id}")
    try:
        # 1. Obtenemos datos del frontend (ej. {"nickname": "Nuevo Apodo"})
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos para actualizar"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/accounts/{account_id}"
        response_capital_one = requests.put(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        # (El código de éxito para PUT suele ser 202: "Aceptado")
        if response_capital_one.status_code != 202:
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora actualizamos NUESTRA BD
        try:
            # Asumimos que el frontend solo envía los campos que quiere cambiar
            # Por ejemplo, si solo queremos cambiar el nickname:
            nickname_actualizado = datos_del_frontend['nickname']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para actualizar la tabla Cuentas
            sql_query = """
                UPDATE Cuentas 
                SET nickname = ? 
                WHERE account_id = ?
            """
            
            # Ejecutamos el comando
            cursor.execute(
                sql_query, 
                nickname_actualizado,
                account_id
            )
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Cuenta {account_id} actualizada en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ACTUALIZAR EN BD (Cuentas)!!: {db_error}")
            # NOTA: Esto asume que 'nickname' siempre viene. 
            # Un código más robusto construiría el SQL dinámicamente
            # basado en las llaves de 'datos_del_frontend', ¡pero esto funciona!

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# A6. DELETE /api/accounts/<id> (Delete a specific existing account)
@app.route("/api/accounts/<string:account_id>", methods=['DELETE'])
def delete_account_by_id(account_id):
    """Elimina una cuenta específica por su ID."""
    print(f"Eliminando la cuenta con ID: {account_id}")
    try:
        # 1. Llamamos a Capital One
        endpoint = f"{URL_BASE}/accounts/{account_id}"
        response_capital_one = requests.delete(endpoint, params=params_llave)

        # 2. Si Capital One falló, nos detenemos
        # (El código de éxito para DELETE suele ser 204: "Sin Contenido")
        if response_capital_one.status_code != 204:
            return jsonify(response_capital_one.json()), response_capital_one.status_code
        
        # 3. ¡ÉXITO! Ahora eliminamos de NUESTRA BD
        try:
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para eliminar de la tabla Cuentas
            sql_query = "DELETE FROM Cuentas WHERE account_id = ?"
            
            # Ejecutamos el comando
            cursor.execute(sql_query, account_id)
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Cuenta {account_id} eliminada de nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ELIMINAR EN BD (Cuentas)!!: {db_error}")

        # 4. Devolvemos la respuesta de Capital One al front-end
        # (Como es 204, no tiene cuerpo JSON, así que enviamos nuestro propio mensaje)
        return jsonify({"message": "Cuenta eliminada exitosamente"}), 204

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# B1. GET /api/atms/ (Get all ATMs)
@app.route("/api/atms")
def get_all_atms():
    """Obtiene todos los cajeros automáticos (ATMs)."""
    print("Pidiendo TODOS los cajeros automáticos (ATMs)")
    try:
        endpoint = f"{URL_BASE}/atms"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# B2. GET /api/atms/<id> (Get ATM by id)
@app.route("/api/atms/<string:atm_id>")
def get_atm_by_id(atm_id):
    """Obtiene un cajero automático (ATM) específico por su ID."""
    print(f"Pidiendo el cajero automático (ATM) con ID: {atm_id}")
    try:
        endpoint = f"{URL_BASE}/atms/{atm_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# C1. GET /api/accounts/<id>/bills (Get all bills for a specific account)
@app.route("/api/accounts/<string:account_id>/bills")
def get_bills_for_account(account_id):
    """Obtiene todas las facturas de una cuenta específica."""
    print(f"Pidiendo facturas para la cuenta: {account_id}")
    try:
        endpoint = f"{URL_BASE}/accounts/{account_id}/bills"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# C2. GET /api/bills/<id> (Get bill by id)
@app.route("/api/bills/<string:bill_id>")
def get_bill_by_id(bill_id):
    """Obtiene una factura específica por su ID."""
    print(f"Pidiendo la factura con ID: {bill_id}")
    try:
        endpoint = f"{URL_BASE}/bills/{bill_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# C3. GET /api/customers/<id>/bills (Get bills by customer id)
@app.route("/api/customers/<string:customer_id>/bills")
def get_bills_for_customer(customer_id):
    """Obtiene todas las facturas de un cliente específico."""
    print(f"Pidiendo facturas para el cliente: {customer_id}")
    try:
        endpoint = f"{URL_BASE}/customers/{customer_id}/bills"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# C4. POST /api/accounts/<id>/bills (Create a bill)
@app.route("/api/accounts/<string:account_id>/bills", methods=['POST'])
def create_bill_for_account(account_id):
    """Crea una factura "inventada" para una cuenta."""
    print(f"Creando factura para la cuenta: {account_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/accounts/{account_id}/bills"
        response_capital_one = requests.post(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 201:
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora guardamos en NUESTRA BD
        try:
            nuevo_objeto = datos_respuesta['objectCreated']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para insertar en la tabla Facturas
            sql_query = """
                INSERT INTO Facturas (bill_id, account_id, status, payee, payment_date, amount)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            
            # Ejecutamos el comando
            cursor.execute(
                sql_query, 
                nuevo_objeto['_id'],
                nuevo_objeto['account_id'],
                nuevo_objeto['status'],
                nuevo_objeto['payee'],
                nuevo_objeto['payment_date'],
                nuevo_objeto['amount']
            )
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Factura {nuevo_objeto['_id']} guardada en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL GUARDAR EN BD (Facturas)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# C5. PUT /api/bills/<id> (Update a specific existing bill)
@app.route("/api/bills/<string:bill_id>", methods=['PUT'])
def update_bill_by_id(bill_id):
    """Actualiza una factura específica."""
    print(f"Actualizando la factura con ID: {bill_id}")
    try:
        # 1. Obtenemos datos del frontend (ej. {"status": "cancelled"})
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos para actualizar"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/bills/{bill_id}"
        response_capital_one = requests.put(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 202: # 202 = "Aceptado"
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora actualizamos NUESTRA BD
        try:
            # Asumimos que el front-end envía los campos que quiere cambiar
            # ¡Hagamos uno más robusto que el anterior!
            
            # Lista de campos que podemos actualizar en la tabla Facturas
            campos_actualizables = ['status', 'payee', 'payment_date', 'amount']
            
            # Construimos la consulta dinámicamente
            partes_sql = []
            valores_sql = []
            
            for campo in campos_actualizables:
                if campo in datos_del_frontend:
                    partes_sql.append(f"{campo} = ?")
                    valores_sql.append(datos_del_frontend[campo])
            
            # Si no hay nada que actualizar, salimos
            if not partes_sql:
                print("No se enviaron campos válidos para actualizar en la BD.")
                # Seguimos, porque la llamada a Capital One SÍ funcionó
                return jsonify(datos_respuesta), response_capital_one.status_code

            # Unimos las partes: "SET status = ?, amount = ?"
            sql_set_clause = ", ".join(partes_sql)
            
            # Añadimos el ID al final de la lista de valores para el WHERE
            valores_sql.append(bill_id)
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            sql_query = f"UPDATE Facturas SET {sql_set_clause} WHERE bill_id = ?"
            
            # Ejecutamos el comando
            cursor.execute(sql_query, *valores_sql) # El * "desempaca" la lista de valores
            conn.commit()
            
            cursor.close()
            conn.close()
            
            print(f"¡Factura {bill_id} actualizada en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ACTUALIZAR EN BD (Facturas)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# C6. DELETE /api/bills/<id> (Delete a specific existing bill)
@app.route("/api/bills/<string:bill_id>", methods=['DELETE'])
def delete_bill_by_id(bill_id):
    """Elimina una factura específica por su ID."""
    print(f"Eliminando la factura con ID: {bill_id}")
    try:
        # 1. Llamamos a Capital One
        endpoint = f"{URL_BASE}/bills/{bill_id}"
        response_capital_one = requests.delete(endpoint, params=params_llave)

        # 2. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 204: # 204 = "Sin Contenido"
            return jsonify(response_capital_one.json()), response_capital_one.status_code
        
        # 3. ¡ÉXITO! Ahora eliminamos de NUESTRA BD
        try:
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para eliminar de la tabla Facturas
            sql_query = "DELETE FROM Facturas WHERE bill_id = ?"
            
            # Ejecutamos el comando
            cursor.execute(sql_query, bill_id)
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Factura {bill_id} eliminada de nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ELIMINAR EN BD (Facturas)!!: {db_error}")

        # 4. Devolvemos la respuesta de Capital One al front-end
        return jsonify({"message": "Factura eliminada exitosamente"}), 204

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# D1. GET /api/branches (Get all branches)
@app.route("/api/branches")
def get_all_branches():
    """Obtiene la lista pública de Sucursales (Branches)."""
    print("Pidiendo TODAS las sucursales")
    try:
        endpoint = f"{URL_BASE}/branches"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# D2. GET /api/branches/<id> (Get branch by id)
@app.route("/api/branches/<string:branch_id>")
def get_branch_by_id(branch_id):
    """Obtiene una sucursal específica por su ID."""
    print(f"Pidiendo la sucursal con ID: {branch_id}")
    try:
        endpoint = f"{URL_BASE}/branches/{branch_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# E1. GET /api/accounts/<id>/customer (Get customer that owns the specified account)
@app.route("/api/accounts/<string:account_id>/customer")
def get_customer_for_account(account_id):
    """Obtiene el cliente dueño de una cuenta específica."""
    print(f"Pidiendo el cliente dueño de la cuenta: {account_id}")
    try:
        endpoint = f"{URL_BASE}/accounts/{account_id}/customer"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# E2. GET /api/customers (Get all customers)
@app.route("/api/customers")
def get_all_customers():
    """Obtiene TODOS los clientes asociados con la API Key."""
    print("Pidiendo TODOS los clientes")
    try:
        endpoint = f"{URL_BASE}/customers"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# E3. GET /api/customers/<id> (Get customer by id)
@app.route("/api/customers/<string:customer_id>")
def get_customer_by_id(customer_id):
    """Obtiene un cliente específico por su ID."""
    print(f"Pidiendo el cliente con ID: {customer_id}")
    try:
        endpoint = f"{URL_BASE}/customers/{customer_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# E4. POST /api/customers (Create a customer)
@app.route("/api/customers", methods=['POST'])
def create_customer():
    """
    Crea un cliente "inventado" EN CAPITAL ONE
    Y LUEGO LO GUARDA EN NUESTRA PROPIA BASE DE DATOS.
    """
    print("El Front-End quiere CREAR un cliente")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/customers"
        response_capital_one = requests.post(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 201:
            return jsonify(datos_respuesta), response_capital_one.status_code

        # 4. ¡ÉXITO! Ahora guardamos en NUESTRA BD
        try:
            # Obtenemos los datos que queremos guardar
            nuevo_objeto = datos_respuesta['objectCreated']
            customer_id = nuevo_objeto['_id']
            first_name = nuevo_objeto['first_name']
            last_name = nuevo_objeto['last_name']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para insertar en la tabla Clientes
            sql_query = "INSERT INTO Clientes (customer_id, first_name, last_name) VALUES (?, ?, ?)"
            
            # Ejecutamos el comando
            cursor.execute(sql_query, customer_id, first_name, last_name)
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Cliente {customer_id} guardado en nuestra BD local!")

        except Exception as db_error:
            print(f"¡¡ERROR AL GUARDAR EN BD (Clientes)!!: {db_error}")
            
        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# E5. PUT /api/customers/<id> (Update a specific existing customer)
@app.route("/api/customers/<string:customer_id>", methods=['PUT'])
def update_customer_by_id(customer_id):
    """Actualiza un cliente específico (ej. cambiar 'address')."""
    print(f"Actualizando el cliente con ID: {customer_id}")
    try:
        # 1. Obtenemos datos del frontend (ej. {"first_name": "NuevoNombre"})
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos para actualizar"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/customers/{customer_id}"
        response_capital_one = requests.put(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 202: # 202 = "Aceptado"
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora actualizamos NUESTRA BD
        try:
            # Lista de campos que podemos actualizar en la tabla Clientes
            campos_actualizables = ['first_name', 'last_name']
            
            partes_sql = []
            valores_sql = []
            
            for campo in campos_actualizables:
                if campo in datos_del_frontend:
                    partes_sql.append(f"{campo} = ?")
                    valores_sql.append(datos_del_frontend[campo])
            
            # Si no hay nada que actualizar en nuestra tabla, salimos
            if not partes_sql:
                print(f"Cliente {customer_id} actualizado en C1, pero sin campos para nuestra BD.")
                return jsonify(datos_respuesta), response_capital_one.status_code

            sql_set_clause = ", ".join(partes_sql)
            valores_sql.append(customer_id) # Para el WHERE
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            sql_query = f"UPDATE Clientes SET {sql_set_clause} WHERE customer_id = ?"
            
            cursor.execute(sql_query, *valores_sql)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            print(f"¡Cliente {customer_id} actualizado en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ACTUALIZAR EN BD (Clientes)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# F1. DELETE /api/data (Delete data associated with your API key)
@app.route("/api/data", methods=['DELETE'])
def delete_all_my_data():
    """
    ¡PELIGROSO! Elimina TODOS los datos (clientes, cuentas, facturas, etc.) 
    asociados con esta API Key, TANTO en Capital One COMO en nuestra BD local.
    """
    print("¡¡¡El Front-End está pidiendo borrar TODOS los datos!!!")
    try:
        # 1. Llamamos a Capital One para que limpien su lado
        endpoint = f"{URL_BASE}/data"
        response_capital_one = requests.delete(endpoint, params=params_llave)

        # 2. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 204: # 204 = "Sin Contenido"
            return jsonify(response_capital_one.json()), response_capital_one.status_code
        
        # 3. ¡ÉXITO! Ahora vaciamos NUESTRA BD
        try:
            print("Vaciando la base de datos local...")
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # --- Borramos en el orden correcto para no violar FOREIGN KEYS ---
            # 1. Borramos "hijos" (los que dependen de Cuentas y Comercios)
            cursor.execute("DELETE FROM Transferencias")
            cursor.execute("DELETE FROM Compras")
            cursor.execute("DELETE FROM Retiros")
            cursor.execute("DELETE FROM Prestamos")
            cursor.execute("DELETE FROM Depositos")
            cursor.execute("DELETE FROM Facturas")
            
            # 2. Borramos "padres" (los que son referenciados)
            cursor.execute("DELETE FROM Cuentas")
            cursor.execute("DELETE FROM Comercios")
            
            # 3. Borramos el "abuelo"
            cursor.execute("DELETE FROM Clientes")
            
            # 4. Borramos tablas independientes (datos públicos)
            cursor.execute("DELETE FROM ATMs")
            cursor.execute("DELETE FROM Sucursales")
            
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print("¡Base de datos local vaciada exitosamente!")

        except Exception as db_error:
            print(f"¡¡ERROR AL VACIAR LA BD LOCAL!!: {db_error}")
            # Devolvemos un error grave si la BD falla
            return jsonify({"error": f"Capital One se reinició, pero la BD local falló: {db_error}"}), 500

        # 4. Devolvemos el éxito
        return jsonify({"message": "Todos los datos (Capital One y BD local) han sido eliminados"}), 204

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# G1. GET /api/accounts/<id>/deposits (Get all deposits)
@app.route("/api/accounts/<string:account_id>/deposits")
def get_all_deposits_for_account(account_id):
    """Obtiene todos los depósitos de una cuenta específica."""
    print(f"Pidiendo depósitos para la cuenta: {account_id}")
    try:
        endpoint = f"{URL_BASE}/accounts/{account_id}/deposits"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# G2. GET /api/deposits/<id> (Get deposit by id)
@app.route("/api/deposits/<string:deposit_id>")
def get_deposit_by_id(deposit_id):
    """Obtiene un depósito específico por su ID."""
    print(f"Pidiendo el depósito con ID: {deposit_id}")
    try:
        endpoint = f"{URL_BASE}/deposits/{deposit_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# G3. POST /api/accounts/<id>/deposits (Create a deposit)
@app.route("/api/accounts/<string:account_id>/deposits", methods=['POST'])
def create_deposit_for_account(account_id):
    """Crea un depósito "inventado" para una cuenta."""
    print(f"Creando depósito para la cuenta: {account_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/accounts/{account_id}/deposits"
        response_capital_one = requests.post(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 201:
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora guardamos en NUESTRA BD
        try:
            nuevo_objeto = datos_respuesta['objectCreated']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para insertar en la tabla Depositos
            sql_query = """
                INSERT INTO Depositos (deposit_id, account_id, amount, description, status, transaction_date)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            
            # Ejecutamos el comando
            cursor.execute(
                sql_query, 
                nuevo_objeto['_id'],
                nuevo_objeto['account_id'],
                nuevo_objeto['amount'],
                nuevo_objeto['description'],
                nuevo_objeto['status'],
                nuevo_objeto['transaction_date']
            )
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Depósito {nuevo_objeto['_id']} guardado en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL GUARDAR EN BD (Depositos)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# G4. PUT /api/deposits/<id> (Update a specific existing deposit)
@app.route("/api/deposits/<string:deposit_id>", methods=['PUT'])
def update_deposit_by_id(deposit_id):
    """Actualiza un depósito específico."""
    print(f"Actualizando el depósito con ID: {deposit_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos para actualizar"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/deposits/{deposit_id}"
        response_capital_one = requests.put(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 202: # 202 = "Aceptado"
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora actualizamos NUESTRA BD
        try:
            # Lista de campos que podemos actualizar en la tabla Depositos
            campos_actualizables = ['amount', 'description', 'status', 'transaction_date']
            
            partes_sql = []
            valores_sql = []
            
            for campo in campos_actualizables:
                if campo in datos_del_frontend:
                    partes_sql.append(f"{campo} = ?")
                    valores_sql.append(datos_del_frontend[campo])
            
            # Si no hay nada que actualizar en nuestra tabla, salimos
            if not partes_sql:
                print(f"Depósito {deposit_id} actualizado en C1, pero sin campos para nuestra BD.")
                return jsonify(datos_respuesta), response_capital_one.status_code

            sql_set_clause = ", ".join(partes_sql)
            valores_sql.append(deposit_id) # Para el WHERE
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            sql_query = f"UPDATE Depositos SET {sql_set_clause} WHERE deposit_id = ?"
            
            cursor.execute(sql_query, *valores_sql)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            print(f"¡Depósito {deposit_id} actualizado en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ACTUALIZAR EN BD (Depositos)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# G5. DELETE /api/deposits/<id> (Delete a specific existing deposit)
@app.route("/api/deposits/<string:deposit_id>", methods=['DELETE'])
def delete_deposit_by_id(deposit_id):
    """Elimina un depósito específico por su ID."""
    print(f"Eliminando el depósito con ID: {deposit_id}")
    try:
        # 1. Llamamos a Capital One
        endpoint = f"{URL_BASE}/deposits/{deposit_id}"
        response_capital_one = requests.delete(endpoint, params=params_llave)

        # 2. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 204: # 204 = "Sin Contenido"
            return jsonify(response_capital_one.json()), response_capital_one.status_code
        
        # 3. ¡ÉXITO! Ahora eliminamos de NUESTRA BD
        try:
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para eliminar de la tabla Depositos
            sql_query = "DELETE FROM Depositos WHERE deposit_id = ?"
            
            # Ejecutamos el comando
            cursor.execute(sql_query, deposit_id)
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Depósito {deposit_id} eliminado de nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ELIMINAR EN BD (Depositos)!!: {db_error}")

        # 4. Devolvemos la respuesta de Capital One al front-end
        return jsonify({"message": "Depósito eliminado exitosamente"}), 204

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# H1. GET /api/accounts/<id>/loans (Get all loans)
@app.route("/api/accounts/<string:account_id>/loans")
def get_all_loans_for_account(account_id):
    """Obtiene todos los préstamos de una cuenta específica."""
    print(f"Pidiendo préstamos para la cuenta: {account_id}")
    try:
        endpoint = f"{URL_BASE}/accounts/{account_id}/loans"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# H2. GET /api/loans/<id> (Get loan by id)
@app.route("/api/loans/<string:loan_id>")
def get_loan_by_id(loan_id):
    """Obtiene un préstamo específico por su ID."""
    print(f"Pidiendo el préstamo con ID: {loan_id}")
    try:
        endpoint = f"{URL_BASE}/loans/{loan_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# H3. POST /api/accounts/<id>/loans (Create a loan)
@app.route("/api/accounts/<string:account_id>/loans", methods=['POST'])
def create_loan_for_account(account_id):
    """Crea un préstamo "inventado" para una cuenta."""
    print(f"Creando préstamo para la cuenta: {account_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/accounts/{account_id}/loans"
        response_capital_one = requests.post(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 201:
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora guardamos en NUESTRA BD
        try:
            nuevo_objeto = datos_respuesta['objectCreated']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para insertar en la tabla Prestamos
            sql_query = """
                INSERT INTO Prestamos (loan_id, account_id, amount, description, status)
                VALUES (?, ?, ?, ?, ?)
            """
            
            # Ejecutamos el comando
            cursor.execute(
                sql_query, 
                nuevo_objeto['_id'],
                nuevo_objeto['account_id'],
                nuevo_objeto['amount'],
                nuevo_objeto['description'],
                nuevo_objeto['status']
            )
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Préstamo {nuevo_objeto['_id']} guardado en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL GUARDAR EN BD (Prestamos)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# H4. PUT /api/loans/<id> (Update a specific existing loan)
@app.route("/api/loans/<string:loan_id>", methods=['PUT'])
def update_loan_by_id(loan_id):
    """Actualiza un préstamo específico."""
    print(f"Actualizando el préstamo con ID: {loan_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos para actualizar"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/loans/{loan_id}"
        response_capital_one = requests.put(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 202: # 202 = "Aceptado"
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora actualizamos NUESTRA BD
        try:
            # Lista de campos que podemos actualizar en la tabla Prestamos
            campos_actualizables = ['amount', 'description', 'status']
            
            partes_sql = []
            valores_sql = []
            
            for campo in campos_actualizables:
                if campo in datos_del_frontend:
                    partes_sql.append(f"{campo} = ?")
                    valores_sql.append(datos_del_frontend[campo])
            
            # Si no hay nada que actualizar en nuestra tabla, salimos
            if not partes_sql:
                print(f"Préstamo {loan_id} actualizado en C1, pero sin campos para nuestra BD.")
                return jsonify(datos_respuesta), response_capital_one.status_code

            sql_set_clause = ", ".join(partes_sql)
            valores_sql.append(loan_id) # Para el WHERE
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            sql_query = f"UPDATE Prestamos SET {sql_set_clause} WHERE loan_id = ?"
            
            cursor.execute(sql_query, *valores_sql)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            print(f"¡Préstamo {loan_id} actualizado en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ACTUALIZAR EN BD (Prestamos)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# H5. DELETE /api/loans/<id> (Delete a specific existing loan)
@app.route("/api/loans/<string:loan_id>", methods=['DELETE'])
def delete_loan_by_id(loan_id):
    """Elimina un préstamo específico por su ID."""
    print(f"Eliminando el préstamo con ID: {loan_id}")
    try:
        # 1. Llamamos a Capital One
        endpoint = f"{URL_BASE}/loans/{loan_id}"
        response_capital_one = requests.delete(endpoint, params=params_llave)

        # 2. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 204: # 204 = "Sin Contenido"
            return jsonify(response_capital_one.json()), response_capital_one.status_code
        
        # 3. ¡ÉXITO! Ahora eliminamos de NUESTRA BD
        try:
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para eliminar de la tabla Prestamos
            sql_query = "DELETE FROM Prestamos WHERE loan_id = ?"
            
            # Ejecutamos el comando
            cursor.execute(sql_query, loan_id)
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Préstamo {loan_id} eliminado de nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ELIMINAR EN BD (Prestamos)!!: {db_error}")

        # 4. Devolvemos la respuesta de Capital One al front-end
        return jsonify({"message": "Préstamo eliminado exitosamente"}), 204

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# I1. GET /api/merchants (Get all merchants)
@app.route("/api/merchants")
def get_all_merchants():
    """Obtiene todos los comercios asociados con la API Key."""
    print("Pidiendo TODOS los comercios")
    try:
        endpoint = f"{URL_BASE}/merchants"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# I2. GET /api/merchants/<id> (Get merchant by id)
@app.route("/api/merchants/<string:merchant_id>")
def get_merchant_by_id(merchant_id):
    """Obtiene un comercio específico por su ID."""
    print(f"Pidiendo el comercio con ID: {merchant_id}")
    try:
        endpoint = f"{URL_BASE}/merchants/{merchant_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# I3. POST /api/merchants (Create a merchant)
@app.route("/api/merchants", methods=['POST'])
def create_merchant():
    """Crea un comercio "inventado"."""
    print("El Front-End quiere CREAR un comercio")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/merchants"
        response_capital_one = requests.post(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 201:
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora guardamos en NUESTRA BD
        try:
            nuevo_objeto = datos_respuesta['objectCreated']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para insertar en la tabla Comercios
            sql_query = """
                INSERT INTO Comercios (merchant_id, name, category)
                VALUES (?, ?, ?)
            """
            
            # Ejecutamos el comando
            cursor.execute(
                sql_query, 
                nuevo_objeto['_id'],
                nuevo_objeto['name'],
                nuevo_objeto['category']
            )
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Comercio {nuevo_objeto['_id']} guardado en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL GUARDAR EN BD (Comercios)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# I4. PUT /api/merchants/<id> (Update a specific existing merchant)
@app.route("/api/merchants/<string:merchant_id>", methods=['PUT'])
def update_merchant_by_id(merchant_id):
    """Actualiza un comercio específico."""
    print(f"Actualizando el comercio con ID: {merchant_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos para actualizar"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/merchants/{merchant_id}"
        response_capital_one = requests.put(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 202: # 202 = "Aceptado"
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora actualizamos NUESTRA BD
        try:
            # Lista de campos que podemos actualizar en la tabla Comercios
            campos_actualizables = ['name', 'category']
            
            partes_sql = []
            valores_sql = []
            
            for campo in campos_actualizables:
                if campo in datos_del_frontend:
                    partes_sql.append(f"{campo} = ?")
                    valores_sql.append(datos_del_frontend[campo])
            
            # Si no hay nada que actualizar en nuestra tabla, salimos
            if not partes_sql:
                print(f"Comercio {merchant_id} actualizado en C1, pero sin campos para nuestra BD.")
                return jsonify(datos_respuesta), response_capital_one.status_code

            sql_set_clause = ", ".join(partes_sql)
            valores_sql.append(merchant_id) # Para el WHERE
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            sql_query = f"UPDATE Comercios SET {sql_set_clause} WHERE merchant_id = ?"
            
            cursor.execute(sql_query, *valores_sql)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            print(f"¡Comercio {merchant_id} actualizado en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ACTUALIZAR EN BD (Comercios)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# J1. GET /api/accounts/<id>/purchases (Get all purchases)
@app.route("/api/accounts/<string:account_id>/purchases")
def get_all_purchases_for_account(account_id):
    """Obtiene todas las compras de una cuenta específica."""
    print(f"Pidiendo compras para la cuenta: {account_id}")
    try:
        endpoint = f"{URL_BASE}/accounts/{account_id}/purchases"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# J2. GET /api/merchants/<id>/accounts/<accountId>/purchases (Get all purchases by account and merchant)
@app.route("/api/merchants/<string:merchant_id>/accounts/<string:account_id>/purchases")
def get_purchases_by_merchant_and_account(merchant_id, account_id):
    """Obtiene compras filtradas por comercio Y cuenta."""
    print(f"Pidiendo compras del comercio {merchant_id} Y la cuenta {account_id}")
    try:
        endpoint = f"{URL_BASE}/merchants/{merchant_id}/accounts/{account_id}/purchases"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# J3. GET /api/merchants/<id>/purchases (Get all purchases by merchant)
@app.route("/api/merchants/<string:merchant_id>/purchases")
def get_purchases_by_merchant(merchant_id):
    """Obtiene todas las compras de un comercio específico."""
    print(f"Pidiendo compras del comercio: {merchant_id}")
    try:
        endpoint = f"{URL_BASE}/merchants/{merchant_id}/purchases"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# J4. GET /api/purchases/<id> (Get purchase by id)
@app.route("/api/purchases/<string:purchase_id>")
def get_purchase_by_id(purchase_id):
    """Obtiene una compra específica por su ID."""
    print(f"Pidiendo la compra con ID: {purchase_id}")
    try:
        endpoint = f"{URL_BASE}/purchases/{purchase_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# J5. POST /api/accounts/<id>/purchases (Create a purchase)
@app.route("/api/accounts/<string:account_id>/purchases", methods=['POST'])
def create_purchase_for_account(account_id):
    """Crea una compra "inventada" para una cuenta."""
    print(f"Creando compra para la cuenta: {account_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/accounts/{account_id}/purchases"
        response_capital_one = requests.post(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 201:
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora guardamos en NUESTRA BD
        try:
            nuevo_objeto = datos_respuesta['objectCreated']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para insertar en la tabla Compras
            sql_query = """
                INSERT INTO Compras (purchase_id, account_id, merchant_id, amount, description, purchase_date, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            
            # Ejecutamos el comando
            cursor.execute(
                sql_query, 
                nuevo_objeto['_id'],
                nuevo_objeto['account_id'],
                nuevo_objeto['merchant_id'],
                nuevo_objeto['amount'],
                nuevo_objeto['description'],
                nuevo_objeto['purchase_date'],
                nuevo_objeto['status']
            )
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Compra {nuevo_objeto['_id']} guardada en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL GUARDAR EN BD (Compras)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# J6. PUT /api/purchases/<id> (Update a specific existing purchase)
@app.route("/api/purchases/<string:purchase_id>", methods=['PUT'])
def update_purchase_by_id(purchase_id):
    """Actualiza una compra específica."""
    print(f"Actualizando la compra con ID: {purchase_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos para actualizar"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/purchases/{purchase_id}"
        response_capital_one = requests.put(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 202: # 202 = "Aceptado"
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora actualizamos NUESTRA BD
        try:
            # Lista de campos que podemos actualizar en la tabla Compras
            campos_actualizables = ['amount', 'description', 'purchase_date', 'status']
            
            partes_sql = []
            valores_sql = []
            
            for campo in campos_actualizables:
                if campo in datos_del_frontend:
                    partes_sql.append(f"{campo} = ?")
                    valores_sql.append(datos_del_frontend[campo])
            
            # Si no hay nada que actualizar en nuestra tabla, salimos
            if not partes_sql:
                print(f"Compra {purchase_id} actualizada en C1, pero sin campos para nuestra BD.")
                return jsonify(datos_respuesta), response_capital_one.status_code

            sql_set_clause = ", ".join(partes_sql)
            valores_sql.append(purchase_id) # Para el WHERE
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            sql_query = f"UPDATE Compras SET {sql_set_clause} WHERE purchase_id = ?"
            
            cursor.execute(sql_query, *valores_sql)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            print(f"¡Compra {purchase_id} actualizada en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ACTUALIZAR EN BD (Compras)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# J7. DELETE /api/purchases/<id> (Delete a specific existing purchase)
@app.route("/api/purchases/<string:purchase_id>", methods=['DELETE'])
def delete_purchase_by_id(purchase_id):
    """Elimina una compra específica por su ID."""
    print(f"Eliminando la compra con ID: {purchase_id}")
    try:
        # 1. Llamamos a Capital One
        endpoint = f"{URL_BASE}/purchases/{purchase_id}"
        response_capital_one = requests.delete(endpoint, params=params_llave)

        # 2. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 204: # 204 = "Sin Contenido"
            return jsonify(response_capital_one.json()), response_capital_one.status_code
        
        # 3. ¡ÉXITO! Ahora eliminamos de NUESTRA BD
        try:
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para eliminar de la tabla Compras
            sql_query = "DELETE FROM Compras WHERE purchase_id = ?"
            
            # Ejecutamos el comando
            cursor.execute(sql_query, purchase_id)
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Compra {purchase_id} eliminada de nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ELIMINAR EN BD (Compras)!!: {db_error}")

        # 4. Devolvemos la respuesta de Capital One al front-end
        return jsonify({"message": "Compra eliminada exitosamente"}), 204

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# K1. GET /api/accounts/<id>/transfers (Get all transfers)
@app.route("/api/accounts/<string:account_id>/transfers")
def get_all_transfers_for_account(account_id):
    """Obtiene todas las transferencias de una cuenta específica."""
    print(f"Pidiendo transferencias para la cuenta: {account_id}")
    try:
        endpoint = f"{URL_BASE}/accounts/{account_id}/transfers"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# K2. GET /api/transfers/<transferId> (Get transfer by id)
@app.route("/api/transfers/<string:transfer_id>")
def get_transfer_by_id(transfer_id):
    """Obtiene una transferencia específica por su ID."""
    print(f"Pidiendo la transferencia con ID: {transfer_id}")
    try:
        endpoint = f"{URL_BASE}/transfers/{transfer_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# K3. POST /api/accounts/<id>/transfers (Create a transfer)
@app.route("/api/accounts/<string:account_id>/transfers", methods=['POST'])
def create_transfer_for_account(account_id):
    """Crea una transferencia "inventada" desde una cuenta."""
    print(f"Creando transferencia desde la cuenta: {account_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/accounts/{account_id}/transfers"
        response_capital_one = requests.post(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 201:
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora guardamos en NUESTRA BD
        try:
            nuevo_objeto = datos_respuesta['objectCreated']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para insertar en la tabla Transferencias
            sql_query = """
                INSERT INTO Transferencias (transfer_id, from_account_id, to_account_id, amount, description, status)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            
            # Ejecutamos el comando
            cursor.execute(
                sql_query, 
                nuevo_objeto['_id'],
                nuevo_objeto['account_id'],  # Esta es la cuenta 'from'
                nuevo_objeto['payee_id'],    # Esta es la cuenta 'to'
                nuevo_objeto['amount'],
                nuevo_objeto['description'],
                nuevo_objeto['status']
            )
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Transferencia {nuevo_objeto['_id']} guardada en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL GUARDAR EN BD (Transferencias)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# K4. PUT /api/transfers/<transferId> (Update a specific existing transfer)
@app.route("/api/transfers/<string:transfer_id>", methods=['PUT'])
def update_transfer_by_id(transfer_id):
    """Actualiza una transferencia específica."""
    print(f"Actualizando la transferencia con ID: {transfer_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos para actualizar"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/transfers/{transfer_id}"
        response_capital_one = requests.put(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 202: # 202 = "Aceptado"
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora actualizamos NUESTRA BD
        try:
            # Lista de campos que podemos actualizar en la tabla Transferencias
            campos_actualizables = ['amount', 'description', 'status']
            
            partes_sql = []
            valores_sql = []
            
            for campo in campos_actualizables:
                if campo in datos_del_frontend:
                    partes_sql.append(f"{campo} = ?")
                    valores_sql.append(datos_del_frontend[campo])
            
            # Si no hay nada que actualizar en nuestra tabla, salimos
            if not partes_sql:
                print(f"Transferencia {transfer_id} actualizada en C1, pero sin campos para nuestra BD.")
                return jsonify(datos_respuesta), response_capital_one.status_code

            sql_set_clause = ", ".join(partes_sql)
            valores_sql.append(transfer_id) # Para el WHERE
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            sql_query = f"UPDATE Transferencias SET {sql_set_clause} WHERE transfer_id = ?"
            
            cursor.execute(sql_query, *valores_sql)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            print(f"¡Transferencia {transfer_id} actualizada en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ACTUALIZAR EN BD (Transferencias)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# K5. DELETE /api/transfers/<transferId> (Delete a specific existing transfer)
@app.route("/api/transfers/<string:transfer_id>", methods=['DELETE'])
def delete_transfer_by_id(transfer_id):
    """Elimina una transferencia específica por su ID."""
    print(f"Eliminando la transferencia con ID: {transfer_id}")
    try:
        # 1. Llamamos a Capital One
        endpoint = f"{URL_BASE}/transfers/{transfer_id}"
        response_capital_one = requests.delete(endpoint, params=params_llave)

        # 2. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 204: # 204 = "Sin Contenido"
            return jsonify(response_capital_one.json()), response_capital_one.status_code
        
        # 3. ¡ÉXITO! Ahora eliminamos de NUESTRA BD
        try:
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para eliminar de la tabla Transferencias
            sql_query = "DELETE FROM Transferencias WHERE transfer_id = ?"
            
            # Ejecutamos el comando
            cursor.execute(sql_query, transfer_id)
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Transferencia {transfer_id} eliminada de nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ELIMINAR EN BD (Transferencias)!!: {db_error}")

        # 4. Devolvemos la respuesta de Capital One al front-end
        return jsonify({"message": "Transferencia eliminada exitosamente"}), 204

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# L1. GET /api/accounts/<id>/withdrawals (Get all withdrawals)
@app.route("/api/accounts/<string:account_id>/withdrawals")
def get_all_withdrawals_for_account(account_id):
    """Obtiene todos los retiros de una cuenta específica."""
    print(f"Pidiendo retiros para la cuenta: {account_id}")
    try:
        endpoint = f"{URL_BASE}/accounts/{account_id}/withdrawals"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# L2. GET /api/withdrawals/<id> (Get withdrawal by id)
@app.route("/api/withdrawals/<string:withdrawal_id>")
def get_withdrawal_by_id(withdrawal_id):
    """Obtiene un retiro específico por su ID."""
    print(f"Pidiendo el retiro con ID: {withdrawal_id}")
    try:
        endpoint = f"{URL_BASE}/withdrawals/{withdrawal_id}"
        response = requests.get(endpoint, params=params_llave)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# L3. POST /api/accounts/<id>/withdrawals (Create a withdrawal)
@app.route("/api/accounts/<string:account_id>/withdrawals", methods=['POST'])
def create_withdrawal_for_account(account_id):
    """Crea un retiro "inventado" para una cuenta."""
    print(f"Creando retiro para la cuenta: {account_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/accounts/{account_id}/withdrawals"
        response_capital_one = requests.post(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 201:
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora guardamos en NUESTRA BD
        try:
            nuevo_objeto = datos_respuesta['objectCreated']
            
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para insertar en la tabla Retiros
            sql_query = """
                INSERT INTO Retiros (withdrawal_id, account_id, amount, description, status, transaction_date)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            
            # Ejecutamos el comando
            cursor.execute(
                sql_query, 
                nuevo_objeto['_id'],
                nuevo_objeto['account_id'],
                nuevo_objeto['amount'],
                nuevo_objeto['description'],
                nuevo_objeto['status'],
                nuevo_objeto['transaction_date']
            )
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Retiro {nuevo_objeto['_id']} guardado en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL GUARDAR EN BD (Retiros)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# L4. PUT /api/withdrawals/<id> (Update a specific existing withdrawal)
@app.route("/api/withdrawals/<string:withdrawal_id>", methods=['PUT'])
def update_withdrawal_by_id(withdrawal_id):
    """Actualiza un retiro específico."""
    print(f"Actualizando el retiro con ID: {withdrawal_id}")
    try:
        # 1. Obtenemos datos del frontend
        datos_del_frontend = request.json
        if not datos_del_frontend:
            return jsonify({"error": "Faltan datos para actualizar"}), 400
            
        # 2. Llamamos a Capital One
        endpoint = f"{URL_BASE}/withdrawals/{withdrawal_id}"
        response_capital_one = requests.put(
            endpoint, 
            params=params_llave, 
            json=datos_del_frontend
        )
        
        datos_respuesta = response_capital_one.json()

        # 3. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 202: # 202 = "Aceptado"
            return jsonify(datos_respuesta), response_capital_one.status_code
        
        # 4. ¡ÉXITO! Ahora actualizamos NUESTRA BD
        try:
            # Lista de campos que podemos actualizar en la tabla Retiros
            campos_actualizables = ['amount', 'description', 'status', 'transaction_date']
            
            partes_sql = []
            valores_sql = []
            
            for campo in campos_actualizables:
                if campo in datos_del_frontend:
                    partes_sql.append(f"{campo} = ?")
                    valores_sql.append(datos_del_frontend[campo])
            
            # Si no hay nada que actualizar en nuestra tabla, salimos
            if not partes_sql:
                print(f"Retiro {withdrawal_id} actualizado en C1, pero sin campos para nuestra BD.")
                return jsonify(datos_respuesta), response_capital_one.status_code

            sql_set_clause = ", ".join(partes_sql)
            valores_sql.append(withdrawal_id) # Para el WHERE
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            sql_query = f"UPDATE Retiros SET {sql_set_clause} WHERE withdrawal_id = ?"
            
            cursor.execute(sql_query, *valores_sql)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            print(f"¡Retiro {withdrawal_id} actualizado en nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ACTUALIZAR EN BD (Retiros)!!: {db_error}")

        # 5. Devolvemos la respuesta de Capital One al front-end
        return jsonify(datos_respuesta), response_capital_one.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# L5. DELETE /api/withdrawals/<id> (Delete a specific existing withdrawal)
@app.route("/api/withdrawals/<string:withdrawal_id>", methods=['DELETE'])
def delete_withdrawal_by_id(withdrawal_id):
    """Elimina un retiro específico por su ID."""
    print(f"Eliminando el retiro con ID: {withdrawal_id}")
    try:
        # 1. Llamamos a Capital One
        endpoint = f"{URL_BASE}/withdrawals/{withdrawal_id}"
        response_capital_one = requests.delete(endpoint, params=params_llave)

        # 2. Si Capital One falló, nos detenemos
        if response_capital_one.status_code != 204: # 204 = "Sin Contenido"
            return jsonify(response_capital_one.json()), response_capital_one.status_code
        
        # 3. ¡ÉXITO! Ahora eliminamos de NUESTRA BD
        try:
            # Nos conectamos a nuestra BD de SQL Server
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Escribimos el comando SQL para eliminar de la tabla Retiros
            sql_query = "DELETE FROM Retiros WHERE withdrawal_id = ?"
            
            # Ejecutamos el comando
            cursor.execute(sql_query, withdrawal_id)
            conn.commit() # ¡Guardamos los cambios!
            
            cursor.close()
            conn.close()
            
            print(f"¡Retiro {withdrawal_id} eliminado de nuestra BD!")

        except Exception as db_error:
            print(f"¡¡ERROR AL ELIMINAR EN BD (Retiros)!!: {db_error}")

        # 4. Devolvemos la respuesta de Capital One al front-end
        return jsonify({"message": "Retiro eliminado exitosamente"}), 204

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ---------------------------------------------------------------
# INICIA EL SERVIDOR
# ---------------------------------------------------------------
if __name__ == "__main__":
    # Get port from environment variable, default to 10000 if not found
    port = int(os.environ.get("PORT", 10000))
    # Listen on 0.0.0.0 to be accessible externally
    app.run(debug=True, host='0.0.0.0', port=port)