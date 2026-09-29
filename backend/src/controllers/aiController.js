import axios from "axios";

export const supportController = async (req, res, next) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/api/ai/support`,
      {
        message: req.body.message,
      },
      {
        headers: {
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
          "x-user-id": String(req.user.id),
          "x-request-id": req.requestId,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error("AI support error:", error.message);

    next(error);
  }
};
