const format_date = (date) => {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}

module.exports = { format_date }