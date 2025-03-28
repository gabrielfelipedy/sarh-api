const format_date = (date) => {
    //const temp_date = new Date(date)
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

module.exports = { format_date }