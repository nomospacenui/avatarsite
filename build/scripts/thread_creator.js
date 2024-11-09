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

function init_thread_database(){
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

function init_replies_data(db) {
    return new Promise(function(resolve, reject) {
        const thread_id = 1

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
            resolve(replies_data)
        }
    })
}

function init_thread_data(db) {
    return new Promise(function(resolve, reject) {
        const thread_id = 1
        var threads_transaction = db.transaction("threads", "readwrite")
        var threads_object_store = threads_transaction.objectStore("threads")

        var get_thread_request = threads_object_store.get(thread_id)

        get_thread_request.onsuccess = function(event) {
            resolve(event.target.result)
        };
    })
}

async function init_thread_layout(){
    const forum_url_json = "../../db/forum.json"
    const json_content = await init_forum_json(forum_url_json)

    var db = await init_thread_database()

    var replies_data = await init_replies_data(db)
    var thread_data = await init_thread_data(db)    

    new Thread(thread_data, replies_data)
}

init_thread_layout()