function inclusive_range(start, end) {
    return [...Array(end + 1).keys()].slice(start)
}

function format_datetime(datetime) {
    const temp_datetime = new Date(datetime)
    var display_time = temp_datetime.toLocaleString('en-us', {month:'short', day:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', hour12: false})
    var relative_time = moment(temp_datetime.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day:'2-digit'}), "MM/DD/YYYY").fromNow()

    return [display_time, relative_time]
}

const utils = {
    inclusive_range,
    format_datetime
}

export default utils