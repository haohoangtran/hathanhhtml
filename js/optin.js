function elegantPopup(config) {
    var config = config || {},
        cookieExpire = config.cookieExpire || 0,
        longExpire = config.longExpire || 0,
        auto = setDefault(config.auto, 'true'),
        flyinhtml = setDefault(config.flyinhtml, ''),
        popuphtml = setDefault(config.popuphtml, ''),
        autospeed = config.autospeed || 10000,
        flyinAutospeed = config.flyinAutospeed || 3000,
        delay = config.delay || 3,
        cookies = getAllCookies(),
        pageview_cookie_name = 'Optin_PageviewCounter',
        modalview_cookie_name = 'Optin_DisplayedPopup',
        flyin_cookie_name = 'Optin_MinimizeFlyin',
        subscribed_cookie_name = 'Optin_Subscribed',
        pageview = cookies[pageview_cookie_name],
        flyin = cookies[flyin_cookie_name],
        main_viewed = cookies[modalview_cookie_name],
        subscribed = cookies[subscribed_cookie_name],
        pageview_count = getCookieValue('Optin_PageviewCounter'),
        flyin_status = getCookieValue('Optin_MinimizeFlyin'),
        click_source = getParameterByName('utm_medium'),
        promo_slide_in_state = getCookieValue('Elegant_Themes_Promo_State'),
        already_subscribed = '';
    if (!subscribed) {
        already_subscribed = 'false';
        Cookies.set(subscribed_cookie_name, already_subscribed, {
            expires: cookieExpire,
            path: '/'
        });
    }
    if (!main_viewed) {
        if (auto === 'false') {
            main_viewed = 'true';
            Cookies.set(modalview_cookie_name, main_viewed, {
                expires: cookieExpire,
                path: '/'
            });
        }
    }
    if (!pageview) {
        pageview = '1';
        Cookies.set(pageview_cookie_name, pageview, {
            expires: cookieExpire,
            path: '/'
        });
    } else if (pageview) {
        pageview++;
        setNewCookieValue(pageview_cookie_name, pageview, 'false');
    }
    if (!flyin) {
        flyin = 'open';
        Cookies.set(flyin_cookie_name, flyin, {
            expires: cookieExpire,
            path: '/'
        });
    }
    if (pageview_count > delay && subscribed === 'false' && promo_slide_in_state != 'open' && main_viewed === 'true') {
        if (flyin_status === 'closed') {
            flyinAutospeed = 0;
        }
        setTimeout(function() {
            fireflyin();
        }, flyinAutospeed);
    }
    if (!main_viewed && auto === 'true' && click_source != 'email' && promo_slide_in_state != 'open' && (typeof subscribed === 'undefined' || subscribed === 'false')) {
        setTimeout(function() {
            if (main_viewed === 'true') {
                return;
            }
            firepopup();
        }, autospeed);
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

    function firepopup() {
        if (jQuery('.et_cookie_consent').length) {
            return;
        }
        jQuery("body").append(popuphtml);
        disablepopup();
        jQuery('#exit_subscribe').on('click', function() {
            subscribe();
        });
        jQuery('.exit-button').on('click', function() {
            jQuery("#exitpopup").hide();
        });
        jQuery(".exit-button").hover(function() {
            jQuery(".exit_warning").fadeIn(200);
        }, function() {
            jQuery(".exit_warning").fadeOut(200);
        });
    }

    function fireflyin() {
        if (jQuery('.et_cookie_consent').length) {
            return;
        }
        var flyin_status = getCookieValue('Optin_MinimizeFlyin');
        jQuery("body").append(flyinhtml);
        if (flyin_status === 'closed') {
            jQuery('#flyinwrapper').addClass("minimize stopanimate");
        } else {
            jQuery('#flyinwrapper').removeClass("minimize");
        }
        jQuery('.exit-button').on('click', function() {
            jQuery('#flyinwrapper').addClass("minimize");
            Optin_MinimizeFlyin();
        });
        jQuery('#flying_subscribe').on('click', function() {
            subscribe();
        });
        jQuery('.flyinbutton').on('click', function() {
            jQuery('#flyinwrapper').removeClass("minimize");
            Optin_MinimizeFlyin();
        });
    }

    function disablepopup() {
        main_viewed = 'true';
        setNewCookieValue(modalview_cookie_name, main_viewed, 'true');
    }

    function subscribe() {
        already_subscribed = 'true';
        setNewCookieValue(subscribed_cookie_name, already_subscribed, 'long');
    }

    function Optin_MinimizeFlyin() {
        var flyin_status = getCookieValue('Optin_MinimizeFlyin');
        if (flyin_status === 'open') {
            flyin = 'closed';
            setNewCookieValue(flyin_cookie_name, flyin, 'true');
        } else {
            flyin = 'open';
            setNewCookieValue(flyin_cookie_name, flyin, 'true');
        }
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search)
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
            parts = value.split("; " + name + "=")
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
};