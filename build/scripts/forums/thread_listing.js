import site_nav from "../tools/site_nav.js"
import utils from "../tools/utils.js"

class ThreadListing {
    constructor(thread_data, url_vars, non_url_vars) {
        this._thread_data = thread_data
        this._url_vars = url_vars
        this._non_url_vars = non_url_vars
        this._max_page_nav_len = 3

        var postcontent_container = document.getElementById("internal-body")
        postcontent_container.append(this.create_page_navigation())
        postcontent_container.append(this.create_listing())
        postcontent_container.append(this.create_page_navigation())
    }

    create_listing() {
        var listing_win = document.createElement("div")
        listing_win.className = "listing-win"
        listing_win.append(this.create_threads_listing_header())

        this.create_listing_rows().forEach(row => {
            listing_win.append(row)
        });

        return listing_win
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
        
        var thread_createthread_button = document.createElement("button")
        thread_createthread_button.className = "createthreadbutton"
        thread_createthread_button.innerHTML = "Create Thread"
        thread_page_buttons_container.appendChild(thread_createthread_button)

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
        const current_page = this._url_vars["page"]
        
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

    create_threads_listing_header() {
        var listing_win_header = document.createElement("div")
        listing_win_header.className = "listing-win-header"

        var thread_name = document.createElement("div")
        thread_name.className = "listing-win-header-cell-l"
        thread_name.innerHTML = "Thread Name"
        listing_win_header.append(thread_name)
        
        var thread_author = document.createElement("div")
        thread_author.className = "listing-win-header-cell-m"
        thread_author.innerHTML = "Author"
        thread_author.style.width = "15%"
        listing_win_header.append(thread_author)
        
        var thread_replies = document.createElement("div")
        thread_replies.className = "listing-win-header-cell-m"
        thread_replies.innerHTML = "Replies"
        thread_replies.style.width = "5%"
        listing_win_header.append(thread_replies)
        
        var thread_last_post = document.createElement("div")
        thread_last_post.className = "listing-win-header-cell-r"
        thread_last_post.innerHTML = "Last Post"
        thread_last_post.style.width = "25%"
        listing_win_header.append(thread_last_post)

        return listing_win_header
    }

    create_listing_rows() {
        var rows = []

        for (var i = 0 ; i < this._thread_data.length ; ++i) {
            var row = document.createElement("a")
            row.className = "listing-win-body-row"
            row.href = site_nav.change_url_var({"thread": this._thread_data[i].id, "page": 1}, this._url_vars, ["subforum"])
            
            var row_name = document.createElement("div")
            row_name.innerHTML = this._thread_data[i].name
            row.append(row_name)

            var row_author = document.createElement("div")
            row_author.innerHTML = "AUTHOR"
            row_author.style.textAlign = "center"
            row.append(row_author)
            
            var row_description = document.createElement("div")
            row_description.innerHTML = this._thread_data[i].num_replies
            row_description.style.textAlign = "center"
            row.append(row_description)
            
            var row_activity = document.createElement("div")
            if (!this._thread_data[i].latest_activity) {
                this._thread_data[i].latest_activity = this._thread_data[i]
            }

            var datetime = this._thread_data[i].latest_activity.datetime

            var [display_time, relative_time] = utils.format_datetime(datetime)
            row_activity.innerHTML = "USERNAME posted"
            
            var row_activity_datetime = document.createElement("text")
            row_activity_datetime.innerHTML = " about " + relative_time
            row_activity.append(row_activity_datetime)
            
            var row_activity_viewpost = document.createElement("a")
            row_activity_viewpost.href = site_nav.change_url_var(
                {
                    "thread": this._thread_data[i].latest_activity.thread_id,
                    "page": this._thread_data[i].latest_activity.page,
                    "action": "jump_to_last"
                },
                this._url_vars,
                ["subforum"]
            )

            row_activity_viewpost.innerHTML = " View post >>"
            row_activity_viewpost.className = "hyperlink"
            row_activity.append(row_activity_viewpost)
            row.append(row_activity)
            
            // If this is the last row, change to rounded style
            if (i == this._thread_data.length - 1) {
                row_name.className = "listing-win-body-cell-bl"
                row_author.className = "listing-win-body-cell-bm"
                row_description.className = "listing-win-body-cell-bm"
                row_activity.className = "listing-win-body-cell-br"
            }

            else {
                row_name.className = "listing-win-body-cell-l"
                row_author.className = "listing-win-body-cell-m"
                row_description.className = "listing-win-body-cell-m"
                row_activity.className = "listing-win-body-cell-r"
            }
            
            rows.push(row)
        }

        return rows
    }
}

export default ThreadListing