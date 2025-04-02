const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const testHashing = async () => {
  const password = "password123";

  console.log("Testing hashPassword function:");

  const hashedPassword = await hashPassword(password);

  if (typeof hashedPassword === "string") {
    console.log("Test Passed: Hashed password is a string");
  } else {
    console.log("Test Failed: Hashed password is not a string");
  }

  if (hashedPassword !== password) {
    console.log(
      "Test Passed: Hashed password is not the same as original password"
    );
  } else {
    console.log("Test Failed: Hashed password matches the original password");
  }

  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (isMatch) {
    console.log("Test Passed: Hash matches the password");
  } else {
    console.log("Test Failed: Hash does not match the password");
  }

  const password2 = "password456";
  const hashedPassword2 = await hashPassword(password2);
  if (hashedPassword !== hashedPassword2) {
    console.log("Test Passed: Different passwords have different hashes");
  } else {
    console.log("Test Failed: Different passwords have the same hash");
  }
};

testHashing();
