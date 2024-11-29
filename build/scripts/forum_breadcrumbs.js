import site_nav from "./site_nav.js"

class ForumBreadcrumbs {
    constructor (subforums_data, current_subforum, url_vars){
        var thread_header = document.getElementById("internal-header")
        var thread_breadcrumbs = document.createElement("div")

        var current = subforums_data[current_subforum["id"]]
        var breadcrumb_link = document.createElement("a")
        breadcrumb_link.href = site_nav.change_url_var({"subforum": current.id, "page": 1}, url_vars, ["thread"])
        breadcrumb_link.innerHTML = current["name"]
        breadcrumb_link.className = "hyperlink"
        var breadcrumbs = [breadcrumb_link]
        
        var seperator = document.createElement("a")
        seperator.innerHTML = " > "
        breadcrumbs.push(seperator)

        while (current["parent_id"] != -1) {
            current = subforums_data[current["parent_id"]]
            var breadcrumb_link = document.createElement("a")
            breadcrumb_link.href = site_nav.change_url_var({"subforum": current.id, "page": 1}, url_vars, ["thread"])
            breadcrumb_link.innerHTML = current["name"]
            breadcrumb_link.className = "hyperlink"
            breadcrumbs.push(breadcrumb_link)
            
            var seperator = document.createElement("a")
            seperator.innerHTML = " > "
            breadcrumbs.push(seperator)
        }
        
        var breadcrumb_link = document.createElement("a")
        breadcrumb_link.href = site_nav.change_url_var({}, url_vars, ["thread", "page"])
        breadcrumb_link.innerHTML = "Forums"
        breadcrumb_link.className = "hyperlink"
        breadcrumbs.push(breadcrumb_link)
        
        var breadcrumbs_str = ""
        breadcrumbs.reverse().forEach(x => thread_breadcrumbs.append(x))
        breadcrumbs_str = breadcrumbs_str.slice(0, breadcrumbs_str.length - 2)

        thread_header.appendChild(thread_breadcrumbs)
    }
}

export default ForumBreadcrumbs