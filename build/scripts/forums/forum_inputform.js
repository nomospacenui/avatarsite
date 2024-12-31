import site_nav from "../tools/site_nav.js"
import db_functions from "../database.js"

class InputForm {
    constructor(url_vars) {
        this._url_vars = url_vars
        this._icon_image_root_dir = "../../../assets/images/icons/create_post/"

        var internalcontent_container = document.getElementById("internal-body")
        
        if ("subforum" in this._url_vars) {
            var title_input = document.createElement("input")
            title_input.className = "title-input"
            title_input.placeholder = "Title of thread"
            internalcontent_container.append(title_input)
        }

        var content_header = document.createElement("div")
        content_header.className = "content-header"
        internalcontent_container.append(content_header)

        var content_body = document.createElement("div")
        content_body.className = "content-body"

        var content_input = document.createElement("textarea")
        content_input.className = "content-input"
        content_input.placeholder = "Content of thread"
        
        var submit_button = document.createElement("button")
        submit_button.className = "button"
        submit_button.innerHTML = "Submit"
        
        content_body.append(this.create_buttons(content_input))
        content_body.append(content_input)
        content_body.append(submit_button)
        
        internalcontent_container.append(content_body)

        var [preview, preview_text] = this.create_preview()
        internalcontent_container.append(preview)
        
        content_input.onchange = function () {
            preview_text.dispatchEvent(new CustomEvent("change", {'detail': {'input_box': this}}))
        }
        
        content_input.oninput = content_input.onchange

        submit_button.onclick = async function() {
            if ("subforum" in url_vars && title_input.value == "") {
                alert("Title must be non-empty")
                return
            }

            if (content_input.value == "") {
                alert("Content must be non-empty")
                return
            }

            var d = new Date()
            if ("subforum" in url_vars) {
                await db_functions.create_entry_in_table("threads",
                    {
                        "content": content_input.value,
                        "subforum_id": url_vars["subforum"],
                        "datetime": (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                        "name": title_input.value
                    }
                )
            }

            else {
                await db_functions.create_entry_in_table("replies",
                    {
                        "content": content_input.value,
                        "datetime": (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                        "thread_id": url_vars["thread"]
                    }
                )
            }

            site_nav.go_to_url(site_nav.change_url_var({"page": 1}, url_vars, ["action"]))
        }
    }

    create_buttons(input_box) {
        var buttons_menu = document.createElement("toolbar")

        buttons_menu.append(this.create_modifier_button(input_box, "bold.png", "<b>", "</b>"))
        buttons_menu.append(this.create_modifier_button(input_box, "italic.png", "<i>", "</i>"))
        buttons_menu.append(this.create_modifier_button(input_box, "underline.png", "<u>", "</u>"))
        buttons_menu.append(this.create_modifier_button(input_box, "strikethrough.png", "<s>", "</s>"))

        buttons_menu.append(this.create_button_spacing())

        buttons_menu.append(this.create_modifier_button(input_box, "left-align.png", "<p style='text-align: left'>", "</p>"))
        buttons_menu.append(this.create_modifier_button(input_box, "center-align.png", "<p style='text-align: center'>", "</p>"))
        buttons_menu.append(this.create_modifier_button(input_box, "right-align.png", "<p style='text-align: right'>", "</p>"))

        buttons_menu.append(this.create_button_spacing())
        
        var font_size_contents = ["10px", "12px", "14px", "16px", "20px"]
        buttons_menu.append(this.create_font_style_dropdown_modifier_button(input_box, "text-size.png", font_size_contents, "font-size: ", true, ["32px", "60px"]))
        
        var font_style_contents = ["Arial", "Verdana", "Tahoma", "Times New Roman", "Georgia", "Courier New", "Comic Sans MS"]
        buttons_menu.append(this.create_font_style_dropdown_modifier_button(input_box, "font.png", font_style_contents, "font-family: ", true, ["60px", "120px"]))
        
        var font_color_contents = ["#f44336", "#ff994f", "#ffd966", "#6aa84f", "#3d9fa1", "#92cbe5", "#3d85c6", "#674ea7", "#cf99c5", "#ed7777", "#a2596f", "#bcbcbc"]
        buttons_menu.append(this.create_font_color_modifier_button(input_box, "text-color.png", font_color_contents, "color: ", ["32px", "52px"]))
        
        buttons_menu.append(this.create_button_spacing())

        buttons_menu.append(this.create_hyperlink_button(input_box, "link.png"))
        buttons_menu.append(this.create_image_button(input_box, "image.png"))
        buttons_menu.append(this.create_modifier_button(input_box, "quote.png", "<q>", "</q>"))

        return buttons_menu
    }

    create_modifier_button(input_box, image_filename, modifier_start, modifier_end) {
        var button = this.create_base_button(image_filename)
        button.onclick = this.selection_modifier_button_click.bind(null, input_box, modifier_start, modifier_end)
        return button
    }

    create_font_style_dropdown_modifier_button(input_box, image_filename, contents, modifier, apply_style_to_content = false, width = null) {
        var [button, dropdown_content] = this.create_base_button_with_expand_menu(image_filename)
        
        if (width) {
            button.style.width = width[0]
            dropdown_content.style.width = width[1]
        }
        
        contents.forEach(x => {
            var content = document.createElement("div")
            content.className = "text-button-content-entry"
            content.onclick = this.selection_modifier_button_click.bind(null, input_box, "<font style='" + modifier + x + "'>", "</font>")
            dropdown_content.append(content)

            if (apply_style_to_content) 
                content.innerHTML = "<font style='" + modifier + x + "'>" + x + "</font>"
            else
                content.innerHTML = x
        });

        return button
    }

    create_font_color_modifier_button(input_box, image_filename, contents, modifier, width = null) {
        var [button, expand_menu] = this.create_base_button_with_expand_menu(image_filename)
        
        if (width) {
            button.style.width = width[0]
            expand_menu.style.width = width[1]
        }
        
        contents.forEach(x => {
            var content = document.createElement("text")
            content.style.background = x
            content.className = "tiny-button"
            content.onclick = this.selection_modifier_button_click.bind(null, input_box, "<font style='" + modifier + x + "'>", "</font>")
            expand_menu.append(content)
        });

        return button
    }
    
    create_hyperlink_button(input_box, image_filename) {
        var [button, expand_menu] = this.create_base_button_with_expand_menu(image_filename)
        
        var link_content = this.create_input_field("Link")
        var display_content = this.create_input_field("Display text")

        expand_menu.append(link_content)
        expand_menu.append(display_content)
        expand_menu.append(this.create_modifier_button_submit(
            function() {
                if (['http://', 'https://', 'ftp://'].some( (prefix) => link_content.value.includes(prefix)))  
                    input_box.value += "<a href=" + link_content.value + ">" + display_content.value + "</a>"
                else
                    input_box.value += "<a href=https://" + link_content.value + ">" + display_content.value + "</a>"
                input_box.onchange()
            }
        ))

        return button
    }
    
    create_image_button(input_box, image_filename) {
        var [button, expand_menu] = this.create_base_button_with_expand_menu(image_filename)

        var link_content = this.create_input_field("Link to image")
        var width_content = this.create_input_field("Width (in pixels)")
        var height_content = this.create_input_field("Height (in pixels)")

        expand_menu.append(link_content)
        expand_menu.append(width_content)
        expand_menu.append(height_content)
        expand_menu.append(this.create_modifier_button_submit(
            function() {
                input_box.value += "<img src=" + link_content.value + ' style="width:' + width_content.value + 'px;height:' + height_content.value + 'px;">'
                input_box.onchange()
            }
        ))
        
        return button
    }
    
    create_base_button(image_filename) {
        var button = document.createElement("button")
        button.className = "text-button"

        var img = document.createElement("img")
        img.src = this._icon_image_root_dir + image_filename
        button.append(img)

        return button
    }

    create_base_button_with_expand_menu(image_filename) {
        var button = this.create_base_button(image_filename)

        var menu = document.createElement("div")
        menu.className = "text-button-content"

        button.onclick = function() { menu.style.visibility = (menu.style.visibility == "visible") ? "hidden" : "visible"}
        button.append(menu)

        return [button, menu]
    }

    create_modifier_button_submit(on_click_func) {
        var submit_button = document.createElement("button")
        submit_button.innerHTML = "Submit"
        submit_button.className = "text-button-input-submit"
        submit_button.onclick = on_click_func
        return submit_button
    }

    create_input_field(placeholder) {
        var input_field = document.createElement("input")
        input_field.className = "text-button-input-content-entry"
        input_field.placeholder = placeholder
        
        input_field.onclick = function(e) {
            e.stopPropagation();
        }

        return input_field
    }
    
    create_button_spacing() {
        var spacing = document.createElement("text")
        spacing.className = "text-button-divider"
        return spacing
    }

    selection_modifier_button_click(input_box, modifier_start, modifier_end) {
        const bef_str = input_box.value.substring(0, input_box.selectionStart)
        const mid_str = input_box.value.substring(input_box.selectionStart, input_box.selectionEnd)
        const aft_str = input_box.value.substring(input_box.selectionEnd, input_box.value.length)
        input_box.value = bef_str + modifier_start + mid_str + modifier_end + aft_str;
        input_box.focus()
        input_box.onchange()
        var end_insert_pos = (bef_str + modifier_start + mid_str + modifier_end).length
        input_box.selectionEnd = end_insert_pos
    }

    create_preview() {
        var preview_container = document.createElement("div")
        preview_container.style.visibility = "hidden"
        
        var preview_header = document.createElement("div")
        preview_header.className = "content-header"
        preview_header.innerHTML = "Preview"
        preview_container.append(preview_header)

        var preview_body = document.createElement("div")
        preview_body.className = "preview-body"
        preview_container.append(preview_body)

        var preview_text = document.createElement("text")
        preview_text.innerHTML = ""
        preview_text.addEventListener('change', function (event) {
            preview_text.innerHTML = event.detail.input_box.value.replaceAll('\n', '<br>')
            preview_container.style.visibility = preview_text.innerHTML == "" ? "hidden": "visible"
        })

        preview_body.append(preview_text)
        return [preview_container, preview_text]
    }
}

export default InputForm