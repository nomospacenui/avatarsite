import site_nav from "../tools/site_nav.js"

class ForumBreadcrumbs {
    constructor (subforums_data, current_subforum, url_vars){
        this._url_vars = url_vars

        var thread_header = document.getElementById("internal-header")
        var thread_breadcrumbs = document.createElement("div")

        var breadcrumbs = []
        var current = subforums_data[current_subforum["id"]]
        breadcrumbs.push(this.create_breadcrumb(current["name"], {"subforum": current.id, "page": 1}, ["thread"]))
        breadcrumbs.push(this.create_seperator())

        while (current["parent_id"] != -1) {
            current = subforums_data[current["parent_id"]]
            breadcrumbs.push(this.create_breadcrumb(current["name"], {"subforum": current.id, "page": 1}, ["thread"]))
            breadcrumbs.push(this.create_seperator())
        }
        
        breadcrumbs.push(this.create_breadcrumb("Forums", {}, ["thread", "page", "subforum"]))
        breadcrumbs.reverse().forEach(x => thread_breadcrumbs.append(x))
        thread_header.appendChild(thread_breadcrumbs)
    }

    create_breadcrumb(display_name, add_url_var, remove_url_var) {
        var breadcrumb_link = document.createElement("a")
        breadcrumb_link.href = site_nav.change_url_var(add_url_var, this._url_vars, remove_url_var)
        breadcrumb_link.innerHTML = display_name
        breadcrumb_link.className = "hyperlink"
        return breadcrumb_link
    }

    create_seperator() {
        var seperator = document.createElement("a")
        seperator.innerHTML = " > "
        return seperator
    }
}

export default ForumBreadcrumbs