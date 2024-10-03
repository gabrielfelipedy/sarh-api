const express = require('express')
const oracledb = require('oracledb')
const moment = require('moment')

require('dotenv').config();

const app = express()
const port = 3000

app.use(express.json())
moment.locale('pt-br'); 

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

//region servidores

//obs servidores são apenas as pessoas que são servidores efetivos
app.get('/servidores', async (req, res) => 
{
    const attributes = `FUNC_MATRICULA_FOLHA, FUNC_PESS_C_P_F, NO_SERVIDOR`

    const tables = `rh_funcionario INNER JOIN serv_pessoal ON rh_funcionario.FUNC_MATRICULA_FOLHA = serv_pessoal.NU_MATR_SERVIDOR`

    const query = `SELECT ${attributes} from ${tables} ORDER BY no_servidor`

    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.get('/servidor/:FUNC_MATRICULA_FOLHA', async (req, res) => 
{
    const FUNC_MATRICULA_FOLHA = req.params.FUNC_MATRICULA_FOLHA

    const attributes = `FUNC_MATRICULA_FOLHA, FUNC_PESS_C_P_F, NO_SERVIDOR`

    const tables = `rh_funcionario INNER JOIN serv_pessoal ON rh_funcionario.FUNC_MATRICULA_FOLHA = serv_pessoal.NU_MATR_SERVIDOR`

    const query = `SELECT ${attributes} from ${tables} WHERE func_matricula_folha = '${FUNC_MATRICULA_FOLHA}'`

    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.get('/servidores/lotacao', async (req, res) =>
{
    const attributes = `func_matricula_folha, sg_lotacao, de_lotacao`

    const tables = `rh_funcionario INNER JOIN lotacao ON rh_funcionario.func_lota_cod_lotacao = lotacao.co_lotacao`

    const query = `SELECT ${attributes} FROM ${tables}`
    
    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.get('/servidores/situacao', async (req, res) =>
{
    const attributes = `func_matricula_folha, situ_cod_situacao, situ_dsc_situacao`

    const tables = `rh_funcionario INNER JOIN rh_situacao ON rh_funcionario.func_perf_cod_situacao = rh_situacao.situ_cod_situacao`

    const query = `SELECT ${attributes} FROM ${tables}`
    
    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})
    

app.get('/servidores/inativos', async (req, res) =>
{
    const attributes = `func_sesb_sigla_secao_subsecao, func_matricula_folha, func_e_mail, func_perf_cod_situacao, situ_cod_situacao, situ_dsc_situacao, user_id, user_nome`

    const tables = `rh_funcionario INNER JOIN rh_situacao ON rh_funcionario.func_perf_cod_situacao = rh_situacao.situ_cod_situacao INNER JOIN rh_user_id ON rh_funcionario.func_matricula_folha = rh_user_id.user_id`

    const query = `SELECT ${attributes} FROM ${tables} WHERE func_sesb_sigla_secao_subsecao <> 'JU' AND func_sesb_sigla_secao_subsecao <> 'DS' AND SITU_DSC_SITUACAO LIKE '%INATIVO%'`
    
    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.get('/servidores/divisao', async (req, res) =>
{
    const attributes = `func_matricula_folha, divi_dsc_divisao`

    const tables = `rh_funcionario INNER JOIN rh_divisao ON rh_funcionario.func_perf_cod_divisao = rh_divisao.divi_cod_divisao`

    const query = `SELECT ${attributes} FROM ${tables}`
    
    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

const format_date = (date) => {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}

const format_ferias = (ferias) => {
    let retorno = ferias

    retorno.forEach(feria => {
        feria[1] = format_date(feria[1])
        feria[3] = format_date(feria[3])
    });

    return retorno
}

app.post('/servidores/ferias/', async (req, res) =>
{
    const matricula = req.body.matricula
    const data_inicio = req.body.data_inicio
    const data_fim = req.body.data_fim

    if(!(matricula && data_inicio && data_fim))
        return []

    matricula_formated = matricula.substring(2)

    const attributes = "pfer_feri_cod_funcionario, pfer_inicio_periodo, pfer_dias_gozados, pfer_fim_periodo, pfer_data_interrup_suspensao, pfer_flag_ocorrencia" //flag = 7 - suspensas, 1 - marcadas, 2- gozadas, 5 - interrompdias / remarcadas

    const tables = `rh_periodo_ferias`

    const query = `SELECT ${attributes} FROM ${tables} WHERE pfer_feri_cod_funcionario = ${matricula_formated} AND pfer_flag_ocorrencia IN (1, 2, 5, 7) AND ((pfer_inicio_periodo BETWEEN '${data_inicio}' AND '${data_fim}') OR (pfer_fim_periodo BETWEEN '${data_inicio}' AND '${data_fim}'))`

    //AND pfer_inicio_periodo BETWEEN ${data_inicio} AND ${data_fim}
    
    try {
        const result = await connectToOracle(query)

        // console.log(result[0][1])
        // console.log(data_inicio)

        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

// region pessoas

//obs pessoas são todas as pessoas que têm vínculo com a Justiça Federal
app.get('/pessoas', async (req, res) => {
    const query = `SELECT nome, cpf, matricula, cargo, uf FROM rh_relacao_pessoas ORDER BY nome`

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

//region pensionistas

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