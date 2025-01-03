import Post from "./post.js"
import utils from "../tools/utils.js"
import site_nav from "../tools/site_nav.js"

class Thread {
    constructor(thread_data, replies_data, url_vars, non_url_vars) {
        this._thread_data = thread_data
        this._replies_data = replies_data
        this._url_vars = url_vars
        this._non_url_vars = non_url_vars
        this._max_page_nav_len = 3

        this.create_header()

        // First post by the thread author
        if (url_vars["page"] == 1)
            new Post(thread_data)

        // Subsequent replies
        for (var i = 0 ; i < replies_data.length ; ++i) {
            const post = new Post(replies_data[i])

            if (("action" in url_vars) &&
                (url_vars["action"] == "jump_to_last") &&
                (i == replies_data.length - 1))
                post.scroll_to()
        }

        this.create_footer()
    }

    create_header() {
        var page_title = document.getElementById("page_title")
        page_title.innerHTML = this._thread_data.name
        
        var thread_header = document.getElementById("internal-header")
        
        var thread_header_left = document.createElement("div")
        thread_header_left.className = "threadheader-left"

        var thread_title = document.createElement("div")
        thread_title.className = "threadtitle"
        thread_title.innerHTML = this._thread_data.name
        thread_header_left.appendChild(thread_title)
        
        var report_thread_button = document.createElement("button")
        report_thread_button.className = "button-accent"
        report_thread_button.innerHTML = "Report Thread"
        thread_header_left.appendChild(report_thread_button)

        var thread_header_right = document.createElement("div")
        thread_header_right.className = "threadheader-right"
        thread_header_right.appendChild(this.create_page_navigation())
        
        thread_header.appendChild(thread_header_left)
        thread_header.appendChild(thread_header_right)

        return thread_header
    }

    create_footer() {
        var thread_footer = document.getElementById("internal-footer")
        thread_footer.className = "threadheader"
        thread_footer.appendChild(this.create_page_navigation())

        return thread_footer
    }

    create_page_navigation() {
        var thread_page_buttons = document.createElement("div")
        thread_page_buttons.className = "pagebuttons"

        var thread_page_buttons_space = document.createElement("div")
        thread_page_buttons_space.className = "pagebuttons-space"
        thread_page_buttons.appendChild(thread_page_buttons_space)
        
        var thread_page_buttons_container = document.createElement("div")
        thread_page_buttons_container.className = "pagebuttonscontainer"
        thread_page_buttons.appendChild(thread_page_buttons_container)
        
        if (this._non_url_vars["num_pages"] > 1) {
            const current_page = this._url_vars["page"]
            const num_pages = this._non_url_vars["num_pages"]

            // + 1 as pages start counting from 1
            var page_button_list = utils.inclusive_range(1, num_pages)

            if (num_pages > this._max_page_nav_len) {
                
                //if the page number is at the front end
                if (current_page < (this._max_page_nav_len / 2))
                    page_button_list = utils.inclusive_range(1, this._max_page_nav_len)

                //if the page number is at the tail end
                else if (current_page + (this._max_page_nav_len / 2) > num_pages)
                    page_button_list = utils.inclusive_range(num_pages - this._max_page_nav_len + 1, num_pages)

                else
                    page_button_list = utils.inclusive_range(current_page - 1, current_page + 1)
            }
            
            if (current_page > 1)
                thread_page_buttons_container.appendChild(this.create_page_navigation_button(current_page - 1, "<"))

            if (!page_button_list.includes(1)) {
                thread_page_buttons_container.appendChild(this.create_page_navigation_button(1, 1))

                // needs "..." if there is a jump from the page 1 button to the next page button 
                if (!page_button_list.includes(2))
                    thread_page_buttons_container.appendChild(this.create_page_jump_button())
            }
            
            for (var i = 0 ; i < page_button_list.length ; ++i)
                thread_page_buttons_container.appendChild(this.create_page_navigation_button(page_button_list[i], page_button_list[i]))
            
            if (!page_button_list.includes(num_pages)) {
                // needs "..." if there is a jump from the next page button to the last page button 
                if (!page_button_list.includes(num_pages - 1))
                    thread_page_buttons_container.appendChild(this.create_page_jump_button())
            
                thread_page_buttons_container.appendChild(this.create_page_navigation_button(num_pages, num_pages))
            }
            
            if (current_page < num_pages)
                thread_page_buttons_container.appendChild(this.create_page_navigation_button(current_page + 1, ">"))
        }
        
        var thread_reply_button = document.createElement("button")
        thread_reply_button.className = "replybutton"
        thread_reply_button.innerHTML = "Reply"
        thread_page_buttons_container.appendChild(thread_reply_button)

        function create_reply_redirect(url_vars) {
            site_nav.go_to_url(site_nav.change_url_var({"action": "create"}, url_vars, ["page"]))
        }

        thread_reply_button.onclick = create_reply_redirect.bind(null, this._url_vars)

        return thread_page_buttons
    }

    create_page_navigation_button(page, display_text) {
        const page_navigation_button = document.createElement("a")
        page_navigation_button.className = (page == this._url_vars["page"]) ? "pagebutton-accent" : "pagebutton"
        page_navigation_button.innerHTML = display_text
        page_navigation_button.href = site_nav.change_url_var({"page": page}, this._url_vars, [])

        return page_navigation_button
    }

    create_page_jump_button() {
        const page_jump_button = document.createElement("popup")
        page_jump_button.className = "pagebutton"
        page_jump_button.innerHTML = "..."
        
        page_jump_button.onclick = function() {
            page_jump_input.style.visibility = (page_jump_input.style.visibility == "visible") ?
                "hidden" :
                "visible"
        }

        const page_jump_input = document.createElement("input")
        page_jump_input.className = "pagebuttonjumpinput"
        page_jump_input.placeholder = "Go to page..."
        const url_vars = this._url_vars
        
        page_jump_input.addEventListener("keydown", function (e) {
            if (e.code == "Enter")
                site_nav.go_to_url(site_nav.change_url_var({"page": page_jump_input.value}, url_vars))
        })
        
        page_jump_input.onclick = function(e) {
            e.stopPropagation();
        }

        page_jump_button.appendChild(page_jump_input)
        return page_jump_button
    }
}

export default Thread