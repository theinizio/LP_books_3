$(document).ready(function () {

    var cardType = '';

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
        validClass: 'inp-valid',
        submitHandler: function () {
            $('.form').hide();
            $('.form-payment').show();
            let firstName = $('[name="firstName"]').val();
            let lastName = $('[name="lastName"]').val();
            $('[name="name"]').val(firstName + ' ' + lastName);
        }
    });

    $('.form-payment').validate({
        rules: {
            cardNumber: {
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
            cardNumber: {
                required: "The Card number field is required.",
                minlength: "The Card number field must be at least 15 characters."
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
        validClass: 'inp-valid',
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

            sendData.cardType = cardType;
            sendData.cardNumber = parseInt(sendData.cardNumber.replace(/\s+/g, ''));
            sendData.phone = parseInt(sendData.phone.replace(/\s+/g, '').match(/\d+/g).join(''));


            console.log('%c sendData', 'color: green; font-size: 16px; font-weight: 600;', sendData);

            $.ajax({
                url: "https://blueomedia.com/lp",
                type: "POST",
                contentType: "application/json",
                data: sendData,
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

    var cartNumber = new Cleave('[name="cardNumber"]', {
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
            // console.log(type);
            $('#card-type').attr('src', 'img/credit_card/' + type + '.png');
            cardType = type;
            if (type === 'unknown') {
                $('[name="cvv"]').attr({
                    maxlength: 3,
                    placeholder: '000',
                }).val('');
            } else if (type === 'amex') {
                $('[name="cvv"]').attr({
                    maxlength: 4,
                    placeholder: '0000',
                }).val('');
            } else {
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
    // $('.localization .active').on('click', function() {
    //     $('.localization .list').toggleClass('open');
    //     $('.localization .active').toggleClass('rotate');
    // });
    //
    // $('.localization .list li').on('click', function() {
    //     let lang = $(this).find('.list__lang').attr('data-lang');
    //     localStorage.setItem('lang', lang);
    //     window.location.reload();
    // });


    // === TRANSLATES === //
    // var language = localStorage.getItem('lang') || 'pl';
    //
    // console.log(language);
    //
    // $('.localization .active').append('<img src="img/language/' + language + '.png" alt=""><span class="active__lang">' + language + '</span>');
    //
    // var option = document.querySelectorAll('.localization .list__lang');
    //
    // option.forEach(function (el) {
    //     if (language === $(el).attr('data-lang')) {
    //         $(el).parent().addClass('selected');
    //     }
    // });
    //
    // $("[data-localize]").localize("translate", {
    //     pathPrefix: "./translates",
    //     language: language
    // });

});