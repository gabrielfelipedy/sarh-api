//AQUI SERÃO ESCRITOS TODOS OS ENDPOINTS QUE 
//RETORNAM INFORMAÇÕES RELACIONADOS 
// AOS CARGOS DOS FUNCIONÁRIOS

const { connectToOracle } = require('../database/oracle')

const getCargo = async (codigo_cargo) =>
{
    const attributes = "carg_cod_cargo, carg_dsc_cargo"

    const tables = `RH_CARGO`

    const query = `SELECT ${attributes} FROM ${tables} WHERE carg_cod_cargo = ${codigo_cargo}`
    
    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        throw new Error("Erro na consulta de cargo")
    }
}

const getCargoByMatricula = async (matricula) =>
{
    const attributes = "func_carg_cod_cargo, func_matricula_folha"

    const tables = `RH_FUNCIONARIO`

    const query = `SELECT ${attributes} FROM ${tables} WHERE func_matricula_folha = '${matricula}'`
    
    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        throw new Error("Erro na consulta de cargo por matricula")
    }
}

module.exports = {
    getCargo,
    getCargoByMatricula
}