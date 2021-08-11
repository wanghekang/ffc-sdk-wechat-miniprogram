
function generateUserData(group) {
  let unixTimeStamp = Math.round(new Date().getTime() / 1000);
  return {
    email: `user${unixTimeStamp}@feature-flags.co`,
    username: `user${unixTimeStamp}`,
    group
  };
}

module.exports = {
  generateUserData: generateUserData
}
