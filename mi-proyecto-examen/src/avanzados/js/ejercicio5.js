(function () {
  function simulateServiceResponse(flag) {
    //flag true => respuesta antes del timeout (aleatorio 1-8s)
    //flag false => respuesta tarde (13-17s)
    return new Promise(function (resolve) {
      let ms;
      if (flag === true || flag === 'true') {
        ms = 1000 + Math.floor(Math.random() * 7000); 
      } else {
        ms = 13000 + Math.floor(Math.random() * 4000);
      }
      setTimeout(function () {
        resolve('Esta es la respuesta del servicio');
      }, ms);
    });
  }

  // Promise que falla pasado cierto tiempo
  function timeoutPromise(ms) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error('Error el servicio no está disponible'));
      }, ms);
    });
  }

  // myMethod: devuelve la promesa que resuelve la respuesta si antes del timeout, si no rechaza
  function myMethod(flag, options) {
    // opciones aceptan: timeoutSeconds
    options = options || {};
    let timeoutSeconds = 12;
    if (options.timeoutSeconds && !isNaN(Number(options.timeoutSeconds))) {
      timeoutSeconds = Number(options.timeoutSeconds);
    }

    // asegurar booleano para simulateServiceResponse
    let boolFlag = flag === true || flag === 'true';

    // crear promesas
    let service = simulateServiceResponse(boolFlag);
    let to = timeoutPromise(timeoutSeconds * 1000);

    // Promise.race para obtener la que llegue primero
    return Promise.race([service, to]);
  }

  // Exponer para pruebas en consola
  window.myMethod = myMethod;

  // --- UI bindings ---
  let runBtn = document.getElementById('srv-run');
  let flagSel = document.getElementById('srv-flag');
  let out = document.getElementById('srv-result');
  let timeoutInput = document.getElementById('srv-timeout');
  let testsEl = document.getElementById('srv-tests');

  if (runBtn && flagSel && out && timeoutInput) {
    runBtn.addEventListener('click', function () {
      out.textContent = 'Cargando...';
      let flag = flagSel.value;
      let timeoutVal = Number(timeoutInput.value) || 12;
      myMethod(flag, { timeoutSeconds: timeoutVal })
        .then(function (res) {
          out.textContent = String(res);
        })
        .catch(function (err) {
          // mostrar mensaje de error
          out.textContent = String(err.message || err);
        });
    });
  }

  // mostrar ejemplos en el pre
  if (testsEl) {
    let lines = [];
    lines.push('// Ejemplos de uso:');
    lines.push('myMethod(true).then(console.log).catch(console.error)');
    lines.push('myMethod(false).then(console.log).catch(console.error)');
    lines.push('');
    lines.push('// Pruebas:');
    lines.push('myMethod(true, {timeoutSeconds:12})');
    lines.push('myMethod(false, {timeoutSeconds:12})');
    lines.push('myMethod(false, {timeoutSeconds:20})');
    testsEl.textContent = lines.join('\n');
  }
})();
