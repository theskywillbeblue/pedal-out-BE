exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    }
}

exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === '22P02' || err.code === '23502' || err.code === '23503' || err.code === '23514') {
        res.status(400).send({ msg: 'Invalid input.'})
    } else {
        next(err);
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Server error."});
}

exports.handleMongoErrors = (err, req, res, next) => {
    if(err.name === 'ValidationError') {
        return res.status(400).send({ msg: err.message })
    };
    if(err.name === 'CastError') {
        return res.status(400).send({ msg: 'Invalid MongoDB ID format' })
    };
    if(err.code === 11000) {
        return res.status(409).send({ msg: 'Duplicate key error' })
    }
    next(err);
}