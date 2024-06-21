export const createMentor = async mentorData => {
  const { fullName, contactNo, skills, companyName, experience, email } =
    mentorData;

  try {
    await MentorModel.validate({
      fullName,
      contactNo,
      skills,
      companyName,
      experience,
      email,
    });
  } catch (error) {
    return { status: 400, data: { error: error.message } };
  }

  try {
    const mentorExists = await MentorModel.findOne({ email });

    if (mentorExists) {
      return { status: 401, data: { error: "Mentor already exists" } };
    }

    const mentor = new MentorModel({
      fullName,
      contactNo,
      skills,
      companyName,
      experience,
      email,
    });
    await mentor.save();
    return {
      status: 201,
      data: { message: "Mentor created successfully", mentor },
    };
  } catch (error) {
    return { status: 400, data: { error: error.message } };
  }
};
