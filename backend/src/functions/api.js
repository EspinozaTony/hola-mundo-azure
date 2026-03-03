const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

// Conectarnos a tu base de datos usando las llaves de local.settings.json
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "MiAppDB";
const containerId = "Registros";

app.http('api', {
    methods: ['GET', 'POST', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Petición ${request.method} recibida en la API.`);
        
        // Entramos a la tabla de tu base de datos
        const container = client.database(databaseId).container(containerId);

        try {
            // ==========================================
            // 1. GET: LEER TODOS LOS DATOS (Listar)
            // ==========================================
            if (request.method === 'GET') {
                const { resources } = await container.items.readAll().fetchAll();
                return { status: 200, jsonBody: resources };
            } 
            
            // ==========================================
            // 2. POST: GUARDAR UN NUEVO DATO
            // ==========================================
            else if (request.method === 'POST') {
                const body = await request.json();
                
                // Cosmos DB obliga a que todo tenga un "id" (texto). Si no lo mandan, inventamos uno.
                const nuevoRegistro = {
                    id: body.id || Date.now().toString(),
                    mensaje: body.mensaje || "Sin mensaje",
                    fecha: new Date().toISOString()
                };
                
                const { resource } = await container.items.create(nuevoRegistro);
                return { status: 201, jsonBody: resource };
            } 
            
            // ==========================================
            // 3. DELETE: BORRAR UN DATO
            // ==========================================
            else if (request.method === 'DELETE') {
                const idParaBorrar = request.query.get('id');
                
                if (!idParaBorrar) {
                    return { status: 400, body: "Error: Falta el '?id=...' en la URL para saber qué borrar." };
                }

                // Borramos el dato usando su ID
                await container.item(idParaBorrar, idParaBorrar).delete();
                return { status: 200, body: `El registro con ID ${idParaBorrar} fue eliminado con éxito.` };
            }

        } catch (error) {
            context.log("Error en la base de datos:", error.message);
            return { status: 500, body: "Hubo un error al conectar con Cosmos DB." };
        }
    }
});