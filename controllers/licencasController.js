//AQUI SERÃO ESCRITOS TODOS OS ENDPOINTS QUE 
//RETORNAM INFORMAÇÕES A LICENCAS DE SERVIDORES


const { connectToOracle } = require('../database/oracle')

const getLicencasServidor = async (matricula, data_inicio, data_fim) =>
{
    const attributes = "plic_lice_cod_funcionario, plic_inicio_periodo, plic_fim_periodo, lice_num_processo, tiaf_dsc_tipo_afas"

    const tables = `rh_periodo_licenca INNER JOIN rh_licenca ON lice_cod_licenca = plic_lice_cod_licenca INNER JOIN rh_tipo_afastamento ON tiaf_cod_tipo_afas = lice_tiaf_cod_tipo_afas`

    const query = `SELECT ${attributes} FROM ${tables} WHERE plic_lice_cod_funcionario = ${matricula_formated} AND lice_func_cod_funcionario = ${matricula_formated}  AND ((plic_inicio_periodo BETWEEN '${data_inicio}' AND '${data_fim}') OR (plic_fim_periodo BETWEEN '${data_inicio}' AND '${data_fim}'))`
    
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
    getLicencasServidor,
}