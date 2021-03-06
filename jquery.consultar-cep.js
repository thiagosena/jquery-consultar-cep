;(function( $ ) {

    function ConsultaCep() {}

    var methods = {
        init : function (settings) {
            return this.each(function () {
                var
                    $this = $(this),
                    data = $this.data('consultarCep'),
                    options = $.extend({
                    elCep: $(this),
                    campos: {
                        cep:        '#cep',
                        logradouro: '#endereco',
                        bairro:     '#bairro',
                        localidade: '#cidade',
                        uf:         '#uf'
                    },
                    evento: 'click',
                    focarAposPara: '#cep',
                    btnConsultar: '#consultar-cep',
                    elMensagem: this, // Elemento container da mensagem
                    mensagem: '<i class="fa fa-spin fa-spinner"></i>',
                    url: 'http://cep.correiocontrol.com.br/$CEP.js?jsoncallback=?'
                }, settings);

                if (!data) {
                    $(this).data('consultarCep', {
                        'target': $this,
                        'options': options
                    });

                    options.btnConsultar = $(options.btnConsultar);
                    options.elMensagem = $('<span/>', {
                        class: options.classMensagem,
                        html: options.mensagem
                    }).hide();

                    if(options.evento == 'click')
                    {
                        options.btnConsultar.parent().parent().after(options.elMensagem);
                        options.btnConsultar.data('loading-text', options.mensagem);
                        options.btnConsultar.on('click', function() {
                            $this.consultarCep('consultar', options.elCep.val());
                        });
                    }
                    else
                    {
                        options.elCep.after(options.elMensagem);
                        options.elCep.on('blur', function() {
                            $this.consultarCep('consultar', $(this).val());
                        });
                    }

                }



            });
        },
        consultar: function (cep) {

            var settings = this.data('consultarCep').options;

            if(cep == undefined || cep.length < 8) return;

            var cep = cep.replace('-', ''),
                url = settings.url.replace('$CEP', cep);

            settings.evento == 'click' ?
                settings.btnConsultar.button('loading') : settings.elMensagem.html(settings.mensagem).show();


            options = settings;

            $.getJSON( url,  {
                format: "json"
            });

//            $.ajax({
//                url: url,
//                jsonp: false,
//                jsonpCallback: function(correiocontrolcep){
//                    alert(correiocontrolcep);
//                    //$(this).consultarCep('correiocontrolcep',data);
//                },
//                dataType: 'jsonp',
//                crossDomain: true
//            });
        },
        correiocontrolcep: function(valor) {

            var elCep = options.elCep;

            if (valor == null || valor == undefined || valor.hasOwnProperty('erro')) {
                options.btnConsultar.button('reset');
                if(options.falha)
                {
                    options.falha(valor);
                }
                else
                {
                    options.elMensagem.html('CEP não encontrado').show();
                    for(var campo in options.campos)
                        $(options.campos[campo]).val(valor[campo]);
                    elCep.focus();
                }
                return;
            } else {
                if(options.sucesso) {
                    options.sucesso(valor);
                }
                //Se quiser que o sucesso sobrescreva tem que usar o preventDefault.
                for(var campo in options.campos)
                    $(options.campos[campo]).val(valor[campo]);

                options.elMensagem.html('').hide();
            }

            if(options.evento == 'click')
                options.btnConsultar.button('reset');

            if(options.focarAposPara)
                $(options.focarAposPara).focus();
        }
    }

    $.fn.consultarCep = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.consultar-cep.js');
        }
    };

    $.consultarCep = new ConsultaCep();

    window.correiocontrolcep = function(valor) {
        var elCep = options.elCep;

        if (valor == null || valor == undefined || valor.hasOwnProperty('erro')) {
            options.btnConsultar.button('reset');
            if(options.falha)
            {
                options.falha(valor);
            }
            else
            {
                options.elMensagem.html('CEP não encontrado').show();
                for(var campo in options.campos)
                    $(options.campos[campo]).val(valor[campo]);
                elCep.focus();
            }
            return;
        } else {
            if(options.sucesso) {
                options.sucesso(valor);
            }
            //Se quiser que o sucesso sobrescreva tem que usar o preventDefault.
            for(var campo in options.campos)
                $(options.campos[campo]).val(valor[campo]);

            options.elMensagem.html('').hide();
        }

        if(options.evento == 'click')
            options.btnConsultar.button('reset');

        if(options.focarAposPara)
            $(options.focarAposPara).focus();

    }
 
}( jQuery ));