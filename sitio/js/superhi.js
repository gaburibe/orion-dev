/*
(function() {
    let acc = document.getElementsByClassName("accordion");
    let i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }

    document.getElementById("form-login").style.display = "none";

})();
*/

const form_sign = $("#form-login");
const accordion_display = $(".accordion");
const btn_menu_form = $("#btn_menu_form");
const close_login = $("#close_login");

form_sign.hide();

btn_menu_form.click(function(e){
    e.preventDefault();
    muestra_oculta()
});

close_login.click(function(e){
    e.preventDefault();
    muestra_oculta()
});

// hidden show form login
function muestra_oculta() {
    if ( form_sign.is(":hidden") ){
        form_sign.slideDown(400);
    } else {
        form_sign.slideUp(400);
    }
}

$(document).ready(function(){
    let i;
    for (i = 0; i < accordion_display.length; i++) {
        accordion_display[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
});