const oracledb = require('oracledb')

require('dotenv').config();

oracledb.initOracleClient({ libDir: process.env.ORACLE_HOME });

const oracleConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING
}

const connectToOracle = async (query) =>
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

module.exports = { connectToOracle }