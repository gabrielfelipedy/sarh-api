//AQUI SERÃO ESCRITOS TODOS OS ENDPOINTS QUE 
//RETORNAM INFORMAÇÕES A FERIAS DE SERVIDORES

//FLAS DE OCORRÊNCIA:
// 7 - suspensas
// 1 - marcadas
// 2 - gozadas
// 5 - interrompidas / remarcadas

const { connectToOracle } = require('../database/oracle')

const getFeriasServidor = async (matricula, data_inicio, data_fim) =>
{
    const attributes = "pfer_feri_cod_funcionario, pfer_inicio_periodo, pfer_fim_periodo, pfer_flag_ocorrencia"

    const tables = `RH_PERIODO_FERIAS`

    const query = `SELECT ${attributes} FROM ${tables} WHERE pfer_feri_cod_funcionario = ${matricula} AND pfer_flag_ocorrencia IN (1, 2, 5, 7) AND ((pfer_inicio_periodo BETWEEN '${data_inicio}' AND '${data_fim}') OR (pfer_fim_periodo BETWEEN '${data_inicio}' AND '${data_fim}'))`
    
    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        throw new Error("Erro na consulta de cargo")
    }
}

module.exports = {
    getFeriasServidor,
}