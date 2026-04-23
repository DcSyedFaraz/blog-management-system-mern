const friendlyMessages = {
  'Invalid credentials': 'Incorrect email or password. Please try again.',
  'Email already registered': 'An account with this email already exists.',
  'Not authorized, no token': 'Please sign in to continue.',
  'Access denied': 'You do not have permission to do that.',
  'Post not found': 'This post could not be found.',
  'User not found': 'Account not found.',
};

const getApiError = (err) => {
  const data = err?.response?.data;
  if (!data) return 'Something went wrong. Please try again.';

  // Joi validation errors — join them into a readable list
  if (data.errors?.length) return data.errors.join(' ');

  const raw = data.message || 'Something went wrong. Please try again.';
  return friendlyMessages[raw] || raw;
};

export default getApiError;
