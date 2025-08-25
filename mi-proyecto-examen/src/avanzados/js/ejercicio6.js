(function () {
  let listeners = {};

  // myAddEventListener: agrega handler y devuelve función para remover
  function myAddEventListener(eventName, handler) {
    if (typeof eventName !== 'string') {
      throw new TypeError('eventName debe ser string');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('handler debe ser función');
    }

    // crear array si no existe
    if (!listeners[eventName]) {
      listeners[eventName] = [];
    }
    // agregar handler
    listeners[eventName].push(handler);

    // devolver función para desuscribir
    return function () {
      let arr = listeners[eventName] || [];
      let nueva = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== handler) {
          nueva.push(arr[i]);
        }
      }
      // si quedó vacío borrar propiedad
      if (nueva.length === 0) {
        delete listeners[eventName];
      } else {
        listeners[eventName] = nueva;
      }
    };
  }

  // myDispatchEvent: llama a todos los handlers registrados con un objeto evento
  function myDispatchEvent(eventName, data) {
    if (typeof eventName !== 'string') {
      throw new TypeError('eventName debe ser string');
    }
    let arr = listeners[eventName];
    if (!arr || arr.length === 0) {
      // no había listeners
      return false;
    }

    // crear objeto evento
    let eventObj = {
      type: eventName,
      data: data,
      timeStamp: Date.now()
    };

    // llamar cada handler con try/catch para que uno no rompa a los demás
    for (let i = 0; i < arr.length; i++) {
      try {
        arr[i](eventObj);
      } catch (err) {
        // log simple en consola, no interrumpir los demás handlers
        try {
          console.error('Error en handler:', err);
        } catch (e) {
          // ignorar si console falla
        }
      }
    }
    return true;
  }

  // exponer en window
  window.myAddEventListener = myAddEventListener;
  window.myDispatchEvent = myDispatchEvent;

  // --- UI bindings (si existen elementos en la página) ---
  let addBtn = document.getElementById('evt-add-listener');
  let dispatchBtn = document.getElementById('evt-dispatch');
  let clearBtn = document.getElementById('evt-clear-log');
  let nameInput = document.getElementById('evt-name');
  let payloadInput = document.getElementById('evt-payload');
  let logEl = document.getElementById('evt-log');

  // función para escribir en el log UI
  function appendLog(text) {
    if (!logEl) return;
    let time = (new Date()).toLocaleTimeString();
    logEl.textContent = '[' + time + '] ' + text + '\n' + logEl.textContent;
  }

  // mantener referencias a desuscriptores para posible uso
  let added = [];

  if (addBtn) {
    addBtn.addEventListener('click', function () {
      let name = (nameInput && nameInput.value) ? nameInput.value.trim() : 'my-event';
      if (!name) {
        alert('Escribe un nombre de evento');
        return;
      }
      // crear handler de ejemplo
      let handler = function (e) {
        appendLog('Handler recibido para "' + e.type + '" — data: ' + JSON.stringify(e.data));
      };
      let unsub = myAddEventListener(name, handler);
      added.push(unsub);
      appendLog('Listener agregado para "' + name + '" (desde UI)');
    });
  }

  if (dispatchBtn) {
    dispatchBtn.addEventListener('click', function () {
      let name = (nameInput && nameInput.value) ? nameInput.value.trim() : 'my-event';
      if (!name) {
        alert('Escribe un nombre de evento');
        return;
      }
      let payload = {};
      try {
        let raw = payloadInput && payloadInput.value ? payloadInput.value.trim() : '';
        payload = raw ? JSON.parse(raw) : {};
      } catch (err) {
        alert('Payload no es JSON válido');
        return;
      }
      let ok = myDispatchEvent(name, payload);
      if (!ok) {
        appendLog('Dispatch para "' + name + '" pero no había listeners.');
      } else {
        appendLog('Dispatch hecho para "' + name + '" con payload ' + JSON.stringify(payload));
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (logEl) logEl.textContent = '';
    });
  }

  // demo automático para que haya al menos un listener
  (function demo() {
    let demoHandler = function (e) {
      appendLog('(demo) my-event recibido: ' + JSON.stringify(e.data));
    };
    myAddEventListener('my-event', demoHandler);
    appendLog('Demo: listener agregado automáticamente para "my-event". Prueba dispatch con {"name":"Juan","last":"Gonzalez"}');
    // no guardamos el unsub demo para que quede activo
  })();
})();
