function dateFormat(timestamp) {
  const time = new Date(timestamp).toLocaleString("en-CA").replace(/\./g, "");
  return time;
}

module.exports = { dateFormat };
