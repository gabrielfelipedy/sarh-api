const format_date = (date) => {
    return new Date(date).toLocaleString("pt-BR")
}

module.exports = { format_date }