import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/registrarTransformador', async (req, res) => {
    const transformador = req.body

    try {
        if (transformador.modelo == "" || transformador.numeroDeSerie == "" || transformador.statusProducao == "") {
            return res.status(500).json({message: "Campos inválidos, tente novamente"})
        } else {
        const newTransformador = await prisma.transformador.create ( {
        data: {
            numeroDeSerie: transformador.numeroDeSerie,
            modelo: transformador.modelo,
            potenciaKva: transformador.potenciaKva,
            statusProducao: transformador.statusProducao,
            temperatura: transformador.temperatura,
        }
        })

        return res.status(201).json({message:`Sucesso! Transformador registrado`}) 
    }
    }catch (err) {
        console.error(err)

        return res.status(500).json({message: "Servidor instável, tente novamente mais tarde"})
    }

})

router.get('/listarTransformador', async (req, res) => {
    const consult = await prisma.transformador.findMany()

    console.log(JSON.stringify(consult, null, 2))

    res.json(consult)
})

router.delete('/deletarTransformador/:numeroDeSerie', async (req, res) => {
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

router.put('/editarTransformador/:numeroDeSerie', async (req, res) => {
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

export default router