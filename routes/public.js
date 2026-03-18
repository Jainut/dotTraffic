import express from 'express' // Importando a biblioteca express
import { PrismaClient } from '@prisma/client' // Importando a biblioteca prisma

const prisma = new PrismaClient() // Definindo as funções do prisma como 'prisma' para poder utilizar
const router = express.Router() // Definindo a função de Router do express como 'router' para poder utilizar

router.post('/registrarTransformador', async (req, res) => { // Rota de post padrão para registro dos transformadores
    const transformador = req.body // Variável transformador recebendo a requisição no body

    try { // Tenta cadastrar o transformador no db
        if (transformador.modelo == "" || transformador.numeroDeSerie == "" || transformador.statusProducao == "") {
            return res.status(500).json({message: "Campos inválidos, tente novamente"}) // Mensagem de erro caso não prencha os campos
        } else {
        const newTransformador = await prisma.transformador.create ( {
        data: { // Mandando as informações para o db
            numeroDeSerie: transformador.numeroDeSerie,
            modelo: transformador.modelo,
            potenciaKva: transformador.potenciaKva,
            statusProducao: transformador.statusProducao,
            temperatura: transformador.temperatura,
        }
        })

        return res.status(201).json({message:`Sucesso! Transformador registrado`}) // Se conseguir registrar no db retorna mensagem de sucesso
    }
    }catch (err) { // Catch para caso de erro
        console.error(err) // Retorna no terminal qual foi o erro

        return res.status(500).json({message: "Servidor instável, tente novamente mais tarde"}) // Mensagem de erro do servidor
    }

})

router.get('/listarTransformador', async (req, res) => { // Rota padrão para listar os transformadores no db
    const consult = await prisma.transformador.findMany() // consult definida para buscar todos os transformadores no db

    console.log(JSON.stringify(consult, null, 2)) 

    res.json(consult) // Transforma a resposta em json e retorna
})

router.delete('/deletarTransformador/:numeroDeSerie', async (req, res) => { // Rota padrão para deletar transformadores com numero de série
        const { numeroDeSerie } = req.params

        try {
            const transformadorDeleted = await prisma.transformador.delete ({
                where: {
                    numeroDeSerie: Number(numeroDeSerie)
                }
            })

            res.json(transformadorDeleted)

            } catch (err) {
                console.error(err)

                res.status(500).json({message: "Servidor instável, tente novamente mais tarde"})
            }
        }
    )

router.put('/editarTransformador/:numeroDeSerie', async (req, res) => { // Rota padrão para editar transformadores com número de série
    const { numeroDeSerie } = req.params
    const data = req.body

    try {
        const transformadorEdit = await prisma.transformador.update ({
            where: {
                numeroDeSerie: Number(numeroDeSerie)
            },
            data: {
                numeroDeSerie: data.numeroDeSerie,
                modelo: data.modelo,
                potenciaKva: data.potenciaKva,
                statusProducao: data.statusProducao,
                temperatura: data.temperatura
            }
        })
        res.json(transformadorEdit)

    } catch(err) {
        console.log(err)

        res.status(500).json({message: "Servidor instável, impossível alterar no momento"})
    }
})

router.post('/registrarLog', async (req, res) => { // Rota padrão para registar logs de eventos dos transformadores
    const log = req.body

    try {
        if (log.idTransformador === "") {
            return res.status(500).json({message: "Campos inválidos, tente novamente"})
        } else {
        const newLog = await prisma.logEventos.create ( {
        data: {
            tipoEvento: log.tipoEvento,
            descEvento: log.descEvento,
            transformador: {
                connect: {
                idTransformador: log.idTransformador.trim()
                }
            }
        }
        })

        return res.status(201).json({message:`Sucesso! Log registrado`}) 
    }
    }catch (err) {
        console.error(err)

        return res.status(500).json({message: "Servidor instável, tente novamente mais tarde"})
    }

})

router.get('/listarLog', async (req, res) => { // Rota padrão para listar os logs de eventos dos transformadores
    const consult = await prisma.logEventos.findMany()

    console.log(JSON.stringify(consult, null, 2))

    res.json(consult)
})

router.delete('/deletarLog/:idLog', async (req, res) => { // Rota padrão para deletar logs de eventos
        const { idLog } = req.params

        try {
            const transformadorDeleted = await prisma.logEventos.delete ({
                where: {
                    idLog: idLog
                }
            })

            res.json(transformadorDeleted)

            } catch (err) {
                console.error(err)

                res.status(500).json({message: "Servidor instável, tente novamente mais tarde"})
            }
        }
    )

    router.put('/editarLog/:idLog', async (req, res) => { // rota padrão para editar logs de eventos
    const { idLog } = req.params
    const data = req.body

    try {
        const transformadorEdit = await prisma.logEventos.update ({
            where: {
                idLog: idLog
            },
            data: {
                tipoEvento: data.tipoEvento,
                descEvento: data.descEvento
            }
        })
        res.json(transformadorEdit)

    } catch(err) {
        console.log(err)

        res.status(500).json({message: "Servidor instável, impossível alterar no momento"})
    }
})

export default router