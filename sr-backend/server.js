require('dotenv').config();

const path = require('path');
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const routes = require(path.join(process.cwd(), 'routes'));
const mqtt = require('mqtt');
const db = require(path.join(process.cwd(), 'db'));

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Authorization'],
    exposeHeaders: ['Authorization']
});

const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);

server.pre(
    function crossOrigin(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header("Access-Control-Allow-Headers", "DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type'");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        return next();
    }
);

server.get('/api/', (req, res) => {
    res.send('Server is running...');
});

routes.attachRoutes(server);

server.listen(process.env.BINDING_PORT, process.env.BINDING_IP, () => console.log(`Listening on port ${process.env.BINDING_PORT}!`));

const client = mqtt.connect('mqtt://23.251.142.247');

client.on('message', async (topic, message) => {
    if (topic === 'data') {
        const json = JSON.parse(message.toString());

        try {
            data = await db.query('INSERT INTO sensor_data (sensor_id, temperature, humidity, pressure, vehicle_count, time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                    json.sensor_id,
                    json.temperature,
                    json.humidity,
                    json.pressure,
                    json.vehicle_count,
                    json.time || new Date().toISOString()
                ]);

            if (json.temperature < ICING_TEMPERATURE) {
                const { rows } = await db.query('SELECT * FROM warning WHERE road_id=(SELECT road_id FROM sensor WHERE sensor_id = $1) AND warning_type = 1', [json.sensor_id]);
                if (rows.length === 0) {
                    await db.query(`
                    INSERT INTO warning (road_id, warning_type) VALUES ((SELECT road_id FROM sensor WHERE sensor_id = $1), 1)
                `, [json.sensor_id]);
                }
            }
            else {
                const { rows } = await db.query('SELECT * FROM warning WHERE road_id=(SELECT road_id FROM sensor WHERE sensor_id = $1) AND warning_type = 1', [json.sensor_id]);
                if (rows.length > 0) {
                    await db.query(`
                        DELETE FROM warning WHERE road_id=(SELECT road_id FROM sensor WHERE sensor_id = $1) AND warning_type=1
                `, [json.sensor_id]);
                }
            }
            if (json.temperature >= ASPHALT_TEMPERATURE) {
                const { rows } = await db.query('SELECT * FROM warning WHERE road_id=(SELECT road_id FROM sensor WHERE sensor_id = $1) AND warning_type = 2', [json.sensor_id]);
                if (rows.length === 0) {
                    await db.query(`
                    INSERT INTO warning (road_id, warning_type) VALUES ((SELECT road_id FROM sensor WHERE sensor_id = $1), 2)
                `, [json.sensor_id]);
                }
            }
            else {
                const { rows } = await db.query('SELECT * FROM warning WHERE road_id=(SELECT road_id FROM sensor WHERE sensor_id = $1) AND warning_type = 2', [json.sensor_id]);
                if (rows.length > 0) {
                    await db.query(`
                        DELETE FROM warning WHERE road_id=(SELECT road_id FROM sensor WHERE sensor_id = $1) AND warning_type=2
                `, [json.sensor_id]);
                }
            }
        }
        catch (error) {
            console.error(error.stack || error);
        }
    }
})