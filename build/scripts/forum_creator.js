import Thread from "./thread.js"
import ForumCategories from "./forum_categories.js"
import ThreadListing from "./thread_listing.js"
import db_functions from "./database.js"

class ForumCreator {
    constructor() {
        this._replies_per_page = 8
        this._non_url_vars = {}
        this._url_vars = {}

        this.init()
    }

    async init() {
        var status = true
        this._url_vars = this.get_vars_from_url()

        if (this._url_vars) {
            if ("thread" in this._url_vars &&
                "page" in this._url_vars &&
                Object.keys(this._url_vars).length == 2)
                status = await this.init_thread_layout()
            
            else if ("subforum" in this._url_vars &&
                     "page" in this._url_vars &&
                     Object.keys(this._url_vars).length == 2)
                status = await this.init_subforum_layout()

            else if (Object.keys(this._url_vars).length == 0)
                status = await this.init_forum_layout()
        }

        else
            status = false

        if (!status) {
            //ERROR PAGE
        }
    }

    get_vars_from_url() {
        var url = String(window.location.href)
        
        //no url vars
        if (url.lastIndexOf("?") == -1)
            return {}

        if (url.split("?").length > 2)
            return false

        url = url.substring(url.lastIndexOf("?") + 1)
        const url_vars_values = url.split("&")
        const eligible_vars = ["page", "thread", "subforum"]
        var url_vars = {}

        for (var i = 0 ; i < url_vars_values.length ; ++i) {
            const var_value = url_vars_values[i].split("=")
            if (var_value == "")
                continue
            
            if (!eligible_vars.includes(var_value[0]))
                return false
            
            url_vars[var_value[0]] = Number(var_value[1])
        }
    
        return url_vars
    }

    async init_thread_layout() {
        const thread_data = await db_functions.get_entry("threads", this._url_vars["thread"])
        var replies_data = await db_functions.get_all("replies")

        if (replies_data.length > 0) {
            var relevant_replies_data = []
            replies_data.forEach(element => {
                if (element.thread_id == this._url_vars["thread"])
                    relevant_replies_data.push(element)
            })
        
            // page - 1 as page is counted from 1 onwards
            var start_reply = this._replies_per_page * (this._url_vars["page"] - 1)
            // - 1 since slice is inclusive of start and end
            var end_reply = start_reply + this._replies_per_page - 1

            if (start_reply > replies_data.length)
                return false
            
            // shift up by one since the first page displays (replies_per_page -1) replies
            if (this._url_vars["page"] != 1)
                --start_reply
            
            this._non_url_vars["num_pages"] = Math.round(Number((relevant_replies_data.length / this._replies_per_page) + 0.5))
            replies_data = relevant_replies_data.slice(start_reply, end_reply)
        }

        const subforums_data = await db_functions.get_all("subforums")
        new Thread(thread_data, replies_data, subforums_data, this._url_vars, this._non_url_vars)
        return true
    }

    async init_subforum_layout() {
        const thread_data = await db_functions.get_all("threads")
        const subforums_data = await this.get_subforums()

        var page_title = document.getElementById("page_title")
        page_title.innerHTML = subforums_data[this._url_vars["subforum"]].name

        if (subforums_data[this._url_vars["subforum"]].children)
            new ForumCategories([subforums_data[this._url_vars["subforum"]]], this._url_vars)
        
        var filtered_thread_data = []
        for (var i = 0 ; i < thread_data.length ; ++i) {
            if (thread_data[i].subforum_id == this._url_vars.subforum) {
                filtered_thread_data.push(thread_data[i])
            }
        }

        if (filtered_thread_data.length > 0) {
            new ThreadListing(filtered_thread_data, this._url_vars)
        }
    }

    async init_forum_layout() {
        const subforums_data = await this.get_subforums()

        var categories = []
        for (var i = 0 ; i < subforums_data.length ; ++i) {
            if (subforums_data[i].parent_id == -1)
                categories.push(subforums_data[i])
        }
        
        new ForumCategories(categories, this._url_vars)
    }

    async get_subforums() {
        var subforums_data = await db_functions.get_all("subforums")

        for (var i = 0 ; i < subforums_data.length ; ++i) {
            const parent_id = subforums_data[i].parent_id
            if (parent_id != -1) {
                if (!subforums_data[parent_id].children)
                    subforums_data[parent_id].children = []

                subforums_data[parent_id].children.push(subforums_data[i])
            }
        }

        return subforums_data
    }
}

new ForumCreator()