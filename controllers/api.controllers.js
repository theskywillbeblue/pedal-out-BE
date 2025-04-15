const { showEndpoints } = require("")

exports.getEndpoints = (req, res) => {
    const endpoints = showEndpoints()
    res.status(200).send({ endpoints })
}