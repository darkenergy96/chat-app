'use strict';
// format form data to right object format

var formatFormData = function formatFormData(data) {
  var order = {};
  data.forEach(function (elem, i) {
    if (i === 3) {
      order['medicines'] = [];
    }
    if (i > 2) {
      if (i % 2 === 1) {
        //medicine odd i value
        order['medicines'][(i - 3) / 2] = {};
        order['medicines'][(i - 3) / 2].medicine = elem['value'];
      } else {
        order['medicines'][(i - 4) / 2].quantity = elem['value'];
      }
      return;
    }
    order[elem['name']] = elem['value'];
  });
  return order;
};

// iterate over medicines array and generate html
var medicineHtml = function medicineHtml(order) {
  var finalHtml = '';
  order.medicines.forEach(function (elem, i) {
    finalHtml += '<tr><td>' + (i + 1) + '.' + elem.medicine + '</td><td>' + elem.quantity + '</td></tr>';
  });
  return finalHtml;
};

// order data
var _state = {
  orderCount: 0,
  orders: []
};

//display orders and data in UI
$('#form').on('submit', function (e) {
  e.preventDefault();
  var data = JSON.stringify($(this).serializeArray());
  var formData = JSON.parse(data);
  var order = formatFormData(formData); //convert form data to right object format
  _state.orders.push(order);
  function updateOrderList() {
    _state.orderCount++;
    var html = '<li>\n        <div class="collapsible-header"><b>' + _state.orderCount + '.</b> ' + order.username + ' <div class="secondary-content order-menu"><i class="material-icons">cancel</i></div></div>\n        <div class="collapsible-body">\n        <table class="responsive-table bordered" style="table-layout: fixed;word-wrap: break-word">\n        <tbody>\n          <tr>\n            <td><b>Name</b></td>\n            <td>' + order.username + '</td>\n          </tr>\n          <tr>\n            <td><b>Phone</b></td>\n            <td>' + order.phone + '</td>\n          </tr>\n          <tr>\n            <td><b>Address</b></td>\n            <td>' + order.address + '</td>\n          </tr>\n        </tbody>\n      </table>\n      <div class="divider grey lighten-1"></div>\n        <table class="responsive-table striped">\n          <thead>\n            <tr><th>Medicine</th><th>Qty</th></tr>\n          </thead>\n          <tbody>\n            ' + medicineHtml(order) + '\n          </tbody>\n        </table>\n        </div>\n        </li>';
    $('#order-list').append(html);
  };
  updateOrderList();
  // reset the form on submit
  function resetForm() {
    $('input').val('').blur();
    $('#address').val('').blur();
    $('.medicine-field').not(':first').remove();
  };
  resetForm();
});
// on cancel press remove an order from UI only
$('div').on('click', '.order-menu', function (e) {
  var element = $(this);
  e.stopPropagation();
  element.closest('li').remove();
  _state.orderCount--;
});

// add and remove extra medicine input field
{
  var medicineTypes = 1;
  $('.add-med').on('click', function (e) {
    e.stopPropagation();
    medicineTypes++;
    var newElem = '<div class="row medicine-field">\n         <div class="input-field col s9">\n          <i class="material-icons prefix">local_hospital</i>\n          <input name="medicine' + medicineTypes + '" id="medicine' + medicineTypes + '" type="text" class="validate">\n          <label for="medicine' + medicineTypes + '">Medicine</label>\n         </div>\n         <div class="input-field col s3">\n          <input name="medicine' + medicineTypes + '-qty" id="medicine' + medicineTypes + '-qty" type="number" class="validate">\n          <label for="medicine' + medicineTypes + '-qty">count</label>\n         </div>\n        </div>';
    $('.medicine-field').last().after(newElem).next().hide().slideDown('fast');
  });
  $('.remove-med').on('click', function (e) {
    e.stopPropagation();
    if ($('.medicine-field').length > 1) {
      $('.medicine-field').last().slideToggle('fast', function () {
        $('.medicine-field').last().remove();
      });
      medicineTypes--;
    }
  });
}