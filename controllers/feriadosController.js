//AQUI SERÃO ESCRITOS TODOS OS ENDPOINTS QUE 
//RETORNAM INFORMAÇÕES A FERIADOS

//código dos meses

//1 = janeiro
//2 = feveiro
//3 = março
//4 = abril
//5 = maio
//6 = junho
//7 = julho
//8 = agosto
//9 = setembro
//10 = outubro
//11 = novembro
//12 = dezembro

const { connectToOracle } = require('../database/oracle')

const getFeriadosByAno = async (codigo_ano) =>
{
    const attributes = "FEAD_CODIGO, FEAD_DATA_FERIADO, FEAD_DESCRICAO, FEAD_ANO"

    const tables = `RH_FERIADO`

    const query = `SELECT ${attributes} FROM ${tables} WHERE FEAD_ANO = ${codigo_ano}`
    
    try {
        const result = await connectToOracle(query)
        return result
    }
    catch(err)
    {
        throw new Error("Erro na consulta de cargo")
    }
}

const getFeriadosByMes = async (codigo_mes, codigo_ano) =>
{
    const attributes = "FEAD_CODIGO, FEAD_DATA_FERIADO, FEAD_DESCRICAO, FEAD_ANO"

    const tables = `RH_FERIADO`

    const query = `SELECT ${attributes} FROM ${tables} WHERE FEAD_ANO = ${codigo_ano}`
    
    try {
        const result = await connectToOracle(query)

        new_result = []

        result.forEach(el => {
            const date = new Date(el[1])
            
            if((date.getMonth() + 1) === codigo_mes)
            {
                new_result.push(el)
            }
        })

        return new_result
    }
    catch(err)
    {
        throw new Error("Erro na consulta de cargo")
    }
}

module.exports = {
    getFeriadosByAno,
    getFeriadosByMes
}