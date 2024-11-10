function click_page_button(page_num, url_vars) {
    var url = String(window.location.href)
    url = url.replace("page=" + url_vars["page"], "page=" + page_num)
    window.location.replace(url);
}

export default click_page_button