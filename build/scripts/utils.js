function inclusive_range(start, end) {
    return [...Array(end + 1).keys()].slice(start)
}

export default inclusive_range