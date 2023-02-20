global.sendSuccess = (res, message, data) => {
  res.status(200).json({
    status: 200,
    message: message || "",
    data: data || {},
  });
};
