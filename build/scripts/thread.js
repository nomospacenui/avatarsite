import Post from "./post.js"
import inclusive_range from "./utils.js"
import click_page_button from "./page_button.js"

class Thread {
    constructor(thread_data, replies_data, url_vars, non_url_vars) {
        var page_title = document.getElementById("page_title")
        page_title.innerHTML = "Title"
        var content_container = document.getElementById("content")
        
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
        
        content_container.appendChild(thread_header)

        var thread_page_buttons = document.createElement("div")
        thread_page_buttons.className = "pagebuttons"
        var thread_page_buttons_space = document.createElement("div")
        thread_page_buttons_space.className = "pagebuttons-space"
        var thread_page_buttons_container = document.createElement("div")
        thread_page_buttons_container.className = "pagebuttonscontainer"
        
        thread_page_buttons.appendChild(thread_page_buttons_space)
        thread_page_buttons.appendChild(thread_page_buttons_container)

        // + 1 as pages start counting from 1
        var page_button_list = inclusive_range(1, non_url_vars["num_pages"])
        const max_page_list_length = 5

        if (non_url_vars["num_pages"] > max_page_list_length) {
            //if the page number is at the front end
            if (url_vars["page"] < (max_page_list_length / 2)){
                page_button_list = inclusive_range(1, max_page_list_length)
            }

            //if the page number is at the tail end
            else if (url_vars["page"] + (max_page_list_length / 2) > non_url_vars["num_pages"]) {
                page_button_list = inclusive_range(non_url_vars["num_pages"] - max_page_list_length + 1, non_url_vars["num_pages"])
            }

            else {
                page_button_list = inclusive_range(url_vars["page"] - 2, url_vars["page"] + 2)
            }
        }
        
        function create_page_button_elements(page) {
            const report_thread_button = document.createElement("button")
            if (page == url_vars["page"]) {
                report_thread_button.className = "pagebutton-accent"
            }
            else {
                report_thread_button.className = "pagebutton"
            }
            report_thread_button.innerHTML = page
            report_thread_button.onclick = function() {click_page_button(report_thread_button.innerHTML, url_vars)}
            thread_page_buttons_container.appendChild(report_thread_button)
        }
        
        page_button_list.forEach((page) => create_page_button_elements(page))

        content_container.appendChild(thread_page_buttons)

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

    init_page_buttons() {

    }
}

export default Thread