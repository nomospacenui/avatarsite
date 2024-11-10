function go_to_page(new_page, current_page) {
    var url = String(window.location.href)
    url = url.replace("page=" + current_page, "page=" + new_page)
    window.location.replace(url);
}

export default go_to_page