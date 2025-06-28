function controller(cb) {
	return (req, res) => {
	  cb(req, res).catch((error) => {
		const { name, message, stack, status } = error || {};
  
		if (status && status >= 300 && status < 600) {
		  res.status(status).send({ name, message, stack });
		} else {
		  res.status(500).send({
			name: "ServerError",
			message: message || "server error",
			stack,
		  });
		}
	  });
	};
  }
  
  module.exports = { controller }; // ✅ exportación en CommonJS
  