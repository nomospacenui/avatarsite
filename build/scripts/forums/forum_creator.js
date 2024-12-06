import Thread from "./thread.js"
import ForumCategories from "./forum_categories.js"
import ForumBreadcrumbs from "./forum_breadcrumbs.js"
import ThreadListing from "./thread_listing.js"
import db_functions from "../database/database.js"

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
        const thread_data = await db_functions.get_entry_from_table("threads", this._url_vars["thread"])
        var replies_data = await db_functions.get_filtered_from_table("replies", {"thread_id": this._url_vars["thread"]})
        const subforums_data = await db_functions.get_all_from_table("subforums")

        if (replies_data.length > 0) {        
            // page - 1 as page is counted from 1 onwards
            var start_reply = this._replies_per_page * (this._url_vars["page"] - 1)
            // - 1 since slice is inclusive of start and end
            var end_reply = start_reply + this._replies_per_page - 1

            if (start_reply > replies_data.length)
                return false
            
            // shift up by one since the first page displays (replies_per_page -1) replies
            if (this._url_vars["page"] != 1)
                --start_reply
            
            this._non_url_vars["num_pages"] = Math.round(Number((replies_data.length / this._replies_per_page) + 0.5))
            replies_data = replies_data.slice(start_reply, end_reply)
        }

        new ForumBreadcrumbs(subforums_data, subforums_data[thread_data["subforum_id"]], this._url_vars)
        new Thread(thread_data, replies_data, this._url_vars, this._non_url_vars)

        return true
    }

    async init_subforum_layout() {
        const thread_data = await db_functions.get_filtered_from_table("threads", {"subforum_id": this._url_vars.subforum})
        const subforums_data = await this.get_subforums()

        var page_title = document.getElementById("page_title")
        page_title.innerHTML = subforums_data[this._url_vars["subforum"]].name

        new ForumBreadcrumbs(subforums_data, subforums_data[this._url_vars["subforum"]], this._url_vars)
        var subforum_children = subforums_data[this._url_vars["subforum"]].children

        if (subforum_children) {
            for (var i = 0 ; i < subforum_children.length ; ++i) {
                const latest_activity = await this.get_subforum_latest_activity(subforum_children[i].id)
                subforum_children[i]["latest_activity"] = latest_activity
            }

            new ForumCategories([subforums_data[this._url_vars["subforum"]]], this._url_vars)
        }

        if (thread_data.length > 0) {
            for (var i = 0 ; i < thread_data.length ; ++i) {
                const replies_data = await db_functions.get_filtered_from_table("replies", {"thread_id": thread_data[i].id})
                const latest_activity = await this.get_thread_latest_activity(thread_data[i].id)
                thread_data[i]["latest_activity"] = latest_activity
                thread_data[i]["num_replies"] = replies_data.length
            }

            new ThreadListing(thread_data, this._url_vars)
        }

        return true
    }

    async init_forum_layout() {
        var subforums_data = await this.get_subforums()

        var categories = []
        for (var i = 0 ; i < subforums_data.length ; ++i) {
            if (subforums_data[i].parent_id == -1)
                categories.push(subforums_data[i])
        }

        for (var i = 0 ; i < categories.length ; ++i) {
            for (var j = 0 ; j < categories[i].children.length ; ++j) {
                var child = categories[i].children[j]
                child["latest_activity"] = await this.get_subforum_latest_activity(child.id)
            }
        }
        
        new ForumCategories(categories, this._url_vars)
        return true
    }

    async get_subforums() {
        var subforums_data = await db_functions.get_all_from_table("subforums")

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

    async get_subforum_latest_activity(subforum_id) {
        var threads_data = await db_functions.get_filtered_from_table("threads", {"subforum_id": subforum_id})
        var subforums_children = (await this.get_subforums())[subforum_id].children
        var latest_activity = null

        for (var i = 0 ; i < threads_data.length ; ++i) {
            const thread_activity = await this.get_thread_latest_activity(threads_data[i].id)
            
            if (!thread_activity) {
                if (!latest_activity || thread.datetime > latest_activity.datetime)
                    latest_activity = {"thread": threads_data[i]}
            }

            else if (!latest_activity || thread_activity.datetime > latest_activity.datetime)
                latest_activity = {"thread": threads_data[i], "reply": thread_activity}
        }

        if (subforums_children) {
            for (var j = 0 ; j < subforums_children.length ; ++j) {
                const child_latest_activity = await this.get_subforum_latest_activity([subforums_children[j].id])
                if (!child_latest_activity)
                    continue

                var child_datetime = "reply" in child_latest_activity ? child_latest_activity["reply"].datetime
                                                                      : child_latest_activity["thread"].datetime

                var latest_datetime = "reply" in latest_activity ? latest_activity["reply"].datetime
                                                                 : latest_activity["thread"].datetime
                
                if (child_datetime > latest_datetime)
                    latest_activity = child_latest_activity
            }
        }

        return latest_activity
    }

    async get_thread_latest_activity(thread_id) {
        var replies_data = await db_functions.get_all_from_table("replies")
        var latest_activity = null

        replies_data.forEach(reply => {
            if (reply.thread_id == thread_id) {
                
                if (latest_activity)
                    if (reply.datetime > latest_activity.datetime)
                        latest_activity = reply

                else
                    latest_activity = reply
            }
        })

        return latest_activity
    }
}

new ForumCreator()