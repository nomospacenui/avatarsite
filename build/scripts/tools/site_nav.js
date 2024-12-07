function change_url_var(keys_values, url_vars, remove_keys=[]) {
    var url = String(window.location.href)
    sessionStorage.setItem('prev_url', url)

    var auto_remove_keys = ["action"]

    if (url.lastIndexOf("?") != -1)
        url = url.substring(0, url.lastIndexOf("?") + 1)
    else
        url += "?"

    if (Object.keys(url_vars).length > 0 ) {
        for (let [k, v] of Object.entries(url_vars)) {
            if (remove_keys.includes(k))
                continue
            else if (auto_remove_keys.includes(k))
                continue
            else if (k in keys_values)
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
    
    return url.substring(0, url.length - 1)
}

function go_to_url(url) {
    window.location.href = url
}

const site_nav = {
    change_url_var,
    go_to_url
}

export default site_nav