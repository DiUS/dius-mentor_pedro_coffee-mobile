var ApiUtil = {
  ENDPOINT: 'http://a7234300.ngrok.io/',
  ORDER_PATH : 'order/',
  MENU_PATH : 'menu/',
  COFFEE_PATH : 'coffee/',
  checkStatus: function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
};

export default ApiUtil;
