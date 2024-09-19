const express = require('express')
const oracledb = require('oracledb')
require('dotenv').config();

const app = express()
const port = 3000

app.use(express.json())

oracledb.initOracleClient({ libDir: process.env.ORACLE_HOME });

const oracleConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING
}

async function connectToOracle(query)
{
    let connection
    try
    {   
        connection = await oracledb.getConnection(oracleConfig)
        const result = await connection.execute(query)
        return result.rows
    }
    catch(err)
    {
        console.error(err)
        throw err
    }
    finally
    {
        if(connection)
        {
            try
            {
                await connection.close()
            }
            catch(err)
            {
                console.error(err)
            }
        }
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to SARH API JS')
})

app.get('/servidores', async (req, res) => {
    const query = `SELECT FUNC_PESS_C_P_F from rh_funcionario`

    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

//TODO finish to implement this
// app.get('/servidores/inativos', async (req, res) => {
//     const query = `SELECT FUNC_PESS_C_P_F from rh_funcionario`

//     try {
//         const result = await connectToOracle(query)
//         res.json(result)
//     }
//     catch(err)
//     {
//         res.status(500).json({ message: 'Erro connecting do database', err})
//     }
// })

app.get('/servidores/:FUNC_MATRICULA_FOLHA', async (req, res) => {

    const FUNC_MATRICULA_FOLHA = req.params.FUNC_MATRICULA_FOLHA

    const query = `SELECT FUNC_PESS_C_P_F, NO_SERVIDOR from rh_funcionario INNER JOIN serv_pessoal ON rh_funcionario.FUNC_MATRICULA_FOLHA = serv_pessoal.NU_MATR_SERVIDOR WHERE func_matricula_folha = '${FUNC_MATRICULA_FOLHA}'`

    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.get('/pessoas', async (req, res) => {
    const query = `SELECT NOME from rh_relacao_pessoas`

    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.get('/pessoas/:MATRICULA', async (req, res) => {
    
    const MATRICULA = req.params.MATRICULA
    // const TEST = 'AP574ES'

    const query = `SELECT * FROM rh_relacao_pessoas WHERE matricula = '${MATRICULA}'`

    try {
        const result = await connectToOracle(query)

        if(result.length === 0)
            return res.status(400).json({ message: 'Registro não encontrado' })

        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Error connecting do database', err})
    }
})

app.get('/pensionistas', async (req, res) => {
    const query = `SELECT PCIV_NOME_PENSIONISTA from rh_pensao_civil`

    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Error connecting do database', err})
    }
})

app.get('/pensionistas/:PCIV_DEPE_COD_FUNCIONARIO', async (req, res) => 
{
    const PCIV_DEPE_COD_FUNCIONARIO = req.params.PCIV_DEPE_COD_FUNCIONARIO

    const query = `SELECT * from rh_pensao_civil WHERE PCIV_DEPE_COD_FUNCIONARIO = ${PCIV_DEPE_COD_FUNCIONARIO}`

    try {
        const result = await connectToOracle(query)

        if(result.length === 0)
            return res.status(400).json({ message: 'Registro não encontrado' })

        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Error connecting do database', err})
    }
})

app.listen(port, () => {
    console.log(`Server is now running on http://localhost:${port}`)
})