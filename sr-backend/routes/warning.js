const path = require('path');
const db = require(path.join(process.cwd(), 'db'));

const route = path.join(process.env.BASE_ROUTE, path.basename(__filename).replace(path.extname(__filename), ''));

module.exports = server => {
    server.get(path.join(route, ':id'), async (req, res) => {
        res.contentType = 'application/json';
        const id = req.params.id;

        try {
            const { rows } = await db.query('SELECT warning_type FROM warning WHERE road_id = $1', [id]);
            // const { rows } = await db.query('SELECT * FROM warning_description WHERE warning_type IN (SELECT warning_type FROM warning WHERE road_id = $1)', [id]);

            if (rows.length == 0) {
                res.send({ success: false, error: 'Empty!' });
                return;
            }

            res.send({ success: true, data: rows });
        }
        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });
};