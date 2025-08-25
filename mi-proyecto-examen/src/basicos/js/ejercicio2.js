(function () {
  function distancia(a, b) {
    //forzar a string
    a = String(a);
    b = String(b);

    //longitud
    let lenA = a.length;
    let lenB = b.length;

    //diferencias entre longitudes
    let minLen = lenA;
    if (lenB < minLen) minLen = lenB;

    let contador = 0;
    for (let i = 0; i < minLen; i++) {
      if (a.charAt(i) !== b.charAt(i)) {
        contador = contador + 1;
      }
    }

    //diferencia de longitudes en caso de haber
    let diffLong = lenA - lenB;
    if (diffLong < 0) diffLong = -diffLong; 
    contador = contador + diffLong;

    return contador;
  }

  //exponer en window para pruebas desde consola
  window.distancia = distancia;

  let boton = document.getElementById('calc-btn');
  let inputA = document.getElementById('str-a');
  let inputB = document.getElementById('str-b');
  let salida = document.getElementById('dist-result');
  let salidaTests = document.getElementById('test-output');

  if (boton && inputA && inputB && salida) {
    boton.addEventListener('click', function () {
      let a = inputA.value;
      let b = inputB.value;
      let resultado = distancia(a, b);
      salida.textContent = String(resultado);
    });
  }

  //mostrar pruebas del enunciado en el pre
  (function mostrarPruebas() {
    let pruebas = [
      { a: 'hola', b: 'hola' },
      { a: 'sol', b: 'tol' },
      { a: 'carro', b: 'correr' }
    ];

    let lineas = [];
    for (let i = 0; i < pruebas.length; i++) {
      let p = pruebas[i];
      let r = distancia(p.a, p.b);
      lineas.push('distancia("' + p.a + '", "' + p.b + '") => ' + String(r));
    }

    if (salidaTests) {
      salidaTests.textContent = lineas.join('\n');
    }
  })();
})();
