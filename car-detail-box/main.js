/* jQuery Animation */
addJQueryEventHandler = function () {
    $('#tab-box .tab-entry').on("click", function () {
        let $name = $(this).data('name');
        let $details = $('#tab-box .details');

        /* Toggle active */
        $('#tab-box .tab-entry').removeClass('active');
        $(this).toggleClass('active');

        $details.removeClass('active');
        $details.each(function () {
            if ($(this).data('details') === $name) {
                $(this).addClass('active');
            }
        })
    });
};

logHTMLReplaced = function () {
    console.log('%cMode changed to:', 'color:#e4ba17', ModeManager.getActiveMode());
};

getAccordion = function (jsonData) {
    let a = '';
    let index = 0;
    for (value of jsonData) {
        a += '<div class="tab">' +
            '<div data-name="' + value.group + '" class="tab-entry' + (index === 0 ? " active" : "") + '">' + value.group.capitalize() + '</div>' +
            '<div class="body">' +
            getDetails(value, index) +
            '</div>' +
            '</div>';
        index++;
    }
    return a;
};

getDetails = function (entry, index) {
    let ret = '';
    if (entry.items !== undefined) {
        let details =
            '<div data-details="' + entry.group + '" class="details' + (index === 0 ? " active" : "") + '">' +
            '<div class="name">' +
            entry.items.map(value => '<span>' + value.name + '</span>').join('') +
            '</div>' +
            '<div class="value">' +
            entry.items.map(value => '<span>' + value.value + '</span>').join('') +
            '</div>' +
            '</div>';
        ret += details;
    }
    if (entry.text !== undefined) {
        let details =
            '<div data-details="' + entry.group + '" class="details' + (index === 0 ? " active" : "") + '">' +
            '<span>' + entry.text + '</span>';
        ret += details;
    }
    return ret;
};

getBox = function (jsonData) {
    let htmlBoxHead =
        '<div class="head-menu">' +
        jsonData.map((entry, index) => {
            return '<div data-name="' + entry.group + '" class="tab-entry' + (index === 0 ? " active" : "") + '">' + entry.group.capitalize() + '</div>'
        }).join('') +
        '</div>';

    let htmlBoxItems =
        '<div class="body">' +
        jsonData.map((entry, index) => {
            let details = getDetails(entry, index);
            if (details !== '') return details;
        }).join('') +
        '</div>';

    return htmlBoxHead + htmlBoxItems;
};

const ModeManager = {
    modes: ['BOX', 'ACCORDION'],
    activeMode: 0,
    setActiveMode: function (newMode) {
        if (typeof newMode === "string") {
            let index = this.modes.indexOf(newMode);
            if (index !== -1) this.activeMode = index;
        } else if (typeof newMode === "number") {
            if (newMode < this.modes.length) this.activeMode = newMode
        }
    },
    setActiveModeViaScreenSize: function(){
        if (window.innerWidth <= 768) {
            this.setActiveMode('ACCORDION');
        } else {
            this.setActiveMode('BOX');
        }
    },
    getActiveMode: function () {
        return this.modes[this.activeMode];
    }
};

resize = function (jsonData, domElement) {
    window.onresize = function () {
        if (window.innerWidth <= 768 &&
            ModeManager.getActiveMode() !== ModeManager.modes[1]
        ) {
            domElement.innerHTML = getAccordion(jsonData);
            ModeManager.setActiveMode('ACCORDION');
            addJQueryEventHandler();
            logHTMLReplaced();
        } else if (
            window.innerWidth > 768 &&
            ModeManager.getActiveMode() !== ModeManager.modes[0]
        ) {
            domElement.innerHTML = getBox(jsonData);
            ModeManager.setActiveMode('BOX');
            addJQueryEventHandler();
            logHTMLReplaced();
        }
    };
};

(function ($, jsonData, domElement) {
    let box = document.getElementById(domElement);
    let domHTMLContent;

    if (window.innerWidth <= 768) {
        domHTMLContent = getAccordion(jsonData);
    } else {
        domHTMLContent = getBox(jsonData)
    }

    ModeManager.setActiveModeViaScreenSize();
    resize(jsonData, box);
    box.innerHTML = domHTMLContent;
    addJQueryEventHandler();
})(jQuery, SPECDT, 'tab-box');
