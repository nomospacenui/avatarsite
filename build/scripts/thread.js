import Post from "./post.js"
import inclusive_range from "./utils.js"
import go_to_page from "./page_button.js"

class Thread {
    constructor(thread_data, replies_data, subforums_data, url_vars, non_url_vars) {
        this._thread_data = thread_data
        this._replies_data = replies_data
        this._subforums_data = subforums_data
        this._url_vars = url_vars
        this._non_url_vars = non_url_vars

        this._max_page_nav_len = 3

        this.create_header()

        // First post by the thread author
        if (url_vars["page"] == 1) {
            const post_data = {content: thread_data["content"]}
            new Post(post_data)
        }

        // Subsequent replies
        for (var i = 0 ; i < replies_data.length ; ++i) {
            new Post(replies_data[i])
        }

        this.create_footer()
    }

    get_breadcrumbs() {
        //database should already be sorted in ascending order so directly accessing the element is possible
        var current = this._subforums_data[this._thread_data["subforum_id"]]
        var breadcrumbs = [current["name"]]

        while (current["parent_id"] != -1) {
            current = this._subforums_data[current["parent_id"]]
            breadcrumbs.push(current["name"])
        }
        
        var breadcrumbs_str = ""
        breadcrumbs.reverse().forEach(x => breadcrumbs_str = breadcrumbs_str + x + " > ")
        return breadcrumbs_str.slice(0, breadcrumbs_str.length - 2)
    }

    create_header() {
        var page_title = document.getElementById("page_title")
        page_title.innerHTML = "Title"
        
        var thread_header = document.getElementById("internal-header")
        
        var thread_header_left = document.createElement("div")
        thread_header_left.className = "threadheader-left"

        var thread_breadcrumbs = document.createElement("div")
        thread_breadcrumbs.innerHTML = this.get_breadcrumbs()
        thread_header_left.appendChild(thread_breadcrumbs)
        
        var thread_title = document.createElement("div")
        thread_title.className = "threadtitle"
        thread_title.innerHTML = "Thread Title"
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
        var thread_page_buttons_container = document.createElement("div")
        thread_page_buttons_container.className = "pagebuttonscontainer"
        
        thread_page_buttons.appendChild(thread_page_buttons_space)
        thread_page_buttons.appendChild(thread_page_buttons_container)
        
        if (this._non_url_vars["num_pages"] > 1) {
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
        }
        
        var thread_reply_button = document.createElement("button")
        thread_reply_button.className = "replybutton"
        thread_reply_button.innerHTML = "Reply"
        thread_page_buttons_container.appendChild(thread_reply_button)

        return thread_page_buttons
    }

    create_page_navigation_button(page, display_text) {
        const page_navigation_button = document.createElement("button")
        
        page_navigation_button.className = (page == this._url_vars["page"]) ? "pagebutton-accent" : "pagebutton"

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
            if (e.code == "Enter")
                go_to_page(page_jump_input.value, current_page)
        })
        
        page_jump_button.appendChild(page_jump_input)

        page_jump_button.onclick = function() {
            page_jump_input.style.visibility = (page_jump_input.style.visibility == "visible") ?
                "hidden" :
                "visible"
        }
        
        page_jump_input.onclick = function(e) {
            e.stopPropagation();
        }

        return page_jump_button
    }
}

export default Thread