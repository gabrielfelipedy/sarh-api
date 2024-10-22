//AQUI SERÃO ESCRITOS TODOS OS ENDPOINTS QUE 
//RETORNAM INFORMAÇÕES RELACIONADOS A DADOS DE SERVIDORES

const { connectToOracle } = require('../database/oracle')

const getServidores = async () =>
{
    const attributes = `FUNC_MATRICULA_FOLHA, FUNC_PESS_C_P_F, NO_SERVIDOR`

    const tables = `rh_funcionario INNER JOIN serv_pessoal ON rh_funcionario.FUNC_MATRICULA_FOLHA = serv_pessoal.NU_MATR_SERVIDOR`

    const query = `SELECT ${attributes} from ${tables} ORDER BY no_servidor`

    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        throw new Error("Erro na consulta dos servidores")
    }
}

const getServidorByMatricula = async (matricula) =>
{
    const FUNC_MATRICULA_FOLHA = matricula.toUpperCase()
    
    const attributes = `FUNC_MATRICULA_FOLHA, FUNC_PESS_C_P_F, NO_SERVIDOR`

    const tables = `rh_funcionario INNER JOIN serv_pessoal ON rh_funcionario.FUNC_MATRICULA_FOLHA = serv_pessoal.NU_MATR_SERVIDOR`

    const query = `SELECT ${attributes} from ${tables} WHERE func_matricula_folha = '${FUNC_MATRICULA_FOLHA}'`

    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        throw new Error("Erro na consulta de servidor pela matrícula")
    }
}

module.exports = {
    getServidores,
    getServidorByMatricula
}