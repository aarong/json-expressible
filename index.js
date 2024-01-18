var check = require("check-types");
var _each = require("lodash/each");
var _includes = require("lodash/includes");
var _clone = require("lodash/clone");

var jsonExpressible = function (val) {
  return !hasCircular(val, []) && onlyJsonValues(val);
};

var onlyJsonValues = function (val) {
  if (
    check.string(val) ||
    check.number(val) ||
    check.boolean(val) ||
    check.null(val)
  ) {
    return true;
  } else if (check.object(val) || check.array(val)) {
    var ret = true;
    _each(val, function (subval) {
      ret = onlyJsonValues(subval);
      return ret; // stop if bad
    });
    return ret;
  } else {
    return false;
  }
};

var hasCircular = function (value, ancestors) {
  if (!check.object(value) && !check.array(value)) {
    return false;
  }

  if (_includes(ancestors, value)) {
    return true;
  }

  var newAncestors = _clone(ancestors);
  newAncestors.push(value);
  var ret = false;
  _each(value, function (child) {
    ret = hasCircular(child, newAncestors);
    return !ret; // stop if bad
  });
  return ret;
};

module.exports = jsonExpressible;
