function dateFormat(timestamp) {
  const time = new Date(timestamp).toLocaleString("en-CA").replace(/\./g, "");
  console.log(time); // 2023-11-09, 4:21:55 pm
  return time;
}

module.exports = { dateFormat };
