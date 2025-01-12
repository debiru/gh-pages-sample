(function() {
  'use strict';

  const NS = {};
  window.NS = NS;

  const Main = {
    contactForm() {
      const form = document.getElementById('form-contact');
      const submit = document.querySelector('#form-contact-submit button');
      let prevent = false;

      Util.addEvent(form, 'submit', async (evt) => {
        evt.preventDefault();
        if (prevent) return;
        prevent = true;

        submit.textContent = '送信中...';
        submit.disabled = true;

        const url = 'https://script.google.com/macros/s/AKfycbzgqTYLZYqcVLYZvqJndtL7BEx6aXRuimDTjhFEvhlUnepnEq5N61_6owKy2CTbDwd7bw/exec';
        const response = await Util.fetchPost(url, form, {mode: 'no-cors'});

        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => field.readOnly = true);

        const submitParent = submit.parentNode;
        submit.remove();
        const text = 'お問い合わせを送信しました。';
        Util.createElement('p', { textContent: text }, submitParent);
      });
    },
  };

  const Util = {
    fetch(url, argOptions = null) {
      if (argOptions == null) argOptions = {};
      const options = Object.assign({}, argOptions);
      return Util.fetchResult(fetch(url, options));
    },
    fetchResult(fetchObj) {
      return fetchObj.then(response => {
        const contentType = response.headers.get('Content-Type');
        if (contentType == null) return null;
        return contentType.startsWith('application/json') ? response.json() : response;
      });
    },
    formData(obj) {
      if (obj instanceof HTMLFormElement) return new FormData(obj);
      if (!(obj instanceof Object)) obj = {};
      const formData = new FormData();
      Object.keys(obj).forEach(key => formData.append(key, obj[key]));
      return formData;
    },
    fetchPost(url, obj, argOptions = null) {
      if (argOptions == null) argOptions = {};
      const options = Object.assign({method: 'POST', body: Util.formData(obj)}, argOptions);
      return Util.fetch(url, options);
    },
    execObjectRoutine(obj) {
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'function') {
          const retval = obj[key]();
          if (retval != null) return retval;
        }
      }
    },
    addEvent(elems, type, listener, options) {
      if (elems == null) return null;
      if (!elems.forEach) elems = [elems];
      if (options == null) options = false;
      elems.forEach((elem, idx) => elem.addEventListener(type, evt => { listener.call(elem, evt, idx); }, options));
    },
    createElement(name, attrs, parent) {
      if (attrs == null) attrs = {};
      const elem = document.createElement(name);
      const { textContent, ...restAttrs } = attrs;
      if (textContent != null) elem.textContent = textContent;
      for (const [key, value] of Object.entries(restAttrs)) {
        elem.setAttribute(key, value);
      }
      if (parent != null) parent.append(elem);
      return elem;
    },
    sprintf(format, ...args) {
      let p = 0;
      return format.replace(/%./g, function(m) {
        if (m === '%%') return '%';
        if (m === '%s') return args[p++];
        return m;
      });
    },
  };
  NS.Util = Util;

  Util.addEvent(document, 'DOMContentLoaded', async () => {
    Util.execObjectRoutine(Main);
  });

  Util.addEvent(window, 'unload', () => {});
}());
