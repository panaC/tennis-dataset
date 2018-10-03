const models      = require('./models');

exports.module.upsert = function upsert(table, values, condition) {
    return models[table]
        .findOne({ where: condition })
        .then(function(obj) {
            if(obj) { // update
                return obj.update(values);
            }
            else { // insert
                return models[table].create(values);
            }
        }
    })
}
