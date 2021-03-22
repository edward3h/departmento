const UNCHECKED = '❏';
const CHECKED = '☑';

const withJQuery = () => {
    $('head').append(`<style>
    .departmento {
        background-color: black;
        color: #CCC;
    }
    .agenda {
        cursor: pointer;
    }
    .agenda.checked {
        font-weight: bold;
        color: black;
    }
    .agenda.unchecked {
        color: #777;
    }
    </style>`);
    $("div.form-check").not(":contains('Battle Sheet')").children("input:checked").each((i, x) => x.click());

    $('div.btn-group').removeClass('mt-5 my-5').after(`<div class="btn-group departmento d-print-none">
    <div class="form-check form-check-inline">
    <input type="checkbox" id="astartes" class="form-check-input" checked><label class="form-check-label" for="astartes">Adeptus Astartes</label>
    </div>
    <div class="form-check form-check-inline">
    <input type="checkbox" id="necrons" class="form-check-input" checked><label class="form-check-label" for="necrons">Necrons</label>
    </div>    
    <div class="form-check form-check-inline">
    <input type="checkbox" id="btv" class="form-check-input" checked><label class="form-check-label" for="btv">BtV</label>
    </div>
    </div>`);


    $('div.row div.col-9').replaceWith((a, b) => {
        let inner = b.replace(new RegExp(`${UNCHECKED}[^,]*,?`, 'g'), `<span class="agenda unchecked">$&</span>`);
        return `<div class="col-9">${inner}</div>`
    });
    $('span.agenda').on('click', function(evt) {
        let el = $(this);
        if (el.hasClass('unchecked')) {
            el.parent().children().removeClass('checked').addClass('unchecked');
            el.parent().children().text((i, t) => t.replace(CHECKED, UNCHECKED));
            el.removeClass('unchecked').addClass('checked');
            el.text(el.text().replace(UNCHECKED, CHECKED));
        } else {
            el.removeClass('checked').addClass('unchecked');
            el.text(el.text().replace(CHECKED, UNCHECKED));
        }
    });

    $('div.col-3').filter(":contains('Adeptus Astartes')").next().addBack().addClass('astartes');
    $('div.col-3').filter(":contains('Necrons')").next().addBack().addClass('necrons');

    $('#astartes').on('click', function (evt) {
        if (this.checked) {
            $('.astartes').show();
        } else {
            $('.astartes').hide();
        }
    });
    $('#necrons').on('click', function (evt) {
        if (this.checked) {
            $('.necrons').show();
        } else {
            $('.necrons').hide();
        }
    });
    $('#btv').on('click', function(evt) {
        if (this.checked) {
            $('.agenda:contains("(BtV)")').show();
        } else {
            $('.agenda:contains("(BtV)")').hide();
        }
    });
};

(function() {
    let container = document.querySelector('#departmento_root');

    if (container) {
        return;
    }


    container = document.createElement('div');
    container.id = '#departmento_root';
    container.style.textAlign = 'center';
    container.style.fontSize = '1.25rem';
    container.style.padding = '0.3125rem';
    container.style.backgroundColor = 'black';
    container.style.color = '#BBB';
    container.innerHTML = '+ D e p a r t m e n t o';

    const navbar = document.querySelector(".navbar");
    const navbarDiv = document.querySelector(".navbar div");

    navbar.insertBefore(container, navbarDiv);

    let loaded = document.createElement('div');
    loaded.id = '#departmento_loaded';
    loaded.style.display = 'none';
    document.body.appendChild(loaded);

    import("https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js")
    .then(withJQuery);
})();

