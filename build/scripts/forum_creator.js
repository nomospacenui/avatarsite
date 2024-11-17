import Thread from "./thread.js"
import Forum from "./forum.js"
import inclusive_range from "./utils.js"

class ForumCreator {
    constructor() {
        this.init()
    }

    async init() {
        var status = true
        this._url_vars = this.get_vars_from_url()

        if (this._url_vars) {
            await this.init_forum()

            if ("thread" in this._url_vars &&
                "page" in this._url_vars &&
                Object.keys(this._url_vars).length == 2) {
                status = await this.init_thread_layout()
            }
            
            else if ("subforum" in this._url_vars &&
                     Object.keys(this._url_vars).length == 1) {
                status = await this.init_subforum_layout()
            }

            else if (Object.keys(this._url_vars).length == 0) {
                status = await this.init_forum_layout()
            }
        }

        else {
            status = false
        }

        if (!status) {
            //ERROR PAGE
        }
    }

    get_vars_from_url() {
        var url = String(window.location.href)
        
        //no url vars
        if (url.lastIndexOf("?") == -1) {
            return {}
        }

        if (url.split("?").length > 2) {
            console.log("Multiple ? in the url")
            return false
        }

        url = url.substring(url.lastIndexOf("?") + 1)
        const url_vars_values = url.split("&")
        const eligible_vars = ["page", "thread", "subforum"]
        var url_vars = {}

        for (var i = 0 ; i < url_vars_values.length ; ++i) {
            const var_value = url_vars_values[i].split("=")
            if (var_value == "") {
                continue
            }
            
            if (!eligible_vars.includes(var_value[0])) {
                return false
            }
            
            url_vars[var_value[0]] = Number(var_value[1])
        }
    
        return url_vars
    }

    async init_forum(){
        const json_content = await this.init_forum_json()
        this._db = await this.init_forum_database(json_content)
    }

    async init_forum_json(forum_json_url) {
        return new Promise(function(resolve, reject) {
            var xhr= new XMLHttpRequest()
            xhr.open('GET', "../../db/forum.json")
            xhr.send()
    
            xhr.onload = function() {
                resolve(JSON.parse(String(xhr.responseText)))
            }
        })
    }
    
    async init_forum_database(json_content) {
        return new Promise(function(resolve, reject) {
            //command for resetting: indexedDB.deleteDatabase('forum')
            var request  = indexedDB.open("forum", 1)
    
            request.onupgradeneeded = function (event) {
                var db = event.target.result
                
                for (var i = 0 ; i < json_content["objects"].length; ++i) {
                    
                    const table_name = json_content["objects"][i]["name"]
                    const primary_key = json_content["objects"][i]["columns"][0]["name"]
                    var object_store = db.createObjectStore(table_name, {keyPath: primary_key})
                    
                    var cols = [primary_key]
                    for (var j = 1 ; j < json_content["objects"][i]["columns"].length; ++j) {
                        const column_name = json_content["objects"][i]["columns"][j]["name"]
                        object_store.createIndex(column_name + "Index", column_name, { unique: false })
                        cols.push(column_name)
                    }
                    
                    for (var j = 0 ; j < json_content["objects"][i]["rows"].length; ++j) {
                        const values = json_content["objects"][i]["rows"][j]
                        
                        var data = {}
                        cols.forEach((col, index) => data[col] = values[index])
                        object_store.add(data)
                    }
                }
            };
    
            request.onsuccess = function(event) {
                var db = event.target.result
                resolve(db)
            }
        })
    }

    async init_thread_layout() {
        if (!("page" in this._url_vars && "thread" in this._url_vars)) {
            return false
        }
    
        const thread_data = await this.get_thread_data(this._db, this._url_vars)
        var [replies_data, num_pages] = await this.get_replies_data(this._db, this._url_vars)

        if (!replies_data) {
            return false
        }

        this._non_url_vars = {"num_pages": num_pages}
        const subforums_data = await this.get_subforums_data(this._db)
        new Thread(thread_data, replies_data, subforums_data, this._url_vars, this._non_url_vars)
        return true
    }

    async init_subforum_layout() {
        this._url_vars["subforum"]
        const subforums_data = await this.get_subforums_data(this._db)
    }

    async init_forum_layout() {
        var subforums_data = await this.get_subforums_data(this._db)

        var categories = []
        for (var i = 0 ; i < subforums_data.length ; ++i) {
            const parent_id = subforums_data[i].parent_id
            if (parent_id != -1) {
                if (subforums_data[parent_id].children) {
                    subforums_data[parent_id].children.push(subforums_data[i])
                }

                else {
                    subforums_data[parent_id].children = [subforums_data[i]]
                }
            }
        }
        
        for (var i = 0 ; i < subforums_data.length ; ++i) {
            if (subforums_data[i].parent_id == -1) {
                categories.push(subforums_data[i])
            }
        }

        new Forum(categories)
    }
    
    async get_replies_data(db, url_vars) {
        return new Promise(function(resolve, reject) {
            const replies_per_page = 8
    
            var replies_transaction = db.transaction("replies", "readwrite")
            var replies_object_store = replies_transaction.objectStore("replies")
            var get_cursor_request = replies_object_store.openCursor()
    
            var replies_data = []
            get_cursor_request.onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                    if (cursor.value["thread_id"] == url_vars["thread"]) {
                        replies_data.push(cursor.value)
                    }
                    cursor.continue()
                }
    
                else{
                    // page - 1 as page is counted from 1 onwards
                    // if page is 1, then the thread's initial post takes up one slot
                    var start_reply = replies_per_page * (url_vars["page"]-1)
                    var end_reply = start_reply + replies_per_page
    
                    if (start_reply > replies_data.length) {
                        resolve([false, url_vars])
                    }
                    
                    // shift up by one since the first page displays (replies_per_page -1) replies
                    if (url_vars["page"] != 1) {
                        --start_reply
                    }
                    --end_reply
                    
                    const num_pages = Math.round(Number((replies_data.length / replies_per_page) + 0.5))
                    resolve([replies_data.slice(start_reply, end_reply), num_pages])
                }
            }
        })
    }
    
    async get_thread_data(db, url_vars) {
        return new Promise(function(resolve, reject) {
            const thread_id = url_vars["thread"]
            var threads_transaction = db.transaction("threads", "readwrite")
            var threads_object_store = threads_transaction.objectStore("threads")
    
            var get_thread_request = threads_object_store.get(thread_id)
    
            get_thread_request.onsuccess = function(event) {
                resolve(event.target.result)
            };
        })
    }
    
    async get_subforums_data(db) {
        return new Promise(function(resolve, reject) {
            var subforums_transaction = db.transaction("subforums", "readwrite")
            var subforums_object_store = subforums_transaction.objectStore("subforums")
            var get_cursor_request = subforums_object_store.openCursor()
            
            var subforums_data = []
            get_cursor_request.onsuccess = function(e) {
                const cursor = e.target.result;
                if (cursor) {
                    subforums_data.push(cursor.value)
                    cursor.continue()
                }
    
                else {
                    resolve(subforums_data)
                }
            }
        })
    }
}

new ForumCreator()