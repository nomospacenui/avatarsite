class ThreadListing {
    constructor(thread_data, url_vars) {

        for (var i = 0 ; i < thread_data.length ; ++i) {
            if (thread_data[i].subforum_id == url_vars["subforum"]) {
                console.log(thread_data[i])
            }
        }
    }
}

export default ThreadListing