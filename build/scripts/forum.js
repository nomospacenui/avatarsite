class Forum {
    constructor(categories) {
        this._categories = categories

        var postcontent_container = document.getElementById("body_contentbox")
        for (var i = 0 ; i < this._categories.length ; ++i) {
            postcontent_container.append(this.init_category(this._categories[i]))
        }
    }

    init_category(category) {
        var category_win = document.createElement("div")
        category_win.className = "category-win"

        var category_win_header = document.createElement("div")
        category_win_header.className = "category-win-header"
        category_win_header.innerHTML = category.name
        
        var category_win_body = document.createElement("div")
        category_win_body.className = "category-win-body"

        for (var i = 0 ; i < category.children.length ; ++i) {
            var category_win_row = document.createElement("div")
            category_win_row.className = "category-win-row"

            category_win_body.append(category_win_row)
            
            var category_name = document.createElement("div")
            category_name.className = "category-win-cell"
            category_name.innerHTML = category.children[i].name
            category_win_row.append(category_name)
            
            var category_description = document.createElement("div")
            category_description.className = "category-win-cell"
            category_description.innerHTML = "Description Description Description Description Description Description Description Description Description Description Description Description"
            category_win_row.append(category_description)
            
            var category_activity = document.createElement("div")
            category_activity.className = "category-win-cell"
            category_activity.innerHTML = "Activity Activity Activity Activity Activity Activity Activity Activity"
            category_win_row.append(category_activity)
            
            if  (i != 0) {
                category_name.style.borderTop = "1px solid #7D528C"
                category_description.style.borderTop = "1px solid #7D528C"
                category_activity.style.borderTop = "1px solid #7D528C"
            }
        }

        category_win.append(category_win_header)
        category_win.append(category_win_body)

        return category_win
    }
}

export default Forum