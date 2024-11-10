import Thread from "./thread.js"

function init_forum_json(forum_json_url) {
    return new Promise(function(resolve, reject) {
        var xhr= new XMLHttpRequest()
        xhr.open('GET', forum_json_url)
        xhr.send()

        xhr.onload = function() {
            resolve(JSON.parse(String(xhr.responseText)))
        }
    })
}

function init_thread_database(json_content){
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

function init_replies_data(db, url_vars, non_url_vars) {
    return new Promise(function(resolve, reject) {
        const thread_id = url_vars["thread"]
        const replies_per_page = 8

        var replies_transaction = db.transaction("replies", "readwrite")
        var replies_object_store = replies_transaction.objectStore("replies")
        var get_cursor_request = replies_object_store.openCursor()

        var replies_data = []
        get_cursor_request.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                if (cursor.value["thread_id"] == thread_id) {
                    replies_data.push(cursor.value)
                }
                cursor.continue();
            }

            else{
                // page - 1 as page is counted from 1 onwards
                // if page is 1, then the thread's initial post takes up one slot
                var start_reply = replies_per_page * (url_vars["page"]-1)
                var end_reply = start_reply + replies_per_page

                if (start_reply > replies_data.length) {
                    resolve([-1, url_vars])
                }

                if (url_vars["page"] == 1) {
                    --end_reply
                }

                else {
                    // shift up by one since the first page displays (replies_per_page -1) replies
                    --start_reply
                    --end_reply
                }

                non_url_vars["num_pages"] = Math.round(Number((replies_data.length / replies_per_page) + 0.5))
                resolve([replies_data.slice(start_reply, end_reply), non_url_vars])
            }
        }
    })
}

function init_thread_data(db, url_vars, non_url_vars) {
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

async function init_thread_layout(url_vars){
    if (!"page" in url_vars) {
        return false
    }

    var non_url_vars = {}

    const forum_url_json = "../../db/forum.json"
    const json_content = await init_forum_json(forum_url_json)

    var db = await init_thread_database(json_content)

    var thread_data = await init_thread_data(db, url_vars, non_url_vars)    
    var [replies_data, non_url_vars] = await init_replies_data(db, url_vars, non_url_vars)
    if (replies_data == -1) {
        return false
    }

    new Thread(thread_data, replies_data, url_vars, non_url_vars)
    return true
}

function get_vars_from_url(){
    var url = String(window.location.href)
    url = url.substring(url.lastIndexOf("?") + 1)
    
    const url_vars_values = url.split("&")

    var url_vars = {}
    for (var i = 0 ; i < url_vars_values.length ; ++i) {
        const var_value = url_vars_values[i].split("=")
        url_vars[var_value[0]] = var_value[1]
    }

    if ("page" in url_vars) {
        url_vars["page"] = Number(url_vars["page"])
    }
    
    if ("thread" in url_vars) {
        url_vars["thread"] = Number(url_vars["thread"])
    }

    return url_vars
}

const url_vars = get_vars_from_url()
const status = await init_thread_layout(url_vars)
if (status){
    console.log("Initialized")
}
else {
    console.log("Error")
}