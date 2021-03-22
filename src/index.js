(function(){
  const administratum = document.location.href.match(/^https\:\/\/www\.administratum\.net/);
  if (!administratum) {
    return;
  }
  const loaded = document.querySelector('#departmento_loaded');
if (!loaded) {

const scriptTag = document.createElement('script');
scriptTag.type = 'module';
scriptTag.src = '__site__url__/assets/js/main.mjs';
document.body.appendChild(scriptTag);

}
}());