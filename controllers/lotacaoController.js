//AQUI SERÃO ESCRITOS TODOS OS ENDPOINTS QUE 
//RETORNAM INFORMAÇÕES RELACIONADOS LOTAÇÕES

const { connectToOracle } = require('../database/oracle')

const getLotacao = async (codigo_lotacao) =>
{
    const attributes = "lota_cod_lotacao, lota_lota_cod_lotacao_pai, lota_dsc_lotacao, lota_sigla_lotacao"

    const tables = `rh_lotacao`

    const query = `SELECT ${attributes} FROM ${tables} WHERE lota_cod_lotacao = ${codigo_lotacao}`
    
    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        throw new Error("Erro na consulta de lotação")
    }
}

const getLotacaoServidores = async () =>
{
    const attributes = `func_matricula_folha, sg_lotacao, de_lotacao`

    const tables = `rh_funcionario INNER JOIN lotacao ON rh_funcionario.func_lota_cod_lotacao = lotacao.co_lotacao`

    const query = `SELECT ${attributes} FROM ${tables}`
    
    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        throw new Error("Erro na consulta de lotação de todos os servidores")
    }
}

const getlotacaoByMatricula = async (matricula) => {
    
    const matricula_formated = matricula.toUpperCase()

    const attributes = `func_matricula_folha, func_lota_cod_lotacao, sg_lotacao, de_lotacao`

    const tables = `rh_funcionario INNER JOIN lotacao ON rh_funcionario.func_lota_cod_lotacao = lotacao.co_lotacao`

    const query = `SELECT ${attributes} FROM ${tables} WHERE func_matricula_folha = '${matricula_formated}'`
    
    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        throw new Error("Erro na consulta de lotação por matrícula")
    }
}

const getLotacaoPai = async (codigo_lotacao) =>
{
    const attributes = "lota_cod_lotacao, lota_lota_cod_lotacao_pai, lota_dsc_lotacao, lota_sigla_lotacao"

    const tables = `rh_lotacao`

    const query = `SELECT ${attributes} FROM ${tables} WHERE lota_cod_lotacao = ${codigo_lotacao}`
    
    try {
        const temp_result = await connectToOracle(query)
        const codigo_pai = temp_result[0][1]

        try {
            const attributes2 = "lota_cod_lotacao, lota_dsc_lotacao, lota_sigla_lotacao"

            const result = await connectToOracle(`SELECT ${attributes2} FROM ${tables} WHERE lota_cod_lotacao = ${codigo_pai}`)

            return result

        } catch (err) {
            throw new Error('Erro na consulta da lotação pai');
        }
    }
    catch(err)
    {
        throw new Error('Erro na consulta da lotação pai');
    }
}

const getLotacaoSubordinados = async (codigo_lotacao_pai) =>
{
    const attributes = "lota_cod_lotacao, lota_dsc_lotacao, lota_sigla_lotacao"

    const tables = `rh_lotacao`

    const query = `SELECT ${attributes} FROM ${tables} WHERE lota_lota_cod_lotacao_pai = ${codigo_lotacao_pai} AND lota_dat_fim IS NULL`
    
    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        res.status(500).json({ message: 'Erro connecting do database', err})
    }
}

module.exports = {
    getLotacao,
    getLotacaoServidores,
    getlotacaoByMatricula,
    getLotacaoPai,
    getLotacaoSubordinados
}