class ThreadListing {
    constructor(thread_data, url_vars) {
        this._thread_data = thread_data
        this._url_vars = url_vars

        var postcontent_container = document.getElementById("internal-body")
        postcontent_container.append(this.create_listing())
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
            var row = document.createElement("div")
            row.className = "listing-win-body-row"
            
            var row_name = document.createElement("div")
            row_name.innerHTML = "THREAD NAME HERE"
            row.append(row_name)

            var row_author = document.createElement("div")
            row_author.innerHTML = "AUTHOR"
            row.append(row_author)
            
            var row_description = document.createElement("div")
            row_description.innerHTML = "REPLIES"
            row.append(row_description)
            
            var row_activity = document.createElement("div")
            row_activity.innerHTML = "By USERNAME DATE"
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