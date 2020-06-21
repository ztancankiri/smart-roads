const path = require('path');
const db = require(path.join(process.cwd(), 'db'));

const route = path.join(process.env.BASE_ROUTE, path.basename(__filename).replace(path.extname(__filename), ''));
const ICING_TEMPERATURE = 2;
const ASPHALT_TEMPERATURE = 35;

module.exports = server => {
    server.post(route, async (req, res) => {
        res.contentType = 'application/json';
        const json = req.body;

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

            res.send({ success: true, data: data.rows });

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
            res.send({ success: false, error: error });
        }
    });
};