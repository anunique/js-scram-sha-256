'use strict';
/*** is_valid_username(name)
 * @brief checks if name is valid
 * 
 * @param {string} name name
 * @returns false on failure, true on success
  */
module.exports = function is_valid_username(name) {
	if (name.indexOf(",") != -1)
		return false;
	return true;
};