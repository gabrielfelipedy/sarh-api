const express = require('express')
const oracledb = require('oracledb')
const moment = require('moment')

const { format_date } = require('./format_date')
const { connectToOracle } = require('./database/oracle')

const {
    getLotacao, 
    getlotacaoByMatricula, 
    getLotacaoPai, 
    getLotacaoSubordinados,
    getLotacaoServidores, 
} = require('./controllers/lotacaoController')

const { 
    getServidores, 
    getServidorByMatricula 
} = require('./controllers/servidoresController')

const app = express()
const port = 3000

app.use(express.json())
moment.locale('pt-br'); 

app.get('/', (req, res) => {
    res.send('Welcome to SARH API JS')
})

//region SERVIDORES

//obs servidores são apenas as pessoas que são servidores efetivos
app.get('/servidores', async (req, res) => 
{
    try {
        const result = await getServidores()
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.post('/servidores', async (req, res) => 
{
    const FUNC_MATRICULA_FOLHA = req.body.matricula

    try {
        const result = await getServidorByMatricula(FUNC_MATRICULA_FOLHA)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

//region SERV LOTAÇÃO

app.get('/servidores/lotacao', async (req, res) =>
{
    try {
        const result = await getLotacaoServidores()
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro em retornar a lotação de cada servidor', err})
    }
})

app.post('/servidores/lotacao', async (req, res) =>
{
    const matricula = req.body.matricula;
    
    try {
        const result = await getlotacaoByMatricula(matricula)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro em retornar a lotação de um servidor', err})
    }
})

app.post('/servidores/chefe', async (req, res) =>
{
    const matricula = req.body.matricula;
    
    try {
        const result = await getlotacaoByMatricula(matricula)
        const codigo_lotacao = result[0][1]

        try {
            const result2 = await getLotacaoPai(codigo_lotacao)
            res.json(result2)
        }
        catch(err)
        {
            res.status(500).json({ message: 'Erro em servidores/chefe', err})
        }
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro em servidores/chefe', err})
    }
})

app.post('/servidores/subordinados', async (req, res) =>
{
    const matricula = req.body.matricula;
    
    try {
        const result = await getlotacaoByMatricula(matricula)
        const codigo_lotacao = result[0][1]

        try {
            const result2 = await getLotacaoPai(codigo_lotacao)
            res.json(result2)
        }
        catch(err)
        {
            res.status(500).json({ message: 'Erro em servidores/chefe', err})
        }
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro em servidores/chefe', err})
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

app.post('/servidores/licencas/', async (req, res) =>
{
    const matricula = req.body.matricula
    const data_inicio = req.body.data_inicio
    const data_fim = req.body.data_fim

    if(!(matricula && data_inicio && data_fim))
        return []

    matricula_formated = matricula.substring(2)

    const attributes = "plic_lice_cod_funcionario, plic_inicio_periodo, plic_fim_periodo, lice_num_processo, tiaf_dsc_tipo_afas"

    const tables = `rh_periodo_licenca INNER JOIN rh_licenca ON lice_cod_licenca = plic_lice_cod_licenca INNER JOIN rh_tipo_afastamento ON tiaf_cod_tipo_afas = lice_tiaf_cod_tipo_afas`

    const query = `SELECT ${attributes} FROM ${tables} WHERE plic_lice_cod_funcionario = ${matricula_formated} AND lice_func_cod_funcionario = ${matricula_formated}  AND ((plic_inicio_periodo BETWEEN '${data_inicio}' AND '${data_fim}') OR (plic_fim_periodo BETWEEN '${data_inicio}' AND '${data_fim}'))`

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

app.post('/servidores/teletrabalho/', async (req, res) =>
{
    const matricula = req.body.matricula
    const data_inicio = req.body.data_inicio
    const data_fim = req.body.data_fim

    if(!(matricula && data_inicio && data_fim))
        return []

    matricula_formated = matricula.substring(2)

    const attributes = "freq_dat_inicio, freq_dat_fim, freq_tipo, freq_observacao"

    const tables = `rh_frequencia_especial`

    const query = `SELECT ${attributes} FROM ${tables} WHERE freq_func_cod_funcionario = ${matricula_formated}`

    //AND pfer_inicio_periodo BETWEEN ${data_inicio} AND ${data_fim}
    
    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.post('/servidores/afastamento/', async (req, res) =>
{
    const matricula = req.body.matricula

    if(!matricula)
        return []

    matricula_formated = matricula.substring(2)

    const attributes = "freq_dat_inicio, freq_dat_fim, freq_tipo, freq_observacao"

    const tables = `rh_frequencia_especial`

    const query = `SELECT ${attributes} FROM ${tables} WHERE freq_func_cod_funcionario = ${matricula_formated}`

    //AND pfer_inicio_periodo BETWEEN ${data_inicio} AND ${data_fim}
    
    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

//region LOTAÇÃO

app.post('/lotacao/', async (req, res) =>
{
    const codigo_lotacao = req.body.codigo_lotacao

    try {
        const result = await getLotacao(codigo_lotacao)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.post('/lotacao/pai', async (req, res) =>
{
    const codigo_lotacao = req.body.codigo_lotacao

    try {
        const result = await getLotacaoPai(codigo_lotacao)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.post('/lotacao/subordinados', async (req, res) =>
{
    const codigo_lotacao_pai = req.body.codigo_lotacao_pai
    
    try {
        const result = await getLotacaoSubordinados(codigo_lotacao_pai)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

// region PESSOAS

//obs pessoas são todas as pessoas que têm vínculo com a Justiça Federal
app.get('/pessoas', async (req, res) =>
{
    const attributes = "nome, cpf, matricula, cargo, uf"

    const tables = `rh_relacao_pessoas`

    const query = `SELECT ${attributes} FROM ${tables}  ORDER BY nome`

    try {
        const result = await connectToOracle(query)
        res.json(result)
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
})

app.get('/pessoas/ativas', async (req, res) =>
{
    const attributes = "nu_matr_servidor, no_servidor, gru_fun_serv, cpf_servidor, flag_ativo"

    const tables = `serv_pessoal`

    const query = `SELECT ${attributes} FROM ${tables} WHERE flag_ativo = 1 ORDER BY no_servidor`

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

//region PENSIONISTAS

app.get('/pensionistas', async (req, res) =>
{
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