import 'dotenv/config' // Importando o .env
import express from 'express' // Importando a biblioteca express
import publicRouter from './routes/public.js' // Importando a pasta de rotas

const port = process.env.PORT || 3000 // Definindo porta dinâmica
const app = express() // Definindo as funções do express para 'app'
app.use(express.json()) // Definindo que express deve utilizar json

app.use('/', publicRouter) // Utilizando as rotas públicas
app.get('/', (req, res) => { // Get só pra mostrar que tá rodando essa bomba 🔥🔥🔥
    res.send("Rodando essa bomba 🔥🔥🔥")
})

app.listen(port, () => {console.log("Rodando o servidor... 🔥")}) // Utilizando a porta e exibindo mensagem que o servidor está rodando