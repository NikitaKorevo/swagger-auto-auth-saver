const hostname = location.hostname;
const id = hostname === 'editor.swagger.io' ? 'swagger-editor' : 'swagger-ui';
const swaggerElement = document.getElementById(id);

const main = async authWrapperElement => {
  let form = authWrapperElement.querySelector('form');
  let input = form?.querySelector('input');
  let buttons = form?.querySelectorAll('button');

  let changeEvent = new Event('change', { bubbles: true });

  if (input) {
    const value = localStorage.getItem('SwaggerAutoAuthSaverValue') ?? '';
    input.value = value;
    input.dispatchEvent(changeEvent);
  }

  if (buttons) {
    const [authButtonElement, closeButtonElement] = buttons;
    authButtonElement.click();
    closeButtonElement.click();

    closeButtonElement.addEventListener('click', () => console.log('click'));
  }
};

const openAuthModal = authWrapperElement => {
  if (!authWrapperElement) {
    return;
  }

  const mutationObserver = new MutationObserver(() => {
    main(authWrapperElement);
    mutationObserver.disconnect();
  });

  mutationObserver.observe(swaggerElement, { childList: true, subtree: true });
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
