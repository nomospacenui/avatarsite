import site_nav from "../tools/site_nav.js"
import utils from "../tools/utils.js"

class ForumCategories {
    constructor(categories, url_vars) {
        this._categories = categories
        this._url_vars = url_vars

        var postcontent_container = document.getElementById("internal-body")
        for (var i = 0 ; i < this._categories.length ; ++i) {
            postcontent_container.append(this.create_category(this._categories[i]))
        }
    }

    create_category(category) {
        var category_win = document.createElement("div")
        category_win.className = "category-win"

        var category_win_header = document.createElement("a")
        category_win_header.className = "category-win-header"
        category_win_header.innerHTML = category.name
        category_win_header.href = site_nav.change_url_var({"subforum": category.id, "page": 0}, this._url_vars)

        category_win.append(category_win_header)
        category_win.append(this.create_children_rows(category.children))

        return category_win
    }

    create_children_rows(children) {
        var category_win_body = document.createElement("div")
        category_win_body.className = "category-win-body"

        for (var i = 0 ; i < children.length ; ++i) {
            var row = document.createElement("a")
            row.className = "category-win-body-row"
            row.href = site_nav.change_url_var({"subforum": children[i].id, "page": 0}, this._url_vars)
            
            var row_name = document.createElement("div")
            row_name.className = "category-win-body-cell"
            row_name.innerHTML = children[i].name
            row_name.style.width = "25%"
            row.append(row_name)
            
            var row_description = document.createElement("div")
            row_description.className = "category-win-body-cell"
            row_description.innerHTML = children[i].description
            row_description.style.width = "40%"
            row.append(row_description)
            
            var row_activity = document.createElement("div")
            row_activity.className = "category-win-body-cell"

            if (!children[i].latest_activity)
                row_activity.innerHTML = "-"
            else {
                var thread_name = null
                if (children[i].latest_activity.length == 2)
                    thread_name = children[i].latest_activity[1].name
                else
                    thread_name = children[i].latest_activity[0].name

                var [display_time, relative_time] = utils.format_datetime(children[i].latest_activity[0].datetime)
                row_activity.innerHTML = "USERNAME posted in " + thread_name + " about " + relative_time
                row_activity.innerHTML += "<br/> View post"
            }

            row.append(row_activity)
            
            category_win_body.append(row)
        }

        return category_win_body
    }
}

export default ForumCategories