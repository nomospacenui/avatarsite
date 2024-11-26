function add_url_var(keys_values, url_vars) {
    var url = String(window.location.href)
    if (url.lastIndexOf("?") != -1)
        url = url.substring(0, url.lastIndexOf("?") + 1)
    else
        url += "?"

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
            console.log(url)
            if (!(k in url_vars))
                url += k + "=" + v + "&"
        }
    }
    
    // window.location.replace(url.substring(0, url.length - 1))
}

export default add_url_var