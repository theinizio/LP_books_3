$(document).ready(function() {

    var url = window.location.search.substring(1);

    if (url === '') {
        window.location.href = 'error404.html';
    }

});