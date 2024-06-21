import { UserModel } from "../db/models/user.js";

export const createUserAndValidate = async body => {
  const { firstName, lastName, email, password } = body;

  try {
    await UserModel.validate({ firstName, lastName, email, password });
  } catch (error) {
    return { status: 400, data: { error: error.message } };
  }

  try {
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return { status: 401, data: { error: "User already exists" } };
    }

    const user = new UserModel({ firstName, lastName, email, password });
    await user.save();

    return {
      status: 201,
      data: { message: "User created successfully", user },
    };
  } catch (error) {
    return { status: 400, data: { error: error.message } };
  }
};

export const validateUser = async ({ email, password }) => {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return { status: 401, data: { error: "Invalid credentials, [ email ]" } };
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return { status: 401, data: { error: "Invalid credentials, [ password ]" } };
    }

    return { status: 200, data: { message: "User authenticated", user } };
  } catch (error) {
    return { status: 400, data: { error: error.message } };
  }
};
