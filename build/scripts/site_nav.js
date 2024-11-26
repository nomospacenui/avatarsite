function add_url_var(keys_values, url_vars) {
    var url = String(window.location.href)
    var filename = url.substring(0, url.lastIndexOf(".html") + 5)
    url = filename + "?"

    if (Object.keys(url_vars).length > 0 ) {
        for (let [k, v] of Object.entries(url_vars)) {
            if (k in keys_values)
                url += k + "=" + keys_values[k] + "&"
            else
                url += k + "=" + v + "&"
        }
    }

    if (Object.keys(keys_values).length > 0 ) {
        for (let [k, v] of Object.entries(keys_values)) {
            if (!(k in url_vars))
                url += k + "=" + v + "&"
        }
    }
    
    window.location.replace(url.substring(0, url.length - 1))
}

export default add_url_var