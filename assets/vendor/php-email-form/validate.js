(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      php_email_form_submit(thisForm, action, formData);

    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(async (response) => {
        let data = await response.text();
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.toString().includes("The form was submitted successfully.")) {
          let message = '<h2>Mensagem enviada com sucesso. Aguarde sua resposta.</h2>';
          displayResponse(thisForm, message);
        }
        else {
          // da pra por um erro personalizado aqui igual na msg ali em cima. ai troca a classe pra algo com bg vermelho.
          displayResponse(thisForm, data);
        }
      })
  }

  function displayResponse(thisForm, response) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = response;
    thisForm.querySelector('.error-message').classList.add('d-block');
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";
  }

})();