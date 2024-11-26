import add_url_var from "./site_nav.js"

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

        var category_win_header = document.createElement("div")
        category_win_header.className = "category-win-header"
        category_win_header.innerHTML = category.name
        const subforum_id = category.id
        const url_vars = this._url_vars
        category_win_header.onclick = function(){
            add_url_var({"subforum": subforum_id, "page": 0}, url_vars)
        }

        category_win.append(category_win_header)
        category_win.append(this.create_children_rows(category.children))

        return category_win
    }

    create_children_rows(children) {
        var category_win_body = document.createElement("div")
        category_win_body.className = "category-win-body"

        for (var i = 0 ; i < children.length ; ++i) {
            var row = document.createElement("div")
            row.className = "category-win-body-row"
            const subforum_id = children[i].id
            const url_vars = this._url_vars
            row.onclick = function(){ 
                add_url_var({"subforum": subforum_id, "page": 0}, url_vars)
            }
            
            var row_name = document.createElement("div")
            row_name.className = "category-win-body-cell"
            row_name.innerHTML = children[i].name
            row.append(row_name)
            
            var row_description = document.createElement("div")
            row_description.className = "category-win-body-cell"
            row_description.innerHTML = "Description Description Description Description Description Description Description Description Description Description Description Description"
            row.append(row_description)
            
            var row_activity = document.createElement("div")
            row_activity.className = "category-win-body-cell"
            row_activity.innerHTML = "Activity Activity Activity Activity Activity Activity Activity Activity"
            row.append(row_activity)
            
            category_win_body.append(row)
        }

        return category_win_body
    }
}

export default ForumCategories