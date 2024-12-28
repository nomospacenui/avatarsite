class Database {
    
    async init(){
        const json_content = await this.init_database_json()
        this._internal_db = await this.init_database(json_content)
        return this._internal_db
    }

    async init_database(json_content) {
        return new Promise(function(resolve, reject) {
            //command for resetting: indexedDB.deleteDatabase('forum')
            var request  = indexedDB.open("forum", 1)
    
            request.onupgradeneeded = function (event) {
                var db = event.target.result
                
                for (var i = 0 ; i < json_content["objects"].length; ++i) {
                    
                    const table_name = json_content["objects"][i]["name"]
                    const primary_key = json_content["objects"][i]["columns"][0]["name"]
                    var object_store = db.createObjectStore(table_name, {keyPath: primary_key, autoIncrement: true})
                    
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

    async init_database_json() {
        return new Promise(function(resolve, reject) {
            var xhr= new XMLHttpRequest()
            xhr.open('GET', "../../db/forum.json")
            xhr.send()
    
            xhr.onload = function() {
                resolve(JSON.parse(String(xhr.responseText)))
            }
        })
    }
}

async function create_entry_in_table(table_name, data) {
    const db_obj = new Database()
    const db = await db_obj.init()

    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(table_name, "readwrite")
        var object_store = transaction.objectStore(table_name)
        object_store.add(data)
        resolve()
    })
}

async function get_all_from_table(table_name) {
    const db_obj = new Database()
    const db = await db_obj.init()

    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(table_name, "readwrite")
        var object_store = transaction.objectStore(table_name)
        var get_request = object_store.getAll()
        
        get_request.onsuccess = function(e) {
            resolve(e.target.result)
        }
    })
}

async function get_filtered_from_table(table_name, conditions) {
    const db_obj = new Database()
    const db = await db_obj.init()

    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(table_name, "readwrite")
        var object_store = transaction.objectStore(table_name)
        var get_request = object_store.getAll()
        
        get_request.onsuccess = function(e) {
            var result = []
            e.target.result.forEach( x => {
                var fulfils_conditions = true
                for (let [k, v] of Object.entries(conditions)) {
                    if (x[k] != v)
                        fulfils_conditions = false
                }

                if (fulfils_conditions) {
                    result.push(x)
                }
            })

            resolve(result)
        }
    })
}

async function get_entry_from_table(table_name, id) {
    const db_obj = new Database()
    const db = await db_obj.init()

    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(table_name, "readwrite")
        var object_store = transaction.objectStore(table_name)
        
        var get_request = object_store.get(id)

        get_request.onsuccess = function(event) {
            resolve(event.target.result)
        };
    })
}

const db_functions = {
    create_entry_in_table,
    get_all_from_table,
    get_filtered_from_table,
    get_entry_from_table
}

export default db_functions