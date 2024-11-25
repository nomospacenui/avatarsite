
class Page {
    constructor() {
        this.create_navigation()
    }

    create_navigation() {
        var navigation_bar = document.getElementById("contentbox-header")

        const nav_items = ["Home", "Avatar", "Forums", "Shops", "Games"]

        for (var i = 0 ; i < nav_items.length ; ++i) {
            
            var button = document.createElement("button")
            button.innerHTML = nav_items[i]
            
            if (window.location.href.includes(nav_items[i].toLowerCase()))
                button.className = "nav-button-accent"
            else
                button.className = "nav-button"

            if (i == 0)
                button.style.borderLeft = "1px solid #7D528C"

            navigation_bar.appendChild(button)
        }
    }
}

new Page()