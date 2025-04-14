const app = require('./app/app.js');
const { PORT = 8080 } = process.env;

app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Listening on ${PORT}`);
})