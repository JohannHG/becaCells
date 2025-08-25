(function () {
  function compressString(s) {
    //convertir a string
    s = s + '';
    //cadena vacía devolvera vacía
    if (s.length === 0) {
      return '';
    }

    let resultado = '';
    let contador = 1;

    //recorremos desde el segundo carácter
    for (let i = 1; i <= s.length; i++) {
      //comparar el carácter actual con el anterior
      let actual = s.charAt(i);
      let anterior = s.charAt(i - 1);

      if (actual === anterior) {
        //mismo carácter consecutivo -> aumenta contador
        contador = contador + 1;
      } else {
        //diferente -> añadir a resultado el par (carácter + contador)
        resultado = resultado + anterior + String(contador);
        //reiniciar contador
        contador = 1;
      }
    }

    return resultado;
  }

  //exponer en window para que puedas probar en consola
  window.compressString = compressString;

  let input = document.getElementById('comp-input');
  let btn = document.getElementById('comp-btn');
  let out = document.getElementById('comp-out');
  let tests = document.getElementById('comp-tests');

  if (btn && input && out) {
    btn.addEventListener('click', function () {
      let v = input.value || '';
      let r = compressString(v);
      out.textContent = r;
    });
  }

  //imprimir pruebas si existe
  if (tests) {
    let ejemplos = [
      { in: 'aabcccccaaa', expect: 'a2b1c5a3' },
      { in: '', expect: '' },
      { in: 'abc', expect: 'a1b1c1' },
      { in: 'aaaa', expect: 'a4' }
    ];
    let lineas = [];
    for (let i = 0; i < ejemplos.length; i++) {
      let e = ejemplos[i];
      lineas.push(e.in + '  ->  ' + compressString(e.in) + '  (esperado: ' + e.expect + ')');
    }
    tests.textContent = lineas.join('\n');
  }
})();
