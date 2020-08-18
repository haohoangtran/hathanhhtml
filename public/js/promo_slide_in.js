function elegantPromo(config) {
    var config = config || {},
        cookieExpire = config.cookieExpire || 0,
        longExpire = config.longExpire || 0,
        promohtml = setDefault(config.promohtml, ''),
        cookies = getAllCookies(),
        promo_cookie_name = 'Elegant_Themes_Promo_State',
        promocookie = cookies[promo_cookie_name],
        promo_state = getCookieValue('Elegant_Themes_Promo_State');
    if (!promocookie) {
        var base_value = 'open';
        Cookies.set(promo_cookie_name, base_value, {
            expires: cookieExpire,
            path: '/'
        });
        promo_state = getCookieValue('Elegant_Themes_Promo_State');
    }
    if (promo_state === 'open') {
        firePromo();
    }

    function setDefault(_property, _default) {
        return typeof _property === 'undefined' ? _default : _property;
    }

    function setNewCookieValue(cookieName, value, setExpire) {
        Cookies.remove(cookieName);
        if (setExpire === 'false') {
            Cookies.set(cookieName, value, {
                path: '/'
            });
        } else if (setExpire === 'long') {
            Cookies.set(cookieName, value, {
                expires: longExpire,
                path: '/'
            });
        } else {
            Cookies.set(cookieName, value, {
                expires: cookieExpire,
                path: '/'
            });
        }
    }

    function firePromo() {
        jQuery("body").prepend(promohtml);
        jQuery("body").addClass('with_promo_slide_in');
        jQuery('.promo-slide-in-button').on('click', function() {
            disablepromo();
        });
        jQuery('.promo-slide-in-close-promo').on('click', function() {
            disablepromo();
            jQuery("body").removeClass('with_promo_slide_in');
            jQuery("body").addClass('without_promo_slide_in');
            jQuery('.promo-slide-in').addClass("promo-slide-in-closed").delay(490).queue(function(next) {
                jQuery(this).hide();
            });
        });
    }

    function disablepromo() {
        var new_value = 'closed';
        setNewCookieValue(promo_cookie_name, new_value, 'true');
    }

    function getAllCookies() {
        var document_cookies = document.cookie.split('; ').reduce(function(prev, curr) {
            var el = curr.split('=');
            prev[el[0]] = el[1];
            return prev;
        }, {});
        return document_cookies;
    }

    function getCookieValue(name) {
        var value = "; " + document.cookie,
            parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
    }
};
var _elegantPromo = elegantPromo({
    cookieExpire: 7,
    longExpire: 365,
    promohtml: '<div class="promo-slide-in accent-pink card-featured"><div class="promo-slide-in-content"><div class="promo-slide-in-content-inner"><h6>Divi Changes Everything. <span>Give It A Test Drive!</span></h6> <a class="button inline-button" href="https://www.elegantthemes.com/gallery/htd/">Learn More</a></div></div><div class="promo-slide-in-close-promo"></div></div>'
});
