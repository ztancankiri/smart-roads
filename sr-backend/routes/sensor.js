const path = require('path');
const db = require(path.join(process.cwd(), 'db'));

const route = path.join(process.env.BASE_ROUTE, path.basename(__filename).replace(path.extname(__filename), ''));

module.exports = server => {

    server.post(route, async (req, res) => {
        res.contentType = 'application/json';
        const json = req.body;
        console.log(json);

        try {
            let { rows } = await db.query('SELECT * FROM road WHERE road_name = $1', [json.road_name]);
            let road_id = rows.length > 0 ? rows[0].road_id : null;
            if (rows.length === 0) {
                let data = await db.query('INSERT INTO road (road_name, road_lat, road_lng, default_speed, warning_speed) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [
                        json.road_name,
                        json.sensor_lat,
                        json.sensor_lng,
                        json.default_speed,
                        json.warning_speed
                    ]);
                road_id = data.rows[0].road_id;
            }
            let data = await db.query('INSERT INTO sensor (road_id, sensor_lat, sensor_lng) VALUES ($1, $2, $3) RETURNING *',
                [
                    road_id,
                    json.sensor_lat,
                    json.sensor_lng
                ]);
            res.send({ success: true, data: data.rows });
        }
        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });

    server.get(route, async (req, res) => {
        res.contentType = 'application/json';
        const road_id = req.query.road_id;

        if (road_id != null) {
            try {
                const data = await db.query('SELECT * FROM sensor WHERE road_id=$1', [road_id]);

                if (data.rows.length == 0) {
                    res.send({ success: false, error: 'Empty!' });
                    return;
                }

                res.send({ success: true, data: data.rows });
            }
            catch (error) {
                console.error(error.stack || error);
                res.send({ success: false, error: error });
            }
        }
        else {
            try {
                const data = await db.query('SELECT * FROM sensor');

                if (data.rows.length == 0) {
                    res.send({ success: false, error: 'Empty!' });
                    return;
                }

                res.send({ success: true, data: data.rows });
            }
            catch (error) {
                console.error(error.stack || error);
                res.send({ success: false, error: error });
            }
        }
    });
};