import '@testing-library/jest-dom';

HTMLFormElement.prototype.requestSubmit = function () {
    if (this.submit) {
      this.submit();
    }
  };