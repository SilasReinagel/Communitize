const result = ({ status, err, content }) => ({ status, error: err, content });

exports.result = result;
exports.success = (content) => result(({ status: "Succeeded", err: "", content}));
exports.error = (status, err) => result(({ status, err, content: null }));