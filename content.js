const localStorageKey = 'SwaggerAutoAuthSaverValue';
const hostname = location.hostname;
const id = hostname === 'editor.swagger.io' ? 'swagger-editor' : 'swagger-ui';
const swaggerElement = document.getElementById(id);

const updateLocalStorageValue = authWrapperElement => {
  const form = authWrapperElement.querySelector('form');
  const buttons = form?.querySelectorAll('button');

  if (!buttons || !form) {
    return;
  }

  const [authButtonElement] = buttons;

  authButtonElement?.addEventListener('mouseup', () => {
    const input = form.querySelector('input');

    if (input) {
      localStorage.setItem(localStorageKey, input.value);
    } else {
      localStorage.removeItem(localStorageKey);
    }
  });
};

const setInitialValue = authWrapperElement => {
  const form = authWrapperElement.querySelector('form');
  const input = form?.querySelector('input');
  const buttons = form?.querySelectorAll('button');

  const changeEvent = new Event('change', { bubbles: true });

  if (input) {
    const value = localStorage.getItem(localStorageKey) ?? '';
    input.value = value;

    input.dispatchEvent(changeEvent);
  }

  if (buttons) {
    const [authButtonElement, closeButtonElement] = buttons;

    authButtonElement?.click();
    closeButtonElement?.click();
  }
};

const openAuthModal = authWrapperElement => {
  if (!authWrapperElement) {
    return;
  }

  let isFirstOpened = true;

  const mutationObserver = new MutationObserver(() => {
    if (isFirstOpened) {
      setInitialValue(authWrapperElement);
      isFirstOpened = false;
    } else {
      updateLocalStorageValue(authWrapperElement);
    }
  });

  mutationObserver.observe(authWrapperElement, { childList: true });
  authWrapperElement.querySelector('button').click();
};

const init = () => {
  const mutationObserver = new MutationObserver(() => {
    const authWrapperElement = document.querySelector('.auth-wrapper');

    if (authWrapperElement) {
      openAuthModal(authWrapperElement);
      mutationObserver.disconnect();
    }
  });

  mutationObserver.observe(swaggerElement, { childList: true, subtree: true });
};

if (swaggerElement) {
  init();
}
