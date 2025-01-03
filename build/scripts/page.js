
class Page {
    constructor() {
        this.handle_backbutton()
        this.create_navigation()
    }

    handle_backbutton() {
        window.addEventListener("popstate", (event) => {window.location.href = sessionStorage.getItem('prev_url')})
    }

    create_navigation() {
        var navigation_bar = document.getElementById("contentbox-header")

        const nav_items = ["Home", "Avatar", "Forums", "Shops", "Games"]

        for (var i = 0 ; i < nav_items.length ; ++i) {
            
            var button = document.createElement("button")
            button.innerHTML = nav_items[i]
            
            if (window.location.href.includes(nav_items[i].toLowerCase())) {
                button.className = "nav-button-accent"
                var page_title = document.getElementById("page_title")
                page_title.innerHTML = nav_items[i]
            }
            
            else
                button.className = "nav-button"

            if (i == 0)
                button.style.borderLeft = "1px solid #7D528C"

            navigation_bar.appendChild(button)
        }
    }
}

new Page()