class Base {
  constructor(data, message) {

    if (data) {
      this.data = data;
    }

    if (message) {
      this.message = message;
    }
  }
}

class SuccessModal extends Base {
  constructor(data, message) {
    super(data, message);
    this.error = 0;
  }
}

class ErrorModal extends Base {
  constructor(data, message) {
    super(data, message);
    this.error = -1;
  }
}


module.exports = {
    SuccessModal,
    ErrorModal
}