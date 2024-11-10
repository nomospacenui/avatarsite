import Post from "./post.js"
import inclusive_range from "./utils.js"
import go_to_page from "./page_button.js"

class Thread {
    constructor(thread_data, replies_data, url_vars, non_url_vars) {
        this._url_vars = url_vars
        this._non_url_vars = non_url_vars

        this._max_page_nav_len = 3

        var content_container = document.getElementById("content")
        content_container.appendChild(this.create_header())

        if (non_url_vars["num_pages"] > 1) {
            content_container.appendChild(this.create_page_navigation())
        }

        // First post by the thread author
        if (url_vars["page"] == 1) {
            const post_data = {content: thread_data["content"]}
            new Post(post_data)
        }

        // Subsequent replies
        for (var i = 0 ; i < replies_data.length ; ++i) {
            new Post(replies_data[i])
        }
    }

    create_header() {
        var page_title = document.getElementById("page_title")
        page_title.innerHTML = "Title"
        
        var thread_header = document.createElement("div")
        thread_header.className = "threadheader"
        
        var thread_title = document.createElement("div")
        thread_title.className = "threadtitle"
        thread_title.innerHTML = "Thread Title"

        thread_header.appendChild(thread_title)
        
        var report_thread_button = document.createElement("button")
        report_thread_button.className = "button-accent"
        report_thread_button.innerHTML = "Report Thread"
        
        thread_header.appendChild(report_thread_button)
        return thread_header
    }

    create_page_navigation() {
        var thread_page_buttons = document.createElement("div")
        thread_page_buttons.className = "pagebuttons"

        var thread_page_buttons_space = document.createElement("div")
        thread_page_buttons_space.className = "pagebuttons-space"
        var thread_page_buttons_container = document.createElement("div")
        thread_page_buttons_container.className = "pagebuttonscontainer"
        
        thread_page_buttons.appendChild(thread_page_buttons_space)
        thread_page_buttons.appendChild(thread_page_buttons_container)

        const current_page = this._url_vars["page"]
        const num_pages = this._non_url_vars["num_pages"]

        // + 1 as pages start counting from 1
        var page_button_list = inclusive_range(1, num_pages)

        if (num_pages > this._max_page_nav_len) {
            
            //if the page number is at the front end
            if (current_page < (this._max_page_nav_len / 2)){
                page_button_list = inclusive_range(1, this._max_page_nav_len)
            }

            //if the page number is at the tail end
            else if (current_page + (this._max_page_nav_len / 2) > num_pages) {
                page_button_list = inclusive_range(num_pages - this._max_page_nav_len + 1, num_pages)
            }

            else {
                page_button_list = inclusive_range(current_page - 1, current_page + 1)
            }
        }
        
        if (current_page > 1) {
            const b = this.create_page_navigation_button(current_page - 1, "<")
            thread_page_buttons_container.appendChild(b)
        }

        if (!page_button_list.includes(1)) {
            const b_nav = this.create_page_navigation_button(1, 1)
            thread_page_buttons_container.appendChild(b_nav)

            // needs "..." if there is a jump from the page 1 button to the next page button 
            if (!page_button_list.includes(2)) {
                const b_jump = this.create_page_jump_button()
                thread_page_buttons_container.appendChild(b_jump)
            }
        }
        
        for (var i = 0 ; i < page_button_list.length ; ++i) {
            const b = this.create_page_navigation_button(page_button_list[i], page_button_list[i])
            thread_page_buttons_container.appendChild(b)
        }
        
        if (!page_button_list.includes(num_pages)) {
            // needs "..." if there is a jump from the next page button to the last page button 
            if (!page_button_list.includes(num_pages - 1)) {
                const b_jump = this.create_page_jump_button()
                thread_page_buttons_container.appendChild(b_jump)
            }
        
            const b = this.create_page_navigation_button(num_pages, num_pages)
            thread_page_buttons_container.appendChild(b)
        }
        
        if (current_page < num_pages) {
            const b = this.create_page_navigation_button(current_page + 1, ">")
            thread_page_buttons_container.appendChild(b)
        }

        return thread_page_buttons
    }

    create_page_navigation_button(page, display_text) {
        const page_navigation_button = document.createElement("button")
        
        if (page == this._url_vars["page"]) {
            page_navigation_button.className = "pagebutton-accent"
        }

        else {
            page_navigation_button.className = "pagebutton"
        }

        page_navigation_button.innerHTML = display_text
        const current_page = this._url_vars["page"]
        page_navigation_button.onclick = function() {go_to_page(page, current_page)}
        return page_navigation_button
    }

    create_page_jump_button() {
        const current_page = this._url_vars["page"]
        
        const page_jump_button = document.createElement("popup")
        page_jump_button.className = "pagejumpbutton"
        page_jump_button.innerHTML = "..."

        const page_jump_input = document.createElement("input")
        page_jump_input.className = "pagebuttonjumpinput"
        page_jump_input.placeholder = "Go to page..."
        
        page_jump_input.addEventListener("keydown", function (e) {
            if (e.code == "Enter") {
                go_to_page(page_jump_input.value, current_page)
            }
        })
        
        page_jump_button.appendChild(page_jump_input)

        page_jump_button.onclick = function() {
            if (page_jump_input.style.visibility == "visible") {
                page_jump_input.style.visibility = "hidden"
            }
            else {
                page_jump_input.style.visibility = "visible"
            }
        }
        
        page_jump_input.onclick = function(e) {
            e.stopPropagation();
        }

        return page_jump_button
    }
}

export default Thread