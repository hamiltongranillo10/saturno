/* =====================================================================
   🌐 TRADUCTOR (Google Translate) — botón "EN / ES"
   - Google solo se carga cuando la persona toca "EN" (antes no se envía nada a Google).
   - Al elegir inglés, Google guarda la cookie "googtrans" para seguir traducido en las demás páginas.
   - Para usarlo en una página: pon un botón con  data-lang-toggle  y carga este archivo:
       <button type="button" class="lang-btn" data-lang-toggle>EN</button>
       <script src="traductor.js" defer></script>
   ===================================================================== */
(function(){
  var buttons = [].slice.call(document.querySelectorAll('[data-lang-toggle]'));
  if (!buttons.length) return;

  // Oculta la barra y los globitos que Google agrega, para que la página se vea igual
  var css = document.createElement('style');
  css.textContent = '#gt_el,.goog-te-banner-frame,.skiptranslate iframe,#goog-gt-tt,.goog-te-balloon-frame,.VIpgJd-ZVi9od-ORHb-OEVmcd{display:none!important}' +
    'body{top:0!important;position:static!important}.goog-text-highlight{background:none!important;box-shadow:none!important}' +
    'font[style]{background:none!important;box-shadow:none!important}';
  document.head.appendChild(css);
  var holder = document.createElement('div'); holder.id = 'gt_el'; document.body.appendChild(holder);

  function isEnglish(){ return /googtrans=\/es\/en/.test(document.cookie); }
  function paint(){
    var en = isEnglish();
    buttons.forEach(function(b){
      b.textContent = en ? 'ES' : 'EN';
      b.setAttribute('aria-label', en ? 'Ver la página en español' : 'View this page in English');
      b.setAttribute('translate', 'no'); b.classList.add('notranslate');
    });
  }

  var loading = false;
  function loadGoogle(then){
    if (window.google && google.translate && google.translate.TranslateElement){ then && then(); return; }
    window.__gtReady = function(){
      new google.translate.TranslateElement({ pageLanguage: 'es', includedLanguages: 'en,es', autoDisplay: false }, 'gt_el');
      then && then();
    };
    if (loading) return; loading = true;
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=__gtReady';
    s.onerror = function(){ loading = false; alert('No se pudo cargar el traductor. Revisa tu conexión e inténtalo de nuevo.'); };
    document.head.appendChild(s);
  }
  // Espera a que Google cree su selector de idioma y elige inglés
  function chooseEnglish(tries){
    var sel = document.querySelector('select.goog-te-combo');
    if (sel && sel.querySelector('option[value="en"]')){
      sel.value = 'en'; sel.dispatchEvent(new Event('change', { bubbles: true }));
      setTimeout(paint, 600); return;
    }
    if ((tries || 0) < 60) setTimeout(function(){ chooseEnglish((tries || 0) + 1); }, 100);
  }
  // Volver a español: Google regresa el texto original (y su cookie queda en "/es/es").
  // Si Google aún no cargó, borra su cookie en todas sus variantes y recarga.
  function backToSpanish(tries){
    var sel = document.querySelector('select.goog-te-combo');
    if (sel && sel.querySelector('option[value="es"]')){
      sel.value = 'es'; sel.dispatchEvent(new Event('change', { bubbles: true }));
      setTimeout(paint, 600); return;
    }
    if (loading && (tries || 0) < 60){ setTimeout(function(){ backToSpanish((tries || 0) + 1); }, 100); return; }
    var host = location.hostname, past = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'googtrans' + past;
    document.cookie = 'googtrans' + past + '; domain=' + host;
    document.cookie = 'googtrans' + past + '; domain=.' + host.replace(/^www\./, '');
    location.reload();
  }

  buttons.forEach(function(b){
    b.addEventListener('click', function(){
      if (isEnglish()) backToSpanish(0);
      else loadGoogle(function(){ chooseEnglish(0); });
    });
  });
  if (isEnglish()) loadGoogle();   // si ya eligió inglés antes, sigue traducida al cambiar de página
  paint();
})();
