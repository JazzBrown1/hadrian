const redirectEnd = (redirect, status) => (status
  ? (req, res) => res.status(status).redirect(redirect)
  : (req, res) => res.redirect(redirect)
);
const sendEnd = (data, status) => (status
  ? (req, res) => res.status(status).send(data)
  : (req, res) => res.send(data)
);
const jsonEnd = (json, status) => (status
  ? (req, res) => res.status(status).json(json)
  : (req, res) => res.json(json)
);
const renderEnd = (view, status, renderData = {}) => (status
  ? (req, res) => res.status(status).render(view, renderData)
  : (req, res) => res.render(view, renderData)
);
const statusEnd = (status) => (req, res) => res.sendStatus(status);

const makeResponder = (end, type) => {
  if (typeof end === 'function') return end;
  if (typeof end !== 'object') throw new Error(`Invalid ${type} input, type ${typeof end} - ${end}`);
  if (end.redirect) return redirectEnd(end.redirect, end.status);
  if (end.send) return sendEnd(end.send, end.status);
  if (end.json) return jsonEnd(end.json, end.status);
  if (end.render) return renderEnd(end.render, end.status, end.renderData);
  if (end.status) return statusEnd(end.status);
  if (end.sendStatus) return statusEnd(end.sendStatus);
  throw new Error(`Invalid ${type} input`);
};

export default makeResponder;
