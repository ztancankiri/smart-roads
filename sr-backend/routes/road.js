const path = require('path');
const db = require(path.join(process.cwd(), 'db'));

const route = path.join(process.env.BASE_ROUTE, path.basename(__filename).replace(path.extname(__filename), ''));

module.exports = server => {
    server.post(route, async (req, res) => {
        res.contentType = 'application/json';
        const json = req.body;

        try {
            let data = await db.query('SELECT * FROM road WHERE road_name = $1', [json.road_name]);

            if (data.rows.length > 0) {
                res.send({ success: false, error: 'Road exists!' });
                return;
            }

            data = await db.query('INSERT INTO road (road_name, road_lat, road_lng, default_speed, warning_speed) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [
                    json.road_name,
                    json.road_lat,
                    json.road_lng,
                    json.default_speed,
                    json.warning_speed
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

        try {
            const data = await db.query('SELECT * FROM road');

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
    });

    server.get(path.join(route, ':id'), async (req, res) => {
        res.contentType = 'application/json';
        const id = req.params.id;

        try {
            const data = await db.query('SELECT * FROM road WHERE road_id = $1', [id]);

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
    });

    server.get(path.join(route, ':name/name'), async (req, res) => {
        res.contentType = 'application/json';
        const name = req.params.name;

        try {
            const data = await db.query('SELECT * FROM road WHERE road_name = $1', [name]);

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
    });
};