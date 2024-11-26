const app = require('./app')

app.listen(app.get('port'), () => {
    console.log('La Api se está ejecutando en el puerto 3000')
})