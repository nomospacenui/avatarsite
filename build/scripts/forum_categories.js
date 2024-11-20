class ForumCategories {
    constructor(categories) {
        this._categories = categories

        var postcontent_container = document.getElementById("body_contentbox")
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
        
        var category_win_body = document.createElement("div")
        category_win_body.className = "category-win-body"
        
        category_win_body.append(this.create_children_rows(category.children))

        category_win.append(category_win_header)
        category_win.append(category_win_body)

        return category_win
    }

    create_children_rows(children) {
        var children_rows = document.createElement("div")

        for (var i = 0 ; i < children.length ; ++i) {
            var row = document.createElement("div")
            row.className = "category-win-row"
            
            var row_name = document.createElement("div")
            row_name.className = "category-win-cell"
            row_name.innerHTML = children[i].name
            row.append(row_name)
            
            var row_description = document.createElement("div")
            row_description.className = "category-win-cell"
            row_description.innerHTML = "Description Description Description Description Description Description Description Description Description Description Description Description"
            row.append(row_description)
            
            var row_activity = document.createElement("div")
            row_activity.className = "category-win-cell"
            row_activity.innerHTML = "Activity Activity Activity Activity Activity Activity Activity Activity"
            row.append(row_activity)
            
            row_name.style.borderTop = "1px solid #7D528C"
            row_description.style.borderTop = "1px solid #7D528C"
            row_activity.style.borderTop = "1px solid #7D528C"
            
            children_rows.append(row)
        }

        return children_rows
    }
}

export default ForumCategories